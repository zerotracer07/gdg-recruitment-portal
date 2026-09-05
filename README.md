# GDG VITC — Recruitment Portal

Recruitment portal for **Google Developer Groups on Campus, VIT Chennai**.
Candidates discover 12 departments, apply to up to 2, and track their status live.
Admins review applications through a hiring pipeline, email candidates, and view reports.

**Live:** https://gdg-recruitment-portal.vercel.app/

## Features

**Candidates**
- Department discovery with icons, descriptions, and lead profiles
- Application forms with department-specific screening questions (all compulsory)
- OTP email verification before account creation
- Draft auto-save with visible "Draft auto-saved" indicator
- My Applications page with a visual status timeline (Applied → Under Review → Interview → Result)
- Welcome, application-confirmation, and status-change emails

**Admins / Leads**
- Dashboard: totals, acceptance rate, avg. time-to-decision, per-department bars, status funnel
- Applicant table: search, department/status/shortlist filters, sorting, pagination, CSV export
- Status pipeline per applicant + internal notes (auto-emails the candidate)
- Bulk custom emails with rich-text editor and templates

**Platform**
- Email/password + Google sign-in (Better-Auth, admin roles, protected routes)
- Light/dark/system themes, fully responsive with mobile apply bar
- Legal pages (Privacy, Terms, Community Guidelines), Support FAQ, branded 404/500
- Animated 3D depth background, custom cursor, scroll entrances, count-ups

## Tech stack

Next.js 14 (App Router) · React 18 · Tailwind CSS + shadcn/ui · Framer Motion ·
Better-Auth · Cloud Firestore (firebase-admin) · Nodemailer (Gmail SMTP)

## Getting started

**Prerequisites:** Node.js 18+

```powershell
Set-Location -LiteralPath "D:\Santhosh K\Original"  # or wherever you cloned it
npm install
Copy-Item ".env.example" ".env.local"   # then fill in the values below
npm run dev                             # → http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build (stop dev first on Windows) |
| `npm start` | Serve the production build |
| `npm run clean` | Delete the `.next` cache (fixes most stale-build 404s) |
| `npm run lint` | Lint check |

> Run **one** server at a time. If the app opens on `:3001`, another copy is hogging `:3000` — stop the extra one.

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Key | Where to get it |
|---|---|
| `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` | Firebase Console → Project Settings → Service Accounts → Generate key |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase Console → Project Settings → Your apps → Web app |
| `BETTER_AUTH_SECRET` | Any random 32+ char string: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `BETTER_AUTH_URL` | `http://localhost:3000` locally; your domain in production (redeploy after changing) |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google Cloud Console → Credentials → OAuth client. Add authorized redirect URI: `<APP_URL>/api/auth/callback/google` |
| `EMAIL_USERNAME`, `EMAIL_PASSWORD` | Gmail address + **App Password** (Google Account → Security → 2-Step Verification → App passwords). Regular passwords are rejected by Google |

Firestore setup: enable the **Cloud Firestore API** and create a database (production mode).
Client access is deny-by-default (`firestore.rules`) — all reads/writes go through server routes.

## Admin access

1. Sign in normally.
2. Firebase Console → Firestore → `user` collection → your document → set `role` to `admin`.
3. Sign out and back in → `/admin` unlocks (link also appears in the navbar).

## Project structure

```
app/                  # Routes: home, departments, join/[...ids], admin,
                      # profile, auth, privacy/terms/guidelines/support + APIs
components/           # UI: NavBar, Hero, FormComp, DataTable, AdminStats,
                      # MailComposer, CursorTracker, DepthBackground, magicui/*
constants/index.js    # Departments, leads, questions, statuses, email templates
lib/                  # auth.js, db.ts, mailer.js, otp.js, auth-client.js
public/assets/        # GDG logo, department icons, fonts
firestore.rules       # Deny-all direct client access
```

## Key behaviours to know

- **Max 2 applications** per account, enforced client- and server-side.
- **Submission deadline** is hardcoded in `app/api/submit-form/route.js` — bump it each cycle.
- **Testing mode**: the VIT-email restriction is currently OFF (any email works). Each bypass has a `NOTE (testing)` comment — restore all three to re-lock to campus emails.
- Emails are best-effort: if SMTP is unconfigured, actions succeed and the miss is logged/toasted, never a crash.

## Deployment (Vercel)

1. Push to GitHub (`main` branch).
2. Vercel → Add New Project → import repo (Next.js preset, defaults fine).
3. Add **all** `.env.local` keys as Environment Variables (`BETTER_AUTH_URL` = production URL, private key with real line breaks).
4. Deploy. Every push to `main` redeploys automatically.
5. Post-deploy: add the production Google redirect URI (table above) and set an admin via Firestore.
