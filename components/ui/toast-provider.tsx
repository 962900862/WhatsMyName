"use client";

import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from './modern-toast';

interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  onRemove: (id: string) => void;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe(setToasts);
    return unsubscribe;
  }, []);

  return (
    <>
      {children}
      <ToastContainer toasts={toasts} />
    </>
  );
}