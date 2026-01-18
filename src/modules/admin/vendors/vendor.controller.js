const service = require("./vendor.service");

/* ================= CREATE ================= */
exports.createVendor = async (req, res, next) => {
  try {
    const vendor = await service.createVendor(
      req.user.id,
      req.body
    );
    res.status(201).json(vendor);
  } catch (err) {
    next(err);
  }
};

/* ================= LIST ================= */
exports.getVendors = async (req, res, next) => {
  try {
    const vendors = await service.getVendors(req.user.id);
    res.json(vendors);
  } catch (err) {
    next(err);
  }
};

/* ================= GET ONE ================= */
exports.getVendorById = async (req, res, next) => {
  try {
    const vendor = await service.getVendorById(
      req.user.id,
      Number(req.params.id)
    );

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.json(vendor);
  } catch (err) {
    next(err);
  }
};

/* ================= UPDATE ================= */
exports.updateVendor = async (req, res, next) => {
  try {
    const vendor = await service.updateVendor(
      req.user.id,
      Number(req.params.id),
      req.body
    );
    res.json(vendor);
  } catch (err) {
    next(err);
  }
};
