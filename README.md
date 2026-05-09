# Estately — Real Estate Portal (Demo)

A frontend-only real estate portal demo with localStorage persistence. Buy, rent, list, compare, chat (UI), favorites, mortgage calculator, map view, admin approvals, and a dark mode for premium feel.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173 — Vite will auto-open it.

## Demo logins

On the **/login** page, click one of:

- **Login as Admin** — full approval queue, analytics, manage users.
- **Login as User** — buyer/seller experience: favorites, messages, my listings, dashboard.

Or sign in with email `user@estately.demo` / `admin@estately.demo`.

## What's implemented

- Hero search, featured & trending listings, animated counters
- Listings page with grid/map toggle, filters drawer, sort, infinite scroll
- Property detail with gallery, lightbox, location map, mortgage calculator, contact form, schedule visit
- 5-step add property flow with map pin drop, drag-and-drop image upload (data URL), admin approval gate
- Compare 2–3 properties side-by-side with feature checks
- User dashboard (profile / listings / favorites / inquiries / messages)
- Admin dashboard (overview KPIs, top cities, most viewed, approvals queue, all listings, users)
- Stub messaging (UI only, persists locally), in-app notifications + toasts
- Dark mode, lazy-loaded images with skeletons, micro-interactions

## What's stubbed

- Real chat backend → UI is fully functional but only persists locally
- Stripe payments → Featured-listing toggles work, no charge flow
- 360° virtual tours → image gallery acts as the tour
- Email/SMS notifications → in-app bell + toast

## Tech

- Vite + React 18 + TypeScript
- Tailwind CSS (with dark mode)
- React Router v6
- Zustand (with `persist` middleware → localStorage)
- Leaflet via `react-leaflet` + OpenStreetMap tiles
- `lucide-react` icons
