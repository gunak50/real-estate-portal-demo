import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';

export default function Signup() {
  const signup = useStore((s) => s.signup);
  const toast = useStore((s) => s.toast);
  const nav = useNavigate();
  const [data, setData] = useState({ name: '', email: '', phone: '', password: '' });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.name || !data.email) {
      toast('Name and email are required', 'error');
      return;
    }
    signup({ name: data.name, email: data.email, phone: data.phone });
    nav('/dashboard');
  };

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-14">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-extrabold tracking-tight">Create your account</h1>
        <p className="mt-1 text-sm text-slate-500">Save favorites, list properties, and chat with agents.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <Field label="Full name" value={data.name} onChange={(v) => setData({ ...data, name: v })} />
          <Field label="Email" type="email" value={data.email} onChange={(v) => setData({ ...data, email: v })} />
          <Field label="Phone" value={data.phone} onChange={(v) => setData({ ...data, phone: v })} />
          <Field label="Password" type="password" value={data.password} onChange={(v) => setData({ ...data, password: v })} />
          <p className="text-xs text-slate-400">Demo build — passwords are not stored or validated.</p>
          <button className="w-full rounded-full bg-brand-600 py-2.5 text-sm font-bold text-white hover:bg-brand-700">
            Create account
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Already a member?{' '}
          <Link to="/login" className="font-semibold text-brand-700 hover:underline dark:text-brand-300">
            Sign in
          </Link>
        </div>
      </div>
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
