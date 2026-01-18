const authRepo = require("./auth.repository");
const bcryptUtil = require("../../../utils/bcrypt.util");
const jwtUtil = require("../../../utils/jwt.util");
const ROLES = require("../../../constants/roles.constants");

module.exports = {
  login: async ({ email, password }) => {
    /* ---------- TRY SUPER ADMIN ---------- */
    const superAdmin = await authRepo.findSuperAdminByEmail(email);

    if (superAdmin) {
      const isValid = await bcryptUtil.comparePassword(
        password,
        superAdmin.password
      );

      if (!isValid) {
        throw new Error("Invalid credentials");
      }

      const token = jwtUtil.signToken({
        id: superAdmin.id,
        role: ROLES.SUPER_ADMIN,
        name: superAdmin.name
      });

      return { token, role: ROLES.SUPER_ADMIN };
    }

    /* ---------- TRY ADMIN ---------- */
    const admin = await authRepo.findAdminByEmail(email);

    if (!admin) {
      throw new Error("Invalid credentials");
    }

    if (admin.status !== "ACTIVE") {
      throw new Error("Admin is inactive");
    }

    const isValid = await bcryptUtil.comparePassword(
      password,
      admin.password
    );

    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    // ✅ Process permissions into array format
    const permissions = (admin.permissions || []).flatMap((row) => {
      const module = row.module?.toUpperCase();
      if (!module) return [];

      const perms = [];
      if (row.canView) perms.push(`${module}:VIEW`);
      if (row.canCreate) perms.push(`${module}:CREATE`);
      if (row.canUpdate) perms.push(`${module}:UPDATE`);
      if (row.canDelete) perms.push(`${module}:DELETE`);
      return perms;
    });

    const token = jwtUtil.signToken({
      id: admin.id,
      role: ROLES.ADMIN,
      name: admin.name,
      permissions: permissions  
    });

    return { token, role: ROLES.ADMIN };
  }
};