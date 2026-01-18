const express = require("express");
const router = express.Router();

const requireAuth = require("../../middlewares/auth.middleware");
const rbac = require("../../middlewares/rbac.middleware");
const ROLES = require("../../constants/roles.constants");

const controller = require("./admin.controller");
const projectRoutes = require("./projects/project.routes");
const unitRoutes = require("./units/unit.routes");
const partnerRoutes = require("./partners/partner.routes");
const investmentRoutes = require("./investments/investment.routes");
const inventoryRoutes = require("./inventory/inventory.routes");
const vendorRoutes = require("./vendors/vendor.routes");
const billingRoutes = require("./billing/billing.routes");
const bifurcationRoutes = require("./bifurcation/bifurcation.routes");
const settlementRoutes = require("./settlements/settlement.routes");
const revenueRoutes = require("./revenue/revenue.routes");

/* ================= AUTH ================= */
router.use(requireAuth, rbac([ROLES.ADMIN]));

/* ================= BASIC ================= */
router.get("/profile", controller.getProfile);
router.get("/dashboard/stats", controller.getDashboardStats);

/* ================= PROJECTS ================= */
router.use("/projects", projectRoutes);

/* ================= UNITS ================= */
router.use("/units", unitRoutes);

/* ================= PARTNERS ================= */
router.use("/partners", partnerRoutes);

/* ================= INVESTMENTS ================= */
router.use("/investments", investmentRoutes);

/* ================= INVENTORY ================= */
router.use("/inventory", inventoryRoutes);

/* ================= VENDORS ================= */
router.use("/vendors", vendorRoutes);

/* ================= BILLING ================= */
router.use("/billing", billingRoutes);

/* ================= BIFURCATION ================= */
router.use("/bifurcation", bifurcationRoutes);

/* ================= SETTLEMENTS ================= */
router.use("/settlements", settlementRoutes);

/* ================= REVENUE ================= */
router.use("/revenue", revenueRoutes);
module.exports = router;
