import { ArrowLeft, Clock } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import LazyImage from '../components/LazyImage';
import { useStore } from '../lib/store';

export function BlogList() {
  const blog = useStore((s) => s.blog);
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300">Insights</span>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight md:text-5xl">The Estately blog</h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-500">
          Practical guides, market reports, and city deep-dives — written by people who've actually closed deals.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {blog.map((b) => (
          <Link
            key={b.id}
            to={`/blog/${b.slug}`}
            className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
          >
            <LazyImage src={b.cover} alt={b.title} />
            <div className="p-5">
              <div className="flex items-center gap-2 text-xs uppercase text-slate-500">
                <Clock className="h-3 w-3" /> {new Date(b.publishedAt).toLocaleDateString()} · {b.author}
              </div>
              <h3 className="mt-1 line-clamp-2 text-lg font-bold">{b.title}</h3>
              <p className="mt-1 line-clamp-3 text-sm text-slate-500">{b.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function BlogPost() {
  const { slug } = useParams();
  const post = useStore((s) => s.blog.find((b) => b.slug === slug));

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <Link to="/blog" className="mt-4 inline-block text-brand-700 hover:underline dark:text-brand-300">
          Back to blog
        </Link>
      </div>
    );
  }
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/blog" className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="h-4 w-4" /> Back to blog
      </Link>
      <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">{post.title}</h1>
      <div className="mt-3 text-sm text-slate-500">
        {new Date(post.publishedAt).toLocaleDateString()} · {post.author}
      </div>
      <img src={post.cover} alt="" className="mt-6 aspect-[16/9] w-full rounded-2xl object-cover" />
      <p className="mt-6 text-lg leading-relaxed text-slate-700 dark:text-slate-200">{post.excerpt}</p>
      <div className="prose mt-4 max-w-none text-slate-700 dark:text-slate-200">
        <p>{post.body}</p>
        <p>
          Pro tip: bookmark properties as you browse, run the mortgage calculator on the detail page, and use the
          Compare bar to put your final two side-by-side before booking visits.
        </p>
      </div>
    </article>
  );
}
