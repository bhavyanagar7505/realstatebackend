const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createField = async (adminId, data) => {
  return prisma.projectField.create({
    data: {
      adminId,
      name: data.name,
      fieldType: data.fieldType,
      category: data.category,
      required: data.required
    }
  });
};

exports.getFields = async (adminId) => {
  return prisma.projectField.findMany({
    where: { adminId },
    orderBy: { createdAt: "asc" }
  });
};
