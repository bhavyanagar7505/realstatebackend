const router = require("express").Router();
const auth = require("../../../middlewares/auth.middleware");
const controller = require("./inventory.controller");

router.use(auth);

/* ITEMS */
router.post("/items", controller.createItem);
router.get("/items", controller.getItems);

/* USAGE */
router.post("/usage", controller.addUsage);
router.get("/project/:projectId", controller.getProjectInventory);

module.exports = router;
