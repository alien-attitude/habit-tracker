# Habit Tracker PWA

A mobile-first Progressive Web App for building and tracking daily habits. Built with Next.js App Router, React, TypeScript, and Tailwind CSS. All data persists locally via `localStorage` — no backend or external auth service required.

---

## Project Overview

Users can:
- Sign up and log in with email and password (local auth)
- Create, edit, and delete habits
- Mark habits complete for today and track streaks
- Install the app via the browser's "Add to Home Screen" prompt
- Use the app shell offline after the first load

---

## Setup

```bash
# Install dependencies
npm install

# Install Playwright browsers (for E2E tests)
npx playwright install chromium
```

---

## Running the App

```bash
# Development server (http://localhost:3000)
npm run dev

# Production build and start
npm run build
npm run start
```

---

## Running the Tests

```bash
# Unit tests only (with coverage report)
npm run test:unit

# Integration / component tests
npm run test:integration

# End-to-end tests (requires dev server — starts automatically)
npm run test:e2e

# Run all test suites in sequence
npm run test
```

Coverage reports are generated in `./coverage/` after running `test:unit`.
Minimum threshold: **80% line coverage** for `src/lib/`.

---

## Local Persistence Structure

All data is stored in `localStorage` under three keys:

| Key | Shape | Description |
|---|---|---|
| `habit-tracker-users` | `User[]` | All registered users |
| `habit-tracker-session` | `Session \| null` | Active session |
| `habit-tracker-habits` | `Habit[]` | All habits for all users |

**User shape:**
```ts
{ id: string; email: string; password: string; createdAt: string }
```

**Session shape:**
```ts
{ userId: string; email: string }
```

**Habit shape:**
```ts
{
  id: string;
  userId: string;
  name: string;
  description: string;
  frequency: 'daily';
  createdAt: string;
  completions: string[]; // YYYY-MM-DD dates
}
```

Each dashboard render filters habits by `session.userId`, so users only ever see their own habits.

---

## PWA Support

Three pieces make this app installable and partially offline-capable:

1. **`public/manifest.json`** — declares `name`, `short_name`, `start_url`, `display: standalone`, theme/background colors, and 192×512 icons. Linked from `<head>` in the root layout.

2. **`public/sw.js`** — a hand-written service worker that:
    - On `install`: pre-caches the app shell URLs (`/`, `/login`, `/signup`, `/dashboard`, icons, manifest)
    - On `fetch`: uses **network-first** for HTML navigation (falls back to cache), **cache-first** for static assets
    - On `activate`: deletes stale caches

3. **SW registration** — injected as an inline script in `src/app/layout.tsx` so it runs on the client after load without requiring a separate entry file.

After one online visit the cached shell renders without a network connection.

---

## Trade-offs and Limitations

| Area | Decision | Reason |
|---|---|---|
| Auth | Plaintext passwords in localStorage | Stage requirement: no backend, local-only, deterministic |
| Frequency | Only `daily` supported | Spec explicitly states only daily is required for Stage 3 |
| Streaks | UTC-based date math | Avoids timezone ambiguity in tests; production would use local date |
| SW caching | App shell only | Fulfils the spec's minimum offline requirement without over-engineering |
| IDs | `crypto.randomUUID()` | Available in all modern browsers; mocked in tests via `setup.ts` |

---

## Test File Map

| File | Tool | Describe block | What it verifies |
|---|---|---|---|
| `tests/unit/slug.test.ts` | Vitest | `getHabitSlug` | Slug generation: lowercase, trim, collapse spaces, strip special chars |
| `tests/unit/validators.test.ts` | Vitest | `validateHabitName` | Empty rejection, 60-char limit, trimmed valid value |
| `tests/unit/streaks.test.ts` | Vitest | `calculateCurrentStreak` | Zero for empty/missing today, consecutive count, dedup, gap-breaking |
| `tests/unit/habits.test.ts` | Vitest | `toggleHabitCompletion` | Add/remove date, no mutation, no duplicates |
| `tests/integration/auth-flow.test.tsx` | Vitest + RTL | `auth flow` | Signup creates user + session; duplicate email error; login stores session; invalid credentials error |
| `tests/integration/habit-form.test.tsx` | Vitest + RTL | `habit form` | Name validation error; create renders card; edit preserves immutable fields; delete requires confirmation; toggle updates streak |
| `tests/e2e/app.spec.ts` | Playwright | `Habit Tracker app` | Splash screen → login redirect; auth redirect; protected route; full signup/login flows; create/complete habit; reload persistence; logout; offline shell |

---

## Folder and File Structure

```
src/
  app/
    layout.tsx            # Root layout (SW registration, manifest link)
    page.tsx              # / route — splash screen + redirect logic
    globals.css
    login/page.tsx        # /login route
    signup/page.tsx       # /signup route
    dashboard/page.tsx    # /dashboard route (protected)
  components/
    auth/
      LoginForm.tsx       # data-testid: auth-login-{email,password,submit}
      SignupForm.tsx      # data-testid: auth-signup-{email,password,submit}
    habits/
      HabitCard.tsx       # data-testid: habit-{card,streak,complete,edit,delete}-{slug}
      HabitForm.tsx       # data-testid: habit-{form,name-input,description-input,frequency-select,save-button}
    shared/
      SplashScreen.tsx    # data-testid: splash-screen
  lib/
    slug.ts               # getHabitSlug()
    validators.ts         # validateHabitName()
    streaks.ts            # calculateCurrentStreak()
    habits.ts             # toggleHabitCompletion()
    storage.ts            # localStorage read/write helpers
  types/
    auth.ts               # User, Session
    habit.ts              # Habit
tests/
  setup.ts                # localStorage + crypto mocks
  unit/
    slug.test.ts
    validators.test.ts
    streaks.test.ts
    habits.test.ts
  integration/
    auth-flow.test.tsx
    habit-form.test.tsx
  e2e/
    app.spec.ts
public/
  manifest.json
  sw.js
  icons/
    icon-192.png
    icon-512.png
```
