import { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title?: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info' | 'destructive' | 'default';
  duration?: number;
}

export function showCustomToast(msg: Omit<ToastMessage, 'id'>) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('app-custom-toast', {
      detail: {
        ...msg,
        id: `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      }
    }));
  }
}

export function CustomToaster() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<ToastMessage>;
      if (!customEvent.detail) return;

      const newToast = customEvent.detail;
      setToasts((prev) => [newToast, ...prev].slice(0, 4));

      // Auto dismiss
      const duration = newToast.duration || 4500;
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, duration);
    };

    window.addEventListener('app-custom-toast', handleToastEvent);
    return () => window.removeEventListener('app-custom-toast', handleToastEvent);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const isError = toast.type === 'error' || toast.type === 'destructive';
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl backdrop-blur-md border transition-all duration-300 transform translate-y-0 opacity-100 animate-in fade-in slide-in-from-bottom-5 ${
              isError
                ? 'bg-red-950/90 border-red-500/40 text-red-100 dark:bg-red-950/90'
                : isSuccess
                ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-100 dark:bg-emerald-950/90'
                : isWarning
                ? 'bg-amber-950/90 border-amber-500/40 text-amber-100 dark:bg-amber-950/90'
                : 'bg-slate-900/90 border-slate-700/60 text-slate-100 dark:bg-slate-900/95'
            }`}
            role="alert"
          >
            <div className="mt-0.5 shrink-0">
              {isError && <AlertCircle className="w-5 h-5 text-red-400" />}
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {!isError && !isSuccess && !isWarning && <Info className="w-5 h-5 text-blue-400" />}
            </div>

            <div className="flex-1 min-w-0 pr-1">
              {toast.title && (
                <p className="font-semibold text-sm leading-tight mb-1 text-white">
                  {toast.title}
                </p>
              )}
              {toast.description && (
                <p className="text-xs leading-relaxed opacity-90 break-words">
                  {toast.description}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default CustomToaster;
