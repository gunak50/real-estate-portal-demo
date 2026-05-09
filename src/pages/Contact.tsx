import { Mail, MapPin, MessageSquare, Phone } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../lib/store';

export default function Contact() {
  const toast = useStore((s) => s.toast);
  const [data, setData] = useState({ name: '', email: '', subject: '', message: '' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.name || !data.email || !data.message) {
      toast('Please fill all required fields', 'error');
      return;
    }
    toast("Thanks! We'll get back to you within 24 hours.", 'success');
    setData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300">Contact</span>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight md:text-5xl">We'd love to hear from you</h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-500">
          Whether you're buying, selling, or have feedback for us — drop a line and a real human will respond.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <Card Icon={Phone} title="Call us" body="Mon-Sat, 9am-7pm IST" link="+91 80000 80000" />
          <Card Icon={Mail} title="Email" body="We reply within 24h" link="hello@estately.demo" />
          <Card Icon={MapPin} title="Visit" body="Estately HQ" link="WeWork, Bengaluru 560001" />
          <Card Icon={MessageSquare} title="Live chat" body="Bottom-left, when signed in" link="Open after sign-in" />
        </div>
        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2 dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Your name *" value={data.name} onChange={(v) => setData({ ...data, name: v })} />
            <Field label="Email *" type="email" value={data.email} onChange={(v) => setData({ ...data, email: v })} />
          </div>
          <Field label="Subject" value={data.subject} onChange={(v) => setData({ ...data, subject: v })} />
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">Message *</label>
            <textarea
              rows={6}
              value={data.message}
              onChange={(e) => setData({ ...data, message: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
          <button className="rounded-full bg-brand-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-700">
            Send message
          </button>
        </form>
      </div>
    </div>
  );
}

function Card({ Icon, title, body, link }: { Icon: typeof Mail; title: string; body: string; link: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700 dark:bg-slate-800 dark:text-brand-300">
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-3 text-sm font-bold">{title}</div>
      <div className="text-xs text-slate-500">{body}</div>
      <div className="mt-1 text-sm font-semibold text-brand-700 dark:text-brand-300">{link}</div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase text-slate-500">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
      />
    </div>
  );
}
