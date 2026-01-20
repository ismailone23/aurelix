# Changes Summary: Cost Price & Discount Feature Fix

## Issues Fixed
1. **Cost Price Not Updating/Adding**: The `costPrice` field was not included in the variant schema validation in the product router
2. **Missing Discount Feature**: Added discount percentage support at both product and variant levels

## Changes Made

### 1. Database Schema (`packages/db/src/schema.ts`)
- Updated variant type in products table to include `discount` field
- Updated comment to reflect new variant structure: `{size, price, costPrice, discount, stock}`

### 2. Product Router (`packages/trpc/src/routes/productRouter.ts`)
- **Updated variant schema**: Added `costPrice` and `discount` fields to variant validation
  ```typescript
  const variantSchema = z.object({
    size: z.string(),
    price: z.number().int().positive(),
    costPrice: z.number().int().min(0).optional(),
    discount: z.number().int().min(0).max(100).optional().default(0),
    stock: z.number().int().min(0),
  });
  ```
- **Updated create procedure**: Added `discount` field to input validation
- **Updated update procedure**: Added `discount` field to input validation

### 3. Type Definitions (`apps/admin/src/components/products/types.ts`)
- Added `discount?: number;` to `Variant` interface
- Added `discount?: number | null;` to `Product` interface

### 4. Variant Editor (`apps/admin/src/components/products/VariantEditor.tsx`)
- Added discount input field (0-100%) for each variant
- Initialize new variants with `discount: 0`
- Display proper structure with Discount % field between Sell price and Stock fields

### 5. Product Form (`apps/admin/src/components/products/ProductForm.tsx`)
- Added discount validation (must be 0-100)
- Added discount field to product form (for base products without variants)
- Added discount to form submission data
- Added discount input to component's onSubmit handler

### 6. Products Page (`apps/admin/src/app/products/page.tsx`)
- Updated `handleUpdate` to include `costPrice` and `discount` in mutation

### 7. Create Product Page (`apps/admin/src/app/products/create/page.tsx`)
- Updated `handleCreate` to include `discount` in mutation

## Feature Details

### Variant Level
Each variant can now have:
- **Size**: Product size identifier (e.g., "10ml", "13ml")
- **Cost Price (৳)**: Cost/purchase price
- **Sell Price (৳)**: Selling price
- **Discount (%)**: Discount percentage (0-100)
- **Stock**: Available quantity
- **Profit Display**: Automatically calculated as `Sell Price - Cost Price`

### Product Level (Base Products)
Base products (without variants) can now have:
- **Cost Price (৳)**: Cost/purchase price
- **Discount (%)**: Discount percentage (0-100)

## Data Validation
- `costPrice`: Optional, must be >= 0
- `discount`: Optional, must be between 0-100
- All numeric fields properly validated before submission

## Migration Status
The `discount` field was already present in the initial database migration (`0000_loud_ultragirl.sql`), so no new migration is required. The changes are purely API/schema validation and UI enhancements.

## Next Steps
To deploy these changes:
1. Deploy the backend changes (product router with updated schema)
2. Deploy the frontend changes (component updates)
3. The database already has the discount field, so no migration is needed
