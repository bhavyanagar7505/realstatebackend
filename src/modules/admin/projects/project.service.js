const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/* ================= GET PROJECTS ================= */
exports.getProjects = async (adminId) => {
  return prisma.project.findMany({
    where: { adminId: Number(adminId) },
    orderBy: { createdAt: "desc" }
  });
};

/* ================= CREATE PROJECT ================= */
exports.createProject = async (adminId, data) => {
  const { fieldValues = [], ...projectData } = data;

  return prisma.project.create({
    data: {
      name: projectData.name,
      location: projectData.location,
      totalValuation: Number(projectData.totalValuation),
      landCost: Number(projectData.landCost),
      infrastructureCost: Number(projectData.infrastructureCost),
      startDate: new Date(projectData.startDate),
      expectedCompletion: Number(projectData.expectedCompletion),
      possessionDate: new Date(projectData.possessionDate),
      status: projectData.status || "PLANNING",
      adminId: Number(adminId), // ✅ FIXED

      fields: {
        create: fieldValues.map(f => ({
          fieldId: f.fieldId,
          value: String(f.value)
        }))
      }
    }
  });
};

/* ================= UPDATE PROJECT ================= */
exports.updateProject = async (id, adminId, data) => {
  const { fieldValues = [], ...projectData } = data;

  const project = await prisma.project.findFirst({
    where: {
      id: Number(id),
      adminId: Number(adminId)
    }
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const updated = await prisma.project.update({
    where: { id: Number(id) },
    data: {
      name: projectData.name,
      location: projectData.location,
      totalValuation: Number(projectData.totalValuation),
      landCost: Number(projectData.landCost),
      infrastructureCost: Number(projectData.infrastructureCost),
      startDate: new Date(projectData.startDate),
      expectedCompletion: Number(projectData.expectedCompletion),
      possessionDate: new Date(projectData.possessionDate),
      status: projectData.status || project.status
    }
  });

  await prisma.projectFieldValue.deleteMany({
    where: { projectId: Number(id) }
  });

  if (fieldValues.length) {
    await prisma.projectFieldValue.createMany({
      data: fieldValues.map(f => ({
        projectId: Number(id),
        fieldId: f.fieldId,
        value: String(f.value)
      }))
    });
  }

  return updated;
};

/* ================= DELETE PROJECT ================= */
exports.deleteProject = async (id, adminId) => {
  const project = await prisma.project.findFirst({
    where: {
      id: Number(id),
      adminId: Number(adminId)
    }
  });

  if (!project) {
    throw new Error("Project not found");
  }

  return prisma.project.delete({
    where: { id: Number(id) }
  });
};

/* ================= PAGINATION ================= */
exports.getProjectsPaginated = async (user, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const where =
    user.role === "SUPER_ADMIN"
      ? {}
      : { adminId: Number(user.id) };

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" }
    }),
    prisma.project.count({ where })
  ]);

  return {
    data: projects,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

/* ================= GET SINGLE ================= */
exports.getProjectById = async (projectId, adminId) => {
  return prisma.project.findFirst({
    where: {
      id: Number(projectId),
      adminId: Number(adminId)
    },
    include: {
      fields: {
        include: { field: true }
      }
    }
  });
};
