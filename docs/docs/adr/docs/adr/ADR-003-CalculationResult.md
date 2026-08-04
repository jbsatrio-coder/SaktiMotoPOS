# ADR-003

## Title

CalculationResult DTO

Status : Accepted

---

## Context

Inventory Engine requires a common object passed across all processing stages.

Instead of passing multiple primitive values, every stage shares one immutable result object.

---

## Decision

calculateNewStock() returns:

```javascript
{
    movement,
    qty,
    qtyIn,
    qtyOut,
    currentStock,
    newStock
}
```

This object is passed unchanged to:

- updateCurrentStock()
- writeLedger()
- moveStock()

---

## Benefits

- Single DTO
- Easier testing
- Easier debugging
- Cleaner pipeline
- Less duplicated data