import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { seedUsers } from "./users.seed";
import { seedServices } from "./services.seed";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL environment variable is not set in .env");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  const { admin, staff } = await seedUsers(prisma);
  const { professionalPackage } = await seedServices(prisma);

  console.log("✅ Seeding completed successfully!");
  console.log(`   • Super Admin : ${admin.email} (Password: Admin@12345)`);
  console.log(`   • Sales Staff : ${staff.email} (Password: Staff@12345)`);
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
