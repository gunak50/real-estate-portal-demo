import { Heart, Home, Inbox, MessageSquare, Plus, User } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import PropertyCard from '../components/PropertyCard';
import { useStore } from '../lib/store';
import { formatINR, timeAgo } from '../lib/utils';

const TABS = [
  { key: 'profile', label: 'Profile', Icon: User },
  { key: 'listings', label: 'My listings', Icon: Home },
  { key: 'favorites', label: 'Saved', Icon: Heart },
  { key: 'inquiries', label: 'Inquiries', Icon: Inbox },
  { key: 'messages', label: 'Messages', Icon: MessageSquare },
] as const;

export default function Dashboard() {
  const me = useStore((s) => s.currentUser());
  const properties = useStore((s) => s.properties);
  const favorites = useStore((s) => s.favorites);
  const inquiries = useStore(useShallow((s) => s.myInquiries()));
  const threads = useStore(useShallow((s) => s.myThreads()));
  const recentlyViewed = useStore((s) => s.recentlyViewed);
  const nav = useNavigate();
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('profile');

  if (!me) {
    nav('/login');
    return null;
  }

  const myListings = properties.filter((p) => p.ownerId === me.id);
  const favs = (favorites[me.id] ?? []).map((id) => properties.find((p) => p.id === id)).filter(Boolean) as typeof properties;
  const recent = recentlyViewed.map((id) => properties.find((p) => p.id === id)).filter(Boolean) as typeof properties;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-wrap items-center gap-4">
        <img src={me.avatar} alt="" className="h-16 w-16 rounded-full ring-4 ring-brand-100 dark:ring-slate-800" />
        <div>
          <h1 className="text-2xl font-extrabold">Hi {me.name.split(' ')[0]} 👋</h1>
          <p className="text-sm text-slate-500">{me.email}</p>
        </div>
        <Link
          to="/sell"
          className="ml-auto flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" /> New listing
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition ${
              tab === key
                ? 'border-brand-600 text-brand-700 dark:text-brand-300'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
            {key === 'favorites' && favs.length > 0 && (
              <span className="rounded-full bg-brand-100 px-1.5 text-xs text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                {favs.length}
              </span>
            )}
            {key === 'inquiries' && inquiries.length > 0 && (
              <span className="rounded-full bg-brand-100 px-1.5 text-xs text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                {inquiries.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === 'profile' && (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-3 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-lg font-bold">Account details</h3>
              <Detail label="Name" value={me.name} />
              <Detail label="Email" value={me.email} />
              <Detail label="Phone" value={me.phone ?? '—'} />
              <Detail label="Member since" value={new Date(me.createdAt).toLocaleDateString()} />
            </div>
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-lg font-bold">Activity</h3>
              <Stat label="Listings" value={myListings.length} />
              <Stat label="Favorites" value={favs.length} />
              <Stat label="Inquiries received" value={inquiries.length} />
              <Stat label="Active chats" value={threads.length} />
            </div>
            {recent.length > 0 && (
              <div className="md:col-span-3">
                <h3 className="mb-3 text-lg font-bold">Recently viewed</h3>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {recent.slice(0, 4).map((p) => (
                    <PropertyCard key={p.id} p={p} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'listings' &&
          (myListings.length === 0 ? (
            <Empty
              icon={Home}
              title="No listings yet"
              hint="Submit your first property in under 5 minutes."
              ctaTo="/sell"
              ctaLabel="Add a listing"
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {myListings.map((p) => (
                <div key={p.id} className="relative">
                  <PropertyCard p={p} />
                  <span
                    className={`absolute left-3 top-3 rounded-full px-2 py-1 text-[11px] font-semibold uppercase shadow ${
                      p.status === 'approved'
                        ? 'bg-emerald-500 text-white'
                        : p.status === 'pending'
                          ? 'bg-amber-500 text-white'
                          : 'bg-red-500 text-white'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          ))}

        {tab === 'favorites' &&
          (favs.length === 0 ? (
            <Empty
              icon={Heart}
              title="No favorites yet"
              hint="Tap the heart on any listing to save it for later."
              ctaTo="/buy"
              ctaLabel="Browse homes"
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {favs.map((p) => (
                <PropertyCard key={p.id} p={p} />
              ))}
            </div>
          ))}

        {tab === 'inquiries' &&
          (inquiries.length === 0 ? (
            <Empty icon={Inbox} title="No inquiries yet" hint="When buyers reach out, you'll see their messages here." />
          ) : (
            <div className="space-y-3">
              {inquiries.map((q) => {
                const p = properties.find((x) => x.id === q.propertyId);
                return (
                  <div
                    key={q.id}
                    className="flex flex-wrap items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                  >
                    {p && <img src={p.images[0]} alt="" className="h-20 w-28 rounded-lg object-cover" />}
                    <div className="flex-1 min-w-[200px]">
                      <div className="text-sm text-slate-500">{p ? p.title : 'Property removed'}</div>
                      <div className="font-bold">{q.name}</div>
                      <div className="text-xs text-slate-500">
                        {q.email} · {q.phone || 'no phone'} · {timeAgo(q.createdAt)}
                      </div>
                      <p className="mt-2 text-sm">{q.message}</p>
                      {q.visitDate && (
                        <div className="mt-2 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                          Visit requested for {q.visitDate}
                        </div>
                      )}
                    </div>
                    {p && (
                      <Link
                        to={`/property/${p.slug}`}
                        className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-semibold dark:border-slate-700"
                      >
                        Open
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

        {tab === 'messages' &&
          (threads.length === 0 ? (
            <Empty icon={MessageSquare} title="No conversations yet" hint="Open a property and tap Chat to start one." />
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900">
              {threads.map((t) => {
                const p = properties.find((x) => x.id === t.propertyId);
                const counterpart = t.buyerId === me.id ? t.sellerName : t.buyerName;
                return (
                  <div key={t.id} className="flex items-center gap-3 border-b border-slate-100 p-3 last:border-b-0 dark:border-slate-800">
                    {p && <img src={p.images[0]} alt="" className="h-12 w-16 rounded object-cover" />}
                    <div className="flex-1">
                      <div className="font-semibold">{counterpart}</div>
                      <div className="line-clamp-1 text-sm text-slate-500">
                        {t.lastText || `About ${p?.title ?? 'this property'}`}
                      </div>
                    </div>
                    <div className="text-xs text-slate-400">{timeAgo(t.lastAt)}</div>
                  </div>
                );
              })}
              <p className="p-3 text-xs text-slate-400">Use the message tray (bottom-left) to reply.</p>
            </div>
          ))}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-slate-100 py-2 last:border-b-0 dark:border-slate-800">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-2xl font-extrabold text-brand-700 dark:text-brand-300">{value}</span>
    </div>
  );
}

function Empty({
  icon: Icon,
  title,
  hint,
  ctaTo,
  ctaLabel,
}: {
  icon: typeof Home;
  title: string;
  hint: string;
  ctaTo?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center dark:border-slate-700 dark:bg-slate-900">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800">
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-3 text-lg font-bold">{title}</div>
      <div className="mt-1 text-sm text-slate-500">{hint}</div>
      {ctaTo && (
        <Link to={ctaTo} className="mt-4 rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white">
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
