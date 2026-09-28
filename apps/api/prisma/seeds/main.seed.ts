import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { seedUsers } from "./users.seed";
import { seedServices } from "./services.seed";
import { seedCommissionSlabs } from "./commissions.seed";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL environment variable is not set in .env");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  const slabMap = await seedCommissionSlabs(prisma);
  const { admin, staff } = await seedUsers(prisma);
  const { professionalPackage } = await seedServices(prisma);

  // Auto-assign Slab 1 to sales staff and create current month progress snapshot
  if (slabMap[1]) {
    await prisma.user.update({
      where: { id: staff.id },
      data: {
        currentSlabId: slabMap[1].id,
        currentSlabAssignedAt: new Date(),
      },
    });

    const now = new Date();
    await prisma.staffMonthlyCommissionProgress.upsert({
      where: {
        staffId_year_month: {
          staffId: staff.id,
          year: now.getFullYear(),
          month: now.getMonth() + 1,
        },
      },
      update: {},
      create: {
        staffId: staff.id,
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        currentSlabId: slabMap[1].id,
        basicSalary: 1500,
        status: "ACTIVE",
      },
    });
  }

  console.log("✅ Seeding completed successfully!");
  console.log(`   • Super Admin : ${admin.email} (Password: Admin@12345)`);
  console.log(`   • Sales Staff : ${staff.email} (Password: Staff@12345)`);
  console.log(`   • Slabs       : Slab 1 (AED 15k), Slab 2 (AED 30k), Slab 3 (AED 50k) initialized`);
  if (professionalPackage) {
    console.log(`   • Sample Package : ${professionalPackage.name} (AED ${professionalPackage.price})`);
  }
}

main()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
