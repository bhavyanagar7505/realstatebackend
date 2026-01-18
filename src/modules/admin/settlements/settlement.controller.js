const service = require("./settlement.service");

/* ================= GET SUMMARY ================= */
exports.getSummary = async (req, res, next) => {
  try {
    const data = await service.getSettlementSummary(
      req.user.id,
      Number(req.params.projectId)
    );
    res.json(data);
  } catch (e) {
    next(e);
  }
};

/* ================= ADD SETTLEMENT ================= */
exports.addSettlement = async (req, res, next) => {
  try {
    const { partnerId, amount, notes } = req.body;

    const data = await service.addSettlement(
      req.user.id,
      Number(req.params.projectId),
      Number(partnerId),
      Number(amount),
      notes
    );

    res.status(201).json({
      message: "Settlement recorded",
      data
    });
  } catch (e) {
    next(e);
  }
};
