import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLeaving(true);
      setTimeout(() => onDismiss(toast.id), 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`glass-card rounded-2xl px-4 py-3 flex items-center gap-3 shadow-card min-w-[280px] max-w-[380px] ${
        leaving ? 'animate-toast-out' : 'animate-toast-in'
      }`}
    >
      <span className="text-lg flex-shrink-0">{toast.message.split(' ')[0]}</span>
      <p className="text-sm font-medium flex-1" style={{ color: '#111111' }}>
        {toast.message.substring(toast.message.indexOf(' ') + 1)}
      </p>
      <button
        onClick={() => {
          setLeaving(true);
          setTimeout(() => onDismiss(toast.id), 300);
        }}
        className="flex-shrink-0 p-1 rounded-full hover:bg-black/5 transition-colors"
      >
        <X size={14} style={{ color: '#6B6B8A' }} />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9998] flex flex-col gap-2 items-center" style={{ maxWidth: 430 }}>
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
};
