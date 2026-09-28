import { PrismaClient } from "@prisma/client";

export async function seedCommissionSlabs(prisma: PrismaClient) {
  console.log("  ↳ Seeding Next Media Monthly Sales Commission Slabs...");

  const slabsData = [
    {
      slabNumber: 1,
      name: "Slab 1",
      monthlySalesTarget: 15000,
      commissionRate: 10,
      commissionAtTarget: 1500,
      achievementBonus: 1000,
      basicSalary: 1500,
    },
    {
      slabNumber: 2,
      name: "Slab 2",
      monthlySalesTarget: 30000,
      commissionRate: 15,
      commissionAtTarget: 4500,
      achievementBonus: 1500,
      basicSalary: 1500,
    },
    {
      slabNumber: 3,
      name: "Slab 3",
      monthlySalesTarget: 50000,
      commissionRate: 20,
      commissionAtTarget: 10000,
      achievementBonus: 2000,
      basicSalary: 1500,
    },
  ];

  const seededSlabs: Record<number, any> = {};

  for (const slab of slabsData) {
    const record = await prisma.commissionSlab.upsert({
      where: { slabNumber: slab.slabNumber },
      update: {
        name: slab.name,
        monthlySalesTarget: slab.monthlySalesTarget,
        commissionRate: slab.commissionRate,
        commissionAtTarget: slab.commissionAtTarget,
        achievementBonus: slab.achievementBonus,
        basicSalary: slab.basicSalary,
      },
      create: slab,
    });
    seededSlabs[slab.slabNumber] = record;
  }

  return seededSlabs;
}
