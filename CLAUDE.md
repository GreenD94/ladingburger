@../UI-UX-RULES.md
@UI-UX-RULES.md
@SPIRIT.md

# ladingburger — AI Agent Briefing

## What this app is

A full-stack restaurant web app named **Saborea**. Two audiences:
1. **Customers** — browse the menu, add to cart, place orders, track order status
2. **Admin staff** — manage orders, menu, inventory, users, analytics

**Stack:** Next.js 14 (App Router) · TypeScript 5 · MongoDB · CSS Modules · Framer Motion

**Database:** MongoDB accessed directly via Next.js server actions — there is no separate API server.

**Auth:** JWT (`jose`) + bcrypt. Admins log in at `/login`. Customers identify themselves by phone number.

---

## The 5 rules you must never break

1. **No CSS libraries** — no MUI, no Tailwind, no Bootstrap. Styling is **CSS Modules only** (`.module.css` files) + CSS variables in `globals.css`. Icons via `material-symbols-outlined` CSS class.
2. **No `null` / `undefined` / `any`** — use empty constants (`''`, `0`, `false`, `EMPTY_USER`).
3. **No ESLint disable comments** — fix the code instead.
4. **All user-facing text through `useLanguage()`** — never hardcode strings. Add keys to `src/features/i18n/translations.ts` for both `en` and `es`.
5. **Mobile-first always** — `SafeArea` component on every full-screen layout; `PillSelect` for every select; `InfoModal` next to every chart/stat.

Full rules: `CODING_RULES.md`

---

## Architecture in one paragraph

Features live in `src/features/<name>/`. Each feature is self-contained: `components/`, `containers/`, `hooks/`, `actions/`, `types/`, `utils/`, `styles/`, `constants/`. Pages in `src/app/` are thin wrappers that only import a Container. All business logic lives in Containers and hooks. Server-side DB calls live in `actions/` files marked `'use server'`.

File naming: `Thing.component.tsx` · `ThingContainer.container.tsx` · `useThing.hook.ts` · `doThing.action.ts` · `Thing.type.ts` · `doThing.util.ts`

---

## Key shared components (always use these, never reinvent)

| Component | Path | Use for |
|---|---|---|
| `SafeArea` | `@/features/shared/components/SafeArea.component` | Any full-screen or fixed layout |
| `PillSelect` | `@/features/shared/components/PillSelect.component` | All dropdowns/selects |
| `InfoModal` | `@/features/shared/components/InfoModal.component` | Info button next to every chart/stat |
| `PhoneNumberInput` | `@/features/shared/components/PhoneNumberInput.component` | Phone inputs |

---

## MongoDB collections (source of truth: `DATABASE.md`)

`orders` · `users` · `burgers` · `admins` · `etiquetas` · `settings` · `businessContact` · `materials` · `bills` · `materialLosses`

---

## Current state (what's done vs not)

See `FEATURES.md` for the full feature inventory with statuses.

**In short:** Customer flow + Admin orders/menu/users/analytics/kitchen are fully built. Inventory module is partially built (materials + bills UI done; analytics, reconciliation, losses UI, and Excel export are NOT built). Automatic etiqueta assignment logic is designed but NOT wired into order status updates.

---

## Where to look for things

| Question | Where to look |
|---|---|
| What's built? | `FEATURES.md` |
| What needs to be done? | `TASKS.md` |
| What was last worked on? | `SESSION.md` |
| What changed and when? | `CHANGELOG.md` |
| DB schema | `DATABASE.md` |
| Coding rules | `CODING_RULES.md` |
| Order statuses / types | `src/features/database/types/status.type.ts` |
| All DB types | `src/features/database/types/` |
| i18n translations | `src/features/i18n/translations.ts` |
