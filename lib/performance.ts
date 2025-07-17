// 性能优化工具

/**
 * 防抖函数
 * 用于减少频繁的函数调用，提高性能
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
}

/**
 * 节流函数
 * 限制函数执行频率
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * 延迟加载图片
 */
export function lazyLoadImage(
  src: string,
  placeholder?: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * 检查是否在视口内
 */
export function isInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * 批量处理 DOM 操作
 */
export function batchDOMUpdates(callback: () => void): void {
  if (typeof requestAnimationFrame !== 'undefined') {
    requestAnimationFrame(callback);
  } else {
    setTimeout(callback, 16); // ~60fps fallback
  }
}

/**
 * 内存监控
 */
export function getMemoryUsage(): any {
  if (typeof performance !== 'undefined' && 'memory' in performance) {
    return (performance as any).memory;
  }
  return null;
}

/**
 * 预加载资源
 */
export function preloadResource(href: string, as: string): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
}

/**
 * 预连接到域名
 */
export function preconnect(href: string): void {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = href;
  document.head.appendChild(link);
}

/**
 * 缓存管理器
 */
export class CacheManager {
  private cache = new Map<string, { data: any; expiry: number }>();
  
  set(key: string, data: any, ttl: number = 300000): void { // 默认5分钟
    const expiry = Date.now() + ttl;
    this.cache.set(key, { data, expiry });
  }
  
  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  size(): number {
    return this.cache.size;
  }
}

/**
 * 虚拟滚动辅助函数
 */
export function calculateVisibleItems(
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  overscan: number = 5
): { startIndex: number; endIndex: number; visibleItems: number } {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleItems = Math.ceil(containerHeight / itemHeight);
  const endIndex = Math.min(totalItems - 1, startIndex + visibleItems + overscan * 2);
  
  return { startIndex, endIndex, visibleItems };
}

/**
 * Web Worker 管理器
 */
export class WorkerManager {
  private workers: Map<string, Worker> = new Map();
  
  createWorker(name: string, script: string): Worker {
    if (this.workers.has(name)) {
      return this.workers.get(name)!;
    }
    
    const blob = new Blob([script], { type: 'application/javascript' });
    const worker = new Worker(URL.createObjectURL(blob));
    this.workers.set(name, worker);
    
    return worker;
  }
  
  terminateWorker(name: string): void {
    const worker = this.workers.get(name);
    if (worker) {
      worker.terminate();
      this.workers.delete(name);
    }
  }
  
  terminateAll(): void {
    this.workers.forEach(worker => worker.terminate());
    this.workers.clear();
  }
}

/**
 * 性能监控
 */
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map();
  
  mark(name: string): void {
    this.marks.set(name, performance.now());
  }
  
  measure(name: string, startMark: string): number {
    const startTime = this.marks.get(startMark);
    if (!startTime) {
      console.warn(`Start mark "${startMark}" not found`);
      return 0;
    }
    
    const duration = performance.now() - startTime;
    console.log(`${name}: ${duration.toFixed(2)}ms`);
    return duration;
  }
  
  clear(): void {
    this.marks.clear();
  }
}

// 全局性能监控实例
export const performanceMonitor = new PerformanceMonitor();

// 全局缓存管理器实例
export const globalCache = new CacheManager();