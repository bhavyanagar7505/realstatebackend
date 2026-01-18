const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/* ================= SETTLEMENT SUMMARY ================= */
exports.getSettlementSummary = async (adminId, projectId) => {
  const bifurcation = await prisma.bifurcation.findUnique({
    where: { projectId },
    include: {
      partners: {
        include: { partner: true }
      }
    }
  });

  // 🔒 STRICT RULE: bifurcation must be locked
  if (!bifurcation || !bifurcation.locked) {
    throw new Error("Bifurcation not locked");
  }

  const settlements = await prisma.settlement.findMany({
    where: { projectId }
  });

  return bifurcation.partners.map((p) => {
    const paid = settlements
      .filter((s) => s.partnerId === p.partnerId)
      .reduce((sum, s) => sum + Number(s.amount), 0);

    const payable = Number(p.shareAmount); // partner share
    const balance = payable - paid;

    let status = "PENDING";
    if (paid > 0 && balance > 0) status = "PARTIAL";
    if (balance === 0) status = "PAID";

    return {
      partnerId: p.partnerId,
      partnerName: p.partner?.name,
      payableAmount: payable,
      paidAmount: paid,
      balanceAmount: balance,
      status
    };
  });
};

/* ================= ADD SETTLEMENT ================= */
exports.addSettlement = async (
  adminId,
  projectId,
  partnerId,
  amount,
  notes
) => {
  const bifurcation = await prisma.bifurcation.findUnique({
    where: { projectId }
  });

  if (!bifurcation || !bifurcation.locked) {
    throw new Error("Bifurcation not locked");
  }

  const partnerShare = await prisma.bifurcationPartner.findFirst({
    where: { bifurcationId: bifurcation.id, partnerId }
  });

  if (!partnerShare) {
    throw new Error("Partner not part of bifurcation");
  }

  const totalPaid = await prisma.settlement.aggregate({
    where: { projectId, partnerId },
    _sum: { amount: true }
  });

  const alreadyPaid = Number(totalPaid._sum.amount || 0);
  const payable = Number(partnerShare.shareAmount);
  const nextPaidTotal = alreadyPaid + Number(amount);

  // ✅ Prevent over-payment
  if (nextPaidTotal > payable) {
    throw new Error("Settlement exceeds payable amount");
  }

  return prisma.settlement.create({
    data: {
      adminId,
      projectId,
      partnerId,
      amount: Number(amount),
      notes
    }
  });
};
