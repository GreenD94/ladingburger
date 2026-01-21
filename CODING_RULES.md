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

### ESLint Rules
- **ESLint disable comments are forbidden**
- Never use `eslint-disable`, `eslint-disable-next-line`, or any other eslint disable comments
- If you encounter a linting error, fix the code instead of disabling the rule
- All code must pass linting without any disable comments
- If a rule seems incorrect, discuss with the team to update the ESLint configuration instead of disabling it

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

// ❌ Bad - ESLint disable comments are forbidden
// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {}, []);

// ✅ Good - Fix the dependency array instead
useEffect(() => {}, [dependency1, dependency2]);
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

### Safe Areas (Mandatory)
- **All components must respect safe areas to guarantee visibility on mobile devices**
- Safe areas ensure content is not hidden by device notches, status bars, or home indicators
- Use the shared `SafeArea` component from `@/features/shared/components/SafeArea.component` for wrapper elements
- For complex padding calculations, use CSS utility classes from `@/features/shared/styles/safeArea.module.css`
- Always use `env(safe-area-inset-*, 0px)` with fallback values in CSS
- Safe area padding must be applied to:
  - Full-screen containers and modals
  - Sticky headers and footers
  - Fixed position elements
  - Scrollable content areas
- **Never hardcode padding values that ignore safe areas** - content must be visible on all mobile devices

### Select Components (Mandatory)
- **The `PillSelect` component is the ONLY select component to be used in this project**
- Use `PillSelect` from `@/features/shared/components/PillSelect.component` for all selection needs
- Do not create custom select components or use third-party select libraries
- The `PillSelect` component supports:
  - Single or multiple selection
  - Optional search functionality with external search strategy
  - Configurable maximum visible items
  - Mobile-first responsive design
  - Flexible data sources (API, JSON, etc.)
- **Never use native `<select>` elements or other select components** - always use `PillSelect`

### Info Modals for Graphs and Statistics (Mandatory)
- **All graphs, charts, and statistics must include an info icon button**
- Use the shared `InfoModal` component from `@/features/shared/components/InfoModal.component` for all informational modals
- The info icon button should be placed next to the title or in a visible location near the graph/statistic
- The modal must explain:
  - What the graph/statistic represents (description)
  - Good and bad scenarios (when applicable)
  - Formula or calculation method (when applicable)
  - Data sources used
- **Never create custom info modals** - always use the shared `InfoModal` component
- The info button must be touch-friendly (minimum 32px) and mobile-optimized

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

### Safe Area Examples:
```typescript
// ✅ Good - Using SafeArea component
import { SafeArea } from '@/features/shared/components/SafeArea.component';

<SafeArea sides="all">
  <YourContent />
</SafeArea>

// ✅ Good - Using CSS utility classes for complex calculations
import safeAreaStyles from '@/features/shared/styles/safeArea.module.css';

<div className={safeAreaStyles.safeAreaAllWithBase}>
  <Content />
</div>

// ✅ Good - CSS with fallback values
padding-top: calc(16px + env(safe-area-inset-top, 0px));

// ❌ Bad - Hardcoded padding ignoring safe areas
padding-top: 16px;

// ❌ Bad - Missing fallback values
padding-top: env(safe-area-inset-top);
```

### Select Component Examples:
```typescript
// ✅ Good - Using PillSelect component
import { PillSelect } from '@/features/shared/components/PillSelect.component';
import { PillSelectOption } from '@/features/shared/types/pillSelect.type';

const options: PillSelectOption[] = [
  { id: '1', label: 'Option 1', value: '1' },
  { id: '2', label: 'Option 2', value: '2' },
];

<PillSelect
  options={options}
  selectedValues={selectedValues}
  onSelectionChange={handleChange}
  multiple={false}
  searchable={true}
  maxVisible={5}
  onSearch={handleSearch}
/>

// ❌ Bad - Using native select
<select>
  <option>Option 1</option>
</select>

// ❌ Bad - Using custom select component
<CustomSelect options={options} />

// ❌ Bad - Using third-party select library
<Select from="some-library" />
```

