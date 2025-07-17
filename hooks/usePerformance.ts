import { useEffect, useCallback, useRef, useState } from 'react';
import { debounce, throttle, performanceMonitor } from '@/lib/performance';

/**
 * 防抖 Hook
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const debouncedCallback = useRef(debounce(callback, delay));
  
  useEffect(() => {
    debouncedCallback.current = debounce(callback, delay);
  }, [callback, delay]);
  
  return debouncedCallback.current as T;
}

/**
 * 节流 Hook
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const throttledCallback = useRef(throttle(callback, delay));
  
  useEffect(() => {
    throttledCallback.current = throttle(callback, delay);
  }, [callback, delay]);
  
  return throttledCallback.current as T;
}

/**
 * 性能监控 Hook
 */
export function usePerformanceMonitor(componentName: string) {
  useEffect(() => {
    performanceMonitor.mark(`${componentName}-mount-start`);
    
    return () => {
      performanceMonitor.measure(
        `${componentName} mount duration`,
        `${componentName}-mount-start`
      );
    };
  }, [componentName]);
  
  const markStart = useCallback((operation: string) => {
    performanceMonitor.mark(`${componentName}-${operation}-start`);
  }, [componentName]);
  
  const markEnd = useCallback((operation: string) => {
    performanceMonitor.measure(
      `${componentName} ${operation} duration`,
      `${componentName}-${operation}-start`
    );
  }, [componentName]);
  
  return { markStart, markEnd };
}

/**
 * 内存监控 Hook
 */
export function useMemoryMonitor(interval: number = 5000) {
  useEffect(() => {
    if (typeof performance === 'undefined' || !('memory' in performance)) {
      return;
    }
    
    const logMemory = () => {
      const memory = (performance as any).memory;
      console.log('Memory usage:', {
        used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
        total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
        limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
      });
    };
    
    const intervalId = setInterval(logMemory, interval);
    
    return () => clearInterval(intervalId);
  }, [interval]);
}

/**
 * 延迟加载 Hook
 */
export function useLazyLoad() {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<Set<Element>>(new Set());
  
  const observe = useCallback((element: Element, callback: () => void) => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback();
            observerRef.current?.unobserve(entry.target);
            elementsRef.current.delete(entry.target);
          }
        });
      });
    }
    
    observerRef.current.observe(element);
    elementsRef.current.add(element);
  }, []);
  
  const unobserve = useCallback((element: Element) => {
    observerRef.current?.unobserve(element);
    elementsRef.current.delete(element);
  }, []);
  
  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);
  
  return { observe, unobserve };
}

/**
 * 虚拟滚动 Hook
 */
export function useVirtualScroll({
  itemCount,
  itemHeight,
  containerHeight,
  overscan = 5
}: {
  itemCount: number;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}) {
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    itemCount - 1,
    startIndex + Math.ceil(containerHeight / itemHeight) + overscan * 2
  );
  
  const visibleItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    visibleItems.push({
      index: i,
      offsetTop: i * itemHeight,
    });
  }
  
  const totalHeight = itemCount * itemHeight;
  
  const handleScroll = useThrottle((e: Event) => {
    const target = e.target as HTMLDivElement;
    setScrollTop(target.scrollTop);
  }, 16);
  
  useEffect(() => {
    const element = scrollElementRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
      return () => element.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);
  
  return {
    scrollElementRef,
    visibleItems,
    totalHeight,
    startIndex,
    endIndex,
  };
}

/**
 * 文件上传优化 Hook
 */
export function useOptimizedFileUpload() {
  const upload = useCallback(async (
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = (e.loaded / e.total) * 100;
          onProgress(progress);
        }
      };
      
      reader.onload = () => {
        resolve(reader.result as string);
      };
      
      reader.onerror = () => {
        reject(new Error('File reading failed'));
      };
      
      reader.readAsDataURL(file);
    });
  }, []);
  
  const compressImage = useCallback((
    file: File,
    quality: number = 0.8,
    maxWidth: number = 1920,
    maxHeight: number = 1080
  ): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // 计算新尺寸
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // 绘制并压缩
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            // 如果toBlob失败，创建一个默认的空Blob
            resolve(new Blob());
          }
        }, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }, []);
  
  return { upload, compressImage };
}

/**
 * 网络状态监控 Hook
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState<string>('unknown');
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // 检测连接类型
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      setConnectionType(connection.effectiveType || 'unknown');
      
      const handleConnectionChange = () => {
        setConnectionType(connection.effectiveType || 'unknown');
      };
      
      connection.addEventListener('change', handleConnectionChange);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        connection.removeEventListener('change', handleConnectionChange);
      };
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return { isOnline, connectionType };
}