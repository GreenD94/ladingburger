# UI/UX Rules — Ladingburger (Saborea)

Extends and overrides `../UI-UX-RULES.md` (general rules). Rules here take precedence.

---

## Animations — override

- **Use Framer Motion** for all animations — not CSS transitions or keyframes.
- Page transitions, modal entrances, and list items use Framer Motion variants.
- The general CSS fade-in rule does NOT apply here; Framer Motion handles it instead.

---

## Selectable options — override (already built)

- Use the existing **`PillSelect` component** (`@/features/shared/components/PillSelect.component`) for every selectable option, filter, or dropdown.
- Never recreate pill select logic — always reuse `PillSelect`.

---

## Safe area — override (already built)

- Use the existing **`SafeArea` component** (`@/features/shared/components/SafeArea.component`) on every full-screen or fixed layout.
- Never apply `env(safe-area-inset-*)` manually — `SafeArea` handles it.

---

## Info modals — override (already built)

- Use the existing **`InfoModal` component** (`@/features/shared/components/InfoModal.component`) next to every chart and stat.
- Place the ⓘ button inline next to the chart/stat label, not as a floating button.

---

## Internationalization

- **All user-facing text must go through `useLanguage()`** — never hardcode strings.
- Add every new string to `src/features/i18n/translations.ts` under both `en` and `es` keys before using it.
- UI text in code = translation key only. Never a raw string.

---

## Two audiences — layout rules

| Audience | Entry | Layout pattern |
|---|---|---|
| **Customers** | `/` — public menu | Mobile-first, no nav bar, cart button sticky at bottom |
| **Admin** | `/login` — JWT protected | Sidebar nav on desktop, bottom nav on mobile |

- Customer views and admin views share no layout components.
- Customer identity = phone number (no password). Admin identity = email + password (JWT).

---

## Color system

- All colors defined as CSS variables in `globals.css`.
- Never hardcode hex values in component files — always use variables.
- (Add specific color variables here as the design system evolves.)

---

## Navigation

- **Admin**: sidebar on desktop · bottom nav on mobile (max 5 tabs).
- **Customer**: no persistent nav — back is browser back or an inline back link.
- General rule of max 3 bottom tabs applies to customer-facing views only.
