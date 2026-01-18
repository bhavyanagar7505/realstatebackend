const service = require("./inventory.service");

/* ================= ITEMS ================= */
exports.createItem = async (req, res, next) => {
  try {
    const item = await service.createItem(req.user.id, req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

exports.getItems = async (req, res, next) => {
  try {
    const items = await service.getItems(req.user.id);
    res.json(items);
  } catch (err) {
    next(err);
  }
};

/* ================= USAGE ================= */
exports.addUsage = async (req, res, next) => {
  try {
    const { projectId, itemId, quantity } = req.body;

    const usage = await service.addUsage(
      req.user.id,
      Number(projectId),
      Number(itemId),
      Number(quantity)
    );

    res.status(201).json(usage);
  } catch (err) {
    next(err);
  }
};

exports.getProjectInventory = async (req, res, next) => {
  try {
    const list = await service.getProjectInventory(
      req.user.id,
      Number(req.params.projectId)
    );
    res.json(list);
  } catch (err) {
    next(err);
  }
};
