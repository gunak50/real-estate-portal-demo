import { CheckCircle2, Info, XCircle, X } from 'lucide-react';
import { useStore } from '../lib/store';

export default function Toaster() {
  const toasts = useStore((s) => s.toasts);
  const dismiss = useStore((s) => s.dismissToast);
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex w-80 flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`animate-slide-in-right flex items-start gap-3 rounded-xl border bg-white px-4 py-3 shadow-lg dark:bg-slate-900 ${
            t.kind === 'success'
              ? 'border-emerald-200 dark:border-emerald-900'
              : t.kind === 'error'
                ? 'border-red-200 dark:border-red-900'
                : 'border-slate-200 dark:border-slate-700'
          }`}
        >
          <div className="mt-0.5">
            {t.kind === 'success' ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            ) : t.kind === 'error' ? (
              <XCircle className="h-5 w-5 text-red-600" />
            ) : (
              <Info className="h-5 w-5 text-brand-600" />
            )}
          </div>
          <div className="flex-1 text-sm text-slate-700 dark:text-slate-200">{t.text}</div>
          <button
            onClick={() => dismiss(t.id)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
