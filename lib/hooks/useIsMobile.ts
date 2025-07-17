import { useState, useEffect } from 'react';

// 定义移动设备的屏幕宽度断点 (例如：小于 768px)
const MOBILE_BREAKPOINT = 768;

/**
 * 自定义 Hook，用于检测当前是否为移动设备屏幕尺寸。
 * @returns {boolean} 如果是移动设备尺寸则返回 true，否则返回 false。
 */
export function useIsMobile(): boolean {
  // 注意：初始状态设为 false，避免服务器端渲染 (SSR) 问题。
  // 客户端挂载后会立即检查并更新。
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 定义检查函数
    const checkDevice = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // 组件挂载后立即执行一次检查
    checkDevice();

    // 添加 resize 事件监听器，以便在窗口大小改变时重新检查
    window.addEventListener('resize', checkDevice);

    // 清理函数：组件卸载时移除事件监听器
    return () => window.removeEventListener('resize', checkDevice);
  }, []); // 空依赖数组确保 effect 只在挂载和卸载时运行

  return isMobile;
} 