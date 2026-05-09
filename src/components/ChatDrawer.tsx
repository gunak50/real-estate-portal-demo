import { MessageSquare, Send, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '../lib/store';
import { timeAgo } from '../lib/utils';

export default function ChatDrawer() {
  const me = useStore((s) => s.currentUser());
  const threads = useStore(useShallow((s) => s.myThreads()));
  const messages = useStore((s) => s.messages);
  const send = useStore((s) => s.sendMessage);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [text, setText] = useState('');
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (threads[0] && !activeId) setActiveId(threads[0].id);
  }, [threads, activeId]);

  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [activeId, messages.length]);

  if (!me) return null;
  const thread = threads.find((t) => t.id === activeId);
  const msgs = messages.filter((m) => m.threadId === activeId);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-30 grid h-12 w-12 place-items-center rounded-full bg-brand-600 text-white shadow-lg hover:bg-brand-700"
        aria-label="Open messages"
      >
        <MessageSquare className="h-5 w-5" />
        {threads.length > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold">
            {threads.length}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setOpen(false)}>
          <div
            className="animate-slide-in-right absolute right-0 top-0 flex h-full w-[95%] max-w-md flex-col bg-white shadow-2xl dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
              <div className="text-base font-semibold">Messages</div>
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-1 overflow-hidden">
              <div className="w-32 shrink-0 overflow-y-auto border-r border-slate-200 dark:border-slate-800">
                {threads.length === 0 && <div className="p-3 text-xs text-slate-400">No chats yet</div>}
                {threads.map((t) => {
                  const counterpart = t.buyerId === me.id ? t.sellerName : t.buyerName;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveId(t.id)}
                      className={`block w-full p-3 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800 ${
                        activeId === t.id ? 'bg-slate-100 dark:bg-slate-800' : ''
                      }`}
                    >
                      <div className="line-clamp-1 font-semibold">{counterpart}</div>
                      <div className="line-clamp-1 text-xs text-slate-500">{t.lastText || 'Start chatting'}</div>
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-1 flex-col">
                <div ref={scroller} className="flex-1 space-y-2 overflow-y-auto p-4">
                  {!thread && <div className="text-center text-sm text-slate-500">Select a chat to begin</div>}
                  {msgs.map((m) => (
                    <div
                      key={m.id}
                      className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                        m.fromUserId === me.id
                          ? 'ml-auto bg-brand-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800'
                      }`}
                    >
                      {m.text}
                      <div className="mt-1 text-[10px] opacity-70">{timeAgo(m.createdAt)}</div>
                    </div>
                  ))}
                </div>
                {thread && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (text.trim()) {
                        send(thread.id, text.trim());
                        setText('');
                      }
                    }}
                    className="flex gap-2 border-t border-slate-200 p-3 dark:border-slate-800"
                  >
                    <input
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Type a message…"
                      className="flex-1 rounded-full border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
                    />
                    <button className="grid h-10 w-10 place-items-center rounded-full bg-brand-600 text-white" aria-label="Send">
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
