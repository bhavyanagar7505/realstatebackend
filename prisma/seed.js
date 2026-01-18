const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient({});

async function main() {
  const hashedPassword = await bcrypt.hash("hisabwala123", 12);

  await prisma.superAdmin.upsert({
    where: { email: "hisabwala@gmail.com" },
    update: {},
    create: {
      email: "hisabwala@gmail.com",
      password: hashedPassword
    }
  });

  console.log("Super Admin seeded successfully");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
