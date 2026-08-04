# ADR-002 - Inventory Movement API

Status : Accepted

## Context

Inventory will be used by multiple modules:

- POS
- Purchase
- Customer Return
- Supplier Return
- Stock Adjustment
- Stock Opname

To avoid duplicated business logic, all stock mutations must pass through a single service.

## Decision

InventoryService introduces a new internal API:

InventoryService.moveStock(movement)

where `movement` is a standardized object representing one inventory movement.

The existing `reduceStock()` method will remain as a backward-compatible wrapper during migration.

## Consequences

Benefits:

- Single inventory engine
- Centralized validation
- Easier Stock Ledger integration
- Easier Purchase module
- Easier Return module
- Easier testing