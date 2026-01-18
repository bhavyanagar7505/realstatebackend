const router = require("express").Router();
const requireAuth = require("../../../middlewares/auth.middleware");

const controller = require("./investment.controller");

router.use(requireAuth);

router.post("/", controller.addInvestment);
router.get("/project/:projectId", controller.getInvestmentsByProject);
router.post("/project/:projectId/lock", controller.lockInvestments);

module.exports = router;
