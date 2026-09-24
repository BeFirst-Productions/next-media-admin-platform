import { PrismaClient } from "@prisma/client";

export async function seedServices(prisma: PrismaClient) {
  console.log("  ↳ Seeding service categories, packages & addons...");

  const category = await prisma.serviceCategory.upsert({
    where: { name: "Website Development" },
    update: {},
    create: {
      name: "Website Development",
      description: "Websites, e-commerce & web apps",
      sortOrder: 1,
    },
  });

  let professionalPackage = await prisma.package.findFirst({
    where: {
      categoryId: category.id,
      name: "Professional",
    },
  });

  if (!professionalPackage) {
    professionalPackage = await prisma.package.create({
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
  }

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

  return { category, professionalPackage };
}
