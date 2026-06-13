# Executive Portfolio Platform

A production-ready, secure **executive portfolio management platform** — a premium public
portfolio website backed by a private administrator dashboard. Every piece of content is
editable from the dashboard without touching code. Built to a Fortune-500, enterprise-grade
standard.

- **Public site** — hero, about, expertise, career timeline, projects, research, patents,
  awards, press, speaking, certifications, testimonials, gallery, contact, footer.
- **Admin dashboard** — full CRUD for every content type, media uploads, SEO, site settings,
  message inbox and analytics.
- **Graceful skeletons** — any section without content shows a tasteful placeholder instead of
  breaking the layout.
- **Printable / downloadable** — a `/print` route renders a clean CV you can save as PDF.

---

## Tech stack

| Layer          | Technology                                   |
| -------------- | -------------------------------------------- |
| Framework      | Next.js 16 (App Router) + React 19           |
| Language       | TypeScript                                   |
| Styling        | Tailwind CSS v4                              |
| Auth/DB/Storage| Supabase (Postgres, Auth, Storage)           |
| Validation     | Zod                                          |
| Hosting        | Railway (Docker)                             |

No Prisma, NextAuth, Cloudinary or separate databases. Supabase handles auth, data and files.

---

## 1. Prerequisites

- Node.js 20+ (22 recommended)
- A free [Supabase](https://supabase.com) project
- A [Railway](https://railway.app) account (for deployment)

---

## 2. Supabase setup

1. Create a new project at [app.supabase.com](https://app.supabase.com).
2. Grab your keys from **Project Settings → API**:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret — server only)
3. Grab your DB connection string from **Settings → Database → Connection string → Session
   pooler (URI)** → `DATABASE_URL`. This is what enables hands-off provisioning.

### Zero-touch provisioning (recommended)

You do **not** need to run any SQL or create any users by hand. On first boot the app:

- applies [`supabase/schema.sql`](supabase/schema.sql) automatically (idempotent — every table,
  index, RLS policy and the `media` / `documents` storage buckets), and
- creates your admin user and grants it access.

To enable it, just set these variables (locally in `.env.local`, or in Railway):

```
DATABASE_URL=postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres
ADMIN_EMAILS=you@example.com
ADMIN_PASSWORD=a-strong-password
```

Then start (or deploy) — the schema lands and you can sign in at `/admin/login` immediately.

> **Manual alternative.** If you prefer, skip `DATABASE_URL`/`ADMIN_PASSWORD`: run
> `supabase/schema.sql` once in the SQL editor, create your user in **Authentication → Users**,
> and set just `ADMIN_EMAILS` (the app grants admin on first login). Admin access is always
> explicit — there is deliberately no "first user becomes admin" shortcut, which would be
> exploitable since the sign-up endpoint is public.

---

## 3. Local development

```bash
cp .env.example .env.local      # then fill in your Supabase keys
npm install
npm run dev                     # http://localhost:3000
```

- Public site: `http://localhost:3000`
- Admin: `http://localhost:3000/admin` (redirects to login)
- Printable profile: `http://localhost:3000/print`

> The app runs even **before** Supabase is connected — every section degrades to a skeleton so
> you can preview the design. Auth and editing require the Supabase keys.

---

## 4. Environment variables

| Variable                        | Required | Description                                                    |
| ------------------------------- | -------- | ------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | yes      | Supabase project URL                                          |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes      | Public anon key (browser-safe, protected by RLS)              |
| `SUPABASE_SERVICE_ROLE_KEY`     | yes      | Service-role key — **server only**, never exposed             |
| `DATABASE_URL`                  | rec.     | Postgres session-pooler URI — enables auto schema on boot     |
| `ADMIN_EMAILS`                  | rec.     | Comma-separated emails granted admin                          |
| `ADMIN_PASSWORD`                | opt.     | With `DATABASE_URL`, auto-creates the admin auth user on boot |
| `NEXT_PUBLIC_SITE_URL`          | opt.     | Canonical URL for SEO, sitemap & Open Graph                   |

---

## 5. Deploying to Railway

This repo ships with a `Dockerfile` and `railway.json`, so Railway builds a slim standalone
image automatically.

1. Push this project to a GitHub repository.
2. In Railway: **New Project → Deploy from GitHub repo** and select it.
3. Railway detects the `Dockerfile` (via `railway.json`). No build config needed.
4. Add the environment variables from the table above under **Variables** — including
   `DATABASE_URL`, `ADMIN_EMAILS` and `ADMIN_PASSWORD` for fully-automatic setup.
5. Deploy. On boot the app provisions the database schema and admin user itself, then starts.
   Railway assigns a public URL and sets `PORT` automatically (the app binds `0.0.0.0`).
   **That's it — no manual SQL, no post-deploy steps.** Sign in at `/admin/login`.
6. **Custom domain**: **Settings → Networking → Custom Domain**, add your domain and create the
   shown CNAME record at your DNS provider. Then set `NEXT_PUBLIC_SITE_URL` to that domain and
   redeploy so SEO/sitemap use absolute URLs.

### Production build (manual)

```bash
npm run build      # outputs .next/standalone
node .next/standalone/server.js
```

---

## 6. Using the dashboard

| Section            | What you manage                                                  |
| ------------------ | --------------------------------------------------------------- |
| **Profile**        | Name, title, bio, mission, summary, contacts, socials, CV       |
| **Expertise**      | Domains of mastery with skills & icons                          |
| **Experience**     | Career timeline with achievements                               |
| **Projects**       | Featured work, galleries, case studies, technologies, links     |
| **Categories**     | Project categories used for filtering                           |
| **Publications**   | Research papers, articles, white papers                         |
| **Patents & IP**   | Granted / pending intellectual property                         |
| **Awards**         | Honors & recognition                                            |
| **Certifications** | Professional credentials                                        |
| **Speaking**       | Keynotes, panels, workshops                                     |
| **Media & Press**  | Coverage, interviews, features                                  |
| **Testimonials**   | Endorsements with ratings                                       |
| **Gallery & Media**| Professional images, videos, documents                          |
| **Messages**       | Contact-form inbox (read / reply / delete)                      |
| **SEO**            | Meta tags, Open Graph, Twitter cards                            |
| **Settings**       | Branding, accent color, **dark/light theme**, announcement bar, section order/visibility |

Reorder or hide any homepage section from **Settings → Homepage sections**. Change the accent
color and the entire site palette follows.

**Theme.** Set the default **dark or light** theme in Settings. Visitors can also flip it
themselves with the sun/moon toggle in the navbar — their choice is remembered in the browser.

---

## 7. Security

- **Row Level Security** on every table — the public (anon) role can only _read_ published
  content and _insert_ a contact message; nothing else.
- **Protected admin routes** via middleware + a server-side `requireAdmin()` guard
  (defence-in-depth).
- **Service-role key stays server-side** — used only by trusted server actions.
- **Validation** with Zod on every write.
- **Rate limiting** on the login (8 / 15 min) and contact form (5 / 10 min) per IP.
- **Spam protection** — honeypot field on the contact form.
- **Secure uploads** — type + size validation, randomized object keys, admin-only writes.
- **Security headers** — Content-Security-Policy, HSTS, X-Frame-Options,
  X-Content-Type-Options, Referrer-Policy, Permissions-Policy (see `next.config.ts`).
- **Explicit admin bootstrap** — no public "first user wins" path; admins granted via
  `ADMIN_EMAILS` allowlist or manual SQL.
- **Scoped image optimizer** — `next/image` restricted to your Supabase Storage host (no open
  proxy).

## Performance & caching

Public pages are statically rendered and served from the Next.js Data Cache (tagged
`portfolio-content`). Editing anything in the dashboard calls `revalidateTag(...)`, so the public
site updates immediately without per-request database round-trips. The admin dashboard always
reads live data.

---

## 8. Project structure

```
myportfolio/
├── supabase/schema.sql            # Complete DB schema, RLS, storage
├── Dockerfile, railway.json       # Railway deployment
├── src/
│   ├── app/
│   │   ├── page.tsx               # Public homepage (composes all sections)
│   │   ├── projects/[slug]/       # Project detail pages
│   │   ├── print/                 # Printable / downloadable CV
│   │   ├── sitemap.ts, robots.ts  # SEO
│   │   └── admin/
│   │       ├── login/             # Auth (outside protected layout)
│   │       └── (panel)/           # Protected dashboard + all editors
│   ├── components/
│   │   ├── public/                # Hero, sections, navbar, footer
│   │   ├── admin/                 # Dashboard UI, config-driven CRUD
│   │   └── ui/                    # Shared primitives
│   ├── lib/
│   │   ├── supabase/              # Browser/server/admin clients + middleware
│   │   ├── actions/               # Server actions (CRUD, auth, contact, upload)
│   │   ├── data.ts                # Read layer
│   │   ├── validations.ts         # Zod schemas
│   │   └── admin-config.ts        # Declarative resource definitions
│   ├── types/database.ts          # Domain types
│   └── middleware.ts              # Session refresh + admin gate
```

---

## License

Private. © All rights reserved.
