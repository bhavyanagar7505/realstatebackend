const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcryptUtil = require("../../utils/bcrypt.util");

/* ================= PROFILE ================= */
exports.getProfile = (id) =>
  prisma.superAdmin.findUnique({
    where: { id: Number(id) },
    select: { id: true, name: true, email: true }
  });

/* ================= ADMINS ================= */
exports.createAdmin = async (data) => {
  const hashedPassword = await bcryptUtil.hashPassword(data.password);

  return prisma.admin.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      phone: data.phone,
      profession: data.profession,
      address: data.address,
      city: data.city,
      state: data.state,
      country: data.country,
      zipCode: data.zipCode
    }
  });
};

exports.updateAdmin = async (id, data) => {
  const {
    name,
    phone,
    profession,
    address,
    city,
    state,
    country,
    zipCode
  } = data;

  return prisma.admin.update({
    where: { id: Number(id) },
    data: {
      name,
      phone,
      profession,
      address,
      city,
      state,
      country,
      zipCode
    }
  });
};

/* ================= DELETE ADMIN (SOFT DELETE) ================= */
exports.deleteAdmin = async (id) =>
  prisma.admin.update({
    where: { id: Number(id) },
    data: { status: "DELETED" }
  });

exports.updateAdminStatus = (id, status) =>
  prisma.admin.update({
    where: { id: Number(id) },
    data: { status }
  });

/* ================= GET ADMINS ================= */
exports.getAdmins = () =>
  prisma.admin.findMany({
    where: { status: { not: "DELETED" } },
    take: 4,
    orderBy: { createdAt: "desc" }
  });

exports.getAdminsPaginated = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [admins, total] = await Promise.all([
    prisma.admin.findMany({
      where: { status: { not: "DELETED" } },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" }
    }),
    prisma.admin.count({
      where: { status: { not: "DELETED" } }
    })
  ]);

  return {
    data: admins,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

/* ================= PERMISSIONS ================= */
exports.assignPermissions = async (adminId, permissions) => {
  await prisma.adminPermission.deleteMany({
    where: { adminId: Number(adminId) }
  });

  return prisma.adminPermission.createMany({
    data: permissions.map((p) => ({
      adminId: Number(adminId),
      ...p
    }))
  });
};

/* ================= ROLES ================= */
exports.createRole = (data) =>
  prisma.role.create({
    data: {
      name: data.name,
      description: data.description
    }
  });

exports.updateRole = (id, data) =>
  prisma.role.update({
    where: { id: Number(id) },
    data
  });

exports.deleteRole = (id) =>
  prisma.role.delete({
    where: { id: Number(id) }
  });

exports.getRolesPaginated = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [roles, total] = await Promise.all([
    prisma.role.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" }
    }),
    prisma.role.count()
  ]);

  return {
    data: roles,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

exports.getActiveRoles = () =>
  prisma.role.findMany({
    take: 4,
    select: { id: true, name: true },
    orderBy: { createdAt: "asc" }
  });

/* ================= DASHBOARD ================= */
exports.getDashboardStats = async () => {
  const totalAdmins = await prisma.admin.count({
    where: { status: { not: "DELETED" } }
  });

  const activeAdmins = await prisma.admin.count({
    where: { status: "ACTIVE" }
  });

  const inactiveAdmins = await prisma.admin.count({
    where: { status: { in: ["INACTIVE", "BLOCKED"] } }
  });

  const totalRoles = await prisma.role.count();

  return {
    totalAdmins,
    activeAdmins,
    inactiveAdmins,
    totalRoles
  };
};

/* ================= UPDATE PROFILE ================= */
exports.updateProfile = async (id, data) =>
  prisma.superAdmin.update({
    where: { id: Number(id) },
    data: {
      name: data.name,
      email: data.email
    }
  });

/* ================= ADMIN PERMISSIONS ================= */
exports.getAdminPermissions = (adminId) =>
  prisma.adminPermission.findMany({
    where: { adminId: Number(adminId) }
  });
