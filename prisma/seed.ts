import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.estimate.deleteMany();
  await prisma.serviceItem.deleteMany();
  await prisma.plant.deleteMany();

  await prisma.plant.createMany({
    data: [
      {
        name: "Coontie Palm",
        isNative: true,
        lightNeeds: "Part Sun to Shade",
        matureSize: "2-3' H x 2-4' W",
        description: "Florida native cycad, drought tolerant, excellent for borders.",
        imageUrl: "/plants/coontie.jpg",
        category: "Native",
      },
      {
        name: "Simpson's Stopper",
        isNative: true,
        lightNeeds: "Sun to Part Shade",
        matureSize: "6-20' H as shrub/tree",
        description: "Fragrant blooms, berries for wildlife, great hedge.",
        imageUrl: "/plants/simpsons-stopper.jpg",
        category: "Native",
      },
      {
        name: "Dwarf Yaupon Holly",
        isNative: true,
        lightNeeds: "Sun to Part Shade",
        matureSize: "3-4' H x 3-4' W",
        description: "Compact native holly, drought and salt tolerant.",
        imageUrl: "/plants/yaupon.jpg",
        category: "Drought Tolerant",
      },
    ],
  });

  await prisma.serviceItem.createMany({
    data: [
      { category: "Bed Prep & Install", name: "Preen", unit: "sq ft", pricePerUnit: 0.03 },
      { category: "Landscape Fabric", name: "Non-Woven fabric (planted areas)", unit: "sq ft", pricePerUnit: 0.15 },
      { category: "Landscape Fabric", name: "Woven (near retaining)", unit: "sq ft", pricePerUnit: 0.45 },
      { category: "Rock & Mulch", name: "Granite Salt 'n Pepper (1/2–1\")", unit: "yard", pricePerUnit: 173 },
      { category: "Rock & Mulch", name: "Absolute Brown", unit: "yard", pricePerUnit: 40 },
      { category: "Edging", name: "6\" Black Edging", unit: "ft", pricePerUnit: 0.67 },
      { category: "Sod Installation", name: "St. Augustine (pallet)", unit: "pallet", pricePerUnit: 250 },
      { category: "Labor", name: "Rock/Mulch Install", unit: "hour", pricePerUnit: 25 },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });


