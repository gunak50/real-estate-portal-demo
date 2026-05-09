import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Inquiry,
  Message,
  Notification,
  Property,
  Thread,
  User,
} from '../types';
import { seedAgents, seedBlog, seedProperties, seedUsers } from './seed';
import { uid } from './utils';

interface ToastMsg {
  id: string;
  text: string;
  kind: 'info' | 'success' | 'error';
}

interface State {
  // data
  users: User[];
  properties: Property[];
  inquiries: Inquiry[];
  threads: Thread[];
  messages: Message[];
  notifications: Notification[];
  favorites: Record<string, string[]>; // userId -> propertyIds
  recentlyViewed: string[];
  compare: string[];
  agents: typeof seedAgents;
  blog: typeof seedBlog;
  // session
  currentUserId: string | null;
  theme: 'light' | 'dark';
  toasts: ToastMsg[];

  // selectors
  currentUser: () => User | null;
  property: (id: string) => Property | undefined;
  propertyBySlug: (slug: string) => Property | undefined;
  visibleProperties: () => Property[];
  isFavorite: (propertyId: string) => boolean;
  unreadCount: () => number;
  myInquiries: () => Inquiry[];
  myThreads: () => Thread[];

  // actions
  loginAs: (role: 'admin' | 'user') => void;
  loginEmail: (email: string) => boolean;
  signup: (data: { name: string; email: string; phone?: string }) => User;
  logout: () => void;
  toggleTheme: () => void;
  toast: (text: string, kind?: 'info' | 'success' | 'error') => void;
  dismissToast: (id: string) => void;

  toggleFavorite: (propertyId: string) => void;
  toggleCompare: (propertyId: string) => void;
  clearCompare: () => void;
  registerView: (propertyId: string) => void;

  addProperty: (
    p: Omit<
      Property,
      'id' | 'slug' | 'status' | 'featured' | 'createdAt' | 'views' | 'ownerId' | 'ownerName' | 'ownerEmail'
    > & { ownerName?: string; ownerEmail?: string },
  ) => Property;
  approveProperty: (id: string) => void;
  rejectProperty: (id: string) => void;
  toggleFeatured: (id: string) => void;
  deleteProperty: (id: string) => void;

  addInquiry: (q: Omit<Inquiry, 'id' | 'createdAt'>) => void;
  startThread: (propertyId: string, sellerId: string, sellerName: string) => string;
  sendMessage: (threadId: string, text: string) => void;

