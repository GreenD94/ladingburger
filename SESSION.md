# Session Context — ladingburger

**Read this first when starting a new session. Update it at the end of every session.**

---

## Last Updated: 2026-06-17

## Current Phase

**Cycle 01 complete. Phase 1 — UI/UX Audit is next.**

All 11 Cycle 01 tasks done. Ladingburger is wired end-to-end to the FastAPI backend for auth, menu, and orders.

## What To Do Next

**Phase 1 — UI/UX Audit**: boot both servers and walk through all 13 screens listed in `ROADMAP.md Phase 1`.

Start order:
1. Landing page (`/`)
2. Menu + cart drawer (`/menu`)
3. Customer order flow (`/create-order` → `/order-confirmation` → `/my-orders`)
4. Admin login (`/login`)
5. Admin orders (`/admin/orders`)
6. ... (see ROADMAP.md for full list)

## How to Start

**PowerShell only — `.\start.ps1` does NOT work in Git Bash.**

```powershell
# Terminal 1
cd D:\github\saborea\legacy-python-backend
.\start.ps1

# Terminal 2
cd D:\github\saborea\ladingburger
npm run dev   # http://localhost:3000
```
Admin: `admin@saborea.com` / `admin123`

## Current Blockers

`ladingburger/.env.local` must exist with:
- `MONGODB_URI` — still needed for unmigrated admin pages (menu CRUD, users, analytics, inventory, kitchen)
- `JWT_SECRET`
- `NEXT_PUBLIC_API_URL=http://localhost:8000`

## Architecture Rules (never break these)

- No new MongoDB server actions — every feature uses FastAPI
- CSS Modules only — no MUI, no Tailwind in components
- All user-facing strings through `useLanguage()` — no hardcoded text
- `apiClient.util.ts` functions for all HTTP calls: `apiGet`, `apiPost`, `apiAuthGet`, `apiAuthPost`, `apiAuthPut`
- `adminToken` cookie holds the JWT from FastAPI — read via `cookies()` in server components/actions

## Non-Obvious Things

- `cookies()` from `next/headers` is **synchronous** in Next.js 14.1.0 (not async — that's Next.js 15)
- MUI is still in `package.json` (some old components use it) but must NOT be used in new components
- `NEXT_PUBLIC_API_URL` defaults to `http://localhost:8000` in `apiClient.util.ts` if env var missing
- Two MongoDB connection patterns still exist: `connectToDatabase()` and `clientPromise` — ignore both for new code
- `src/features/api/types/api.type.ts` has: `ProductFromAPI`, `SaleItemFromAPI`, `SaleFromAPI`, `TokenFromAPI`, `UserFromAPI`
