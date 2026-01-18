const service = require("./bifurcation.service");

exports.generate = async (req, res, next) => {
  try {
    const data = await service.generateBifurcation(
      req.user.id,
      Number(req.params.projectId)
    );
    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
};

exports.get = async (req, res, next) => {
  try {
    const data = await service.getBifurcation(
      Number(req.params.projectId)
    );
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.lock = async (req, res, next) => {
  try {
    await service.lockBifurcation(
      Number(req.params.projectId)
    );
    res.json({ message: "Bifurcation locked" });
  } catch (e) {
    next(e);
  }
};
