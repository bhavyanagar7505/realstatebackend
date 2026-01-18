const prisma = require("../../../config/db.config");

module.exports = {
  findSuperAdminByEmail: async (email) => {
    return await prisma.superAdmin.findUnique({
      where: { email }
    });
  },

  findAdminByEmail: async (email) => {
    return await prisma.admin.findUnique({
      where: { email },
      include: {
        permissions: true  // ✅ CRITICAL - Must include permissions
      }
    });
  }
};