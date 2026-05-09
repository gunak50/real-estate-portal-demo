import { Facebook, Github, Instagram, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ALL_CITIES } from '../lib/seed';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:px-8 py-12 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2 font-extrabold text-slate-900 dark:text-white">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-600 to-emerald-500 text-white">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M12 3 3 11h2v9h6v-6h2v6h6v-9h2L12 3Z" /></svg>
            </div>
            <span className="text-lg tracking-tight">Estately</span>
          </Link>
          <p className="mt-3 text-sm text-slate-500">
            Verified listings, smart tools, and a delightful experience for buyers, renters, and sellers across India.
          </p>
          <div className="mt-4 flex gap-3 text-slate-500">
            <a href="#" aria-label="Facebook" className="hover:text-brand-600"><Facebook className="h-4 w-4" /></a>
            <a href="#" aria-label="Instagram" className="hover:text-brand-600"><Instagram className="h-4 w-4" /></a>
            <a href="#" aria-label="LinkedIn" className="hover:text-brand-600"><Linkedin className="h-4 w-4" /></a>
            <a href="#" aria-label="GitHub" className="hover:text-brand-600"><Github className="h-4 w-4" /></a>
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Popular cities</div>
          <ul className="mt-3 space-y-2 text-sm">
            {ALL_CITIES.slice(0, 6).map((c) => (
              <li key={c}>
                <Link to={`/buy?city=${encodeURIComponent(c)}`} className="text-slate-600 hover:text-brand-600 dark:text-slate-300">
                  Properties in {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Company</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/agents" className="text-slate-600 hover:text-brand-600 dark:text-slate-300">Our agents</Link></li>
            <li><Link to="/blog" className="text-slate-600 hover:text-brand-600 dark:text-slate-300">Blog</Link></li>
            <li><Link to="/contact" className="text-slate-600 hover:text-brand-600 dark:text-slate-300">Contact</Link></li>
            <li><Link to="/sell" className="text-slate-600 hover:text-brand-600 dark:text-slate-300">List your property</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Stay in the loop</div>
          <p className="mt-3 text-sm text-slate-500">Get fresh listings & city insights, weekly.</p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-3 flex overflow-hidden rounded-full border border-slate-200 dark:border-slate-700"
          >
            <span className="grid w-10 place-items-center bg-slate-100 text-slate-500 dark:bg-slate-800">
              <Mail className="h-4 w-4" />
            </span>
            <input type="email" placeholder="you@email.com" className="flex-1 bg-white px-3 py-2 text-sm focus:outline-none dark:bg-slate-900" />
            <button className="bg-brand-600 px-4 text-sm font-semibold text-white">Join</button>
          </form>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500 dark:border-slate-800">
        © {new Date().getFullYear()} Estately Demo. Built for showcase — no real transactions.
      </div>
    </footer>
  );
}
