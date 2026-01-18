const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/* ================= CREATE BILL ================= */
exports.createBill = async (
  adminId,
  projectId,
  vendorId,
  baseAmount,
  gstAmount = 0,
  billNumber,
  notes
) => {
  if (!baseAmount || baseAmount <= 0) {
    throw new Error("Invalid bill amount");
  }

  const project = await prisma.project.findFirst({
    where: { id: projectId, adminId }
  });
  if (!project) throw new Error("Project not found");

  const vendor = await prisma.vendor.findFirst({
    where: { id: vendorId, adminId }
  });
  if (!vendor) throw new Error("Vendor not found");

  const totalAmount = Number(baseAmount) + Number(gstAmount || 0);

  const bill = await prisma.bill.create({
    data: {
      adminId,
      projectId,
      vendorId,
      billNumber,
      baseAmount,
      gstAmount: gstAmount || 0,
      totalAmount,
      notes
    }
  });

  return bill;
};

/* ================= LIST BY PROJECT ================= */
exports.getBillsByProject = async (adminId, projectId) => {
  return prisma.bill.findMany({
    where: { adminId, projectId },
    include: {
      vendor: { select: { id: true, name: true } },
      project: { select: { id: true, name: true } }
    },
    orderBy: { createdAt: "desc" }
  });
};

/* ================= UPDATE STATUS ================= */
exports.updateBillStatus = async (adminId, billId, status) => {
  const bill = await prisma.bill.findFirst({
    where: { id: billId, adminId }
  });

  if (!bill) throw new Error("Bill not found");

  return prisma.bill.update({
    where: { id: billId },
    data: { status }
  });
};
