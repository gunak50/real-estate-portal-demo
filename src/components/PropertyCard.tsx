import { Bath, BedDouble, Heart, MapPin, Maximize, Scale, Share2, BadgeCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../lib/store';
import type { Property } from '../types';
import { formatINR } from '../lib/utils';
import LazyImage from './LazyImage';

export default function PropertyCard({ p }: { p: Property }) {
  const isFav = useStore((s) => s.isFavorite(p.id));
  const inCompare = useStore((s) => s.compare.includes(p.id));
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const toggleCompare = useStore((s) => s.toggleCompare);
  const toast = useStore((s) => s.toast);

  const onShare = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `${location.origin}/property/${p.slug}`;
    if (navigator.share) {
      navigator.share({ title: p.title, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      toast('Link copied to clipboard', 'success');
    }
  };

  return (
    <Link
      to={`/property/${p.slug}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="relative">
        <LazyImage src={p.images[0]} alt={p.title} ratio="aspect-[4/3]" />
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-full bg-brand-600 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow">
            For {p.listingType === 'buy' ? 'sale' : 'rent'}
          </span>
          {p.featured && (
            <span className="rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow">
              Featured
            </span>
          )}
          {p.status === 'pending' && (
            <span className="rounded-full bg-slate-700 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow">
              Pending
            </span>
          )}
        </div>
        <div className="absolute right-3 top-3 flex gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(p.id);
            }}
            aria-label={isFav ? 'Remove from favorites' : 'Save to favorites'}
            className="grid h-8 w-8 place-items-center rounded-full bg-white/95 text-slate-700 shadow hover:scale-110 transition dark:bg-slate-800 dark:text-slate-200"
          >
            <Heart className={`h-4 w-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
          <button
            onClick={onShare}
            aria-label="Share"
            className="grid h-8 w-8 place-items-center rounded-full bg-white/95 text-slate-700 shadow hover:scale-110 transition dark:bg-slate-800 dark:text-slate-200"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleCompare(p.id);
            }}
            aria-label="Add to compare"
            className={`grid h-8 w-8 place-items-center rounded-full shadow transition hover:scale-110 ${
              inCompare ? 'bg-brand-600 text-white' : 'bg-white/95 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
            }`}
          >
            <Scale className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-baseline justify-between gap-3">
          <div className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {formatINR(p.price)}
            {p.listingType === 'rent' && <span className="text-sm font-medium text-slate-500">/mo</span>}
          </div>
          <BadgeCheck className="h-5 w-5 text-emerald-500" />
        </div>
        <h3 className="mt-1 line-clamp-1 font-semibold text-slate-800 dark:text-slate-100">{p.title}</h3>
        <div className="mt-1 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
          <MapPin className="h-3.5 w-3.5" />
          <span className="line-clamp-1">
            {p.address}, {p.city}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-4 border-t border-slate-100 pt-3 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
          <span className="flex items-center gap-1">
            <BedDouble className="h-4 w-4" />
            {p.beds} bed
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            {p.baths} bath
          </span>
          <span className="ml-auto flex items-center gap-1">
            <Maximize className="h-4 w-4" />
            {p.area} sqft
          </span>
        </div>
      </div>
    </Link>
  );
}
