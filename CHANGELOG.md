# Changelog — ladingburger

Most recent entries at the top.

---

## 2026-06-14 — Architecture decision + Phase 0 fixes

**Architectural decision:** Backend (FastAPI on Docker) will be the eventual API layer. Frontend currently keeps MongoDB while backend is built. Migration happens in Phase 3 after UI/UX audit is complete. See `ROADMAP.md`.

**CSS decision:** No predefined CSS libraries. MUI removed from layout. Tailwind removed from globals. All styling via CSS Modules + CSS variables only.

**Code fixes:**
- `providers.tsx` — stripped MUI ThemeProvider and broken `@/theme` import; now a plain pass-through wrapper
- `layout.tsx` — removed `Box` from `@mui/material`, plain `<body>` wrapper, updated page title/lang to Spanish
- `globals.css` — removed `@tailwind base/components/utilities`, added proper `box-sizing` reset and base body styles, kept Material Symbols import

**New files:**
- `.env.local.example` — documents `MONGODB_URI` and `JWT_SECRET`
- `/api/seed/route.ts` — idempotent seed: creates admin (`admin@saborea.com` / `admin123`), 4 burgers, 20 etiquetas (8 automatic + 12 manual). Safe to run multiple times.
- `ROADMAP.md` (workspace root) — full 4-phase plan
- Documentation system (`CLAUDE.md`, `DATABASE.md`, `FEATURES.md`, `TASKS.md`, `SESSION.md`)

**Documentation corrections:**
- Etiqueta auto-assignment was wrongly marked as missing — it is FULLY implemented in `userTags.util.ts`, `getOrCreateUser.action.ts`, and `updateOrderStatus.action.ts`

---

## [Date unknown] — Inventory module foundation

- Built `materials` feature: MaterialForm, MaterialRow, MaterialsContainer
- Built `bills` feature: BillForm, BillRow, BillsContainer, BillConfirmationModal, MaterialReconciliationForm
- Actions: `calculateWAC`, `createMaterial`, `getMaterials`, `updateMaterial`, `updateMaterialStock`, `confirmBillConsumption`, `getBills`, `registerBill`, `getMaterialLosses`, `recordMaterialLoss`, `calculateBurgerCost`, `recalculateBurgerCostsForMaterial`, `attachCostDataToOrder`, `consumeMaterialsFromOrder`
- `BurgerRecipe` type embedded in `Burger`; `costData` and `costBreakdown` fields added to `Order` / `OrderItem`

---

## [Date unknown] — Etiqueta system built + auto-assignment wired

- 20 etiquetas defined (8 automatic + 12 manual)
- Full CRUD UI: EtiquetasContainer, EtiquetaList, EtiquetaCard, modals
- `userTags.util.ts` — all auto-assignment logic for all 8 automatic etiquetas
- `getOrCreateUser.action.ts` — assigns `Nuevo` on user creation
- `updateOrderStatus.action.ts` — calls `recalculateUserEtiquetasForOrderChanges` on every status change
- `ETIQUETAS_DOCUMENTATION.md` — full spec

---

## [Date unknown] — Analytics module built

- Actions: `getAnalyticsSummary`, `getCustomerAnalytics`, `getPeakHours`, `getSalesData`, `getTopSellingItems`
- Components: overview, sales chart, top items, peak hours, customer analytics, churn, CLV, segments, refund rate
- Containers: `AnalyticsOverviewContainer`, `AnalyticsCategoryContainer`
- Dynamic category routing at `/admin/analytics/[category]`

---

## [Date unknown] — Users (customers) module built

- Actions: `getUserById`, `getUserDetailedStats`, `getUsersWithStats`
- Components: UserCard, UserDetailView (general/history/stats tabs), order frequency, revenue, status distribution, time distribution charts
- Containers: `UsersContainer`, `UserDetailContainer`

---

## [Date unknown] — Admins module built

- Actions: `createAdmin`, `getAdminById`, `getAdmins`, `resetPassword`, `updateAdmin`
- Components: AdminCard, AdminDetailView, modals (create/edit/reset password)

---

## [Date unknown] — Admin orders dashboard built

- Full orders dashboard with status tabs, filters, search
- Order detail modal, status change flow, cancel/issue/refund/payment modals
- WhatsApp shortcuts, customer history modal, order priority, timer, alerts, auto-refresh

---

## [Date unknown] — Menu management + customer flow built

- Admin: burger list, create/edit/delete
- Customer: menu with cart drawer, swipe gestures, animated burger images, theme system
- Kitchen view with order claiming

---

## [Date unknown] — Project initialized

- Next.js 14 app (package name: saborea)
- MongoDB connection, JWT auth
- Shared components: SafeArea, PillSelect, InfoModal, PhoneNumberInput
- i18n system (EN + ES)
- Admin sidebar + topbar layout
- `CODING_RULES.md` written
