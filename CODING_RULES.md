# Coding Rules & Standards

## Architecture: Feature Modules & Vertical Slicing

This project follows a **feature-based architecture with vertical slicing** to separate business logic from framework concerns.

### Principles:
- **Business logic separation**: Core business logic is isolated from framework-specific code (Next.js, React, etc.)
- **Vertical slicing**: Each feature is self-contained with its own components, hooks, actions, types, and utilities
- **Feature modules**: Features are organized in `src/features/` directory, each representing a complete business domain

### Structure:
```
src/features/
├── [feature-name]/
│   ├── components/     # UI components
│   ├── containers/    # Container components
│   ├── hooks/         # Custom hooks
│   ├── contexts/      # React contexts
│   ├── actions/       # Server actions
│   ├── types/         # TypeScript types
│   ├── utils/         # Utility functions
│   ├── styles/        # Shared styles and animations
│   └── ...
```

## Server Actions

- Use server actions for all server-side operations
- Server actions must be in `'use server'` files
- Place server actions in `features/[feature]/actions/` directory
- Server actions should handle database operations, API calls, and business logic
- Always return typed responses with success/error states

## Naming Conventions

### Folders
- **All folder names must be plural**
  - ✅ `components/`, `containers/`, `hooks/`, `actions/`
  - ❌ `component/`, `container/`, `hook/`, `action/`

### Files
- **All file names must be singular**
- **Use dot notation with descriptive suffixes**
  - ✅ `MenuItem.component.tsx`
  - ✅ `OrdersContainer.container.tsx`
  - ✅ `useOrders.hook.ts`
  - ✅ `getOrders.action.ts`
  - ✅ `Order.type.ts`
  - ✅ `formatCurrency.util.ts`
  - ❌ `menu-item.tsx`
  - ❌ `orders-container.tsx`
  - ❌ `useOrders.ts` (without suffix)

### Functions & Variables
- **All function and variable names must be in English**
- **Use descriptive names**
  - ✅ `isAdmin`, `getUserById`, `calculateTotalPrice`
  - ❌ `isAdm`, `getUsr`, `calc`

### Routes
- **Route names can be in Spanish or any language** (exception to English rule)
  - ✅ `/menu`, `/admin/pedidos`, `/configuracion`

## TypeScript Standards

### Always Use TypeScript
- Write all code in TypeScript
- Use `.ts` for non-React files, `.tsx` for React components

### Type Safety
- **Never use `null`, `undefined`, or `any` types**
- Always define explicit types
- Use proper TypeScript types and interfaces

### Examples:
```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  age: number;
  isAdmin: boolean;
}

// ❌ Bad
interface User {
  id: string | null;
  name: string | undefined;
  age: any;
}
```

## Descriptive Code

### Function Names
- Functions must clearly describe what they do
  - ✅ `getUserById`, `calculateOrderTotal`, `validateEmail`
  - ❌ `get`, `calc`, `val`

### Variable Names
- Variables must be self-documenting
  - ✅ `isAdmin`, `totalPrice`, `userEmail`
  - ❌ `admin`, `total`, `email`

### If Statements
- Use descriptive boolean variables instead of direct comparisons
  - ✅ `if (isAdmin) { ... }`
  - ✅ `if (hasPermission) { ... }`
  - ❌ `if (user.role === 2) { ... }`
  - ❌ `if (user.permissions.includes('admin')) { ... }`

## Empty Values & Constants

### Primitive Values
- Use empty values from constants instead of `null` or `undefined`
  - ✅ `age = 0`
  - ✅ `name = ''`
  - ✅ `isAdmin = false`
  - ❌ `age = null`
  - ❌ `name = null`
  - ❌ `isAdmin = null`

### Object Values
- Create constants for empty objects
  - ✅ 
    ```typescript
    const EMPTY_USER: User = {
      id: '',
      name: '',
      age: 0,
      isAdmin: false,
    };
    ```
  - ❌ `const user: User | null = null;`

### Constants & Enums
- Always use constants and enums for magic values
- Define constants at the top of files or in dedicated constants files
- Use enums for fixed sets of values

### Examples:
```typescript
// ✅ Good
enum OrderStatus {
  PENDING = 0,
  CONFIRMED = 1,
  COMPLETED = 2,
}

const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_TIMEOUT = 5000;

// ❌ Bad
if (order.status === 1) { ... }
if (attempts < 3) { ... }
```

## UI/UX Standards

### Mobile-First Design
- **The entire UI/UX must be mobile-friendly, design first**
- All components must be designed and optimized for mobile devices first
- Use responsive design patterns that work on small screens
- Touch-friendly interactions (minimum 44x44px touch targets)
- Test on mobile viewports before desktop
- Use `clamp()` for responsive sizing
- Consider safe areas for devices with notches
- Optimize for portrait orientation (primary mobile use case)

### Examples:
```typescript
// ✅ Good - Mobile-first responsive
width: 'clamp(48px, 12vw, 64px)',
minHeight: isMobile ? 44 : 36,
fullWidth={isMobile}

// ❌ Bad - Desktop-first
width: '64px',
minHeight: 36,
```

## Code Organization

### Containers
- **All page logic must be in container components** located in `features/[feature]/containers/`
- Pages in `app/` directory should only import and render containers
- Containers handle:
  - Business logic and state management
  - Hooks and data fetching
  - Route parameters and search params
  - Context providers setup
  - Conditional rendering logic
