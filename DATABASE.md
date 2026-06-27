# MongoDB Schema — ladingburger

Source of truth for all MongoDB collections. All field names, types, and shapes must match these definitions. TypeScript types live in `src/features/database/types/` and `src/features/inventory/types/`.

---

## Collection: `orders`

Type: `src/features/database/types/order.type.ts`

```ts
Order {
  _id?:              ObjectId | string
  orderNumber?:      number               // auto-incremented
  userId?:           string               // ref → users._id
  customerPhone:     string               // required, used to link to user
  customerName?:     string
  items:             OrderItem[]
  totalPrice:        number
  status:            OrderStatusType      // see status.type.ts
  createdAt:         Date
  updatedAt:         Date
  paymentInfo:       PaymentInfo
  logs?:             OrderLog[]
  priority?:         'normal' | 'high' | 'urgent'
  assignedTo?:       string
  internalNotes?:    string
  estimatedPrepTime?: number
  actualPrepTime?:   number
  cookingStartedAt?: Date
  problemCategory?:  string
  cancelledAt?:      Date
  cancellationReason?: string
  cancelledBy?:      string
  costData?: {
    totalCost:       number
    calculatedAt:    Date
    burgerCosts: { burgerId: string; quantity: number; unitCost: number; totalCost: number }[]
  }
}

OrderItem {
  burgerId:           string              // ref → burgers._id
  removedIngredients: string[]
  quantity:           number
  price:              number
  note?:              string
  costAtOrder?:       number
  costBreakdown?:     { materialId: string; materialName: string; quantity: number; unitCost: number; totalCost: number }[]
}

OrderLog {
  status:     OrderStatusType
  statusName: string
  createdAt:  Date
  comment?:   string
}

PaymentInfo {
  bankAccount:       string
  transferReference: string
}
```

**Order statuses (`src/features/database/types/status.type.ts`):**

| Constant | Value | Label |
|---|---|---|
| `WAITING_PAYMENT` | 1 | Esperando Pago |
| `PAYMENT_FAILED` | 2 | Pago Fallido |
| `COOKING` | 3 | En Cocina |
| `IN_TRANSIT` | 4 | En Tránsito |
| `WAITING_PICKUP` | 5 | Esperando Recogida |
| `COMPLETED` | 6 | Completado |
| `ISSUE` | 7 | Problema |
| `CANCELLED` | 8 | Cancelado |
| `REFUNDED` | 9 | Reembolsado |
| `READY` | 10 | Listo |
| `PENDING` | 11 | Pendiente |

---

## Collection: `users`

Type: `src/features/database/types/user.type.ts`

```ts
User {
  _id?:       ObjectId | string
  phoneNumber: string                     // primary identifier
  name?:      string
  birthdate?: Date
  gender?:    string
  notes?:     string
  tags?:      string[]                   // etiqueta IDs or refs
  createdAt:  Date
  updatedAt:  Date
}
```

---

## Collection: `burgers`

Type: `src/features/database/types/burger.type.ts`

```ts
Burger {
  _id?:              ObjectId | string
  name:              string
  description:       string
  price:             number
  ingredients:       string[]
  image:             BurgerImage          // '/media/burgers/...'
  category:          string
  isAvailable:       boolean
  estimatedPrepTime?: number
  recipe?:           BurgerRecipe         // embedded (see inventory/types/recipe.type.ts)
}

BurgerRecipe {
  materialRequirements: { materialId: string; quantity: number; unit: string }[]
  currentCost:          number
  lastCostUpdate:       Date
  costHistory?:         CostSnapshot[]
}

CostSnapshot {
  date:           Date
  cost:           number
  materialCosts:  { materialId: string; quantity: number; unitCost: number; totalCost: number }[]
}
```

---

## Collection: `admins`

Type: `src/features/database/types/admin.type.ts`

```ts
Admin {
  _id:        string
  email:      string
  password:   string                      // bcrypt hash
  isEnabled?: boolean
  createdAt:  Date
  updatedAt:  Date
}
```

