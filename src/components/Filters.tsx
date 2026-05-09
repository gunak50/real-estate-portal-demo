import { Filter, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { ALL_AMENITIES, ALL_CITIES } from '../lib/seed';
import type { Filters } from '../types';

interface Props {
  value: Filters;
  onChange: (next: Filters) => void;
}

export default function FiltersPanel({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => onChange({ ...value, [k]: v });
  const toggleAmenity = (a: string) => {
    set(
      'amenities',
      value.amenities.includes(a) ? value.amenities.filter((x) => x !== a) : [...value.amenities, a],
    );
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200"
      >
        <SlidersHorizontal className="h-4 w-4" /> Filters
      </button>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/40" onClick={() => setOpen(false)}>
          <div
            className="animate-slide-in-right absolute right-0 top-0 h-full w-[88%] max-w-sm overflow-y-auto bg-white p-5 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Filter className="h-5 w-5" /> Filters
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <FilterControls value={value} set={set} toggleAmenity={toggleAmenity} />
            <button
              onClick={() => setOpen(false)}
              className="mt-6 w-full rounded-full bg-brand-600 py-3 font-semibold text-white"
            >
              Show results
            </button>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:block sticky top-24 h-fit w-72 shrink-0 rounded-2xl border border-slate-200 bg-white p-5 dark:bg-slate-900 dark:border-slate-800">
        <div className="mb-4 flex items-center gap-2 text-base font-semibold">
          <Filter className="h-4 w-4" /> Filters
        </div>
        <FilterControls value={value} set={set} toggleAmenity={toggleAmenity} />
      </aside>
    </>
  );
}

function FilterControls({
  value,
  set,
  toggleAmenity,
}: {
  value: Filters;
  set: <K extends keyof Filters>(k: K, v: Filters[K]) => void;
  toggleAmenity: (a: string) => void;
}) {
  return (
    <div className="space-y-5 text-sm">
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">Listing type</label>
        <div className="flex gap-2">
          {(['all', 'buy', 'rent'] as const).map((t) => (
            <button
              key={t}
              onClick={() => set('listingType', t)}
              className={`flex-1 rounded-full border px-3 py-1.5 capitalize transition ${
                value.listingType === t
                  ? 'border-brand-600 bg-brand-600 text-white'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">Property type</label>
        <select
          value={value.category}
          onChange={(e) => set('category', e.target.value as Filters['category'])}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
        >
          <option value="all">All types</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="villa">Villa</option>
          <option value="plot">Plot</option>
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">City</label>
        <select
          value={value.city}
          onChange={(e) => set('city', e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
        >
          <option value="all">All cities</option>
          {ALL_CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 flex items-center justify-between text-xs font-semibold uppercase text-slate-500">
          <span>Price (₹)</span>
          <span className="font-mono text-[11px] text-slate-400">
            {value.minPrice.toLocaleString('en-IN')} – {value.maxPrice.toLocaleString('en-IN')}
          </span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={value.minPrice}
            min={0}
            onChange={(e) => set('minPrice', Number(e.target.value) || 0)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
          <input
            type="number"
            value={value.maxPrice}
            min={0}
            onChange={(e) => set('maxPrice', Number(e.target.value) || 0)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">Beds</label>
          <select
            value={value.beds}
            onChange={(e) => set('beds', Number(e.target.value))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n === 0 ? 'Any' : `${n}+`}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">Baths</label>
          <select
            value={value.baths}
            onChange={(e) => set('baths', Number(e.target.value))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n === 0 ? 'Any' : `${n}+`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">Amenities</label>
        <div className="flex flex-wrap gap-2">
          {ALL_AMENITIES.map((a) => (
            <button
              key={a}
              onClick={() => toggleAmenity(a)}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                value.amenities.includes(a)
                  ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                  : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
