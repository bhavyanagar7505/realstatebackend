const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/* ================= CREATE ================= */
exports.createVendor = async (adminId, data) => {
  const {
    name,
    phone,
    email,
    address,
    gstNumber,
    gstType
  } = data;

  return prisma.vendor.create({
    data: {
      adminId,
      name,
      phone,
      email,
      address,
      gstNumber,
      gstType
    }
  });
};

/* ================= LIST ================= */
exports.getVendors = async (adminId) => {
  return prisma.vendor.findMany({
    where: { adminId },
    orderBy: { createdAt: "desc" }
  });
};

/* ================= GET ONE ================= */
exports.getVendorById = async (adminId, id) => {
  return prisma.vendor.findFirst({
    where: { id, adminId }
  });
};

/* ================= UPDATE ================= */
exports.updateVendor = async (adminId, id, data) => {
  const vendor = await prisma.vendor.findFirst({
    where: { id, adminId }
  });

  if (!vendor) {
    throw new Error("Vendor not found");
  }

  return prisma.vendor.update({
    where: { id },
    data
  });
};
