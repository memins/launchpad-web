'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

type ToastEventPayload = Omit<Toast, 'id'>;

/**
 * Event emitter for toast notifications
 */
const createToastEvent = () => {
  const listeners: Array<(toast: ToastEventPayload) => void> = [];

  return {
    listen: (callback: (toast: ToastEventPayload) => void) => {
      listeners.push(callback);
      return () => {
        const index = listeners.indexOf(callback);
        if (index > -1) listeners.splice(index, 1);
      };
    },
    emit: (toast: ToastEventPayload) => {
      listeners.forEach((listener) => listener(toast));
    },
  };
};

export const toastEvent = createToastEvent();

/**
 * Toast API for creating toast notifications
 */
export const toast = {
  success: (title: string, description?: string, duration = 5000) => {
    toastEvent.emit({ title, description, type: 'success', duration });
  },
  error: (title: string, description?: string, duration = 5000) => {
    toastEvent.emit({ title, description, type: 'error', duration });
  },
  warning: (title: string, description?: string, duration = 5000) => {
    toastEvent.emit({ title, description, type: 'warning', duration });
  },
  info: (title: string, description?: string, duration = 5000) => {
    toastEvent.emit({ title, description, type: 'info', duration });
  },
};

/**
 * Toaster component for displaying toast notifications
 */
export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const unsubscribe = toastEvent.listen((toast) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { ...toast, id }]);

      if (toast.duration) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, toast.duration);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!mounted) return null;

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const getToastClasses = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 dark:bg-green-600';
      case 'error':
        return 'bg-red-500 dark:bg-red-600';
      case 'warning':
        return 'bg-amber-500 dark:bg-amber-600';
      case 'info':
        return 'bg-blue-500 dark:bg-blue-600';
      default:
        return 'bg-gray-700 dark:bg-gray-800';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg px-4 py-3 text-white shadow-lg ${getToastClasses(
            toast.type
          )} transform transition-all duration-300 ease-in-out animate-in fade-in slide-in-from-right-10`}
          role="alert"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium">{toast.title}</h3>
              {toast.description && (
                <p className="mt-1 text-sm opacity-90">{toast.description}</p>
              )}
            </div>
            <button
              type="button"
              className="ml-4 inline-flex shrink-0 text-white hover:opacity-80"
              onClick={() => removeToast(toast.id)}
            >
              <X size={18} />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 