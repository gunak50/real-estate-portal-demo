import { Scale, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../lib/store';
import { formatINR } from '../lib/utils';

export default function CompareBar() {
  const compare = useStore((s) => s.compare);
  const properties = useStore((s) => s.properties);
  const toggle = useStore((s) => s.toggleCompare);
  const clear = useStore((s) => s.clearCompare);

  if (compare.length === 0) return null;
  const items = compare.map((id) => properties.find((p) => p.id === id)).filter(Boolean);

  return (
    <div className="fixed bottom-4 left-1/2 z-40 w-[95%] max-w-3xl -translate-x-1/2 animate-slide-up rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
      <div className="flex items-center gap-3">
        <Scale className="h-5 w-5 text-brand-600" />
        <div className="text-sm font-semibold">Compare ({compare.length}/3)</div>
        <div className="flex flex-1 items-center gap-2 overflow-x-auto no-scrollbar">
          {items.map(
            (p) =>
              p && (
                <div
                  key={p.id}
                  className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs dark:bg-slate-800"
                >
                  <span className="line-clamp-1 max-w-[140px]">{p.title}</span>
                  <span className="font-semibold text-brand-700 dark:text-brand-300">{formatINR(p.price)}</span>
                  <button onClick={() => toggle(p.id)} aria-label="Remove">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ),
          )}
        </div>
        <button
          onClick={clear}
          className="rounded-full px-3 py-1 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          Clear
        </button>
        <Link
          to="/compare"
          className="rounded-full bg-brand-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Compare
        </Link>
      </div>
    </div>
  );
}
