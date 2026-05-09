import {
  Bath,
  BedDouble,
  Building2,
  CalendarCheck,
  Heart,
  MapPin,
  Maximize,
  MessageSquare,
  Phone,
  Play,
  Scale,
  Share2,
  ShieldCheck,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import ImageGallery from '../components/ImageGallery';
import MortgageCalculator from '../components/MortgageCalculator';
import PropertyCard from '../components/PropertyCard';
import { SingleMap } from '../components/PropertyMap';
import { useStore } from '../lib/store';
import { formatINR, timeAgo } from '../lib/utils';

export default function PropertyDetail() {
  const { slug } = useParams();
  const property = useStore((s) => (slug ? s.propertyBySlug(slug) : undefined));
  const properties = useStore(useShallow((s) => s.visibleProperties()));
  const isFav = useStore((s) => (property ? s.isFavorite(property.id) : false));
  const inCompare = useStore((s) => (property ? s.compare.includes(property.id) : false));
  const toggleFav = useStore((s) => s.toggleFavorite);
  const toggleCompare = useStore((s) => s.toggleCompare);
  const addInquiry = useStore((s) => s.addInquiry);
  const startThread = useStore((s) => s.startThread);
  const registerView = useStore((s) => s.registerView);
  const me = useStore((s) => s.currentUser());
  const toast = useStore((s) => s.toast);
  const nav = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', visitDate: '' });

  useEffect(() => {
    if (!property) return;
    registerView(property.id);
    document.title = `${property.title} • Estately`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', property.description.slice(0, 150));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [property?.id]);

  // Pre-fill from current user
  useEffect(() => {
    if (me) {
      setForm((f) => ({
        ...f,
        name: f.name || me.name,
        email: f.email || me.email,
        phone: f.phone || me.phone || '',
      }));
    }
  }, [me]);

  const similar = useMemo(() => {
    if (!property) return [];
    return properties
      .filter((p) => p.id !== property.id && (p.city === property.city || p.category === property.category))
      .slice(0, 3);
  }, [properties, property]);

  if (!property) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-bold">Property not found</h1>
        <p className="mt-2 text-slate-500">It may have been removed or rejected.</p>
        <Link to="/buy" className="mt-6 inline-block rounded-full bg-brand-600 px-6 py-2 text-sm font-semibold text-white">
          Browse listings
        </Link>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast('Please fill in your name, email, and message', 'error');
      return;
    }
    addInquiry({
      propertyId: property.id,
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.message,
      visitDate: form.visitDate,
    });
    setForm({ name: '', email: '', phone: '', message: '', visitDate: '' });
  };

  const onChat = () => {
    if (!me) {
      toast('Please sign in to start a chat', 'info');
      nav('/login');
      return;
    }
    const id = startThread(property.id, property.ownerId, property.ownerName);
    if (id) toast('Chat started — open the message tray bottom-left', 'success');
  };

  return (
    <div className="animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="text-xs text-slate-500">
          <Link to="/" className="hover:underline">Home</Link>
          <span className="mx-1">›</span>
          <Link to={`/buy?city=${encodeURIComponent(property.city)}`} className="hover:underline">{property.city}</Link>
          <span className="mx-1">›</span>
          <span className="capitalize">{property.category}s</span>
          <span className="mx-1">›</span>
          <span className="text-slate-700 dark:text-slate-300">{property.title}</span>
        </nav>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold uppercase text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                <ShieldCheck className="mr-1 inline h-3 w-3" /> Verified
              </span>
              <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold uppercase text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                For {property.listingType === 'buy' ? 'sale' : 'rent'}
              </span>
              <span className="text-xs text-slate-500">Listed {timeAgo(property.createdAt)} · {property.views} views</span>
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">{property.title}</h1>
            <div className="mt-1 flex items-center gap-1.5 text-slate-500">
              <MapPin className="h-4 w-4" /> {property.address}, {property.city}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => toggleFav(property.id)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition ${
                isFav ? 'border-red-300 bg-red-50 text-red-600' : 'border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
              }`}
            >
              <Heart className={`h-4 w-4 ${isFav ? 'fill-red-500' : ''}`} />
              {isFav ? 'Saved' : 'Save'}
            </button>
            <button
              onClick={() => toggleCompare(property.id)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition ${
                inCompare ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
              }`}
            >
              <Scale className="h-4 w-4" /> Compare
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast('Link copied', 'success');
              }}
              className="flex items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <Share2 className="h-4 w-4" /> Share
            </button>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <ImageGallery images={property.images} alt={property.title} />
      </div>

      <div className="mx-auto mt-8 grid max-w-7xl gap-8 px-4 sm:px-6 lg:px-8 lg:grid-cols-3">
        {/* Main */}
        <div className="space-y-8 lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-baseline gap-3">
              <div className="text-3xl font-extrabold text-brand-700 dark:text-brand-300">
                {formatINR(property.price)}
                {property.listingType === 'rent' && <span className="text-base font-medium text-slate-500"> /mo</span>}
              </div>
              {property.beds > 0 && (
                <div className="text-sm text-slate-500">
                  {Math.round(property.price / property.area).toLocaleString('en-IN')} ₹/sqft
                </div>
              )}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat icon={BedDouble} label="Bedrooms" value={property.beds || '—'} />
              <Stat icon={Bath} label="Bathrooms" value={property.baths || '—'} />
              <Stat icon={Maximize} label="Area" value={`${property.area} sqft`} />
              <Stat icon={Building2} label="Type" value={property.category} />
            </div>
            <hr className="my-6 border-slate-200 dark:border-slate-700" />
            <h2 className="text-lg font-bold">About this home</h2>
            <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-300">{property.description}</p>

            <h2 className="mt-6 text-lg font-bold">Amenities</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {property.amenities.length === 0 && <span className="text-sm text-slate-400">No amenities listed</span>}
              {property.amenities.map((a) => (
                <span
                  key={a}
                  className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>

          {/* Tour stub */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="grid gap-0 md:grid-cols-2">
              <div className="relative aspect-video">
                <img src={property.images[0]} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 grid place-items-center bg-black/40">
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-white/95 text-brand-700 shadow-xl">
                    <Play className="h-6 w-6 fill-current" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold">Virtual tour</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Walk through the home from your couch. The full gallery captures every room — 360° tours coming soon.
                </p>
                <button
                  onClick={() => toast('360° tour player coming soon', 'info')}
                  className="mt-3 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold dark:border-slate-700"
                >
                  Watch tour
                </button>
              </div>
            </div>
          </div>

          {/* Map */}
          <div>
            <h2 className="mb-3 text-lg font-bold">Location</h2>
            <SingleMap lat={property.lat} lng={property.lng} />
          </div>

          {/* Mortgage */}
          {property.listingType === 'buy' && <MortgageCalculator defaultPrice={property.price} />}

          {/* Similar */}
          {similar.length > 0 && (
            <div>
              <h2 className="mb-3 text-lg font-bold">Similar homes</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {similar.map((p) => (
                  <PropertyCard key={p.id} p={p} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <img
                src={`https://i.pravatar.cc/100?u=${encodeURIComponent(property.ownerEmail)}`}
                alt=""
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <div className="text-sm font-bold">{property.ownerName}</div>
                <div className="text-xs text-slate-500">Listing agent</div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <a
                href={`tel:${property.ownerPhone}`}
                className="flex items-center justify-center gap-1.5 rounded-full border border-slate-300 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <Phone className="h-4 w-4" /> Call
              </a>
              <button
                onClick={onChat}
                className="flex items-center justify-center gap-1.5 rounded-full bg-brand-600 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                <MessageSquare className="h-4 w-4" /> Chat
              </button>
            </div>

            <hr className="my-5 border-slate-200 dark:border-slate-700" />

            <form onSubmit={submit} className="space-y-3">
              <div className="text-sm font-bold">Schedule a visit / Inquire</div>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Phone (optional)"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                type="date"
                value={form.visitDate}
                onChange={(e) => setForm({ ...form, visitDate: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <textarea
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder={`Hi, I'm interested in ${property.title}…`}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <button className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
                <CalendarCheck className="h-4 w-4" /> Book a visit
              </button>
              <p className="text-center text-[11px] text-slate-400">Your details are shared only with the listing agent.</p>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof BedDouble; label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
      <div className="flex items-center gap-1.5 text-xs uppercase text-slate-500">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="mt-1 text-base font-semibold capitalize">{value}</div>
    </div>
  );
}
