const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/* ================= GENERATE ================= */
exports.generateBifurcation = async (adminId, projectId) => {
  const existing = await prisma.bifurcation.findUnique({
    where: { projectId }
  });

  if (existing) {
    throw new Error("Bifurcation already generated");
  }

  const investments = await prisma.partnerProject.findMany({
    where: { projectId }
  });

  if (!investments.length) {
    throw new Error("No investments found");
  }

  const bills = await prisma.bill.findMany({
    where: { projectId }
  });

  if (!bills.length) {
    throw new Error("No costs recorded yet");
  }

  /* ✅ FIXED REVENUE CALCULATION */
  const payments = await prisma.payment.findMany({
    where: {
      sale: {
        projectId: Number(projectId)
      }
    }
  });

  const revenue = payments.reduce(
    (sum, p) => sum + Number(p.amount),
    0
  );

  console.log("BIFURCATION REVENUE:", revenue); // debug once

  if (revenue <= 0) {
    throw new Error("Bifurcation can be generated only after revenue is recorded");
  }

  const totalInvestment = investments.reduce(
    (sum, i) => sum + Number(i.investmentAmount),
    0
  );

  const totalCost = bills.reduce(
    (sum, b) => sum + Number(b.totalAmount),
    0
  );

  const profitOrLoss = revenue - totalCost;

  const bifurcation = await prisma.bifurcation.create({
    data: {
      adminId,
      projectId,
      totalInvestment,
      totalCost,
      totalRevenue: revenue,
      profitOrLoss
    }
  });

  for (const inv of investments) {
    const share =
      (Number(inv.ownershipPercent) / 100) * profitOrLoss;

    await prisma.bifurcationPartner.create({
      data: {
        bifurcationId: bifurcation.id,
        partnerId: inv.partnerId,
        investmentAmount: Number(inv.investmentAmount),
        ownershipPercent: Number(inv.ownershipPercent),
        shareAmount: Number(share.toFixed(2))
      }
    });
  }

  return bifurcation;
};

/* ================= GET ================= */
exports.getBifurcation = async (projectId) => {
  return prisma.bifurcation.findUnique({
    where: { projectId },
    include: {
      partners: {
        include: { partner: true }
      }
    }
  });
};

/* ================= LOCK ================= */
exports.lockBifurcation = async (projectId) => {
  const bif = await prisma.bifurcation.findUnique({
    where: { projectId }
  });

  if (!bif) {
    throw new Error("Bifurcation not found");
  }

  if (Number(bif.totalRevenue) <= 0) {
    throw new Error("Cannot lock bifurcation without revenue");
  }

  return prisma.bifurcation.update({
    where: { projectId },
    data: { locked: true }
  });
};
