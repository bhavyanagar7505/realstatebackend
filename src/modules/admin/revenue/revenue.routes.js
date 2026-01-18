const router = require("express").Router();
const controller = require("./revenue.controller");
const auth = require('../../../middlewares/auth.middleware');

router.post("/sell-unit", auth, controller.sellUnit);

module.exports = router;
