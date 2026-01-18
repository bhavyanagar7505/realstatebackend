const service = require("./projectField.service");

/**
 * Get project fields
 * Permission handled by route middleware (permit)
 */
exports.getFields = async (req, res, next) => {
  try {
    const fields = await service.getFields(req.user.id);
    res.json(fields);
  } catch (e) {
    next(e);
  }
};

/**
 * Create project field
 * Permission handled by route middleware (permit)
 */
exports.createField = async (req, res, next) => {
  try {
    const field = await service.createField(req.user.id, req.body);
    res.status(201).json(field);
  } catch (e) {
    next(e);
  }
};
