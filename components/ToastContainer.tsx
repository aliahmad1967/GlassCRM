import React from 'react';
import { useToast } from '../context/ToastContext';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg backdrop-blur-md border animate-fade-in-up min-w-[300px] cursor-pointer
            ${toast.type === 'success' ? 'bg-emerald-500/90 text-white border-emerald-400/50' : ''}
            ${toast.type === 'error' ? 'bg-red-500/90 text-white border-red-400/50' : ''}
            ${toast.type === 'info' ? 'bg-blue-500/90 text-white border-blue-400/50' : ''}
          `}
          onClick={() => removeToast(toast.id)}
        >
          <div className="shrink-0">
            {toast.type === 'success' && <CheckCircle size={20} />}
            {toast.type === 'error' && <XCircle size={20} />}
            {toast.type === 'info' && <Info size={20} />}
          </div>
          <span className="text-sm font-medium flex-1">{toast.message}</span>
          <button className="opacity-70 hover:opacity-100">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};