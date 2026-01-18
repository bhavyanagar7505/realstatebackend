const router = require("express").Router();
const auth = require("../../../middlewares/auth.middleware");
const controller = require("./bifurcation.controller");

router.use(auth);

router.post("/:projectId/generate", controller.generate);
router.get("/:projectId", controller.get);
router.post("/:projectId/lock", controller.lock);

module.exports = router;