- Pages should be minimal wrappers that only handle Next.js-specific concerns (Suspense, metadata, etc.)

### Container Structure:
```
src/app/[route]/page.tsx          # Minimal page wrapper
src/features/[feature]/containers/
├── MenuContainer.container.tsx   # Contains all page logic
└── OrdersContainer.container.tsx
```

### Componentization
- **Componentize the view** to identify main UI pieces
- Break down complex components into smaller, reusable pieces
- Each component should have a single responsibility
- Organize components to make logic flow clear and understandable
- **Components should be small and focused** - if a component exceeds ~200 lines, consider splitting it
- Extract repeated UI patterns into reusable components
- Avoid inline component definitions - extract them to separate files

### File Structure Example:
```
components/
├── MenuItem.component.tsx
├── MenuList.component.tsx
├── CartButton.component.tsx
├── CartDrawer.component.tsx
├── LoadingScreen.component.tsx
├── ErrorMessage.component.tsx
└── EmptyMenuState.component.tsx
```

### Custom Hooks
- **Extract reusable logic into custom hooks** located in `features/[feature]/hooks/`
- Use hooks for:
  - State management logic
  - Side effects (useEffect patterns)
  - Data fetching
  - Event handlers
  - Complex calculations
  - Browser APIs (IntersectionObserver, etc.)
- Hooks should be focused and do one thing well
- Name hooks with `use` prefix: `useMenuLoading.hook.ts`, `useIntersectionObserver.hook.ts`
- Share hooks across components when logic is duplicated

### Examples:
```typescript
// ✅ Good - Logic extracted to hook
const { burgers, loading, error } = useMenuLoading();

// ❌ Bad - Logic inline in component
const [burgers, setBurgers] = useState([]);
const [loading, setLoading] = useState(true);
useEffect(() => { /* complex logic */ }, []);
```

### DRY (Don't Repeat Yourself)
- **Never duplicate code** - if you find yourself copying code, extract it
- Extract shared logic to:
  - Custom hooks for state/effects logic
  - Utility functions for pure logic
  - Shared components for UI patterns
  - Shared styles for animations and CSS
- If code appears in 2+ places, it should be extracted
- Avoid duplicating:
  - Provider structures
  - Animation styles
  - Event handlers
  - State management patterns
  - Utility functions

### Examples:
```typescript
// ✅ Good - Shared hook
const { isVisible } = useIntersectionObserver();

// ❌ Bad - Duplicated IntersectionObserver logic in multiple components

// ✅ Good - Shared component
<LoadingScreen theme={theme} loading={loading} />

// ❌ Bad - Loading screen JSX duplicated in multiple places

// ✅ Good - Shared styles
import { MenuAnimations } from '../styles/menuAnimations.styles';

// ❌ Bad - Animation styles duplicated in each component
```

### Utilities & Shared Code
- **Extract pure functions to utilities** in `features/[feature]/utils/`
- Extract shared styles/animations to `features/[feature]/styles/`
- Utilities should be pure functions (no side effects)
- Shared styles should be reusable across components
- Name utilities with descriptive names: `parseBurgerName.util.ts`, `menuAnimations.styles.tsx`

### Readability
- **Avoid IIFEs (Immediately Invoked Function Expressions) in JSX** - use early returns or extract to components
- Use descriptive boolean variables for conditional rendering
- Keep component JSX clean and readable
- Extract complex conditional logic to variables or functions

### Examples:
```typescript
// ✅ Good - Clean conditional rendering
const isLoadingComplete = !loading;
const hasError = error !== EMPTY_STRING;
const shouldShowError = isLoadingComplete && hasError;

return (
  <>
    {shouldShowError && <ErrorMessage message={error} />}
    {shouldShowContent && <Content />}
  </>
);

// ❌ Bad - IIFE in JSX
{(() => {
  const isLoadingComplete = !loading;
  return isLoadingComplete ? <Content /> : null;
})()}
```

## Comments

- **Avoid comments in code**
- Code should be self-documenting through:
  - Descriptive variable and function names
  - Clear component structure
  - Well-organized code flow
- Only add comments when absolutely necessary for complex business logic that cannot be expressed clearly in code

## Summary Checklist

- [ ] Feature modules with vertical slicing architecture
- [ ] Server actions for server-side operations
- [ ] Plural folder names (`components/`, `hooks/`, `containers/`, `utils/`, `styles/`)
- [ ] Singular file names with dot notation (`.component.tsx`, `.action.ts`, `.container.tsx`, `.hook.ts`, `.util.ts`)
- [ ] All page logic in container components
- [ ] Pages are minimal wrappers that only import containers
- [ ] Reusable logic extracted to custom hooks
- [ ] No code duplication (DRY principle)
- [ ] Components are small and focused (~200 lines max)
- [ ] Shared utilities extracted to `utils/` directory
- [ ] Shared styles extracted to `styles/` directory
- [ ] No IIFEs in JSX - use early returns or extracted components
- [ ] All code in TypeScript
- [ ] No `null`, `undefined`, or `any` types
- [ ] Descriptive function and variable names (English)
- [ ] Descriptive if statements (`isAdmin` not `user.role === 2`)
- [ ] Empty values from constants (`age = 0`, `name = ''`)
- [ ] Empty object constants (`EMPTY_USER`)
- [ ] Use constants and enums
- [ ] Avoid comments
- [ ] Componentize views
- [ ] English names (except routes)
- [ ] Mobile-first design (entire UI/UX mobile-friendly)

