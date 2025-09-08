import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const plants = await prisma.plant.count();
  const services = await prisma.serviceItem.count();
  const estimates = await prisma.estimate.count();
  console.log(`Plants: ${plants}, Services: ${services}, Estimates: ${estimates}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


