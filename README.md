# Next Digital CRM — Monorepo

A billing/proposal management CRM with two roles — **Super Admin** and
**Sales Staff** — built around one core business engine:

```
LEAD → CLIENT → PROPOSAL (Package + Add-ons) → APPROVAL → CONTRACT → INVOICE → PAYMENT → COMMISSION → REPORTING
```

## 1. Monorepo layout

```
next-digital-crm/
├── apps/
│   ├── api/                 # Express + TypeScript REST API (this is what's built out below)
│   └── web/                 # Next.js frontend — scaffolded in Phase 2, see apps/web/README.md
├── packages/
│   └── shared-types/        # Types shared between api <-> web (proposal shapes, enums, DTOs)
├── package.json              # npm workspaces root
└── tsconfig.base.json
```

Single repo, two deployable apps, one shared-types package — not two
disconnected codebases. The frontend never redefines an enum or a DTO shape
that the backend already owns.

## 2. Why this architecture

- **One application, two role-scoped surfaces** — not two separate apps.
  Both Super Admin and Sales Staff hit the same API; access is enforced at
  the API layer via RBAC, never by hiding UI menus alone.
- **RBAC is 3 layers deep**: Frontend hides what a role shouldn't see →
  API route requires a permission (`authorize(PERMISSIONS.X)`) → every
  Prisma query is additionally scoped (e.g. Sales Staff can only ever
  query `WHERE salesStaffId = req.user.id`, no matter what query params
  they send).
- **Dynamic package/add-on engine** — packages, features and add-ons live
  in the database (`service_categories → packages → package_features`,
  `addons`), never hard-coded, so Super Admin can change pricing without a
  developer touching code (spec section 6–8).
- **Server-side calculation, always** — `proposal-calculator.ts` is the
  single source of truth for proposal totals. The frontend can render a
  running total for UX, but the backend re-reads prices from the DB and
  recalculates from scratch on every write. A tampered request body can
  never change what a client is billed (spec section 9).
- **Proposal status is a state machine**, not a free-text field —
  `ALLOWED_TRANSITIONS` in `proposals.service.ts` enforces the exact flow
  from the spec (DRAFT → SUBMITTED → UNDER_REVIEW → APPROVED → ... ), with
  every transition recorded in `proposal_status_history`.
- **Audit vs. System logs are deliberately separate** (spec section 24):
  `audit_logs` = business actions ("changed package price AED 3,999 →
  4,499"); `system_logs` = technical events (API/server/DB errors). Mixing
  these makes both harder to use.
- **Consistent error/response envelope** everywhere — see `ApiResponse`
  (success) and `errorHandler` (failure). The frontend never has to guess
  the shape of a response or write one-off error parsing per endpoint.

## 3. Backend module map (`apps/api/src/modules`)

| Module | Status | Notes |
|---|---|---|
| `auth` | ✅ built | register/login/refresh/logout, JWT access + rotating refresh tokens (httpOnly cookie) |
| `users` | ✅ built | Super Admin only — list/update/deactivate |
| `services` | ✅ built | service-categories, packages, package-features, addons — the dynamic pricing engine |
| `leads` | ✅ built | full lifecycle, notes, activity log, assignment, notifications |
| `clients` | ✅ built | client + contacts, linked from converted leads |
| `proposals` | ✅ built | 4-step wizard backend: create → items/recalculate → submit → review → approve → send → accept. Calculation engine is fully server-authoritative. |
| `contracts` | 🧱 scaffolded | route + RBAC gate wired; service/controller are Phase 5 |
| `invoices` | 🧱 scaffolded | Phase 6 |
| `payments` | 🧱 scaffolded | Phase 6 |
| `commissions` | 🧱 scaffolded | Phase 7 — schema already stores a commission **rate snapshot** per the spec ("don't recalculate from the current staff rate later") |
| `sales-targets` | 🧱 scaffolded | Phase 7/8 |
| `reports` | 🧱 scaffolded | Phase 8 |
| `notifications` | ✅ built | in-app notification rows, created by other modules (e.g. lead assignment) |
| `audit-logs` | ✅ built (read) | every module writes here via `recordAuditLog()` |
| `system-logs` | ✅ built (read) | technical/error events, Super Admin only |
| `settings`, `backups` | 🧱 scaffolded | Phase 9 |

"Scaffolded" modules have their route file, RBAC permission, and a
placeholder handler already wired into `routes/index.ts` — implementing
them is adding a `.service.ts` / `.controller.ts` / `.validation.ts` next
to the existing `.routes.ts`, following the exact pattern used by
`leads` or `proposals`.

## 4. Request lifecycle (how every endpoint works)

```
Request
  → helmet / cors / compression / json body parser
  → pino request logger (adds x-request-id)
  → global rate limiter
  → authenticate            (verifies JWT, attaches req.user)
  → authorize(PERMISSION)   (RBAC check)
  → validate(zodSchema)     (body/query/params parsed + coerced)
  → controller               (thin — pulls req data, calls service)
  → service                  (business logic, Prisma calls, audit log)
  → ApiResponse.success(...) / .created(...) / .noContent(...)

On any thrown error, anywhere in that chain:
  → errorHandler maps AppError / ZodError / Prisma errors to a
    consistent { success:false, message, code, details?, requestId } JSON body
```

## 5. Error & response contract

**Success:**
```json
{
  "success": true,
  "message": "Proposal created",
  "data": { "...": "..." },
  "meta": { "page": 1, "limit": 20, "total": 42, "totalPages": 3 },
  "timestamp": "2026-09-14T10:00:00.000Z"
}
```

**Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": { "email": ["Invalid email"] },
  "requestId": "a1b2c3...",
  "timestamp": "2026-09-14T10:00:00.000Z"
}
```

Error `code` values are stable strings (`VALIDATION_ERROR`, `UNAUTHORIZED`,
`FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `UNIQUE_CONSTRAINT`, ...) — the
frontend should switch on `code`, never on `message` text.

