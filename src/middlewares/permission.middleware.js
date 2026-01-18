/**
 * Authorization middleware (RBAC)
 * Permission format: MODULE:ACTION
 * Example: PROJECTS:VIEW
 */
module.exports = function permit(module, action) {
  const MODULE = String(module).toUpperCase();
  const ACTION = String(action).toUpperCase();

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    /* ✅ SUPER ADMIN → FULL ACCESS */
    if (req.user.role === "SUPER_ADMIN") {
      return next();
    }

    const permissions = req.user.permissions;

    if (!Array.isArray(permissions)) {
      return res.status(403).json({ message: "Permission denied" });
    }

    /**
     * 🔥 AUTO VIEW RULE
     * If user has ANY permission for the module,
     * allow VIEW automatically
     */
    if (ACTION === "VIEW") {
      const hasAnyModulePermission = permissions.some(
        (p) => p.startsWith(`${MODULE}:`)
      );

      if (hasAnyModulePermission) {
        return next();
      }
    }

    /* 🔒 STRICT CHECK FOR OTHER ACTIONS */
    const requiredPermission = `${MODULE}:${ACTION}`;

    if (!permissions.includes(requiredPermission)) {
      return res.status(403).json({ message: "Permission denied" });
    }

    return next();
  };
};
