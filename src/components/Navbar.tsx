import { Heart, LogIn, LogOut, Menu, Plus, User as UserIcon, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import NotificationsBell from './NotificationsBell';
import ThemeToggle from './ThemeToggle';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition ${isActive ? 'text-brand-700 dark:text-brand-300' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'}`;

export default function Navbar() {
  const me = useStore((s) => s.currentUser());
  const logout = useStore((s) => s.logout);
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-slate-900 dark:text-white">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-600 to-emerald-500 text-white">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M12 3 3 11h2v9h6v-6h2v6h6v-9h2L12 3Z"/></svg>
          </div>
          <span className="text-lg tracking-tight">Estately</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/buy" className={linkClass}>Buy</NavLink>
          <NavLink to="/rent" className={linkClass}>Rent</NavLink>
          <NavLink to="/sell" className={linkClass}>Sell</NavLink>
          <NavLink to="/agents" className={linkClass}>Agents</NavLink>
          <NavLink to="/blog" className={linkClass}>Blog</NavLink>
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:flex"><ThemeToggle /></div>
          <NotificationsBell />
          <Link
            to="/sell"
            className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" /> List property
          </Link>

          {me ? (
            <div className="hidden md:flex items-center gap-2">
              <Link
                to={me.role === 'admin' ? '/admin' : '/dashboard'}
                className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm dark:border-slate-700"
              >
                <img src={me.avatar} alt="" className="h-6 w-6 rounded-full" />
                <span className="font-medium">{me.name.split(' ')[0]}</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  nav('/');
                }}
                className="rounded-full border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <LogIn className="h-4 w-4" /> Sign in
            </Link>
          )}

          <button
            onClick={() => setOpen(true)}
            className="md:hidden rounded-full border border-slate-200 p-2 dark:border-slate-700"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setOpen(false)}>
          <div
            className="animate-slide-in-right absolute right-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-white p-5 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="text-lg font-extrabold">Estately</span>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button onClick={() => setOpen(false)} aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {[
                ['/', 'Home'],
                ['/buy', 'Buy'],
                ['/rent', 'Rent'],
                ['/sell', 'List property'],
                ['/agents', 'Agents'],
                ['/blog', 'Blog'],
                ['/contact', 'Contact'],
              ].map(([to, label]) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2.5 text-base font-medium ${isActive ? 'bg-brand-50 text-brand-700 dark:bg-slate-800' : 'text-slate-700 dark:text-slate-200'}`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>
            <hr className="my-4 border-slate-200 dark:border-slate-800" />
            {me ? (
              <div className="flex flex-col gap-2">
                <Link
                  onClick={() => setOpen(false)}
                  to={me.role === 'admin' ? '/admin' : '/dashboard'}
                  className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2.5 dark:bg-slate-800"
                >
                  <img src={me.avatar} className="h-9 w-9 rounded-full" alt="" />
                  <div>
                    <div className="text-sm font-semibold">{me.name}</div>
                    <div className="text-xs text-slate-500">{me.role === 'admin' ? 'Admin dashboard' : 'My dashboard'}</div>
                  </div>
                </Link>
                <Link
                  to="/dashboard?tab=favorites"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-slate-700 dark:text-slate-200"
                >
                  <Heart className="h-4 w-4" /> Saved
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                    nav('/');
                  }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-slate-700 dark:text-slate-200"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full bg-brand-600 py-2.5 text-sm font-semibold text-white"
              >
                <UserIcon className="h-4 w-4" /> Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
