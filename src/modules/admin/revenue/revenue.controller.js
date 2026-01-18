const service = require("./revenue.service");

/* ================= SELL UNIT ================= */
exports.sellUnit = async (req, res, next) => {
  try {
    // 🔍 optional debug (keep during development)
    console.log("SELL UNIT REQ BODY:", req.body);

    const sale = await service.sellUnit(req.body);

    res.status(201).json({
      message: "Unit sold successfully with booking payment",
      sale
    });
  } catch (e) {
    next(e);
  }
};
