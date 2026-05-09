import { Bath, BedDouble, Check, MapPin, Maximize, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../lib/store';
import { ALL_AMENITIES } from '../lib/seed';
import { formatINR } from '../lib/utils';

export default function Compare() {
  const compare = useStore((s) => s.compare);
  const properties = useStore((s) => s.properties);
  const remove = useStore((s) => s.toggleCompare);
  const items = compare.map((id) => properties.find((p) => p.id === id)).filter(Boolean) as typeof properties;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">Compare properties</h1>
        <p className="mt-2 text-slate-500">Add 2 or 3 properties from the listings to see them side-by-side.</p>
        <Link to="/buy" className="mt-6 inline-block rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white">
          Browse listings
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Side-by-side</h1>
      <p className="mt-1 text-slate-500">Comparing {items.length} {items.length === 1 ? 'property' : 'properties'}.</p>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[700px] border-separate border-spacing-x-3">
          <thead>
            <tr>
              <th className="w-32"></th>
              {items.map((p) => (
                <th key={p.id} className="text-left">
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                    <div className="relative">
                      <img src={p.images[0]} alt="" className="aspect-[4/3] w-full object-cover" />
                      <button
                        onClick={() => remove(p.id)}
                        className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/95 text-slate-600 shadow"
                        aria-label="Remove"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="p-4">
                      <Link to={`/property/${p.slug}`} className="font-bold hover:underline">
                        {p.title}
                      </Link>
                      <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="h-3 w-3" /> {p.city}
                      </div>
                      <div className="mt-2 text-2xl font-extrabold text-brand-700 dark:text-brand-300">
                        {formatINR(p.price)}
                      </div>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm">
            <Row label="Type" cells={items.map((p) => <span className="capitalize">{p.category}</span>)} />
            <Row
              label="For"
              cells={items.map((p) => (
                <span className="capitalize">{p.listingType === 'buy' ? 'sale' : 'rent'}</span>
              ))}
            />
            <Row
              label="Bedrooms"
              cells={items.map((p) => (
                <span className="flex items-center gap-1">
                  <BedDouble className="h-3.5 w-3.5 text-slate-400" /> {p.beds}
                </span>
              ))}
            />
            <Row
              label="Bathrooms"
              cells={items.map((p) => (
                <span className="flex items-center gap-1">
                  <Bath className="h-3.5 w-3.5 text-slate-400" /> {p.baths}
                </span>
              ))}
            />
            <Row
              label="Area"
              cells={items.map((p) => (
                <span className="flex items-center gap-1">
                  <Maximize className="h-3.5 w-3.5 text-slate-400" /> {p.area} sqft
                </span>
              ))}
            />
            <Row
              label="₹/sqft"
              cells={items.map((p) => (
                <span>{p.area ? Math.round(p.price / p.area).toLocaleString('en-IN') : '—'}</span>
              ))}
            />
            {ALL_AMENITIES.map((a) => (
              <Row
                key={a}
                label={a}
                cells={items.map((p) =>
                  p.amenities.includes(a) ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <X className="h-4 w-4 text-slate-300" />
                  ),
                )}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Row({ label, cells }: { label: string; cells: React.ReactNode[] }) {
  return (
    <tr>
      <td className="py-2 text-xs font-semibold uppercase text-slate-500">{label}</td>
      {cells.map((c, i) => (
        <td key={i} className="py-2 text-slate-700 dark:text-slate-200">
          {c}
        </td>
      ))}
    </tr>
  );
}
