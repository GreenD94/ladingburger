# Feature Inventory — ladingburger

Status legend: `done` · `partial` · `missing`

---

## Customer-Facing Features

| Feature | Route | Status | Notes |
|---|---|---|---|
| Landing page | `/` | `done` | HeroSection, MenuShowcase, SocialProof, TopBar |
| Menu (browse burgers) | `/menu` | `done` | Cart drawer, animated burger images, swipe gestures, theme support |
| Create order (cart → submit) | `/create-order` | `done` | Phone input, cart review, order submission |
| Order confirmation | `/order-confirmation` | `done` | Post-order confirmation screen |
| My orders (track by phone) | `/my-orders` | `done` | Status timeline, WhatsApp contact button |
| Customer order list | `/orders` | `done` | Order list view by phone number |

---

## Admin Features

### Auth
| Feature | Route | Status | Notes |
|---|---|---|---|
| Admin login | `/login` | `done` | JWT, bcrypt, cookie-based session |

### Orders Dashboard
| Feature | Status | Notes |
|---|---|---|
| Orders list with tabs by status | `done` | Tabs, filters, search, real-time refresh |
| Order detail modal | `done` | Full order info, status log history |
| Change order status | `done` | Full status flow with validation |
| Cancel order | `done` | Cancel with reason |
| Mark as issue | `done` | Problem category |
| Refund order | `done` | Refund modal |
| Payment confirmation | `done` | Bank transfer reference, bank selector |
| Order priority | `done` | normal / high / urgent |
| Internal notes | `done` | Admin-only notes field |
| Order timer | `done` | Elapsed time display |
| WhatsApp shortcuts | `done` | Message customer from order card |
| Customer history modal | `done` | Previous orders by same customer |
| Order alerts | `done` | Browser notification, sound badge |
| Auto-refresh timer | `done` | Configurable interval |

### Menu Management
| Feature | Status | Notes |
|---|---|---|
| Burger list | `done` | Image, price, availability toggle |
| Create burger | `done` | Form with image, ingredients, price, category |
| Edit burger | `done` | Same form, pre-filled |
| Delete burger | `done` | Confirm dialog |
| Recipe builder in burger form | `partial` | BurgerRecipe type + actions exist; UI tab not built in BurgerForm |
| Cost / margin shown in burger list | `missing` | `recipe.currentCost` exists but not displayed |

### Inventory Module
| Feature | Status | Notes |
|---|---|---|
| Materials list | `done` | Stock levels, categories |
| Create / edit material | `done` | MaterialForm |
| Bills (purchase invoices) list | `done` | BillsContainer, BillRow |
| Register new bill | `done` | BillForm with material line items |
| Confirm bill / update stock | `done` | BillConfirmationModal, MaterialReconciliationForm |
| WAC calculation | `done` | `calculateWAC.action.ts` |
| Consume materials on order complete | `done` | `consumeMaterialsFromOrder.action.ts` |
| Attach cost data to order | `done` | `attachCostDataToOrder.action.ts` |
| Recalculate burger costs | `done` | `recalculateBurgerCostsForMaterial.action.ts` |
| Material loss recording UI | `missing` | Actions exist; no UI component |
| Material losses list UI | `missing` | Actions exist; no UI component |
| Inventory reconciliation UI | `missing` | Not built |
| Inventory analytics / charts | `missing` | Not built |
| Excel / CSV export | `missing` | Not built |
| Production capacity dashboard | `missing` | Not built |

### Kitchen
| Feature | Status | Notes |
|---|---|---|
| Kitchen order view | `done` | KitchenContainer, KitchenOrderCard |
| Take / claim an order | `done` | `takeOrder.action.ts` |

### Analytics
| Feature | Status | Notes |
|---|---|---|
| Analytics overview | `done` | Metric cards, sales chart, top items, peak hours |
| Category analytics routing | `done` | `/admin/analytics/[category]` |
| Sales chart | `done` | Line/bar with date range |
| Top selling items | `done` | Bar chart |
| Peak hours | `done` | Heatmap-style chart |
| Customer analytics | `done` | Segments, churn, CLV, revenue by segment, refund rate |
| Inventory / cost analytics | `missing` | Designed, not built |

### Users (Customers)
| Feature | Status | Notes |
|---|---|---|
| Users list with search & segment filter | `done` | |
| User detail (general / history / stats tabs) | `done` | |
| User stats charts | `done` | Order frequency, revenue, status distribution, time distribution |
| Create user | `done` | CreateUserModal |
| Edit user | `done` | EditUserModal |

### Etiquetas (Customer Tags)
| Feature | Status | Notes |
|---|---|---|
| Etiquetas management UI | `done` | CRUD for definitions |
| Auto-assign `Nuevo` on user creation | `done` | Wired in `getOrCreateUser.action.ts` |
| Auto-assign via order status changes | `done` | `recalculateUserEtiquetasForOrderChanges` called in `updateOrderStatus.action.ts` — covers: Pago Fallido, Cancelaciones Frecuentes, Problemas de Entrega, Reembolsos, Cliente Activo, En Riesgo, Primer Pedido |
| Remove `Nuevo` on first cross-day order | `done` | `handleNuevoOnOrderCreated` logic in `userTags.util.ts` |

### Admins
| Feature | Status | Notes |
|---|---|---|
| Admins list / detail | `done` | |
| Create / edit admin | `done` | |
| Reset admin password | `done` | |

### Business Config
| Feature | Status | Notes |
|---|---|---|
| Business contact / WhatsApp config | `done` | |
| App settings (theme, language) | `done` | |
| Menu theme selector | `done` | ThemeSelector, MenuPreview |
| Admin theme (dark / light) | `done` | AdminThemeContext |

---

## Shared Infrastructure

| Feature | Status | Notes |
|---|---|---|
| i18n (EN + ES) | `done` | `useLanguage` hook, `translations.ts` |
| SafeArea component | `done` | Required for all mobile layouts |
| PillSelect component | `done` | Required for all selects |
| InfoModal component | `done` | Required for all charts/stats |
| PhoneNumberInput component | `done` | International phone input |
| CSS Modules (no MUI, no Tailwind) | `done` | Global CSS reset in place, Tailwind removed |
