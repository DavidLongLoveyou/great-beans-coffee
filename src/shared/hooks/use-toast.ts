/**
 * Simple Toast Hook
 * Provides basic toast notification functionality
 */

import { useState, useCallback } from 'react';

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
}

interface Toast extends ToastOptions {
  id: string;
}

interface UseToastReturn {
  toasts: Toast[];
  toast: (options: ToastOptions) => void;
  dismiss: (id: string) => void;
}

let toastCount = 0;

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((options: ToastOptions) => {
    const id = `toast-${++toastCount}`;
    const newToast: Toast = {
      id,
      ...options,
    };

    setToasts(prev => [...prev, newToast]);

    // Auto dismiss after duration
    const duration = options.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return {
    toasts,
    toast,
    dismiss,
  };
}

// Simple toast function for direct usage
export function toast(_options: ToastOptions) {
  // For now, just use a no-op as a fallback
  // In a real implementation, this would trigger a toast notification
}
