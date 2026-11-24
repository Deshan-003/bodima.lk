# Bodima.lk

Frontend for a Sri Lankan boarding marketplace that connects **seekers** (people
looking for a room, annex or boarding place) with **owners** (people advertising
their properties). This repository contains the public website, the seeker and
owner experiences, and a separate frontend-only **Admin Panel**.

## Stack

Vite 5, React 18, TypeScript, Tailwind CSS 3, React Router 6 and Lucide icons.
There is **no backend, database or API server** — every demo interaction runs in
the browser against local mock data.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173. Production build: `npm run build` (TypeScript
check + Vite bundle), preview: `npm run preview`.

## Public routes

| Route | Page |
| --- | --- |
| `/` | Landing page — hero, search, features, popular locations, CTA, footer |
| `/browse` | Listings with cascading district/town, price, type and facility filters, sorting, pagination |
| `/browse/:id` | Property details — photo gallery, facilities, reviews, owner contact and chat |
| `/chats` | Saved chat threads (`?chat=1` on a details page opens a thread) |
| `/dashboard` | Owner dashboard — listing stats, property table, add-property modal |
| `/login`, `/register` | Seeker/owner authentication demo |
| `/about`, `/contact` | Placeholder pages |

## Admin Panel

The admin console lives under `/admin` with its own sidebar, top bar and route
guard. The public website is unchanged — no seeker or owner page was replaced.

### Demo admin credentials

| Field | Value |
| --- | --- |
| Email | `admin@bodima.lk` |
| Password | `Admin@123` |

Sign in at **http://localhost:5173/admin/login**. Incorrect credentials show an
inline error. A successful sign-in redirects to `/admin`; the session survives
a page refresh; **Logout** clears it and returns to the login page.

> **Security notice:** This is a frontend demonstration only. The credentials
> are hard-coded in `src/admin/auth/AdminAuthContext.tsx` and the session is a
> plain JSON object in `localStorage` (`bodima.admin.auth.v1`). `localStorage`
> is readable by any script on the origin, so this is **not** secure production
> authentication. A real deployment needs a server-side identity provider,
> hashed passwords, signed sessions/tokens, role checks on the API, rate
> limiting and audit logging.

### Admin routes

| Route | Page |
| --- | --- |
| `/admin/login` | Admin sign-in (public) |
| `/admin` | Dashboard — KPI cards, registration/listing charts, recent activity, quick actions |
| `/admin/listings` | All listings — search, filters, sort, pagination, approve/reject/feature/delete |
| `/admin/listings/pending` | Pending listings queue |
| `/admin/listings/reported` | Reported listings and moderation actions |
| `/admin/locations` | Districts and towns, properties by location |
| `/admin/users` | All users — add, edit, view, suspend, delete; `?q=` deep-links search |
| `/admin/users/seekers` | Seekers — profiles, saved-property suggestions, enquiry history |
| `/admin/users/owners` | Owners — profiles, their listings, pending and reported ads |
| `/admin/messages` | Enquiries — threads, admin replies, mark read, delete |
| `/admin/reviews` | Reviews — publish, report, pending moderation, delete |
| `/admin/reports` | Reports & complaints — review, notes, resolve/dismiss/delete |
| `/admin/analytics` | Charts and location/moderation performance |
| `/admin/notifications` | In-app notifications, mark read / mark all read |
| `/admin/settings` | Admin profile, notification preferences, platform config, password UI, reset demo data |

Unauthenticated visits to any `/admin/*` route (except `/admin/login`) redirect
to the login page. Seeker and owner accounts cannot access the console because
the admin session is stored separately from `bodima.auth.v1`.

### Frontend-only behaviour

All admin data lives in `src/admin/data/seed.ts` (deterministic mock data built
from the real `LISTINGS` and Sri Lankan districts/towns) and is persisted in
`localStorage` under `bodima.admin.data.v1` through `AdminDataProvider`. Every
mutation (add/edit/delete user, approve/reject/remove listing, resolve a
complaint, reply to an enquiry, change settings, …) updates React state
immediately, writes to storage, logs an activity entry and shows a toast. Use
**Settings → Security → Reset all demo data** to restore the seed dataset.

Charts are hand-built SVG components — no chart library was added.

## Project structure

```
src/
├── main.tsx                 # providers: Auth, AdminAuth, AdminData + router
├── App.tsx                  # public + protected admin routes
├── components/              # shared public-site components
├── context/AuthContext.tsx  # seeker/owner demo session (bodima.auth.v1)
├── data/                    # public listings, locations, chats
├── pages/                   # public, seeker and owner pages
└── admin/
    ├── auth/AdminAuthContext.tsx
    ├── components/          # AdminLayout, AdminRoute, ListingTable, SVG charts, UI kit
    ├── data/                # types, seed data, selectors, persistent store
    └── pages/               # admin login + 14 console pages
```

## Assets

Photos in `public/assets/` were extracted from reference mockups in
`reference/`. The scripts in `scripts/` show how each crop was produced. The
admin panel reuses the same listing photos so moderation previews match the
public site.

## Limitations

- No backend: data is per-browser `localStorage`; clearing site data resets it
  and two browsers do not share state.
- Admin and public demo accounts are independent; logging in as a seeker/owner
  does not grant admin access (by design).
- Uploaded admin photos are selected from existing bundled assets rather than
  stored to a server.
- The password-change screen is a UI demonstration; it does not alter the
  hard-coded demo login password.
