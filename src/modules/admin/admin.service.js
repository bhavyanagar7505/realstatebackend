const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/* =========================
   ADMIN PROFILE
========================= */
exports.getProfile = async (adminId) => {
  return prisma.admin.findUnique({
    where: { id: adminId },
    select: {
      id: true,
      name: true,
      email: true
    }
  });
};

/* =========================
   ADMIN DASHBOARD STATS
========================= */
exports.getDashboardStats = async (user) => {
  const where =
    user.role === "SUPER_ADMIN"
      ? {}
      : { adminId: user.id };

  const totalProjects = await prisma.project.count({ where });

  return { totalProjects };
};

