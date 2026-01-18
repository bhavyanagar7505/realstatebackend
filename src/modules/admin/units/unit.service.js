const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/* ================= UNIT TYPES ================= */

exports.getUnitTypes = async (adminId) => {
  return prisma.unitType.findMany({
    where: { adminId: Number(adminId) },
    orderBy: { createdAt: "asc" }
  });
};

exports.createUnitType = async (adminId, name) => {
  if (!name) {
    throw new Error("Unit type name is required");
  }

  return prisma.unitType.create({
    data: {
      name,
      adminId: Number(adminId)
    }
  });
};

/* ================= UNITS ================= */

exports.getUnitsByProject = async (projectId) => {
  return prisma.unit.findMany({
    where: { projectId: Number(projectId) },
    include: { unitType: true },
    orderBy: { createdAt: "asc" }
  });
};

exports.createUnit = async (data) => {
  return prisma.unit.create({
    data: {
      unitNumber: data.unitNumber,
      unitTypeId: Number(data.unitTypeId),
      baseCost: Number(data.baseCost),
      sellingPrice: Number(data.sellingPrice),
      status: data.status || "AVAILABLE",
      projectId: Number(data.projectId)
    }
  });
};

exports.updateUnit = async (id, data) => {
  return prisma.unit.update({
    where: { id: Number(id) },
    data: {
      unitNumber: data.unitNumber,
      unitTypeId: Number(data.unitTypeId),
      baseCost: Number(data.baseCost),
      sellingPrice: Number(data.sellingPrice),
      status: data.status
    }
  });
};

exports.deleteUnit = async (id) => {
  return prisma.unit.delete({
    where: { id: Number(id) }
  });
};
