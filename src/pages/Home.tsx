import { ArrowRight, Building2, Home as HomeIcon, MapPin, Search, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Counter from '../components/Counter';
import LazyImage from '../components/LazyImage';
import PropertyCard from '../components/PropertyCard';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '../lib/store';
import { ALL_CITIES } from '../lib/seed';

const HERO_BG =
  'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=2000&q=70';

export default function Home() {
  const [q, setQ] = useState('');
  const [city, setCity] = useState('all');
  const [type, setType] = useState<'all' | 'buy' | 'rent'>('all');
  const properties = useStore(useShallow((s) => s.visibleProperties()));
  const blog = useStore((s) => s.blog).slice(0, 3);
  const nav = useNavigate();
  const featured = properties.filter((p) => p.featured).slice(0, 6);
  const trending = properties.slice(0, 8);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (city !== 'all') params.set('city', city);
    nav(`/${type === 'rent' ? 'rent' : 'buy'}?${params.toString()}`);
  };

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/55 to-slate-900/80" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-white">
         <div className="mx-auto max-w-4xl text-center animate-slide-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Verified listings · 12,000+ homes
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Find a place you'll love to call <span className="text-emerald-400">home</span>.
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-slate-200 md:text-xl">
              Browse hand-verified properties, compare side-by-side, and connect directly with trusted agents.
            </p>
          </div>

          <form
            onSubmit={search}
            className="mx-auto mt-8 grid max-w-4xl items-stretch overflow-hidden rounded-2xl bg-white p-1.5 shadow-2xl md:grid-cols-[120px,1fr,180px,140px] dark:bg-slate-900"
          >
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'all' | 'buy' | 'rent')}
              className="bg-transparent px-3 py-3 text-sm font-semibold text-slate-700 outline-none dark:text-slate-100"
            >
              <option value="all">All</option>
              <option value="buy">Buy</option>
              <option value="rent">Rent</option>
            </select>
            <div className="flex items-center bg-transparent px-3 md:border-l md:border-slate-200 md:dark:border-slate-700">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by area, project, or keyword"
                className="w-full bg-transparent px-3 py-3 text-sm text-slate-700 outline-none dark:text-slate-100"
              />
            </div>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="bg-transparent px-3 py-3 text-sm text-slate-700 outline-none md:border-l md:border-slate-200 dark:text-slate-100 md:dark:border-slate-700"
            >
              <option value="all">Any city</option>
              {ALL_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <button className="ml-1.5 flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700">
              Search <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mx-auto mt-6 flex max-w-4xl flex-wrap items-center justify-center gap-3 text-sm text-slate-200">
            <span className="opacity-80">Quick:</span>
            {['Apartments in Mumbai', 'Villas in Bengaluru', 'Plots in Coimbatore', 'Rent in Chennai'].map((t, i) => (
              <Link
                key={t}
                to={i < 3 ? '/buy' : '/rent'}
                className="rounded-full border border-white/30 px-3 py-1 text-xs hover:bg-white/10"
              >
                {t}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 mx-auto -mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 md:grid-cols-4">
          {[
            { n: 12000, suffix: '+', label: 'Verified properties' },
            { n: 480, suffix: '+', label: 'Trusted agents' },
            { n: 56, suffix: '', label: 'Cities covered' },
            { n: 98, suffix: '%', label: 'Satisfaction rate' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-extrabold text-brand-700 dark:text-brand-300">
                <Counter to={s.n} suffix={s.suffix} />
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300">Featured</span>
            <h2 className="mt-1 text-3xl font-extrabold tracking-tight">Hand-picked homes for you</h2>
          </div>
          <Link to="/buy" className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline dark:text-brand-300">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <PropertyCard key={p.id} p={p} />
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="bg-slate-50 dark:bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-center text-3xl font-extrabold tracking-tight">Why home buyers choose Estately</h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-slate-500">A trusted partner from search to settlement.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { Icon: ShieldCheck, title: 'Verified listings', body: 'Every listing is reviewed by our team before going live — no scams, no surprises.' },
              { Icon: Zap, title: 'Smart tools', body: 'Compare side-by-side, run mortgage scenarios, and track favorites in one place.' },
              { Icon: Building2, title: 'End-to-end support', body: 'From first visit to final keys, our agent network is with you every step of the way.' },
            ].map(({ Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold">{title}</h3>
                <p className="mt-1 text-sm text-slate-500">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-extrabold tracking-tight">Explore top cities</h2>
        <p className="mt-1 text-slate-500">From Bengaluru villas to Mumbai high-rises — discover thriving neighborhoods.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-3 lg:grid-cols-4">
          {ALL_CITIES.slice(0, 8).map((city, i) => {
            const sample = properties.find((p) => p.city === city);
            return (
              <Link
                key={city}
                to={`/buy?city=${encodeURIComponent(city)}`}
                className="group relative block overflow-hidden rounded-2xl shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <LazyImage src={sample?.images[0] ?? ''} alt={city} ratio={i % 5 === 0 ? 'aspect-[4/5]' : 'aspect-[4/3]'} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <div>
                    <div className="flex items-center gap-1 text-sm font-semibold">
                      <MapPin className="h-3.5 w-3.5" /> {city}
                    </div>
                    <div className="text-xs opacity-80">
                      {properties.filter((p) => p.city === city).length} properties
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Trending */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300">Trending</span>
            <h2 className="mt-1 text-3xl font-extrabold tracking-tight">New on the market</h2>
          </div>
          <Link to="/buy" className="text-sm font-semibold text-brand-700 hover:underline dark:text-brand-300">View all →</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trending.slice(0, 4).map((p) => (
            <PropertyCard key={p.id} p={p} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-brand-700 to-emerald-600 p-10 text-white md:flex md:items-center md:justify-between">
          <div>
            <div className="text-2xl font-extrabold md:text-3xl">Selling? Reach 1M+ serious buyers.</div>
            <p className="mt-2 text-white/90">List in minutes, get verified in 24 hours, sell on your terms.</p>
          </div>
          <Link
            to="/sell"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-brand-700 shadow-lg hover:scale-[1.02] transition md:mt-0"
          >
            <HomeIcon className="h-4 w-4" /> List your property
          </Link>
        </div>
      </section>

      {/* Blog */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-3xl font-extrabold tracking-tight">From the blog</h2>
        <p className="mt-1 text-slate-500">Insights and guides for buyers, renters, and sellers.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {blog.map((b) => (
            <Link
              key={b.id}
              to={`/blog/${b.slug}`}
              className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
            >
              <LazyImage src={b.cover} alt={b.title} />
              <div className="p-5">
                <div className="text-xs uppercase text-slate-500">{new Date(b.publishedAt).toLocaleDateString()}</div>
                <h3 className="mt-1 line-clamp-2 text-lg font-bold">{b.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{b.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
