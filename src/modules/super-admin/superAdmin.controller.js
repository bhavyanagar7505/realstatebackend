const service = require("./superAdmin.service");

/* ================= PROFILE ================= */
exports.getProfile = async (req, res) => {
  const profile = await service.getProfile(req.user.id);
  res.json(profile);
};

/* ================= ADMINS ================= */
exports.createAdmin = async (req, res) => {
  const admin = await service.createAdmin(req.body);
  res.status(201).json(admin);
};

exports.updateAdmin = async (req, res) => {
  const admin = await service.updateAdmin(req.params.id, req.body);
  res.json({ message: "Admin updated", data: admin });
};

exports.deleteAdmin = async (req, res) => {
  await service.deleteAdmin(req.params.id);
  res.json({ message: "Admin deleted" });
};

exports.updateAdminStatus = async (req, res) => {
  const admin = await service.updateAdminStatus(
    req.params.id,
    req.body.status
  );
  res.json({ message: "Status updated", data: admin });
};

exports.getAdmins = async (req, res) => {
  const admins = await service.getAdmins();
  res.json({ success: true, data: admins });
};

exports.getAdminsPaginated = async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 10, 100);

  const result = await service.getAdminsPaginated(page, limit);
  res.json(result);
};

/* ================= PERMISSIONS ================= */
exports.assignPermissions = async (req, res) => {
  await service.assignPermissions(req.params.id, req.body.permissions);
  res.json({ message: "Permissions updated" });
};

/* ================= ROLES ================= */
exports.createRole = async (req, res) => {
  const role = await service.createRole(req.body);
  res.status(201).json(role);
};

exports.updateRole = async (req, res) => {
  const role = await service.updateRole(req.params.id, req.body);
  res.json(role);
};

exports.deleteRole = async (req, res) => {
  await service.deleteRole(req.params.id);
  res.json({ message: "Role deleted" });
};

exports.getRolesPaginated = async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 10, 100);

  const result = await service.getRolesPaginated(page, limit);
  res.json(result);
};

exports.getActiveRoles = async (req, res) => {
  const roles = await service.getActiveRoles();
  res.json({ success: true, data: roles });
};

/* ================= DASHBOARD ================= */
exports.getDashboardStats = async (req, res) => {
  const stats = await service.getDashboardStats();
  res.json({ success: true, data: stats });
};

/* ================= UPDATE PROFILE ================= */
exports.updateProfile = async (req, res) => {
  const profile = await service.updateProfile(req.user.id, req.body);
  res.json({ message: "Profile updated", data: profile });
};

/* ================= CHANGE PASSWORD ================= */
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  await service.changePassword(
    req.user.id,
    currentPassword,
    newPassword
  );

  res.json({ message: "Password updated successfully" });
};

exports.getAdminPermissions = async (req, res) => {
  const permissions = await service.getAdminPermissions(req.params.id);
  res.json(permissions);
};
