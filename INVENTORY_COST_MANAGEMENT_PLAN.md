# Inventory & Cost Management Module - Design Plan

## Table of Contents
1. [Overview](#overview)
2. [Core Data Models](#core-data-models)
3. [Module Features & Functionality](#module-features--functionality)
4. [Performance Optimization Strategy](#performance-optimization-strategy)
5. [UI/UX Design](#uiux-design)
6. [Integration Points](#integration-points)
7. [Additional Strategic Features](#additional-strategic-features)
8. [Technical Implementation Plan](#technical-implementation-plan)
9. [Excel Export Specifications](#excel-export-specifications)
10. [Business Intelligence Features](#business-intelligence-features)
11. [User Roles & Permissions](#user-roles--permissions)

---

## Overview

The **Inventory & Cost Management Module** is a comprehensive business intelligence system designed to track material purchases, calculate burger costs, manage inventory, analyze profitability, and provide strategic insights for maximizing earnings and minimizing costs.

### Objectives
- Track every material purchase with varying costs over time
- Calculate accurate burger costs down to material level
- Determine profitability per burger and overall business
- Track inventory levels and production capacity
- Record and analyze material losses/waste
- Provide analytics and visualizations for decision-making
- Generate Excel reports for accountants and administrators
- Optimize performance to avoid heavy backend consumption

### Key Benefits
- **For Accountants**: Automated cost tracking, profit analysis, and Excel exports
- **For Administrators**: Real-time inventory visibility, cost optimization insights
- **For Business Owners**: Profitability analysis, strategic recommendations, trend identification

---

## Core Data Models

### 1. Material (Ingredient)

Represents a raw material/ingredient used in burger production.

```typescript
interface Material {
  _id: ObjectId | string;
  name: string;                    // "Carne blend 150g", "Queso americano", "Pan brioche"
  unit: string;                    // "kg", "g", "unidad", "litro", "ml"
  category: string;                // "Proteína", "Lácteos", "Panadería", "Verduras", "Condimentos"
  currentStock: number;             // Current available quantity
  minStockLevel: number;            // Alert threshold
  averageCost: number;              // Calculated average cost per unit
  lastPurchaseDate?: Date;
  lastPurchasePrice?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

**Key Fields:**
- `currentStock`: Real-time calculated inventory level
- `minStockLevel`: Threshold for low stock alerts
- `averageCost`: Weighted average of all purchase costs
- `category`: For grouping and filtering

### 2. Material Purchase

Records each purchase of materials with cost information.

```typescript
interface MaterialPurchase {
  _id: ObjectId | string;
  materialId: string;
  quantity: number;
  unitCost: number;                 // Cost per unit at purchase time
  totalCost: number;                 // quantity * unitCost
  supplier?: string;
  purchaseDate: Date;
  invoiceNumber?: string;
  notes?: string;
  recordedBy: string;               // Admin ID
  createdAt: Date;
  updatedAt: Date;
}
```

**Purpose:**
- Track all material purchases
- Calculate average costs over time
- Support supplier analysis
- Maintain purchase history

### 3. Burger Recipe (Material Requirements)

Defines the exact materials and quantities needed for each burger.

```typescript
interface BurgerRecipe {
  _id: ObjectId | string;
  burgerId: string;
  materialRequirements: MaterialRequirement[];
  totalCost: number;                 // Calculated cost per burger
  lastCalculatedAt: Date;
}

interface MaterialRequirement {
  materialId: string;
  quantity: number;                 // Amount needed per burger
  unit: string;                      // Must match material unit
}
```

**Integration:**
- Linked to `Burger` via `burgerId`
- Updated when material costs change
- Used to calculate burger production capacity

### 4. Material Loss/Waste

Records material losses with cause tracking.

```typescript
interface MaterialLoss {
  _id: ObjectId | string;
  materialId: string;
  quantity: number;
  lossDate: Date;
  cause: MaterialLossCause;
  notes?: string;
  recordedBy: string;
  createdAt: Date;
}

enum MaterialLossCause {
  EXPIRATION = 'expiration',           // Material expired
  SPOILAGE = 'spoilage',               // Material spoiled
  DAMAGE = 'damage',                   // Physical damage
  OVERCOOKING = 'overcooking',         // Overcooked during preparation
  PREPARATION_ERROR = 'preparation_error', // Error during preparation
  THEFT = 'theft',                     // Theft or unauthorized use
  INVENTORY_ERROR = 'inventory_error', // Counting/recording error
  OTHER = 'other'                      // Other reasons
}
```

**Common Loss Causes in Fast Food:**
- **Expiration**: Materials past expiration date
- **Spoilage**: Perishable items gone bad
- **Damage**: Physical damage during handling/transport
- **Overcooking**: Food overcooked and unusable
- **Preparation Error**: Mistakes during food prep
- **Theft**: Unauthorized removal
- **Inventory Error**: Counting mistakes

### 5. Inventory Snapshot

Stores manual inventory reconciliation data for performance optimization.

```typescript
interface InventorySnapshot {
  _id: ObjectId | string;
  materialId: string;
  calculatedStock: number;           // System calculated
  actualStock: number;               // Admin verified
  difference: number;                // actual - calculated
  snapshotDate: Date;
  verifiedBy?: string;
  verifiedAt?: Date;
  notes?: string;
}
```

**Purpose:**
- Store manual inventory counts
- Track discrepancies between calculated and actual stock
- Enable periodic reconciliation without full recalculation

---

## Module Features & Functionality

### 2.1 Material Management

**Core Operations:**
- ✅ Create, Edit, Delete materials
- ✅ Set units (kg, g, unidad, litro, ml)
- ✅ Assign categories for organization
- ✅ Set minimum stock levels for alerts
- ✅ Material search and filtering
- ✅ Bulk material import

**Features:**
- Material list with sortable columns
- Quick edit capabilities
- Duplicate material detection
- Category-based grouping

### 2.2 Purchase Tracking

**Purchase Recording:**
- ✅ Record individual purchases
- ✅ Bulk purchase entry (multiple materials at once)
- ✅ Supplier information tracking
- ✅ Invoice number tracking
- ✅ Purchase date and notes

**Automatic Updates:**
- ✅ Auto-update material stock levels
- ✅ Auto-calculate weighted average cost
- ✅ Update last purchase date and price
- ✅ Trigger low stock alerts if applicable

**Purchase History:**
- ✅ View all purchases for a material
- ✅ Filter by date range, supplier, material
- ✅ Purchase cost trends visualization
- ✅ Supplier comparison

### 2.3 Burger Recipe Management

**Recipe Builder:**
- ✅ Link materials to burgers with exact quantities
- ✅ Visual recipe builder interface
- ✅ Drag-and-drop material selection
- ✅ Quantity input with unit validation
- ✅ Real-time cost calculation preview

**Cost Calculation:**
- ✅ Auto-calculate burger cost based on current material costs
- ✅ Recipe versioning (track cost changes over time)
- ✅ Bulk recipe update capability
- ✅ Cost breakdown visualization

**Integration:**
- ✅ Integrated into burger form in menu management
- ✅ Recipe tab in burger detail view
- ✅ Show cost and profit margin in burger list

### 2.4 Cost Calculation Engine

**Real-Time Cost Calculation:**
- ✅ Material costs (from current average cost)
- ✅ Labor cost allocation (optional, configurable)
- ✅ Overhead allocation (optional, configurable)

**Profit Margin Calculation:**
- ✅ Revenue per burger = Sale price
- ✅ Cost per burger = Material + Labor + Overhead
- ✅ Gross profit = Revenue - Cost
- ✅ Profit margin % = (Profit / Revenue) × 100

**Cost Breakdown:**
- ✅ Visual cost breakdown (pie chart)
- ✅ Material cost per burger
- ✅ Labor cost per burger
- ✅ Overhead cost per burger

### 2.5 Inventory Tracking

**Real-Time Stock Calculation:**
```
Current Stock = Starting Stock
              + Purchases
              - Orders Consumed (from completed orders)
              - Material Losses
```

**Features:**
- ✅ Real-time stock levels
- ✅ Stock history timeline
- ✅ Stock alerts (low/critical levels)
- ✅ Stock value calculation (stock × average cost)

**Stock Alerts:**
- ✅ Low stock warnings
- ✅ Critical stock alerts
- ✅ Out of stock notifications
- ✅ Email/notification system integration

### 2.6 Production Capacity

**Capacity Calculation:**
- ✅ Calculate how many burgers can be made with current stock
- ✅ Formula: `floor(currentStock / requiredQuantity)` per material
- ✅ Identify limiting material (bottleneck)
- ✅ Production capacity dashboard

**Features:**
- ✅ Show production capacity per burger
- ✅ Highlight limiting materials
- ✅ Suggest purchase quantities to meet demand
- ✅ Capacity trends over time

### 2.7 Material Loss/Waste Management

**Loss Recording:**
- ✅ Record material losses with:
  - Material selection
  - Quantity lost
  - Loss date
  - Cause (predefined + custom)
  - Notes
  - Recorded by (admin ID)

**Loss Causes (Fast Food Industry):**
1. **Expiration**: Materials past expiration date
2. **Spoilage**: Perishable items gone bad
3. **Damage**: Physical damage during handling
4. **Overcooking**: Food overcooked and unusable
5. **Preparation Error**: Mistakes during food prep
6. **Theft**: Unauthorized removal
7. **Inventory Error**: Counting/recording mistakes
8. **Other**: Custom reasons

**Loss Analytics:**
- ✅ Loss trends over time
- ✅ Most common loss causes
- ✅ Loss impact on profitability
- ✅ Loss by material category
- ✅ Loss cost analysis

### 2.8 Inventory Reconciliation

**Manual Inventory Count:**
- ✅ Admin clicks "Reconcile Inventory" button
- ✅ System shows calculated stock vs. actual count
- ✅ Admin enters actual quantities for each material
- ✅ System records differences
- ✅ Auto-adjust stock to match actual
- ✅ Create inventory snapshot

**Reconciliation Features:**
- ✅ Batch reconciliation (multiple materials)
- ✅ Reconciliation history
- ✅ Variance analysis
- ✅ Discrepancy investigation tools
- ✅ Reconciliation reports

**Performance Optimization:**
- ✅ On-demand calculation (not automatic)
- ✅ Background processing for large inventories
- ✅ Progress tracking for long operations

### 2.9 Analytics & Reporting

#### Financial Analytics

**Profitability Dashboard:**
- ✅ Total revenue (from orders)
- ✅ Total material costs
- ✅ Gross profit
- ✅ Profit margin %
- ✅ Profit by burger
- ✅ Profit by date range

**Cost Trends:**
- ✅ Material costs over time (line chart)
- ✅ Cost inflation analysis
- ✅ Supplier cost comparison
- ✅ Cost variance analysis

**Profitability Analysis:**
- ✅ Most profitable burgers
- ✅ Least profitable burgers
- ✅ Profit margin trends
- ✅ Revenue vs. cost comparison

#### Inventory Analytics

**Stock Analysis:**
- ✅ Stock levels over time (area chart)
- ✅ Material consumption trends
- ✅ Purchase frequency analysis
- ✅ Stock turnover rate
- ✅ Days of inventory on hand

**Consumption Analysis:**
- ✅ Most consumed materials
- ✅ Consumption patterns by day/week/month
- ✅ Seasonal consumption trends
- ✅ Consumption vs. sales correlation

#### Operational Analytics

**Operational Metrics:**
- ✅ Waste/loss trends
- ✅ Loss causes distribution
- ✅ Supplier performance
- ✅ Cost variance analysis
- ✅ Production efficiency

### 2.10 Excel Export

**Export Capabilities:**
- ✅ Material inventory report
- ✅ Purchase history report
- ✅ Cost analysis report
- ✅ Profitability report
- ✅ Material loss report
- ✅ Production capacity report
- ✅ Custom date range exports

**Excel Report Formats:**

1. **Material Inventory Report**
   - Material name, category, current stock, unit, average cost, total value, last purchase date

2. **Purchase History Report**
   - Date, material, quantity, unit cost, total cost, supplier, invoice number

3. **Cost Analysis Report**
   - Burger name, sale price, material cost, profit, margin %, production capacity

4. **Profitability Report**
   - Date range, total revenue, total costs, gross profit, margin %, breakdown by burger

5. **Material Loss Report**
   - Date, material, quantity, cause, cost impact, recorded by

---

## Performance Optimization Strategy

### 3.1 Background Calculation Jobs

**On-Demand Calculation:**
- ✅ Admin clicks "Calculate Inventory" button
- ✅ Server action processes in background
- ✅ Returns job ID for tracking
- ✅ Client polls for completion status
- ✅ Progress indicator during calculation

**Scheduled Calculations:**
- ✅ Daily inventory snapshot (midnight)
- ✅ Weekly cost recalculation
- ✅ Monthly profitability report generation
- ✅ Configurable schedule

**Job Management:**
- ✅ Job queue system
- ✅ Job status tracking
- ✅ Error handling and retry logic
- ✅ Job cancellation capability

### 3.2 Caching Strategy

**Cached Values:**
- ✅ Burger costs (recalculate when material costs change)
- ✅ Current inventory levels (update on purchase/order/loss)
- ✅ Profitability metrics (cache for 1 hour)
- ✅ Production capacity (cache until stock changes)

**Cache Invalidation:**
- ✅ New purchase → Invalidate material cache
- ✅ New order completion → Invalidate inventory cache
- ✅ Material loss recorded → Invalidate inventory cache
- ✅ Recipe changes → Invalidate burger cost cache

**Cache Implementation:**
- ✅ MongoDB collection for cache storage
- ✅ TTL (Time To Live) for automatic expiration
- ✅ Manual cache invalidation API

### 3.3 Incremental Updates

**Efficient Updates:**
- ✅ Only update affected materials when order completes
- ✅ Only recalculate affected burger costs when material cost changes
- ✅ Use MongoDB aggregation pipelines for efficiency
- ✅ Batch updates when possible

**Update Triggers:**
- ✅ Order status → COMPLETED: Update consumption
- ✅ Material purchase: Update stock and cost
- ✅ Material loss: Update stock
- ✅ Recipe change: Update burger cost

### 3.4 Database Indexing

**Required Indexes:**
- ✅ `materialPurchases.materialId + purchaseDate`
- ✅ `orders.status + createdAt` (for consumption calculation)
- ✅ `burgerRecipes.burgerId`
- ✅ `materialLosses.materialId + lossDate`
- ✅ `materials.category`
- ✅ `materials.currentStock` (for low stock queries)

**Index Strategy:**
- ✅ Compound indexes for common queries
- ✅ Partial indexes for filtered queries
- ✅ Regular index maintenance

---

## UI/UX Design

### 4.1 Main Navigation

**Admin Sidebar Integration:**
- Add "Inventory & Costs" section
- Icon: `inventory` or `calculate`

**Sub-Sections:**
1. **Dashboard** - Overview and key metrics
2. **Materials** - Material management
3. **Purchases** - Purchase tracking
4. **Recipes** - Burger recipe management
5. **Inventory** - Stock levels and reconciliation
6. **Losses** - Material loss tracking
7. **Analytics** - Charts and visualizations
8. **Reports** - Excel export generation

### 4.2 Dashboard View

**Key Metrics Cards:**
- Total inventory value
- Average profit margin
- Low stock alerts count
- Recent purchases (last 5)
- Recent losses (last 5)
- Production capacity summary

**Quick Actions:**
- Record purchase (button)
- Record loss (button)
- Reconcile inventory (button)
- Generate report (dropdown)

**Charts:**
- Profitability trend (mini chart)
- Stock levels overview (mini chart)
- Top materials by value (mini chart)

### 4.3 Material Management

**Material List:**
- Table with columns:
  - Name
  - Category
  - Current Stock
  - Unit
  - Average Cost
  - Total Value
  - Stock Status (indicator)
  - Actions (edit, purchase, loss)

**Stock Status Indicators:**
- 🟢 Normal (above min level)
- 🟡 Low (at or near min level)
- 🔴 Critical (below min level)

**Material Detail View:**
- Material information
- Purchase history chart
- Consumption chart
- Cost trend chart
- Stock level timeline
- Related recipes

### 4.4 Recipe Builder

**Visual Interface:**
- Burger selection dropdown
- Material picker (searchable)
- Quantity input per material
- Unit display (read-only, from material)
- Real-time cost calculation
- Cost breakdown visualization
- Save/Update buttons

**Recipe View:**
- List of materials with quantities
- Total cost per burger
- Profit margin display
- Edit/Delete actions

### 4.5 Analytics Dashboard

**Chart Types:**
1. **Profitability Over Time** (Line Chart)
   - Revenue, Cost, Profit over time
   - Date range selector

2. **Cost Breakdown by Burger** (Bar Chart)
   - Material cost per burger
   - Profit margin per burger

3. **Material Consumption** (Pie Chart)
   - Consumption by material category
   - Top consumed materials

4. **Stock Levels** (Area Chart)
   - Stock levels over time
   - Multiple materials comparison

5. **Loss Causes** (Pie Chart)
   - Distribution of loss causes
   - Cost impact by cause

6. **Profit Margin by Burger** (Bar Chart)
   - Profit margin percentage
   - Sorted by profitability

**Interactive Features:**
- Date range filtering
- Material category filtering
- Burger filtering
- Export chart data

---

## Integration Points

### 5.1 Order System Integration

**Order Completion Hook:**
- ✅ When order status → `COMPLETED`:
  - Calculate material consumption based on burger recipes
  - Deduct consumed materials from inventory
  - Update burger cost if material costs changed
  - Record consumption in log
  - Trigger stock alerts if needed

**Consumption Calculation:**
```typescript
// For each order item:
const burgerRecipe = getBurgerRecipe(item.burgerId);
burgerRecipe.materialRequirements.forEach(req => {
  const consumed = req.quantity * item.quantity;
  deductFromInventory(req.materialId, consumed);
});
```

### 5.2 Menu System Integration

**Burger Form Enhancement:**
- ✅ Add "Recipe" tab to burger form
- ✅ Link materials to burgers with quantities
- ✅ Show calculated cost and profit margin
- ✅ Real-time cost updates

**Burger List Enhancement:**
- ✅ Display cost per burger
- ✅ Display profit margin %
- ✅ Color code by profitability
- ✅ Sort by profit margin

### 5.3 Analytics Module Integration

**New Analytics Category:**
- ✅ Add "Cost & Inventory" category to analytics
- ✅ Share data with existing analytics
- ✅ Cross-reference with sales data
- ✅ Combined profitability analysis

---

## Additional Strategic Features

### 6.1 Cost Optimization Suggestions

**Automated Recommendations:**
- ✅ Identify high-cost materials
- ✅ Suggest alternative suppliers
- ✅ Highlight low-margin burgers
- ✅ Recommend price adjustments
- ✅ Suggest bulk purchase opportunities

**Optimization Alerts:**
- ✅ Alert when material cost increases > 10%
- ✅ Alert when burger margin < 20%
- ✅ Alert when waste rate > 5%

### 6.2 Predictive Analytics

**Forecasting:**
- ✅ Forecast material needs (based on order history)
- ✅ Predict stock-out dates
- ✅ Seasonal demand patterns
- ✅ Cost trend predictions

**Machine Learning (Future):**
- ✅ Demand forecasting
- ✅ Optimal purchase timing
- ✅ Price optimization

### 6.3 Supplier Management

**Supplier Tracking:**
- ✅ Track supplier performance
- ✅ Compare supplier costs
- ✅ Supplier rating system
- ✅ Delivery time tracking
- ✅ Quality metrics

**Supplier Analytics:**
- ✅ Cost comparison charts
- ✅ Reliability metrics
- ✅ Best supplier recommendations

### 6.4 Batch Costing

**Advanced Costing:**
- ✅ Track costs per batch/lot
- ✅ FIFO/LIFO costing methods
- ✅ Expiration date tracking
- ✅ Batch-based inventory management

### 6.5 Multi-Location Support (Future)

**Multi-Location Features:**
- ✅ Track inventory per location
- ✅ Transfer materials between locations
- ✅ Location-based cost analysis
- ✅ Cross-location reporting

### 6.6 Recipe Cost History

**Historical Tracking:**
- ✅ Track how burger costs change over time
- ✅ Identify cost inflation trends
- ✅ Price adjustment recommendations
- ✅ Cost versioning

---

## Technical Implementation Plan

### 7.1 Database Collections

**New Collections:**
```
- materials
- materialPurchases
- burgerRecipes
- materialLosses
- inventorySnapshots
- materialConsumptionLogs (for tracking)
- inventoryCache (for performance)
```

**Collection Relationships:**
- `materials` ← `materialPurchases` (one-to-many)
- `materials` ← `materialLosses` (one-to-many)
- `burgers` ← `burgerRecipes` (one-to-one)
- `burgerRecipes` → `materials` (many-to-many via requirements)

### 7.2 Server Actions Structure

```
features/inventory/
  actions/
    - getMaterials.action.ts
    - createMaterial.action.ts
    - updateMaterial.action.ts
    - deleteMaterial.action.ts
    - recordPurchase.action.ts
    - getPurchases.action.ts
    - createBurgerRecipe.action.ts
    - updateBurgerRecipe.action.ts
    - calculateBurgerCost.action.ts
    - calculateInventory.action.ts
    - recordMaterialLoss.action.ts
    - getMaterialLosses.action.ts
    - reconcileInventory.action.ts
    - getInventoryAnalytics.action.ts
    - exportInventoryReport.action.ts
    - processOrderConsumption.action.ts
```

### 7.3 Calculation Utilities

```
features/inventory/
  utils/
    - calculateAverageCost.util.ts
    - calculateBurgerCost.util.ts
    - calculateInventory.util.ts
    - calculateProfitability.util.ts
    - processOrderConsumption.util.ts
    - validateMaterialUnits.util.ts
    - convertUnits.util.ts (if needed)
```

### 7.4 Types

```
features/inventory/
  types/
    - material.type.ts
    - purchase.type.ts
    - recipe.type.ts
    - loss.type.ts
    - snapshot.type.ts
    - analytics.type.ts
```

### 7.5 Components

```
features/inventory/
  components/
    - MaterialList.component.tsx
    - MaterialForm.component.tsx
    - PurchaseForm.component.tsx
    - PurchaseList.component.tsx
    - RecipeBuilder.component.tsx
    - InventoryDashboard.component.tsx
    - LossForm.component.tsx
    - ReconciliationForm.component.tsx
    - ProfitabilityChart.component.tsx
    - StockLevelChart.component.tsx
    - CostBreakdownChart.component.tsx
```

### 7.6 Containers

```
features/inventory/
  containers/
    - InventoryContainer.container.tsx
    - MaterialsContainer.container.tsx
    - PurchasesContainer.container.tsx
    - RecipesContainer.container.tsx
    - AnalyticsContainer.container.tsx
```

---

## Excel Export Specifications

### 8.1 Material Inventory Report

**Columns:**
- Material Name
- Category
- Current Stock
- Unit
- Average Cost
- Total Value (Stock × Cost)
- Last Purchase Date
- Last Purchase Price
- Stock Status

**Format:**
- CSV/Excel format
- UTF-8 encoding with BOM
- Formatted numbers (currency, decimals)
- Date formatting

### 8.2 Purchase History Report

**Columns:**
- Purchase Date
- Material Name
- Quantity
- Unit
- Unit Cost
- Total Cost
- Supplier
- Invoice Number
- Recorded By
- Notes

**Filters:**
- Date range
- Material
- Supplier

### 8.3 Cost Analysis Report

**Columns:**
- Burger Name
- Sale Price
- Material Cost
- Labor Cost (if applicable)
- Overhead Cost (if applicable)
- Total Cost
- Gross Profit
- Profit Margin %
- Production Capacity (current stock)

**Sorting:**
- By profit margin
- By burger name
- By cost

### 8.4 Profitability Report

**Summary Section:**
- Date Range
- Total Revenue
- Total Material Costs
- Total Labor Costs (if applicable)
- Total Overhead Costs (if applicable)
- Gross Profit
- Profit Margin %

**Breakdown Section:**
- Burger Name
- Quantity Sold
- Revenue
- Cost
- Profit
- Margin %

### 8.5 Material Loss Report

**Columns:**
- Loss Date
- Material Name
- Quantity Lost
- Unit
- Cost Impact (Quantity × Average Cost)
- Cause
- Notes
- Recorded By

**Summary:**
- Total Losses by Cause
- Total Cost Impact
- Loss Rate %

---

## Business Intelligence Features

### 9.1 Profitability Alerts

**Alert Types:**
- ✅ Burger margin below threshold (e.g., < 20%)
- ✅ Material cost increase > X% (e.g., > 10%)
- ✅ Waste rate above threshold (e.g., > 5%)
- ✅ Low stock alerts
- ✅ High-cost material alerts

**Alert Configuration:**
- ✅ Configurable thresholds
- ✅ Email notifications (future)
- ✅ In-app notifications
- ✅ Alert history

### 9.2 Cost Variance Analysis

**Variance Tracking:**
- ✅ Compare actual vs. budgeted costs
- ✅ Identify cost drivers
- ✅ Trend analysis
- ✅ Variance reports

**Variance Types:**
- Material cost variance
- Labor cost variance
- Overhead variance
- Total cost variance

### 9.3 ROI Analysis

**ROI Metrics:**
- ✅ Return on inventory investment
- ✅ Material turnover rate
- ✅ Days of inventory on hand
- ✅ Inventory carrying cost

**ROI Calculations:**
- Inventory ROI = (Profit / Inventory Value) × 100
- Turnover Rate = Cost of Goods Sold / Average Inventory
- Days on Hand = (Average Inventory / Daily Consumption) × 365

---

## User Roles & Permissions

### Role Definitions

**Admin:**
- ✅ Full access to all features
- ✅ Create/edit/delete materials
- ✅ Record purchases and losses
- ✅ Reconcile inventory
- ✅ View all analytics
- ✅ Export all reports

**Accountant:**
- ✅ View all data
- ✅ Record purchases
- ✅ Record losses
- ✅ Export reports
- ✅ View analytics
- ❌ Cannot delete materials
- ❌ Cannot modify recipes

**Manager:**
- ✅ View analytics
- ✅ Record losses
- ✅ Reconcile inventory
- ✅ View reports
- ❌ Cannot record purchases
- ❌ Cannot modify materials

**Chef:**
- ✅ View inventory levels only
- ✅ View production capacity
- ❌ No write access
- ❌ No analytics access

---

## Implementation Phases

### Phase 1: Core Foundation (Week 1-2)
- Material management (CRUD)
- Purchase tracking
- Basic inventory calculation

### Phase 2: Recipe & Costing (Week 3-4)
- Recipe builder
- Cost calculation engine
- Profitability calculation

### Phase 3: Inventory Management (Week 5-6)
- Real-time inventory tracking
- Production capacity
- Stock alerts

### Phase 4: Loss & Reconciliation (Week 7-8)
- Material loss tracking
- Inventory reconciliation
- Variance analysis

### Phase 5: Analytics & Reports (Week 9-10)
- Analytics dashboard
- Charts and visualizations
- Excel export functionality

### Phase 6: Optimization & Polish (Week 11-12)
- Performance optimization
- Caching implementation
- UI/UX improvements
- Testing and bug fixes

---

## Success Metrics

### Key Performance Indicators (KPIs)

**Financial:**
- Average profit margin
- Cost per burger
- Revenue vs. cost ratio
- ROI on inventory

**Operational:**
- Inventory accuracy rate
- Waste/loss percentage
- Stock turnover rate
- Production capacity utilization

**User Adoption:**
- Number of purchases recorded
- Frequency of reconciliation
- Report generation frequency
- User satisfaction score

---

## Future Enhancements

### Short-term (3-6 months)
- Mobile app for inventory management
- Barcode scanning for materials
- Automated purchase order generation
- Integration with accounting software

### Medium-term (6-12 months)
- AI-powered demand forecasting
- Supplier portal integration
- Multi-location support
- Advanced reporting templates

### Long-term (12+ months)
- Machine learning for cost optimization
- Predictive analytics for inventory
- Integration with POS systems
- Real-time supplier price comparison

---

## Conclusion

The Inventory & Cost Management Module provides a comprehensive solution for tracking materials, calculating costs, managing inventory, and analyzing profitability. By implementing this module, the business will have:

1. **Complete Visibility**: Real-time tracking of materials, costs, and inventory
2. **Accurate Costing**: Precise burger cost calculation down to material level
3. **Profitability Insights**: Clear understanding of which burgers are profitable
4. **Strategic Decision Making**: Data-driven insights for cost optimization
5. **Operational Efficiency**: Automated calculations and reporting
6. **Performance Optimization**: Efficient backend processing with caching

This module will significantly improve the business's ability to maximize earnings and minimize costs while providing accountants and administrators with the tools they need to manage the business effectively.