---

## Collection: `etiquetas`

Type: `src/features/database/types/etiqueta.type.ts`

```ts
Etiqueta {
  _id?:            ObjectId | string
  id:              string                 // custom ID: 'etq_<timestamp>_<random>'
  ref:             string                 // slug: 'nombre-de-etiqueta'
  name:            string
  color:           string                 // hex color
  isEnabled:       boolean
  isSystemManaged: boolean                // true = auto-assigned by system
  isSystemCreated: boolean                // true = seeded, cannot be deleted
  createdAt:       Date
  updatedAt:       Date
}
```

**Automatic etiquetas (seeded, system-managed):**
`nuevo` · `pago-fallido` · `cancelaciones-frecuentes` · `problemas-de-entrega` · `reembolsos` · `cliente-activo` · `en-riesgo` · `primer-pedido`

Full spec: `ETIQUETAS_DOCUMENTATION.md`

---

## Collection: `settings`

Type: `src/features/database/types/settings.type.ts`  
**Singleton** — only one document exists.

```ts
Settings {
  _id:            ObjectId
  menuTheme:      string                  // 'green' | other themes
  adminThemeMode: 'light' | 'dark'
  language:       'en' | 'es'
  updatedAt:      Date
}
```

---

## Collection: `businessContact`

Type: `src/features/database/types/businessContact.type.ts`  
**Singleton** — only one document exists.

```ts
BusinessContact {
  whatsappLink:    string
  instagramLink:   string
  venezuelaPayment: {
    phoneNumber:   string
    bankAccount:   string
    documentNumber: string
  }
  qrCodeUrl:       string
  createdAt:       Date
  updatedAt:       Date
}
```

---

## Collection: `materials`

Type: `src/features/inventory/types/material.type.ts`

```ts
Material {
  _id?:               ObjectId | string
  name:               string
  unit:               string              // 'kg' | 'g' | 'unidad' | 'litro' | 'ml'
  category:           string              // 'Proteína' | 'Lácteos' | 'Panadería' | 'Verduras' | 'Condimentos'
  currentStock:       number
  averageCost:        number              // weighted average cost per unit
  minStockLevel:      number              // alert threshold
  lastPurchaseDate?:  Date
  lastPurchasePrice?: number
  lastCalculatedAt:   Date
  createdAt:          Date
  updatedAt:          Date
}
```

---

## Collection: `bills`

Type: `src/features/inventory/types/bill.type.ts`  
Represents a supplier purchase invoice (factura de compra).

```ts
Bill {
  _id?:                 ObjectId | string
  billNumber:           string
  supplier:             string
  purchaseDate:         Date
  totalAmount:          number
  items:                BillItem[]
  status:               'active' | 'consumed' | 'archived'
  confirmedBy?:         string            // admin ID
  confirmedAt?:         Date
  reconciliationNotes?: string
  createdAt:            Date
  updatedAt:            Date
}

BillItem {
  materialId: string                      // ref → materials._id
  quantity:   number
  unit:       string
  unitCost:   number
  totalCost:  number
}
```

---

## Collection: `materialLosses`

Type: `src/features/inventory/types/loss.type.ts`

```ts
MaterialLoss {
  _id?:        ObjectId | string
  materialId:  string                     // ref → materials._id
  quantity:    number
  lossDate:    Date
  cause:       MaterialLossCause
  notes?:      string
  recordedBy:  string                     // admin ID
  createdAt:   Date
}

MaterialLossCause = 'expiration' | 'spoilage' | 'damage' | 'overcooking' | 'preparation_error' | 'theft' | 'inventory_error' | 'other'
```

---

## Inventory stock formula

```
currentStock = startingStock + purchases (bills confirmed) - orders consumed (COMPLETED) - materialLosses
```

Stock is recalculated on demand, not automatically. Triggered by admin action or when bill is confirmed.
