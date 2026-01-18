const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/* ================= CREATE ITEM ================= */
exports.createItem = async (adminId, data) => {
  const { name, unit, rate } = data;

  return prisma.inventoryItem.create({
    data: {
      adminId,
      name,
      unit,
      rate: Number(rate)
    }
  });
};

/* ================= LIST ITEMS ================= */
exports.getItems = async (adminId) => {
  return prisma.inventoryItem.findMany({
    where: { adminId },
    orderBy: { createdAt: "desc" }
  });
};

/* ================= ADD USAGE ================= */
exports.addUsage = async (
  adminId,
  projectId,
  itemId,
  quantity
) => {
  const item = await prisma.inventoryItem.findFirst({
    where: { id: itemId, adminId }
  });
  if (!item) throw new Error("Inventory item not found");

  const project = await prisma.project.findFirst({
    where: { id: projectId, adminId }
  });
  if (!project) throw new Error("Project not found");

  const cost = Number(quantity) * item.rate;

  return prisma.inventoryUsage.create({
    data: {
      adminId,
      projectId,
      itemId,
      quantity: Number(quantity),
      cost
    }
  });
};

/* ================= PROJECT USAGE ================= */
exports.getProjectInventory = async (adminId, projectId) => {
  return prisma.inventoryUsage.findMany({
    where: { adminId, projectId },
    include: {
      item: true
    },
    orderBy: { createdAt: "desc" }
  });
};
