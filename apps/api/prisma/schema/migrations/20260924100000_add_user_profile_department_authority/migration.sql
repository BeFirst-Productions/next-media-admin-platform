-- ============================================================
-- Migration: add_user_profile_department_authority
-- Adds Department model and extends User with profile fields
-- ============================================================

-- 1. Add INACTIVE value to UserStatus enum
ALTER TYPE "UserStatus" ADD VALUE IF NOT EXISTS 'INACTIVE';

-- 2. Add ADMIN and MARKETING_TEAM to Role enum (if not present)
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'ADMIN';
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'MARKETING_TEAM';

-- 3. Create departments table
CREATE TABLE IF NOT EXISTS "departments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- Unique constraint on department name
CREATE UNIQUE INDEX IF NOT EXISTS "departments_name_key" ON "departments"("name");

-- 4. Add new columns to users table

-- employeeId: first add as nullable, populate with temp values, then make unique + not null
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "employeeId" TEXT;

-- Backfill existing rows with a unique employeeId using a CTE
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY "createdAt") AS rn
  FROM "users"
  WHERE "employeeId" IS NULL
)
UPDATE "users"
SET "employeeId" = 'USR-' || LPAD(CAST(numbered.rn AS TEXT), 4, '0')
FROM numbered
WHERE "users".id = numbered.id;

-- Now add unique constraint and NOT NULL
ALTER TABLE "users" ALTER COLUMN "employeeId" SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "users_employeeId_key" ON "users"("employeeId");

-- departmentId (FK to departments)
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "departmentId" TEXT;

-- joiningDate
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "joiningDate" TIMESTAMP(3);

-- salesTarget
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "salesTarget" DECIMAL(15, 2);

-- commissionPercentage
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "commissionPercentage" DECIMAL(5, 2);

-- canManageUsers (temporary authority flag)
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "canManageUsers" BOOLEAN NOT NULL DEFAULT false;

-- manageUsersExpiresAt
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "manageUsersExpiresAt" TIMESTAMP(3);

-- 5. Add indexes
CREATE INDEX IF NOT EXISTS "users_status_idx" ON "users"("status");
CREATE INDEX IF NOT EXISTS "users_departmentId_idx" ON "users"("departmentId");

-- 6. Add FK constraint from users.departmentId → departments.id
ALTER TABLE "users"
    ADD CONSTRAINT "users_departmentId_fkey"
    FOREIGN KEY ("departmentId") REFERENCES "departments"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
