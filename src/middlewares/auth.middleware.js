const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

module.exports = async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      role: decoded.role?.toUpperCase(),
      permissions: []
    };

    // SUPER ADMIN → full access
    if (req.user.role === "SUPER_ADMIN") {
      return next();
    }

    // ADMIN → load permissions
    if (req.user.role === "ADMIN") {
      const rows = await prisma.adminPermission.findMany({
        where: { adminId: decoded.id }
      });

      const permissionSet = new Set();

      rows.forEach((row) => {
        const module = row.module.toUpperCase();

        if (
          row.canCreate ||
          row.canUpdate ||
          row.canDelete ||
          row.canView
        ) {
          permissionSet.add(`${module}:VIEW`);
        }
        if (row.canCreate) permissionSet.add(`${module}:CREATE`);
        if (row.canUpdate) permissionSet.add(`${module}:UPDATE`);
        if (row.canDelete) permissionSet.add(`${module}:DELETE`);
      });

      req.user.permissions = Array.from(permissionSet);
    }

    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

