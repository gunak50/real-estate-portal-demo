import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-24 text-center">
      <div className="text-7xl font-extrabold text-brand-700 dark:text-brand-300">404</div>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight">This page slipped through the cracks</h1>
      <p className="mt-2 text-slate-500">Maybe the listing was delisted, or the link is mistyped.</p>
      <div className="mt-6 flex justify-center gap-2">
        <Link to="/" className="rounded-full bg-brand-600 px-6 py-2.5 text-sm font-bold text-white">
          Back home
        </Link>
        <Link to="/buy" className="rounded-full border border-slate-300 px-6 py-2.5 text-sm font-bold dark:border-slate-700">
          Browse homes
        </Link>
      </div>
    </div>
  );
}
