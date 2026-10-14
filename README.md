# Furi Kale Hiwot — Children's Ministry Management

A production-oriented management system for a church children's ministry: children,
parents, teachers, classes, activities, schedules, attendance, lessons, progress,
events, communication and safeguarding — in one place, for three roles.

Built with **Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Supabase
(PostgreSQL + Auth + Row Level Security)**.

---

## 1. Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

The app runs immediately in **preview mode**: no Supabase project required. A realistic
demo dataset backs every screen and sign-in uses a cookie-based role preview so the
product can be reviewed end to end.

### Connect the real backend

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local` and fill in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
3. Run the migrations in order (SQL editor or `supabase db push`):
   - `supabase/migrations/0001_schema.sql` — tables, enums, relationships, triggers
   - `supabase/migrations/0002_policies.sql` — Row Level Security
   - `supabase/migrations/0003_seed.sql` — optional starter data

Nothing else changes: every page already reads through the Supabase data layer
(`src/lib/data/queries.ts`) and falls back to demo data only when credentials are
missing.

---

## 2. The logo

The church emblem that shipped with the project (`11.jfif`) is **never modified**.

| File | Purpose |
| --- | --- |
| `11.jfif` | untouched original, left at the repo root |
| `public/brand/logo-original.jpg` | byte copy of the original, source for the pipeline |
| `public/brand/logo-transparent.png` | generated — original colours, white background removed |
| `public/brand/logo-mask.png` | generated — alpha silhouette used as a CSS mask |

```bash
npm run logo:generate   # regenerates both derived assets + prints an ASCII preview
```

`<Logo>` / `<LogoMark>` (`src/components/brand/logo.tsx`) render the emblem in three
variants — `themed`, `original`, `contrast`. The themed variant paints the mask with the
`--logo-color` token, so **re-colouring the logo everywhere is a one-line change** in
`src/app/globals.css`. Shape, proportions and recognisability are always preserved.

---

## 3. Design system

Derived from the supplied UI reference (deep forest green, warm cream canvas, pale
section bands, pill controls, generously rounded cards, soft diffuse shadows).

All tokens live in `src/app/globals.css`:

- **Brand** `--color-brand-50…950` (primary `#2f5d2a`), sage accents
- **Surfaces** `canvas #fbfbf3`, `band #eef4e3`, `surface #ffffff`
- **Text** `ink #1b251a`, `muted`, `faint`
- **Status** sun (amber), berry (red), sky (blue — the logo's heritage colour), plum
- **Radii** `xs .5rem → 2xl 2.25rem`; **shadows** `card`, `lift`, `float`
- **Type** Plus Jakarta Sans (display) + Inter (body)

Reusable primitives in `src/components/ui`: Button, Card, Badge/Status badges, Field
(Input, Select, Textarea, Checkbox, Switch), Avatar/AvatarStack, StatCard, ProgressBar,
Table, EmptyState, Tabs, PageHeader. Domain components in `src/components/domain`:
activity rows/cards, child cards, event cards, lesson cards, announcements, notification
list, calendar (month + week), attendance taker, role selector, message centre.

**Responsive by design:** phones get a bottom tab bar and a slide-over drawer; tablets
and desktops get the floating sidebar and pill top bar — not a shrunken desktop layout.

---

## 4. Roles & routes

| Role | Home | Capabilities |
| --- | --- | --- |
| **Admin** | `/admin` | dashboard, users & roles, children, parents, teachers, registrations, classes, activities & schedule, events, lessons, attendance, calendar, announcements, notifications, reports, settings, audit logs |
| **Teacher** | `/teacher` | assigned classes only, students, schedule, attendance, lessons, progress, messages, announcements, events |
| **Parent** | `/parent` | own children only, register a child, schedule, attendance, lessons, progress, events, messages, notifications, settings |

Role changes (`Parent → Teacher → Admin`) happen on `/admin/users` via a select with an
explicit confirmation step; every change is written to the audit log.

---

## 5. Age bands & language

The ministry serves **children aged 4–15**, grouped into four age bands, each taught
in **Amharic (አማርኛ)**, **English**, or both:

| Age band | Class | Language |
| --- | --- | --- |
| 4–6 | Little Sprouts (ቡቃያ) | Amharic |
| 4–6 | Little Sprouts (English) | English |
| 7–9 | Junior Class (ታናናሾች) | Amharic |
| 10–12 | Explorers (አሳሾች) | Amharic & English |
| 13–15 | Anchor Teens (መልህቅ) | Amharic |

- Parents pick a **language preference** during registration (`languagePreference` on
  the child record); the form then suggests only the classes that fit the child's age
  **and** preferred language.
- Ages outside 4–15 are rejected by the form, by the server action and by a `CHECK`
  constraint on `children.birth_date`.
- `age_band_for(birth_date)` in SQL and `bandForAge(age)` in TypeScript keep placement
  consistent on both sides.

---

## 6. Activities, not "Sundays"

The schedule system is generic: an activity has a **type** (class, Bible study,
children's worship, choir, teacher/parent meeting, camp, field trip, competition,
programme, custom), a date, start/end time, location, class/group, teachers, audience,
recurrence (weekly / bi-weekly / monthly on any weekdays) and reminder settings.

Reminders: `1 day`, `1 hour`, `30 / 15 / 10 minutes before`, `at start`, `at end`, plus
automatic cancellation and reschedule notices.

---

## 7. Safety

- Role-based access in the UI **and** Row Level Security in the database
- A parent can only reach their own children (`is_my_child`)
- A teacher can only reach children in their assigned classes (`teaches_child`)
- Emergency contacts, authorised pick-up lists, photo/medical consent, check-in/out
- Append-only `audit_logs` (no update/delete policy exists)

---

## 8. Project structure

```
src/
  app/
    page.tsx                 public landing page
    (auth)/                  login · register · forgot-password
    admin/ teacher/ parent/  role areas, each with its own layout + shell
  components/
    brand/     logo
    layout/    app shell, sidebar, top bar, mobile nav
    ui/        design-system primitives
    domain/    ministry-specific components
    marketing/ illustrated scenes
  lib/
    actions/   server actions (auth, ministry mutations)
    config/    site + navigation config
    data/      queries (Supabase-first) + demo dataset
    supabase/  browser / server / middleware clients
    auth.ts roles.ts types.ts labels.ts utils.ts
  middleware.ts              route protection + session refresh
supabase/migrations/         schema · policies · seed
scripts/generate-logo-assets.mjs
```

## 9. Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | development server |
| `npm run build` | production build (type-check + lint) |
| `npm start` | serve the production build |
| `npm run lint` | ESLint |
| `npm run logo:generate` | rebuild the themeable logo assets |
