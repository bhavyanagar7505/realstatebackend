const express = require("express");
const router = express.Router();

const {
  requireAuth
} = require("../../middlewares/auth.middleware");

const rbac = require("../../middlewares/rbac.middleware");
const ROLES = require("../../constants/roles.constants");

const controller = require("./superAdmin.controller");

/* ================= MIDDLEWARE ================= */
router.use(requireAuth, rbac([ROLES.SUPER_ADMIN]));

/* ================= PROFILE ================= */
router.get("/profile", controller.getProfile);
router.put("/profile", controller.updateProfile);
router.put("/profile/password", controller.changePassword);

/* ================= ADMINS ================= */
router.post("/admins", controller.createAdmin);
router.put("/admins/:id", controller.updateAdmin);
router.delete("/admins/:id", controller.deleteAdmin);
router.patch("/admins/:id/status", controller.updateAdminStatus);
router.get("/admins", controller.getAdmins);
router.get("/admins/all", controller.getAdminsPaginated);

/* ================= PERMISSIONS ================= */
router.post("/admins/:id/permissions", controller.assignPermissions);
router.get("/admins/:id/permissions", controller.getAdminPermissions);

/* ================= ROLES ================= */
router.post("/roles", controller.createRole);
router.put("/roles/:id", controller.updateRole);
router.delete("/roles/:id", controller.deleteRole);
router.get("/roles/active", controller.getActiveRoles);
router.get("/roles/all", controller.getRolesPaginated);

/* ================= DASHBOARD ================= */
router.get("/dashboard/stats", controller.getDashboardStats);

module.exports = router;
