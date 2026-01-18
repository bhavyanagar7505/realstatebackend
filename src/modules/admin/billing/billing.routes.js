const router = require("express").Router();
const auth = require("../../../middlewares/auth.middleware");
const controller = require("./billing.controller");

router.use(auth);

/* CREATE BILL */
router.post("/", controller.createBill);

/* LIST BY PROJECT */
router.get("/project/:projectId", controller.getBillsByProject);

/* UPDATE STATUS */
router.patch("/:id/status", controller.updateBillStatus);

module.exports = router;
