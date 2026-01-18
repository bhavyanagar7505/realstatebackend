const router = require("express").Router();
const auth = require("../../../middlewares/auth.middleware");
const controller = require("./vendor.controller");

router.use(auth);

router.post("/", controller.createVendor);
router.get("/", controller.getVendors);
router.get("/:id", controller.getVendorById);
router.put("/:id", controller.updateVendor);

module.exports = router;
