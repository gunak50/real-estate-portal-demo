import { Check } from 'lucide-react';

export default function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-2 md:gap-4">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex items-center gap-2">
            <div
              className={`grid h-8 w-8 place-items-center rounded-full text-sm font-bold transition ${
                done
                  ? 'bg-emerald-500 text-white'
                  : active
                    ? 'bg-brand-600 text-white shadow-lg'
                    : 'bg-slate-200 text-slate-500 dark:bg-slate-700'
              }`}
            >
              {done ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`text-sm ${active ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-500'}`}>
              {label}
            </span>
            {i < steps.length - 1 && <span className="hidden md:inline-block h-px w-10 bg-slate-300 dark:bg-slate-700" />}
          </li>
        );
      })}
    </ol>
  );
}
