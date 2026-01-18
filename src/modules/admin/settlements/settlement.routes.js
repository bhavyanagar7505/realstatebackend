const router = require("express").Router();
const auth = require('../../../middlewares/auth.middleware');

const controller = require("./settlement.controller");

router.use(auth);

router.get("/:projectId", controller.getSummary);
router.post("/:projectId", controller.addSettlement);

module.exports = router;
