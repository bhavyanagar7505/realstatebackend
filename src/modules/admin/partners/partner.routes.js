const router = require("express").Router();

const requireAuth = require("../../../middlewares/auth.middleware");
const permit = require("../../../middlewares/permission.middleware");
const MODULES = require("../../../constants/permissions.constants");

const partnerController = require("./partner.controller");

const PARTNERS_MODULE =
  MODULES?.PARTNERS || MODULES?.default?.PARTNERS || "PARTNERS";

/**
 * All routes require authentication
 */
router.use(requireAuth);

/* =====================================================
   PARTNER CRUD
===================================================== */

// CREATE partner
router.post(
  "/",
  permit(PARTNERS_MODULE, "CREATE"),
  partnerController.createPartner
);

// GET all partners
router.get(
  "/",
  permit(PARTNERS_MODULE, "VIEW"),
  partnerController.getPartners
);

// GET partner by ID
router.get(
  "/:id",
  permit(PARTNERS_MODULE, "VIEW"),
  partnerController.getPartnerById
);

// UPDATE partner
router.put(
  "/:id",
  permit(PARTNERS_MODULE, "UPDATE"),
  partnerController.updatePartner
);

// UPDATE status
router.patch(
  "/:id/status",
  permit(PARTNERS_MODULE, "UPDATE"),
  partnerController.updatePartnerStatus
);

/* ================= PARTNER PROJECTS ================= */

// Assign partner to project
router.post(
  "/:id/projects",
  permit(PARTNERS_MODULE, "UPDATE"),
  partnerController.assignPartnerToProject
);

// Get partner projects
router.get(
  "/:id/projects",
  permit(PARTNERS_MODULE, "VIEW"),
  partnerController.getPartnerProjects
);


module.exports = router;
