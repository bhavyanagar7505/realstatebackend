const service = require("./investment.service");

/* ================= ADD ================= */
exports.addInvestment = async (req, res, next) => {
  try {
    const { partnerId, projectId, amount, notes } = req.body;

    const result = await service.addInvestment(
      req.user.id,
      Number(partnerId),
      Number(projectId),
      Number(amount),
      notes
    );

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

/* ================= LIST ================= */
exports.getInvestmentsByProject = async (req, res, next) => {
  try {
    console.log("INVESTMENTS API HIT");
    console.log("ADMIN ID:", req.user.id);
    console.log("PROJECT ID PARAM:", req.params.projectId);

    const list = await service.getInvestmentsByProject(
      req.user.id,
      Number(req.params.projectId)
    );

    console.log("RESULT COUNT:", list.length);
    res.json(list);
  } catch (err) {
    next(err);
  }
};


/* ================= LOCK ================= */
exports.lockInvestments = async (req, res, next) => {
  try {
    await service.lockInvestments(
      req.user.id,
      Number(req.params.projectId)
    );
    res.json({ message: "Investments locked successfully" });
  } catch (err) {
    next(err);
  }
};
