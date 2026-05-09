import { LayoutGrid, MapIcon, Search, SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import FiltersPanel from '../components/Filters';
import PropertyCard from '../components/PropertyCard';
import PropertyMap from '../components/PropertyMap';
import { GridSkeleton } from '../components/Skeleton';
import { useStore } from '../lib/store';
import type { Filters, ListingType, Property } from '../types';

const PAGE = 9;

const defaultFilters: Filters = {
  q: '',
  listingType: 'all',
  category: 'all',
  city: 'all',
  minPrice: 0,
  maxPrice: 100000000,
  beds: 0,
  baths: 0,
  amenities: [],
  sort: 'newest',
};

interface Props {
  forced?: ListingType;
}

export default function Listings({ forced }: Props) {
  const properties = useStore(useShallow((s) => s.visibleProperties()));
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState<Filters>({
    ...defaultFilters,
    listingType: forced ?? (params.get('type') as ListingType) ?? 'all',
    q: params.get('q') ?? '',
    city: params.get('city') ?? 'all',
  });
  const [view, setView] = useState<'grid' | 'map'>('grid');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const sentinel = useRef<HTMLDivElement>(null);

  // Sync forced listing type if route changes
  useEffect(() => {
    if (forced) setFilters((f) => ({ ...f, listingType: forced }));
  }, [forced]);

  // Fake initial load delay so skeletons appear
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, [filters.listingType, filters.city]);

  // Persist q/city back to URL for shareability
  useEffect(() => {
    const next = new URLSearchParams();
    if (filters.q) next.set('q', filters.q);
    if (filters.city !== 'all') next.set('city', filters.city);
    setParams(next, { replace: true });
  }, [filters.q, filters.city, setParams]);

  const filtered: Property[] = useMemo(() => {
    let out = properties.filter((p) => {
      if (filters.listingType !== 'all' && p.listingType !== filters.listingType) return false;
      if (filters.category !== 'all' && p.category !== filters.category) return false;
      if (filters.city !== 'all' && p.city !== filters.city) return false;
      if (filters.minPrice && p.price < filters.minPrice) return false;
      if (filters.maxPrice && p.price > filters.maxPrice) return false;
      if (filters.beds && p.beds < filters.beds) return false;
      if (filters.baths && p.baths < filters.baths) return false;
      if (filters.amenities.length && !filters.amenities.every((a) => p.amenities.includes(a))) return false;
      if (filters.q) {
        const t = filters.q.toLowerCase();
        if (![p.title, p.description, p.city, p.address].some((x) => x.toLowerCase().includes(t))) return false;
      }
      return true;
    });
    out = [...out].sort((a, b) => {
      switch (filters.sort) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'beds':
          return b.beds - a.beds;
        default:
          return b.createdAt - a.createdAt;
      }
    });
    return out;
  }, [properties, filters]);

  // Infinite scroll
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && page * PAGE < filtered.length) setPage((p) => p + 1);
      });
    });
    io.observe(el);
    return () => io.disconnect();
  }, [page, filtered.length]);

  // Reset paging when filters change
  useEffect(() => setPage(1), [filtered.length]);

  const visible = filtered.slice(0, page * PAGE);
  const heading = forced === 'rent' ? 'Homes for rent' : forced === 'buy' ? 'Homes for sale' : 'All listings';

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <nav className="mb-3 text-xs text-slate-500">
        <span>Home</span> <span className="mx-1">›</span>
        <span className="capitalize">{forced ?? 'Listings'}</span>
        {filters.city !== 'all' && (
          <>
            <span className="mx-1">›</span>
            <span>{filters.city}</span>
          </>
        )}
        {filters.category !== 'all' && (
          <>
            <span className="mx-1">›</span>
            <span className="capitalize">{filters.category}s</span>
          </>
        )}
      </nav>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{heading}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {filtered.length} matching {filtered.length === 1 ? 'property' : 'properties'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-full border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
              placeholder="Search…"
              className="ml-2 w-48 bg-transparent text-sm outline-none"
            />
          </div>
          <select
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value as Filters['sort'] })}
            className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
            <option value="beds">Most beds</option>
          </select>
          <div className="hidden md:flex overflow-hidden rounded-full border border-slate-300 dark:border-slate-700">
            <button
              onClick={() => setView('grid')}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm ${
                view === 'grid' ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 dark:bg-slate-900 dark:text-slate-200'
              }`}
            >
              <LayoutGrid className="h-4 w-4" /> Grid
            </button>
            <button
              onClick={() => setView('map')}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm ${
                view === 'map' ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 dark:bg-slate-900 dark:text-slate-200'
              }`}
            >
              <MapIcon className="h-4 w-4" /> Map
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-6">
        <FiltersPanel value={filters} onChange={setFilters} />

        <div className="flex-1 min-w-0">
          {view === 'map' ? (
            <div className="h-[70vh] min-h-[480px] w-full">
              <PropertyMap properties={filtered} />
            </div>
          ) : loading ? (
            <GridSkeleton />
          ) : filtered.length === 0 ? (
            <div className="grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center dark:border-slate-700 dark:bg-slate-900">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <div className="mt-3 text-lg font-semibold">No matches</div>
              <div className="mt-1 text-sm text-slate-500">Try widening your filters or search terms.</div>
              <button
                onClick={() => setFilters({ ...defaultFilters, listingType: forced ?? 'all' })}
                className="mt-4 rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((p) => (
                  <PropertyCard key={p.id} p={p} />
                ))}
              </div>
              {visible.length < filtered.length && (
                <div ref={sentinel} className="mt-8 flex justify-center">
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded-full border border-slate-300 px-6 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    Load more ({filtered.length - visible.length})
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
