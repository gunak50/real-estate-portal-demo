import { Calculator } from 'lucide-react';
import { useMemo, useState } from 'react';
import { calcMortgage, formatINR } from '../lib/utils';

export default function MortgageCalculator({ defaultPrice }: { defaultPrice: number }) {
  const [price, setPrice] = useState(defaultPrice);
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);

  const principal = Math.max(0, price - (price * downPct) / 100);
  const monthly = useMemo(() => calcMortgage(principal, rate, years), [principal, rate, years]);
  const total = monthly * years * 12;
  const interest = total - principal;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center gap-2 text-lg font-semibold">
        <Calculator className="h-5 w-5 text-brand-600" /> Mortgage calculator
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="col-span-2">
          <label className="text-xs font-semibold uppercase text-slate-500">Home price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value) || 0)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500">Down payment %</label>
          <input
            type="number"
            value={downPct}
            onChange={(e) => setDownPct(Number(e.target.value) || 0)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500">Rate %</label>
          <input
            type="number"
            step={0.1}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value) || 0)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
        <div className="col-span-2">
          <label className="text-xs font-semibold uppercase text-slate-500">Loan term (years): {years}</label>
          <input
            type="range"
            min={5}
            max={30}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="mt-2 w-full accent-brand-600"
          />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
        <div>
          <div className="text-xs uppercase text-slate-500">Monthly</div>
          <div className="text-lg font-bold text-brand-700 dark:text-brand-300">{formatINR(Math.round(monthly))}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-slate-500">Interest</div>
          <div className="text-lg font-bold">{formatINR(Math.round(interest))}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-slate-500">Total payable</div>
          <div className="text-lg font-bold">{formatINR(Math.round(total))}</div>
        </div>
      </div>
    </div>
  );
}
