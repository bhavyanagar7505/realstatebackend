const service = require("./billing.service");

/* ================= CREATE ================= */
exports.createBill = async (req, res, next) => {
  try {
    const {
      projectId,
      vendorId,
      baseAmount,
      gstAmount,
      billNumber,
      notes
    } = req.body;

    const bill = await service.createBill(
      req.user.id,
      Number(projectId),
      Number(vendorId),
      Number(baseAmount),
      Number(gstAmount || 0),
      billNumber,
      notes
    );

    res.status(201).json(bill);
  } catch (err) {
    next(err);
  }
};

/* ================= LIST ================= */
exports.getBillsByProject = async (req, res, next) => {
  try {
    const bills = await service.getBillsByProject(
      req.user.id,
      Number(req.params.projectId)
    );
    res.json(bills);
  } catch (err) {
    next(err);
  }
};

/* ================= UPDATE STATUS ================= */
exports.updateBillStatus = async (req, res, next) => {
  try {
    const bill = await service.updateBillStatus(
      req.user.id,
      Number(req.params.id),
      req.body.status
    );
    res.json(bill);
  } catch (err) {
    next(err);
  }
};
