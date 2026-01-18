const express = require("express");
const router = express.Router();

/* ================= AUTH ================= */
const authRoutes = require("../modules/admin/auth/auth.routes");

/* ================= SUPER ADMIN ================= */
const superAdminRoutes = require("../modules/super-admin/superAdmin.routes");

/* ================= ADMIN ================= */
const adminRoutes = require("../modules/admin/admin.routes");

/* ---------- ROUTES ---------- */
router.use("/auth", authRoutes);
router.use("/super-admin", superAdminRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
