# Database Schema Architecture

## Overview
The existing database uses a **star schema** design with operations managed through a parent-child relationship, not with line item tables.

## Core Tables

### fact_operation (Parent Table)
- `operation_key` - Primary key
- `operation_id` - Business ID (REC-001, DEL-001, etc.)
- `op_type_key` - Type of operation (1=Receipt, 2=Delivery, 3=Transfer, 4=Adjustment)
- `created_by_key` - User who created
- `validated_by_key` - User who validated
- `status` - draft, validated, cancelled
- `reference_no` - External reference
- `created_date_key` - Date dimension key
- `validated_date_key` - Date dimension key
- `document_total_qty` - Total quantity
- `meta` - **JSONB** field for flexible data (stores product lines)
- `created_at` - Timestamp

### fact_receipts (Child - Receipt Details)
- `receipt_key` - Primary key
- `operation_key` - FK to fact_operation
- `supplier_name`
- `invoice_number`
- `expected_date_key` - Date dimension
- `created_at`

### fact_deliveries (Child - Delivery Details)
- `delivery_key` - Primary key
- `operation_key` - FK to fact_operation
- `customer_name`
- `sales_order_no`
- `pickup_date_key` - Date dimension
- `created_at`

### fact_transfers (Child - Transfer Details)
- `transfer_key` - Primary key
- `operation_key` - FK to fact_operation
- `transfer_reason`
- `created_at`

### fact_adjustments (Child - Adjustment Details)
- `adjustment_key` - Primary key
- `operation_key` - FK to fact_operation
- `adjustment_reason`
- `counted_quantity`
- `created_at`

### fact_stock_movement (Ledger)
- `movement_key` - Primary key
- `operation_key` - FK to fact_operation
- `product_key` - FK to dim_product
- `from_location_key` - FK to dim_location (source)
- `to_location_key` - FK to dim_location (destination)
- `op_type_key` - Operation type
- `date_key` - Date dimension
- `quantity_change` - +/- quantity
- `balance_after` - Running balance
- `created_by_key` - User
- `note` - Text note
- `created_at`

## Key Design Patterns

### NO Line Tables
❌ fact_receipt_lines
❌ fact_delivery_lines
❌ fact_transfer_lines
❌ fact_adjustment_lines

Instead:
1. **Product details** stored in `fact_operation.meta` JSONB field
2. **Stock changes** tracked in `fact_stock_movement`

### Example Flow: Create Receipt

```sql
-- Step 1: Create operation
INSERT INTO fact_operation (operation_id, op_type_key, status, meta, created_by_key, created_date_key)
VALUES ('REC-001', 1, 'draft', 
  '{"lines": [
    {"product_key": 5, "quantity": 100, "location_key": 2},
    {"product_key": 8, "quantity": 50, "location_key": 2}
  ]}', 
  123, 20250125);

-- Step 2: Create receipt details
INSERT INTO fact_receipts (operation_key, supplier_name, invoice_number)
VALUES (1, 'ABC Supplier', 'INV-2025-001');

-- Step 3: On validation, create stock movements
INSERT INTO fact_stock_movement (operation_key, product_key, from_location_key, to_location_key, quantity_change, created_by_key)
VALUES 
  (1, 5, NULL, 2, 100, 123),  -- Receiving into location 2
  (1, 8, NULL, 2, 50, 123);

-- Step 4: Update operation status
UPDATE fact_operation SET status = 'validated', validated_by_key = 123, validated_date_key = 20250125 WHERE operation_key = 1;
```

## Migration Strategy

### What Needs to Change

1. **Services** - Complete rewrite needed
   - Store product lines in meta JSONB
   - Create operation first, then child record
   - On validation, insert stock_movement records

2. **Controllers** - Minimal changes
   - API structure can stay the same
   - Just call updated services

3. **Frontend** - NO changes needed
   - Receipts.jsx already complete
   - API contract remains same

## Next Steps

1. ✅ Update all models to match schema
2. ✅ Fix associations (Operation as parent)
3. ⏳ Rewrite services to use new pattern
4. ⏳ Test CRUD operations
5. ⏳ Complete remaining frontend pages