  addNotification: (n: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAllRead: () => void;

  deleteUser: (id: string) => void;
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      users: seedUsers,
      properties: seedProperties,
      inquiries: [],
      threads: [],
      messages: [],
      notifications: [],
      favorites: {},
      recentlyViewed: [],
      compare: [],
      agents: seedAgents,
      blog: seedBlog,
      currentUserId: null,
      theme: 'light',
      toasts: [],

      currentUser: () => {
        const id = get().currentUserId;
        return id ? get().users.find((u) => u.id === id) ?? null : null;
      },
      property: (id) => get().properties.find((p) => p.id === id),
      propertyBySlug: (slug) => get().properties.find((p) => p.slug === slug),
      visibleProperties: () => {
        const me = get().currentUser();
        if (me?.role === 'admin') return get().properties;
        return get().properties.filter((p) => p.status === 'approved' || p.ownerId === me?.id);
      },
      isFavorite: (propertyId) => {
        const u = get().currentUserId;
        if (!u) return false;
        return (get().favorites[u] ?? []).includes(propertyId);
      },
      unreadCount: () => {
        const u = get().currentUserId;
        if (!u) return 0;
        return get().notifications.filter((n) => n.userId === u && !n.read).length;
      },
      myInquiries: () => {
        const me = get().currentUser();
        if (!me) return [];
        const myProps = new Set(get().properties.filter((p) => p.ownerId === me.id).map((p) => p.id));
        return get().inquiries.filter((q) => myProps.has(q.propertyId));
      },
      myThreads: () => {
        const id = get().currentUserId;
        if (!id) return [];
        return get().threads.filter((t) => t.buyerId === id || t.sellerId === id);
      },

      loginAs: (role) => {
        const target = get().users.find((u) => u.role === role);
        if (target) {
          set({ currentUserId: target.id });
          get().toast(`Logged in as ${target.name}`, 'success');
        }
      },
      loginEmail: (email) => {
        const u = get().users.find((x) => x.email.toLowerCase() === email.toLowerCase());
        if (u) {
          set({ currentUserId: u.id });
          get().toast(`Welcome back, ${u.name}`, 'success');
          return true;
        }
        get().toast('No account found for that email', 'error');
        return false;
      },
      signup: (data) => {
        const u: User = {
          id: uid('u-'),
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: 'user',
          avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(data.email)}`,
          createdAt: Date.now(),
        };
        set((s) => ({ users: [...s.users, u], currentUserId: u.id }));
        get().toast(`Welcome to Estately, ${u.name}!`, 'success');
        return u;
      },
      logout: () => set({ currentUserId: null, compare: [] }),
      toggleTheme: () => {
        set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' }));
        applyTheme(get().theme);
      },
      toast: (text, kind = 'info') => {
        const id = uid('t-');
        set((s) => ({ toasts: [...s.toasts, { id, text, kind }] }));
        setTimeout(() => get().dismissToast(id), 3500);
      },
      dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      toggleFavorite: (propertyId) => {
        const u = get().currentUserId;
        if (!u) {
          get().toast('Please sign in to save favorites', 'info');
          return;
        }
        const list = get().favorites[u] ?? [];
        const next = list.includes(propertyId) ? list.filter((x) => x !== propertyId) : [...list, propertyId];
        set((s) => ({ favorites: { ...s.favorites, [u]: next } }));
      },
      toggleCompare: (propertyId) => {
        set((s) => {
          const has = s.compare.includes(propertyId);
          if (has) return { compare: s.compare.filter((x) => x !== propertyId) };
          if (s.compare.length >= 3) {
            get().toast('Compare up to 3 properties at a time', 'info');
            return s;
          }
          return { compare: [...s.compare, propertyId] };
        });
      },
      clearCompare: () => set({ compare: [] }),
      registerView: (propertyId) => {
        set((s) => ({
          properties: s.properties.map((p) => (p.id === propertyId ? { ...p, views: p.views + 1 } : p)),
          recentlyViewed: [propertyId, ...s.recentlyViewed.filter((x) => x !== propertyId)].slice(0, 8),
        }));
      },

      addProperty: (p) => {
        const me = get().currentUser();
        const slug =
          p.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .slice(0, 60) + '-' + Math.random().toString(36).slice(2, 6);
        const created: Property = {
          ...p,
          id: uid('p-'),
          slug,
          status: me?.role === 'admin' ? 'approved' : 'pending',
          featured: false,
          createdAt: Date.now(),
          views: 0,
          ownerId: me?.id ?? 'guest',
          ownerName: p.ownerName ?? me?.name ?? 'Guest seller',
          ownerEmail: p.ownerEmail ?? me?.email ?? 'unknown@estately.demo',
          ownerPhone: p.ownerPhone || me?.phone || '',
        };
        set((s) => ({ properties: [created, ...s.properties] }));
        // notify admins
        get()
          .users.filter((u) => u.role === 'admin')
          .forEach((a) =>
            get().addNotification({
              userId: a.id,
              title: 'New listing pending review',
              body: `${created.title} • ${created.city}`,
              link: `/admin`,
            }),
          );
        get().toast('Listing submitted! Admin will review shortly.', 'success');
        return created;
      },
      approveProperty: (id) => {
        set((s) => ({
          properties: s.properties.map((p) => (p.id === id ? { ...p, status: 'approved' as const } : p)),
        }));
        const prop = get().property(id);
        if (prop) {
          get().addNotification({
            userId: prop.ownerId,
            title: 'Your listing is live',
            body: `${prop.title} has been approved.`,
            link: `/property/${prop.slug}`,
          });
        }
        get().toast('Listing approved', 'success');
      },
      rejectProperty: (id) => {
        set((s) => ({
          properties: s.properties.map((p) => (p.id === id ? { ...p, status: 'rejected' as const } : p)),
        }));
        const prop = get().property(id);
        if (prop) {
          get().addNotification({
            userId: prop.ownerId,
            title: 'Listing not approved',
            body: `${prop.title} did not pass review. Please update and resubmit.`,
          });
        }
        get().toast('Listing rejected', 'info');
      },
      toggleFeatured: (id) => {
        set((s) => ({
          properties: s.properties.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p)),
        }));
      },
      deleteProperty: (id) => {
        set((s) => ({ properties: s.properties.filter((p) => p.id !== id) }));
        get().toast('Listing deleted', 'info');
      },

      addInquiry: (q) => {
        const inq: Inquiry = { ...q, id: uid('i-'), createdAt: Date.now() };
        set((s) => ({ inquiries: [inq, ...s.inquiries] }));
        const prop = get().property(q.propertyId);
        if (prop) {
          get().addNotification({
            userId: prop.ownerId,
            title: q.visitDate ? 'New visit request' : 'New inquiry',
            body: `${q.name}: ${q.message.slice(0, 80)}`,
            link: `/dashboard`,
          });
        }
        get().toast('Message sent. The agent will be in touch.', 'success');
      },
      startThread: (propertyId, sellerId, sellerName) => {
        const me = get().currentUser();
        if (!me) {
          get().toast('Please sign in to chat', 'info');
          return '';
        }
        const existing = get().threads.find(
          (t) => t.propertyId === propertyId && t.buyerId === me.id && t.sellerId === sellerId,
        );
        if (existing) return existing.id;
        const t: Thread = {
          id: uid('th-'),
          propertyId,
          buyerId: me.id,
          buyerName: me.name,
          sellerId,
          sellerName,
          lastText: '',
          lastAt: Date.now(),
        };
        set((s) => ({ threads: [t, ...s.threads] }));
        return t.id;
      },
      sendMessage: (threadId, text) => {
        const me = get().currentUser();
        if (!me) return;
        const m: Message = {
          id: uid('m-'),
          threadId,
          fromUserId: me.id,
          fromName: me.name,
          text,
          createdAt: Date.now(),
        };
        set((s) => ({
          messages: [...s.messages, m],
          threads: s.threads.map((t) => (t.id === threadId ? { ...t, lastText: text, lastAt: m.createdAt } : t)),
        }));
        const thread = get().threads.find((t) => t.id === threadId);
        if (thread) {
          const otherId = thread.buyerId === me.id ? thread.sellerId : thread.buyerId;
          get().addNotification({
            userId: otherId,
            title: `New message from ${me.name}`,
            body: text.slice(0, 80),
            link: `/dashboard`,
          });
        }
      },

      addNotification: (n) => {
        const note: Notification = { ...n, id: uid('n-'), createdAt: Date.now(), read: false };
        set((s) => ({ notifications: [note, ...s.notifications] }));
      },
      markAllRead: () => {
        const u = get().currentUserId;
        if (!u) return;
        set((s) => ({
          notifications: s.notifications.map((n) => (n.userId === u ? { ...n, read: true } : n)),
        }));
      },

      deleteUser: (id) => {
        set((s) => ({
          users: s.users.filter((u) => u.id !== id),
          properties: s.properties.filter((p) => p.ownerId !== id),
        }));
        get().toast('User removed', 'info');
      },
    }),
    {
      name: 'estately-store-v1',
      partialize: (s) => ({
        users: s.users,
        properties: s.properties,
        inquiries: s.inquiries,
        threads: s.threads,
        messages: s.messages,
        notifications: s.notifications,
        favorites: s.favorites,
        recentlyViewed: s.recentlyViewed,
        currentUserId: s.currentUserId,
        theme: s.theme,
      }),
    },
  ),
);

function applyTheme(theme: 'light' | 'dark') {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

// Apply theme on initial load
if (typeof window !== 'undefined') {
  setTimeout(() => applyTheme(useStore.getState().theme), 0);
}
