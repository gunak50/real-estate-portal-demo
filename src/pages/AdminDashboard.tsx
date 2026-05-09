import {
  Activity,
  BadgeCheck,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Eye,
  Star,
  Trash2,
  TrendingUp,
  UserMinus,
  Users,
  XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Counter from '../components/Counter';
import { useStore } from '../lib/store';
import { formatINR, formatNumber, timeAgo } from '../lib/utils';

const TABS = [
  { key: 'overview', label: 'Overview', Icon: TrendingUp },
  { key: 'pending', label: 'Pending review', Icon: Activity },
  { key: 'all', label: 'All listings', Icon: Building2 },
  { key: 'users', label: 'Users', Icon: Users },
] as const;

export default function AdminDashboard() {
  const me = useStore((s) => s.currentUser());
  const properties = useStore((s) => s.properties);
  const users = useStore((s) => s.users);
  const inquiries = useStore((s) => s.inquiries);
  const approve = useStore((s) => s.approveProperty);
  const reject = useStore((s) => s.rejectProperty);
  const toggleFeatured = useStore((s) => s.toggleFeatured);
  const deleteProperty = useStore((s) => s.deleteProperty);
  const deleteUser = useStore((s) => s.deleteUser);
  const nav = useNavigate();
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('overview');

  if (!me || me.role !== 'admin') {
    nav('/login');
    return null;
  }

  const pending = properties.filter((p) => p.status === 'pending');
  const approved = properties.filter((p) => p.status === 'approved');
  const totalViews = properties.reduce((acc, p) => acc + p.views, 0);
  const totalValue = approved.filter((p) => p.listingType === 'buy').reduce((acc, p) => acc + p.price, 0);

  const cityCounts = useMemo(() => {
    const m: Record<string, number> = {};
    approved.forEach((p) => (m[p.city] = (m[p.city] ?? 0) + 1));
    return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [approved]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Admin console</h1>
          <p className="mt-1 text-sm text-slate-500">Approvals, analytics, and platform management</p>
        </div>
        <div className="flex gap-2">
          <Link to="/" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold dark:border-slate-700">
            View site
          </Link>
        </div>
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
            {key === 'pending' && pending.length > 0 && (
              <span className="rounded-full bg-amber-500 px-2 text-xs font-bold text-white">{pending.length}</span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid gap-3 md:grid-cols-4">
              <KPI Icon={Building2} label="Total listings" value={properties.length} />
              <KPI Icon={CheckCircle2} label="Approved" value={approved.length} accent="emerald" />
              <KPI Icon={Activity} label="Pending" value={pending.length} accent="amber" />
              <KPI Icon={Eye} label="Total views" value={totalViews} />
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <KPI Icon={Users} label="Users" value={users.length} />
              <KPI Icon={CircleDollarSign} label="Inventory value" value={formatINR(totalValue)} raw />
              <KPI Icon={Star} label="Featured" value={properties.filter((p) => p.featured).length} />
              <KPI Icon={BadgeCheck} label="Inquiries" value={inquiries.length} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-base font-bold">Top cities</h3>
                  <span className="text-xs text-slate-500">By approved listings</span>
                </div>
                <ul className="space-y-2">
                  {cityCounts.map(([city, n], i) => {
                    const pct = (n / cityCounts[0][1]) * 100;
                    return (
                      <li key={city}>
                        <div className="mb-1 flex justify-between text-sm">
                          <span className="font-medium">
                            {i + 1}. {city}
                          </span>
                          <span className="text-slate-500">{n} listings</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-emerald-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="mb-3 text-base font-bold">Most viewed</h3>
                <ul className="space-y-2">
                  {[...approved]
                    .sort((a, b) => b.views - a.views)
                    .slice(0, 6)
                    .map((p) => (
                      <li key={p.id} className="flex items-center gap-3">
                        <img src={p.images[0]} alt="" className="h-12 w-16 rounded object-cover" />
                        <div className="flex-1">
                          <Link to={`/property/${p.slug}`} className="line-clamp-1 text-sm font-semibold hover:underline">
                            {p.title}
                          </Link>
                          <div className="text-xs text-slate-500">{p.city}</div>
                        </div>
                        <div className="text-sm font-bold tabular-nums">
                          <Counter to={p.views} />
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {(tab === 'pending' || tab === 'all') && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800/50">
                <tr>
                  <th className="p-3">Property</th>
                  <th className="p-3">City</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Owner</th>
                  <th className="p-3">Submitted</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(tab === 'pending' ? pending : properties).map((p) => (
                  <tr key={p.id} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="p-3">
                      <Link to={`/property/${p.slug}`} className="flex items-center gap-3 hover:underline">
                        <img src={p.images[0]} alt="" className="h-10 w-14 rounded object-cover" />
                        <span className="line-clamp-1 max-w-[280px] font-semibold">{p.title}</span>
                      </Link>
                    </td>
                    <td className="p-3">{p.city}</td>
                    <td className="p-3 font-semibold">{formatINR(p.price)}</td>
                    <td className="p-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase ${
                          p.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-700'
                            : p.status === 'pending'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-slate-500">{p.ownerName}</td>
                    <td className="p-3 text-xs text-slate-500">{timeAgo(p.createdAt)}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap justify-end gap-1.5">
                        {p.status !== 'approved' && (
                          <button
                            onClick={() => approve(p.id)}
                            className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
                          >
                            <CheckCircle2 className="mr-1 inline h-3 w-3" /> Approve
                          </button>
                        )}
                        {p.status !== 'rejected' && (
                          <button
                            onClick={() => reject(p.id)}
                            className="rounded-full border border-red-300 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
                          >
                            <XCircle className="mr-1 inline h-3 w-3" /> Reject
                          </button>
                        )}
                        <button
                          onClick={() => toggleFeatured(p.id)}
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            p.featured
                              ? 'bg-amber-500 text-white'
                              : 'border border-amber-300 text-amber-700 hover:bg-amber-50'
                          }`}
                        >
                          <Star className="mr-1 inline h-3 w-3" /> {p.featured ? 'Featured' : 'Feature'}
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${p.title}"? This cannot be undone.`)) deleteProperty(p.id);
                          }}
                          className="rounded-full border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                          title="Delete listing"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(tab === 'pending' ? pending : properties).length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-10 text-center text-slate-500">
                      Nothing here right now.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'users' && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800/50">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Joined</th>
                  <th className="p-3">Listings</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <img src={u.avatar} alt="" className="h-8 w-8 rounded-full" />
                        <span className="font-semibold">{u.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-500">{u.email}</td>
                    <td className="p-3">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold capitalize dark:bg-slate-800">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">{properties.filter((p) => p.ownerId === u.id).length}</td>
                    <td className="p-3 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => {
                            if (confirm(`Remove ${u.name}? Their listings will also be deleted.`)) deleteUser(u.id);
                          }}
                          className="inline-flex items-center gap-1 rounded-full border border-red-300 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                        >
                          <UserMinus className="h-3 w-3" /> Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function KPI({
  Icon,
  label,
  value,
  accent,
  raw,
}: {
  Icon: typeof Activity;
  label: string;
  value: number | string;
  accent?: 'emerald' | 'amber';
  raw?: boolean;
}) {
  const tone =
    accent === 'emerald'
      ? 'text-emerald-600'
      : accent === 'amber'
        ? 'text-amber-600'
        : 'text-brand-700 dark:text-brand-300';
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
        <Icon className="h-4 w-4" /> {label}
      </div>
      <div className={`mt-2 text-3xl font-extrabold ${tone}`}>
        {raw ? value : typeof value === 'number' ? <Counter to={value} /> : formatNumber(Number(value))}
      </div>
    </div>
  );
}
