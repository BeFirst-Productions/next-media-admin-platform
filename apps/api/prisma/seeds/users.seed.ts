import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import { ROLE_DEFAULT_PERMISSIONS } from "../../src/common/constants/roles";

export async function seedUsers(prisma: PrismaClient) {
  console.log("  ↳ Seeding users for all 4 enterprise roles...");

  // 1. Super Admin (Total Controller)
  const superAdminPassword = await argon2.hash("Admin@12345", { type: argon2.argon2id });
  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@nextdigital.com" },
    update: {
      permissions: ROLE_DEFAULT_PERMISSIONS.SUPER_ADMIN,
    },
    create: {
      name: "Super Admin",
      email: "superadmin@nextdigital.com",
      // passwordHash: superAdminPassword,
      passwordHash: "Superadmin@123##",
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      permissions: ROLE_DEFAULT_PERMISSIONS.SUPER_ADMIN,
      settings: {
        theme: "dark",
        notifications: { email: true, inApp: true },
        dashboardView: "global_command_center",
      },
    },
  });

  // 2. Operations Admin
  // const adminPassword = await argon2.hash("Admin@12345", { type: argon2.argon2id });
  const admin = await prisma.user.upsert({
    where: { email: "admin.ops@nextdigital.com" },
    update: {
      permissions: ROLE_DEFAULT_PERMISSIONS.ADMIN,
    },
    create: {
      name: "Sarah (Operations Admin)",
      email: "admin@nextdigital.com",
      // passwordHash: adminPassword,
      passwordHash: "Admin@123##",
      role: "ADMIN",
      status: "ACTIVE",
      permissions: ROLE_DEFAULT_PERMISSIONS.ADMIN,
      settings: {
        theme: "dark",
        notifications: { email: true, inApp: true },
        dashboardView: "operations_overview",
      },
    },
  });

  // 3. Sales Staff
  const staffPassword = await argon2.hash("Staff@12345", { type: argon2.argon2id });
  const staff = await prisma.user.upsert({
    where: { email: "staff@nextdigital.com" },
    update: {
      permissions: ROLE_DEFAULT_PERMISSIONS.SALES_STAFF,
    },
    create: {
      name: "Anaz (Sales Staff)",
      email: "staff@nextdigital.com",
      passwordHash: staffPassword,
      role: "SALES_STAFF",
      status: "ACTIVE",
      permissions: ROLE_DEFAULT_PERMISSIONS.SALES_STAFF,
      settings: {
        theme: "dark",
        notifications: { email: true, inApp: true },
        dashboardView: "personal_sales_cockpit",
      },
    },
  });

  // 4. Marketing Team
  const marketingPassword = await argon2.hash("Market@12345", { type: argon2.argon2id });
  const marketing = await prisma.user.upsert({
    where: { email: "marketing@nextdigital.crm" },
    update: {
      permissions: ROLE_DEFAULT_PERMISSIONS.MARKETING_TEAM,
    },
    create: {
      name: "Elena (Marketing Lead)",
      email: "marketing@nextdigital.crm",
      passwordHash: marketingPassword,
      role: "MARKETING_TEAM",
      status: "ACTIVE",
      permissions: ROLE_DEFAULT_PERMISSIONS.MARKETING_TEAM,
      settings: {
        theme: "dark",
        notifications: { email: true, inApp: true },
        dashboardView: "marketing_growth_hub",
      },
    },
  });

  return { superAdmin, admin, staff, marketing };
}
