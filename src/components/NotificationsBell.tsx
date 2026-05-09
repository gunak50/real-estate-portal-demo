import { Bell } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../lib/store';
import { timeAgo } from '../lib/utils';

export default function NotificationsBell() {
  const me = useStore((s) => s.currentUser());
  const notifications = useStore((s) => s.notifications);
  const unread = useStore((s) => s.unreadCount());
  const markAllRead = useStore((s) => s.markAllRead);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  if (!me) return null;
  const myNotes = notifications.filter((n) => n.userId === me.id).slice(0, 12);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => {
          setOpen((o) => !o);
          if (!open) markAllRead();
        }}
        className="relative rounded-full border border-slate-200 dark:border-slate-700 p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="animate-fade-in absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-3 text-sm font-semibold dark:border-slate-700">Notifications</div>
          <div className="max-h-80 overflow-y-auto">
            {myNotes.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500">You're all caught up.</div>
            ) : (
              myNotes.map((n) => {
                const Inner = (
                  <div className="border-b border-slate-100 p-3 text-sm hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800">
                    <div className="font-semibold text-slate-800 dark:text-slate-100">{n.title}</div>
                    <div className="line-clamp-2 text-slate-600 dark:text-slate-400">{n.body}</div>
                    <div className="mt-1 text-xs text-slate-400">{timeAgo(n.createdAt)}</div>
                  </div>
                );
                return n.link ? (
                  <Link to={n.link} key={n.id} onClick={() => setOpen(false)}>
                    {Inner}
                  </Link>
                ) : (
                  <div key={n.id}>{Inner}</div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
