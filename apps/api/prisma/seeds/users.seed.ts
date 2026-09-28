import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import { ROLE_DEFAULT_PERMISSIONS } from "../../src/common/constants/roles";

export async function seedDepartments(prisma: PrismaClient) {
  console.log("  ↳ Seeding departments...");

  const departments = [
    { name: "Administration", description: "Company administration and management" },
    { name: "Sales", description: "Sales team responsible for lead conversion" },
    { name: "Marketing", description: "Marketing and brand growth team" },
    { name: "Finance", description: "Finance, billing, and payment operations" },
    { name: "Operations", description: "Day-to-day operational activities" },
    { name: "IT", description: "Technology and infrastructure support" },
  ];

  const created: Record<string, string> = {};

  for (const dept of departments) {
    const record = await prisma.department.upsert({
      where: { name: dept.name },
      update: {},
      create: dept,
    });
    created[dept.name] = record.id;
  }

  return created;
}

export async function seedUsers(prisma: PrismaClient) {
  console.log("  ↳ Seeding users for all 4 enterprise roles...");

  // Seed departments first
  const deptIds = await seedDepartments(prisma);

  // 1. Super Admin (Total Controller) — no department, no sales target
  const superAdminEmail = process.env.SUPERADMIN_EMAIL || "superadmin@next.com";
  const superAdminPlainPassword = process.env.SUPERADMIN_PASSWORD || "Superadmin@123";
  const superAdminPassword = await argon2.hash(superAdminPlainPassword, { type: argon2.argon2id });

  const superAdmin = await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: {
      permissions: ROLE_DEFAULT_PERMISSIONS.SUPER_ADMIN,
    },
    create: {
      employeeId: "USR-0001",
      name: "Super Admin",
      email: superAdminEmail,
      passwordHash: superAdminPassword,
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
  const adminPassword = await argon2.hash("Admin@12345", { type: argon2.argon2id });
  const admin = await prisma.user.upsert({
    where: { email: "admin@next.com" },
    update: {
      permissions: ROLE_DEFAULT_PERMISSIONS.ADMIN,
    },
    create: {
      employeeId: "USR-0002",
      name: "Sarah (Operations Admin)",
      email: "admin@next.com",
      passwordHash: adminPassword,
      role: "ADMIN",
      status: "ACTIVE",
      departmentId: deptIds["Administration"],
      joiningDate: new Date("2025-01-10"),
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
      employeeId: "USR-0003",
      name: "Anaz (Sales Staff)",
      email: "staff@nextdigital.com",
      passwordHash: staffPassword,
      role: "SALES_STAFF",
      status: "ACTIVE",
      departmentId: deptIds["Sales"],
      joiningDate: new Date("2025-02-15"),
      salesTarget: 50000,
      commissionPercentage: 10,
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
      employeeId: "USR-0004",
      name: "Elena (Marketing Lead)",
      email: "marketing@nextdigital.crm",
      passwordHash: marketingPassword,
      role: "MARKETING_TEAM",
      status: "ACTIVE",
      departmentId: deptIds["Marketing"],
      joiningDate: new Date("2025-03-12"),
      salesTarget: 30000,
      commissionPercentage: 7,
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
