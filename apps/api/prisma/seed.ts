import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const adminPassword = await argon2.hash("Admin@12345", { type: argon2.argon2id });
  const admin = await prisma.user.upsert({
    where: { email: "admin@nextdigital.crm" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@nextdigital.crm",
      passwordHash: adminPassword,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    },
  });

  const staffPassword = await argon2.hash("Staff@12345", { type: argon2.argon2id });
  const staff = await prisma.user.upsert({
    where: { email: "staff@nextdigital.crm" },
    update: {},
    create: {
      name: "Anaz (Sales Staff)",
      email: "staff@nextdigital.crm",
      passwordHash: staffPassword,
      role: "SALES_STAFF",
      status: "ACTIVE",
    },
  });

  const category = await prisma.serviceCategory.upsert({
    where: { name: "Website Development" },
    update: {},
    create: { name: "Website Development", description: "Websites, e-commerce & web apps", sortOrder: 1 },
  });

  const professional = await prisma.package.create({
    data: {
      categoryId: category.id,
      name: "Professional",
      description: "For growing businesses that need a polished, feature-rich site",
      price: 3999,
      billingType: "ONE_TIME",
      duration: "30 Days",
      isPopular: true,
      features: {
        create: [
          { featureName: "Responsive Design", included: true, sortOrder: 1 },
          { featureName: "Custom UI/UX", included: true, sortOrder: 2 },
          { featureName: "Contact Form", included: true, sortOrder: 3 },
          { featureName: "WhatsApp Integration", included: true, sortOrder: 4 },
          { featureName: "Google Maps", included: true, sortOrder: 5 },
          { featureName: "SEO", included: true, sortOrder: 6 },
        ],
      },
    },
  });

  await prisma.addon.createMany({
    data: [
      { name: "Extra Website Page", price: 150, pricingType: "ONE_TIME" },
      { name: "Arabic + English Website", price: 800, pricingType: "ONE_TIME" },
      { name: "E-Commerce Module", price: 1500, pricingType: "ONE_TIME" },
      { name: "WhatsApp API Integration", price: 400, pricingType: "ONE_TIME" },
      { name: "Website Maintenance", price: 250, pricingType: "MONTHLY" },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seed complete:");
  console.log(`   Super Admin -> admin@nextdigital.crm / Admin@12345`);
  console.log(`   Sales Staff -> staff@nextdigital.crm / Staff@12345`);
  console.log(`   Sample package -> ${professional.name} (AED ${professional.price})`);
  void staff;
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