## 6. Getting it running locally

```bash
# 1. Install
npm install

# 2. Configure env
cp .env.example apps/api/.env
# edit apps/api/.env — at minimum set DATABASE_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
# (generate strong secrets: openssl rand -base64 48)

# 3. Start PostgreSQL (docker example)
docker run --name crm-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=next_digital_crm -p 5432:5432 -d postgres:16

# 4. Generate client, run migrations, seed
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed

# 5. Run the API
npm run dev:api
# -> http://localhost:4000/api/v1, health check at http://localhost:4000/health
```

Seeded accounts (from `apps/api/prisma/seed.ts`):
- Super Admin: `admin@nextdigital.crm` / `Admin@12345`
- Sales Staff: `staff@nextdigital.crm` / `Staff@12345`

> This sandbox environment couldn't reach `binaries.prisma.sh` to download
> the Prisma query engine, so `prisma generate` / an actual DB connection
> couldn't be verified end-to-end here. Everything is written and
> `npm install` succeeds cleanly (217 packages); running the 5 steps above
> on your machine (with normal internet access) will generate the client
> and bring the API fully online.

## 7. Security checklist already in place

- Passwords hashed with **argon2id** (OWASP-recommended, memory-hard)
- **JWT access tokens** (short-lived, 15m) + **rotating refresh tokens**
  (hashed at rest, httpOnly+sameSite cookie, revoked on use/logout)
- **RBAC enforced server-side** on every protected route, not just hidden
  in the UI
- **Zod validation** on every request body/query/params
- **Prisma ORM** everywhere — no raw SQL string concatenation
- **express-rate-limit** — stricter limit on `/auth/*`, global limit on `/api/*`
- **helmet**, **CORS locked to `CLIENT_URL`**, `trust proxy` set correctly
  for accurate `req.ip` behind a load balancer
- **Audit log** on every create/update/delete/status-change across
  leads, clients, packages, addons, proposals, users
- Centralized error handler that **never leaks stack traces** in production

## 8. Recommended next steps (in order)

1. Run `prisma migrate dev` and confirm the schema matches your actual
   Next Media CRM PDFs 1:1 — add any fields you spot missing.
2. Implement `contracts` (Proposal `CLIENT_ACCEPTED` → generate Contract).
3. Implement `invoices` + `payments` (this is also where Puppeteer-based
   PDF generation for proposals/invoices/contracts should live — add a
   `modules/pdf` module with a reusable HTML template, per spec section 34).
4. Implement `commissions` — the rate snapshot fields already exist on the
   `Commission` model; compute `commission_amount` at invoice-paid time.
5. Scaffold `apps/web` (Next.js) against this API.
