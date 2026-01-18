const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/* ================= ADD INVESTMENT ================= */
exports.addInvestment = async (
  adminId,
  partnerId,
  projectId,
  amount,
  notes
) => {
  if (!amount || amount <= 0) {
    throw new Error("Invalid investment amount");
  }

  const project = await prisma.project.findFirst({
    where: { id: projectId, adminId }
  });
  if (!project) throw new Error("Project not found");

  await prisma.investment.create({
    data: {
      adminId,
      partnerId,
      projectId,
      amount,
      notes
    }
  });

  const total = await prisma.investment.aggregate({
    where: { partnerId, projectId },
    _sum: { amount: true }
  });

  const totalInvestment = total._sum.amount || 0;


  const ownershipPercent =
    (totalInvestment / project.totalValuation) * 100;


  await prisma.partnerProject.upsert({
    where: {
      partnerId_projectId: {
        partnerId,
        projectId
      }
    },
    create: {
      partnerId,
      projectId,
      investmentAmount: totalInvestment,
      ownershipPercent: Number(ownershipPercent.toFixed(2))
    },
    update: {
      investmentAmount: totalInvestment,
      ownershipPercent: Number(ownershipPercent.toFixed(2))
    }
  });

  return {
    totalInvestment,
    ownershipPercent: Number(ownershipPercent.toFixed(2))
  };
};

/* ================= GET INVESTMENTS ================= */
exports.getInvestmentsByProject = async (adminId, projectId) => {
  return prisma.investment.findMany({
    where: {
      projectId: Number(projectId),
      project: {
        is: {
          adminId: adminId   
        }
      }
    },
    include: {
      partner: {
        select: {
          id: true,
          name: true
        }
      },
      project: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};

/* ================= LOCK INVESTMENTS ================= */
exports.lockInvestments = async (adminId, projectId) => {
  await prisma.investment.updateMany({
    where: { adminId, projectId },
    data: { locked: true }
  });
};