### Info Modal Examples:
```typescript
// ✅ Good - Using InfoModal component with graph
import { InfoModal } from '@/features/shared/components/InfoModal.component';

<div className={styles.chartHeader}>
  <h3 className={styles.chartTitle}>Revenue Trends</h3>
  <InfoModal
    title="Revenue Trends"
    description="This chart shows the revenue generated over time, helping identify growth patterns and seasonal trends."
    goodScenario="Steady upward trend indicates healthy business growth"
    badScenario="Declining trend may indicate customer loss or market issues"
    formula="Revenue = Sum of all completed order totals"
    dataSources={['Orders collection', 'Order status: COMPLETED']}
  />
</div>

// ❌ Bad - Graph without info button
<div>
  <h3>Revenue Trends</h3>
  <Chart data={data} />
</div>

// ❌ Bad - Custom info modal instead of shared component
<CustomInfoModal title="Revenue" />
```

### Translation System (Mandatory)
- **All user-facing text must use the translation system**
- Use the `useLanguage` hook from `@/features/i18n/hooks/useLanguage.hook` to access translations
- All text displayed to users must be translated, including:
  - Button labels
  - Form labels and placeholders
  - Error messages
  - Success messages
  - Section titles
  - Descriptions
  - Tooltips and aria-labels
- Translation keys must be added to `src/features/i18n/translations.ts` for both `en` and `es` languages
- Use descriptive translation keys that clearly indicate their purpose
- **Never hardcode user-facing text in components** - always use the translation function `t()`
- The translation system supports English (`en`) and Spanish (`es`)
- If a translation key is missing, the system falls back to English, then to the key itself

### Translation Examples:
```typescript
// ✅ Good - Using translation system
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';

export function MyComponent() {
  const { t } = useLanguage();
  
  return (
    <div>
      <h2>{t('sectionTitle')}</h2>
      <button>{t('saveButton')}</button>
      <p>{t('descriptionText')}</p>
    </div>
  );
}

// ✅ Good - Translation keys in translations.ts
export const translations: Record<string, Translations> = {
  en: {
    sectionTitle: 'User Statistics',
    saveButton: 'Save',
    descriptionText: 'This section shows user statistics',
  },
  es: {
    sectionTitle: 'Estadísticas de Usuario',
    saveButton: 'Guardar',
    descriptionText: 'Esta sección muestra las estadísticas del usuario',
  },
};

// ❌ Bad - Hardcoded text
export function MyComponent() {
  return (
    <div>
      <h2>User Statistics</h2>
      <button>Save</button>
      <p>This section shows user statistics</p>
    </div>
  );
}

// ❌ Bad - Mixed hardcoded and translated text
export function MyComponent() {
  const { t } = useLanguage();
  return (
    <div>
      <h2>User Statistics</h2> {/* ❌ Should use t() */}
      <button>{t('saveButton')}</button>
    </div>
  );
}
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

## React Hooks & Performance

### useEffect Dependency Management
- **Only include dependencies that should trigger the effect**
- Do NOT include values in dependencies if they're only used for conditional checks
- Use refs to track state that shouldn't trigger re-renders (e.g., initialization flags, loading flags)
- If a value is only checked in a condition (`if (loadedStatuses.has(status))`), don't include it in dependencies
- Use functional state updates (`setState(prev => ...)`) to avoid dependency issues

### Preventing Infinite Loops
- **Never include state values in useEffect dependencies if the effect updates that same state**
- If an effect updates `loadedStatuses`, don't include `loadedStatuses` in its dependency array
- Use refs to track loading/loaded state for async operations to prevent race conditions
- Separate effects by concern - one effect per trigger (status change, page change, filter change)

### Initialization Patterns
- **Use refs to prevent duplicate initialization calls** (especially important in React Strict Mode)
- Track initialization state with `useRef` instead of `useState` for one-time operations
- Set ref before async operation to prevent race conditions

### Stable Callback References
- **Use `useCallback` with empty dependencies for functions that use functional state updates**
- If a callback uses `setState(prev => ...)`, it can have empty dependencies
- Use refs inside callbacks to access current state without dependencies

### Examples:
```typescript
// ✅ Good - Using ref for initialization tracking
const hasInitialized = useRef(false);
useEffect(() => {
  if (hasInitialized.current) return;
  hasInitialized.current = true;
  fetchData();
}, []); // Empty deps - only run once

// ❌ Bad - State in dependency causes infinite loop
const [loaded, setLoaded] = useState(false);
useEffect(() => {
  if (loaded) {
    loadData(); // This updates loaded, causing infinite loop
  }
}, [loaded]); // ❌ Don't include state you're updating

