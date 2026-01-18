const service = require("./unit.service");

/* ================= UNIT TYPES ================= */

exports.getUnitTypes = async (req, res, next) => {
  try {
    const types = await service.getUnitTypes(req.user.id);
    res.json(types);
  } catch (e) {
    next(e);
  }
};

exports.createUnitType = async (req, res, next) => {
  try {
    const { name } = req.body;
    const type = await service.createUnitType(req.user.id, name);
    res.status(201).json(type);
  } catch (e) {
    next(e);
  }
};

/* ================= UNITS ================= */

exports.getUnitsByProject = async (req, res, next) => {
  try {
    const projectId = Number(req.params.projectId);
    const units = await service.getUnitsByProject(projectId);
    res.json(units);
  } catch (e) {
    next(e);
  }
};

exports.createUnit = async (req, res, next) => {
  try {
    const unit = await service.createUnit(req.body);
    res.status(201).json(unit);
  } catch (e) {
    next(e);
  }
};

exports.updateUnit = async (req, res, next) => {
  try {
    const unit = await service.updateUnit(req.params.id, req.body);
    res.json(unit);
  } catch (e) {
    next(e);
  }
};

exports.deleteUnit = async (req, res, next) => {
  try {
    await service.deleteUnit(req.params.id);
    res.json({ message: "Unit deleted" });
  } catch (e) {
    next(e);
  }
};
