const router = require("express").Router();
const controller = require("./unit.controller");
const permission = require("../../../middlewares/permission.middleware");

router.get("/types", permission("UNITS", "VIEW"), controller.getUnitTypes);
router.post("/types", permission("UNITS", "CREATE"), controller.createUnitType);

router.get("/:projectId", permission("UNITS", "VIEW"), controller.getUnitsByProject);
router.post("/", permission("UNITS", "CREATE"), controller.createUnit);

router.put("/:id", permission("UNITS", "UPDATE"), controller.updateUnit);
router.delete("/:id", permission("UNITS", "DELETE"), controller.deleteUnit);

module.exports = router;
