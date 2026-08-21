# SaktiMotoPOS — Project Instructions

## 1. Project Language

Gunakan Bahasa Indonesia ketika:

- menjelaskan hasil analisis;
- menjelaskan perubahan;
- menjelaskan error;
- menjelaskan test result;
- menjelaskan business logic; dan
- berkomunikasi dengan product owner.

Gunakan English untuk:

- function names;
- variable names;
- class/object names;
- technical identifiers;
- API names;
- Git commands; dan
- code syntax.

Pertahankan istilah bisnis Indonesia yang sudah digunakan repository seperti: Work Order, DRAFT, MENUNGGU_DIAGNOSA, MENUNGGU_APPROVAL, DALAM_PENGERJAAN, MENUNGGU_SPAREPART, QC, SELESAI, SUDAH_DIAMBIL, DIBATALKAN, Work Order Part, Work Order Jasa, sparepart, stok, mekanik, pelanggan, dan kendaraan.

## 2. Role

The human product owner defines:

- business workflow;
- operational rules;
- desired user experience; dan
- acceptance criteria.

Codex acts as:

- coding agent;
- repository analyst;
- test runner; dan
- implementation assistant.

Do not invent business rules when the repository or product owner does not define them.

## 3. Safety

Before modifying code:

- inspect relevant existing implementation;
- identify affected services/repositories/tests;
- preserve existing architecture unless a refactor is explicitly requested;
- avoid unrelated changes; dan
- do not modify working functionality merely for stylistic reasons.

Never delete or rewrite a major module without explicit approval.

## 4. Git Safety

Before major changes:

- inspect `git status`;
- identify current branch; dan
- identify latest checkpoint.

Do not reset, rebase, force-push, or delete branches unless explicitly instructed.

Prefer small, reviewable commits.

## 5. Testing

Every business-logic change should have:

- relevant existing tests executed;
- regression tests considered; dan
- new regression coverage added when a bug or lifecycle rule is introduced.

Do not claim a change is complete merely because the code compiles.

## 6. Business Logic

SaktiMotoPOS is a motorcycle workshop management system.

Important domains include:

- Customer;
- Vehicle;
- Master Barang;
- Master Jasa;
- Work Order;
- Work Order Jasa;
- Work Order Part;
- Inventory / Stock Ledger;
- Purchase;
- POS / Sales;
- Commission;
- Permission; dan
- Reporting / Dashboard.

Work Order lifecycle and stock lifecycle are business-critical.

Stock mutations must be auditable and must preserve ledger integrity.

Cancellation and reversal operations must be idempotent and must not create duplicate reversal movements.

Completion gates must prevent invalid Work Order completion.

## 7. Architecture

Prefer the existing architecture:

```text
View → Controller → Service → Repository → Google Sheets
```

unless a change is explicitly approved.

Avoid introducing direct sheet access into UI code when a service/repository layer already exists.

## 8. Legacy Code

The repository may contain legacy and newer implementations.

Do not automatically delete legacy code.

First:

- identify it;
- determine whether it is still referenced;
- identify migration risk; dan
- propose retirement before removing it.

## 9. Production Principle

The ultimate goal is a standalone responsive web application that can be accessed from:

- desktop;
- tablet; dan
- mobile.

The initial backend/data storage may remain Google Sheets through Apps Script.

Users should not need to open the spreadsheet directly to operate the application.

## 10. Communication

When proposing changes, explain briefly:

**WHY:** What business/technical problem are we solving?

**WHAT:** What files/modules will change?

**RISK:** What existing functionality could be affected?

**TEST:** How will we prove the change works?

Do not make large architectural decisions silently.

## 11. Read-Only First

For unfamiliar areas of the repository:

- inspect first;
- explain findings;
- propose changes; dan
- only then modify code after approval.

## 12. Important Current Architectural Risks

Known areas requiring careful attention:

- multiple inventory implementations;
- POS ↔ Work Order settlement integration;
- inconsistent permission enforcement;
- legacy duplicate flows;
- lack of standalone web-app routing;
- lack of automated full regression execution; dan
- production deployment/backup/monitoring strategy.

Do not attempt to solve all of these simultaneously.

Work incrementally and maintain stable checkpoints.
