import { Apple, Chrome, Facebook, Mail, ShieldCheck, UserCog, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';

export default function Login() {
  const loginAs = useStore((s) => s.loginAs);
  const loginEmail = useStore((s) => s.loginEmail);
  const nav = useNavigate();
  const [email, setEmail] = useState('');

  const sample = (role: 'admin' | 'user') => {
    loginAs(role);
    nav(role === 'admin' ? '/admin' : '/dashboard');
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail(email)) nav('/dashboard');
  };

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-14">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-600 to-emerald-500 text-white">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to your Estately account</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <button
            onClick={() => sample('admin')}
            className="flex flex-col items-center gap-1 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800 hover:bg-amber-100 dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-200"
          >
            <UserCog className="h-5 w-5" />
            <span className="text-sm font-bold">Login as Admin</span>
            <span className="text-xs">Approvals + analytics</span>
          </button>
          <button
            onClick={() => sample('user')}
            className="flex flex-col items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800/40 dark:bg-emerald-900/20 dark:text-emerald-200"
          >
            <UserRound className="h-5 w-5" />
            <span className="text-sm font-bold">Login as User</span>
            <span className="text-xs">Buy / rent / save</span>
          </button>
        </div>

        <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          OR SIGN IN WITH EMAIL
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">Email</label>
            <div className="mt-1 flex items-center rounded-lg border border-slate-300 px-3">
              <Mail className="h-4 w-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
                className="w-full bg-transparent px-3 py-2 outline-none"
              />
            </div>
            <div className="mt-1 text-xs text-slate-400">
              Try <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">user@estately.demo</code> or{' '}
              <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">admin@estately.demo</code>
            </div>
          </div>
          <button className="w-full rounded-full bg-brand-600 py-2.5 text-sm font-bold text-white hover:bg-brand-700">
            Continue
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          OR
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <SocialBtn Icon={Chrome} label="Google" />
          <SocialBtn Icon={Apple} label="Apple" />
          <SocialBtn Icon={Facebook} label="Facebook" />
        </div>

        <div className="mt-6 text-center text-sm text-slate-500">
          New to Estately?{' '}
          <Link to="/signup" className="font-semibold text-brand-700 hover:underline dark:text-brand-300">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

function SocialBtn({ Icon, label }: { Icon: typeof Mail; label: string }) {
  const toast = useStore((s) => s.toast);
  return (
    <button
      onClick={() => toast(`${label} sign-in coming soon`, 'info')}
      className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
