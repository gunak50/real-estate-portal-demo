import { Mail, MapPin, Phone, Star } from 'lucide-react';
import { useStore } from '../lib/store';

export default function Agents() {
  const agents = useStore((s) => s.agents);
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300">Our agents</span>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight md:text-5xl">Trusted, hand-picked, on your side.</h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-500">
          Our certified consultants average 5+ years on the field and deliver verified deals across India.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {agents.map((a) => (
          <div
            key={a.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
          >
            <img src={a.avatar} alt={a.name} className="mx-auto h-24 w-24 rounded-full ring-4 ring-brand-100 dark:ring-slate-800" />
            <h3 className="mt-4 text-lg font-bold">{a.name}</h3>
            <div className="text-xs text-slate-500">{a.title}</div>
            <div className="mt-2 flex items-center justify-center gap-1 text-xs text-slate-500">
              <MapPin className="h-3 w-3" /> {a.city}
            </div>
            <div className="mt-2 flex items-center justify-center gap-1.5 text-sm">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{a.rating}</span>
              <span className="text-slate-500">· {a.deals} deals</span>
            </div>
            <p className="mt-3 text-xs text-slate-500">{a.bio}</p>
            <div className="mt-4 flex justify-center gap-2">
              <a href={`tel:${a.phone}`} className="grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-brand-700 hover:bg-brand-100 dark:bg-slate-800 dark:text-brand-300">
                <Phone className="h-4 w-4" />
              </a>
              <a href={`mailto:${a.email}`} className="grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-brand-700 hover:bg-brand-100 dark:bg-slate-800 dark:text-brand-300">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
