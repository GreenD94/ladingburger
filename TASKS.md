# Tasks — ladingburger

**Principle:** All features go through the FastAPI backend (`legacy-python-backend`).
No new MongoDB server actions will be written. If a backend endpoint does not exist yet, build it first, then build the frontend feature.

Move completed items to `CHANGELOG.md`. Update `SESSION.md` at end of every session.

---

## Cycle 01 — Core flow (in progress)

_Goal: working end-to-end path from customer phone → menu → order → admin sees it._

- [x] **C01-07** Env setup + API client (`NEXT_PUBLIC_API_URL`, `apiClient.util.ts`, TypeScript clean)
- [x] **C01-08** Admin auth — login page calls `POST /api/v1/auth/login`, stores JWT in `adminToken` cookie, protected route wrapper redirects on missing cookie
- [x] **C01-09** Menu page — `GET /api/v1/catalog/products` replaces MongoDB burger fetch; renders product cards
- [ ] **C01-10** Customer order flow — cart → checkout → `POST /api/v1/sales`; show confirmation + sale ID
- [ ] **C01-11** Admin orders page — `GET /api/v1/sales` with status filter pills; `PUT /api/v1/sales/{id}/status` on action buttons

---

## Cycle 02 — Product management + Customers

_Backend prerequisite: catalog full CRUD + customer endpoints (see `legacy-python-backend/TASKS.md` C02-BE-*)_

- [ ] **C02-01** Admin menu management — create / edit / delete products via `POST/PUT/DELETE /api/v1/catalog/products`; replaces MongoDB burger actions
- [ ] **C02-02** Admin category management — manage product categories via `/api/v1/catalog/categories`
- [ ] **C02-03** Customer list page — `GET /api/v1/customers` with search + pagination; replaces MongoDB users fetch
- [ ] **C02-04** Customer detail page — `GET /api/v1/customers/{id}` + `GET /api/v1/customers/{id}/sales`; replaces MongoDB user detail + order history actions

---

## Cycle 03 — Inventory + Production

_Backend prerequisite: procurement, inventory, production modules (see `legacy-python-backend/TASKS.md` C03-BE-*)_

- [ ] **C03-01** Inventory: materials + stock view — `GET /api/v1/inventory/stock`; replaces MongoDB materials actions
- [ ] **C03-02** Inventory: purchase orders (bills) — `POST /api/v1/procurement/orders`; replaces MongoDB bill actions
- [ ] **C03-03** Inventory: recipe builder — `GET/PUT /api/v1/production/recipes/{product_id}`; replaces MongoDB recipe actions
- [ ] **C03-04** Inventory: losses / adjustments — `POST /api/v1/inventory/movements` (type=waste); replaces MongoDB loss actions

---

## Cycle 04 — Analytics + MongoDB removal

_Backend prerequisite: reports endpoints (see `legacy-python-backend/TASKS.md` C04-BE-*)_

- [ ] **C04-01** Sales analytics dashboard — revenue chart, order frequency, status breakdown — all from `/api/v1/reports/*`
- [ ] **C04-02** Delete all MongoDB server actions (`src/features/database/actions/`, `src/features/*/actions/*.action.ts` that import from mongodb)
- [ ] **C04-03** Remove `mongodb` npm package
- [ ] **C04-04** Remove `MONGODB_URI` and `JWT_SECRET` from `.env.local.example` (replaced by `NEXT_PUBLIC_API_URL` only)
- [ ] **C04-05** Delete `src/features/database/config/mongodb.ts` and all files that only existed to support direct MongoDB access

---

## Future — Specialization Layer

> **Important design note:** `ladingburger` is currently a burger-restaurant specialization — the UI uses burger-specific language, images, and flows. The `legacy-python-backend` is deliberately generic (products, product types, categories) and is designed to serve any food or drink business.
>
> A future feature will make the ladingburger UI configurable as a **specialization layer**: instead of "burger", the product type label, category names, default images, and checkout copy come from a brand/store configuration fetched from the API. This allows the same codebase to run as a pizza shop, taquería, café, or bar with no code changes.

- [ ] **SPEC-01** Brand/store config screen — admin sets store name, product type label, logo, primary color
- [ ] **SPEC-02** Dynamic terminology — replace hardcoded "burger" labels with values from store config (product type name from `/api/v1/organization/stores/{id}`)
- [ ] **SPEC-03** Multi-store selector — admin can switch between stores; all queries scoped to active store
- [ ] **SPEC-04** Category-driven menu — menu groups by category pulled from `/api/v1/catalog/categories`; no hardcoded sections

---

## Completed

_See `CHANGELOG.md` for completed work with dates._
