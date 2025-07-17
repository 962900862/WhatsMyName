"use client";

import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  onRemove: (id: string) => void;
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const toastStyles = {
  success: 'border-green-500/50 text-white shadow-xl',
  error: 'border-red-500/50 text-white shadow-xl',
  warning: 'border-yellow-500/50 text-white shadow-xl',
  info: 'border-blue-500/50 text-white shadow-xl',
};

const iconStyles = {
  success: 'text-green-400',
  error: 'text-red-400',
  warning: 'text-yellow-400',
  info: 'text-blue-400',
};

export function Toast({ id, type, title, message, duration = 2500, onRemove }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const Icon = toastIcons[type];

  useEffect(() => {
    // 入场动画
    const showTimer = setTimeout(() => setIsVisible(true), 50);
    
    // 自动消失
    const hideTimer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => onRemove(id), 200);
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [id, duration, onRemove]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => onRemove(id), 200);
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border shadow-xl transition-all duration-300 ease-out',
        'max-w-md w-full pointer-events-auto bg-black',
        toastStyles[type],
        isVisible && !isLeaving ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'
      )}
    >
      <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', iconStyles[type])} />
      
      <div className="flex-1 min-w-0">
        {title && (
          <p className="text-sm font-semibold leading-tight mb-1">
            {title}
          </p>
        )}
        <p className="text-sm leading-relaxed opacity-90">
          {message}
        </p>
      </div>

      <button
        onClick={handleClose}
        className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts }: { toasts: ToastProps[] }) {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
}

// Toast管理器
class ToastManager {
  private toasts: ToastProps[] = [];
  private listeners: Array<(toasts: ToastProps[]) => void> = [];
  private maxToasts = 3; // 最多同时显示3个toast

  subscribe(listener: (toasts: ToastProps[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private emit() {
    this.listeners.forEach(listener => listener([...this.toasts]));
  }

  private add(props: Omit<ToastProps, 'id' | 'onRemove'>): string {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastProps = {
      ...props,
      id,
      onRemove: this.remove.bind(this),
    };
    
    // 新toast出现时立即清除所有现有toast
    this.toasts = [];
    
    this.toasts.push(newToast);
    this.emit();
    return id;
  }

  private remove(id: string) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.emit();
  }

  // 清除所有toast
  clear() {
    this.toasts = [];
    this.emit();
  }

  success(message: string, title?: string, duration?: number) {
    return this.add({ type: 'success', message, title, duration: duration || 2500 });
  }

  error(message: string, title?: string, duration?: number) {
    return this.add({ type: 'error', message, title, duration: duration || 3500 });
  }

  warning(message: string, title?: string, duration?: number) {
    return this.add({ type: 'warning', message, title, duration: duration || 3000 });
  }

  info(message: string, title?: string, duration?: number) {
    return this.add({ type: 'info', message, title, duration: duration || 2500 });
  }
}

export const toast = new ToastManager();