// ✅ Good - Only check, don't react to changes
useEffect(() => {
  if (loadedStatuses.has(selectedStatus)) {
    loadData();
  }
  // Don't include loadedStatuses in deps - only checking it
}, [selectedStatus, loadData]);

// ✅ Good - Using ref for async state tracking
const loadingRef = useRef(new Set());
const loadStatus = useCallback(async (status) => {
  if (loadingRef.current.has(status)) return;
  loadingRef.current.add(status);
  // ... async operation
  loadingRef.current.delete(status);
}, []); // Empty deps - uses ref instead

// ✅ Good - Functional state updates
setOrders((prev) => ({
  ...prev,
  [status]: newOrders,
}));

// ❌ Bad - Direct state access in dependency
const loadStatus = useCallback(async () => {
  if (loadingStatuses.has(status)) return; // ❌ Accessing state
  // ...
}, [loadingStatuses]); // ❌ Causes callback to recreate on every state change
```

## Performance & Data Fetching

### Preventing Duplicate API Calls
- **Use refs to track initialization and prevent duplicate calls on mount**
- In React Strict Mode, components mount twice - use refs to guard against duplicate calls
- Only fetch data that's immediately needed - lazy load historical data

### Lazy Loading Patterns
- **Load data on demand, not all at once**
- Separate active data (always loaded) from historical data (loaded on demand)
- Use date filters to limit initial data fetch (e.g., last 24 hours for active orders)
- Only fetch historical data when user explicitly requests it

### Server-Side vs Client-Side Filtering
- **Use server-side filtering for large datasets**
- Client-side filtering is acceptable for small datasets (< 100 items)
- For paginated data, always use server-side filtering and search
- Debounce search queries when using server-side filtering (500ms is recommended)

### Date Filtering
- **Always apply date filters for active/current data**
- Use time-based filters (e.g., last 24 hours) to reduce data volume
- Only fetch historical data when user expands date range

### Examples:
```typescript
// ✅ Good - Lazy loading with date filter
const ACTIVE_STATUSES = [WAITING_PAYMENT, COOKING];
const fetchActiveOrders = async () => {
  await Promise.all(
    ACTIVE_STATUSES.map(status => 
      getOrdersByStatus({ status, hoursAgo: 24 }) // Only last 24 hours
    )
  );
};

// ✅ Good - Debounced server-side search
const [debouncedQuery, setDebouncedQuery] = useState('');
useEffect(() => {
  const timer = setTimeout(() => setDebouncedQuery(query), 500);
  return () => clearTimeout(timer);
}, [query]);

// ❌ Bad - Fetching all data upfront
useEffect(() => {
  fetchAllOrders(); // Fetches 40,000+ orders
}, []);

// ✅ Good - Server-side filtering with pagination
const loadStatus = async (status, { page, searchQuery, startDate, endDate }) => {
  await getOrdersByStatus({
    status,
    limit: 50,
    skip: (page - 1) * 50,
    searchQuery,
    startDate,
    endDate,
  });
};
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
- [ ] No ESLint disable comments (forbidden)
- [ ] Descriptive function and variable names (English)
- [ ] Descriptive if statements (`isAdmin` not `user.role === 2`)
- [ ] Empty values from constants (`age = 0`, `name = ''`)
- [ ] Empty object constants (`EMPTY_USER`)
- [ ] Use constants and enums
- [ ] Avoid comments
- [ ] Componentize views
- [ ] English names (except routes)
- [ ] Mobile-first design (entire UI/UX mobile-friendly)
- [ ] Safe areas implemented for all mobile components (mandatory)
- [ ] PillSelect component used for all selection needs (mandatory)
- [ ] InfoModal component used for all graphs and statistics (mandatory)
- [ ] Translation system used for all user-facing text (mandatory)
- [ ] useEffect dependencies only include values that should trigger the effect
- [ ] No infinite loops from state dependencies (use refs for tracking state)
- [ ] Initialization patterns use refs to prevent duplicate calls
- [ ] Functional state updates used to avoid dependency issues
- [ ] Lazy loading implemented for historical data
- [ ] Date filters applied for active data (e.g., last 24 hours)
- [ ] Server-side filtering used for large datasets
- [ ] Search queries debounced for server-side filtering

