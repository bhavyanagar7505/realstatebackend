const router = require("express").Router();

const requireAuth = require("../../../middlewares/auth.middleware");
const permit = require("../../../middlewares/permission.middleware");

const MODULES = require("../../../constants/permissions.constants");

const PROJECTS_MODULE =
  MODULES?.PROJECTS || MODULES?.default?.PROJECTS || "PROJECTS";

const projectController = require("./project.controller");
const fieldController = require("./projectField.controller");

/**
 * All routes below require authentication
 */
router.use(requireAuth);


/**
 * All routes below require authentication
 */
router.use(requireAuth);

/* =====================================================
   PROJECT FIELDS (STATIC ROUTES – MUST COME FIRST)
===================================================== */

router.get(
  "/fields",
  permit(PROJECTS_MODULE, "VIEW"),
  fieldController.getFields
);

router.post(
  "/fields",
  permit(PROJECTS_MODULE, "CREATE"),
  fieldController.createField
);

/* =====================================================
   PROJECT CRUD
===================================================== */

router.get(
  "/",
  permit(PROJECTS_MODULE, "VIEW"),
  projectController.getProjects
);

router.post(
  "/",
  permit(PROJECTS_MODULE, "CREATE"),
  projectController.createProject
);

router.get(
  "/:id",
  permit(PROJECTS_MODULE, "VIEW"),
  projectController.getProject
);

router.put(
  "/:id",
  permit(PROJECTS_MODULE, "UPDATE"),
  projectController.updateProject
);

router.delete(
  "/:id",
  permit(PROJECTS_MODULE, "DELETE"),
  projectController.deleteProject
);

module.exports = router;
