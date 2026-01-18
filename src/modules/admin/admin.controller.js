const adminService = require("./admin.service");

/* ================= PROFILE ================= */
exports.getProfile = async (req, res, next) => {
  try {
    const profile = await adminService.getProfile(req.user.id);
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

/* ================= DASHBOARD ================= */
exports.getDashboardStats = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats(req.user); 
    res.json(stats);
  } catch (error) {
    next(error);
  }
};


