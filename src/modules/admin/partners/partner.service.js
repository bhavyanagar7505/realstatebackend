const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/* ================= CREATE PARTNER ================= */
exports.createPartner = async (data, adminId) => {
  const {
    name,
    email,
    phone,
    address,
    businessName,
    businessType,
    projectId,
    investmentAmount
  } = data;

  return prisma.partner.create({
    data: {
      name,
      email,
      phone,
      address,
      businessName,
      businessType,
      adminId,
      ...(projectId && {
        projects: {
          create: {
            projectId: Number(projectId),
            investmentAmount: Number(investmentAmount) || 0,
            ownershipPercent: 0
          }
        }
      })
    }
  });
};

/* ================= GET ALL PARTNERS ================= */
exports.getPartners = async (adminId) => {
  return prisma.partner.findMany({
    where: { adminId },
    include: {
      projects: {
        include: {
          project: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};

/* ================= GET PARTNER BY ID ================= */
exports.getPartnerById = async (id, adminId) => {
  return prisma.partner.findFirst({
    where: {
      id: Number(id),
      adminId
    },
    include: {
      projects: {
        include: {
          project: true
        }
      }
    }
  });
};

/* ================= UPDATE PARTNER ================= */
exports.updatePartner = async (id, adminId, data) => {
  const partner = await prisma.partner.findFirst({
    where: {
      id: Number(id),
      adminId
    }
  });

  if (!partner) {
    throw new Error("Partner not found");
  }

  return prisma.partner.update({
    where: { id: Number(id) },
    data
  });
};

/* ================= ACTIVATE / DEACTIVATE ================= */
exports.updatePartnerStatus = async (id, adminId, status) => {
  const partner = await prisma.partner.findFirst({
    where: {
      id: Number(id),
      adminId
    }
  });

  if (!partner) {
    throw new Error("Partner not found");
  }

  return prisma.partner.update({
    where: { id: Number(id) },
    data: { status }
  });
};

/* ================= ASSIGN PARTNER TO PROJECT ================= */
exports.assignPartnerToProject = async (
  partnerId,
  projectId,
  investmentAmount,
  adminId
) => {
  const partner = await prisma.partner.findFirst({
    where: { id: partnerId, adminId }
  });
  if (!partner) throw new Error("Partner not found");

  const project = await prisma.project.findFirst({
    where: { id: projectId, adminId }
  });
  if (!project) throw new Error("Project not found");

  if (!project.totalValuation || project.totalValuation <= 0) {
    throw new Error("Project valuation not set");
  }

  const amount = Number(investmentAmount);
  if (!amount || isNaN(amount) || amount <= 0) {
    throw new Error("Invalid investment amount");
  }

  const ownershipPercent =
    (amount / project.totalValuation) * 100;

  return prisma.partnerProject.upsert({
    where: {
      partnerId_projectId: {
        partnerId,
        projectId
      }
    },
    create: {
      partnerId,
      projectId,
      investmentAmount: amount,
      ownershipPercent: Number(ownershipPercent.toFixed(2))
    },
    update: {
      investmentAmount: amount,
      ownershipPercent: Number(ownershipPercent.toFixed(2))
    }
  });
};



/* ================= GET PARTNER PROJECTS ================= */
exports.getPartnerProjects = async (partnerId, adminId) => {
  const partner = await prisma.partner.findFirst({
    where: {
      id: Number(partnerId),
      adminId
    }
  });

  if (!partner) {
    throw new Error("Partner not found");
  }

  return prisma.partnerProject.findMany({
    where: { partnerId: Number(partnerId) },
    include: {
      project: true
    }
  });
};
