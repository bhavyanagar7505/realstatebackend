const service = require("./partner.service");

/* ================= CREATE PARTNER ================= */
const createPartner = async (req, res, next) => {
  try {
    const partner = await service.createPartner(
      req.body,
      req.user.id
    );
    res.status(201).json(partner);
  } catch (err) {
    next(err);
  }
};

/* ================= GET ALL PARTNERS ================= */
const getPartners = async (req, res, next) => {
  try {
    const partners = await service.getPartners(req.user.id);
    res.json(partners);
  } catch (err) {
    next(err);
  }
};

/* ================= GET PARTNER BY ID ================= */
const getPartnerById = async (req, res, next) => {
  try {
    const partner = await service.getPartnerById(
      req.params.id,
      req.user.id
    );

    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    res.json(partner);
  } catch (err) {
    next(err);
  }
};

/* ================= UPDATE PARTNER ================= */
const updatePartner = async (req, res, next) => {
  try {
    const partner = await service.updatePartner(
      req.params.id,
      req.user.id,
      req.body
    );
    res.json(partner);
  } catch (err) {
    next(err);
  }
};

/* ================= UPDATE STATUS ================= */
const updatePartnerStatus = async (req, res, next) => {
  try {
    const partner = await service.updatePartnerStatus(
      req.params.id,
      req.user.id,
      req.body.status
    );
    res.json(partner);
  } catch (err) {
    next(err);
  }
};

/* ================= ASSIGN PARTNER TO PROJECT ================= */
const assignPartnerToProject = async (req, res, next) => {
  try {
    const partnerId = Number(req.params.id);
    const { projectId, investmentAmount } = req.body;

    if (!projectId || !investmentAmount) {
      return res
        .status(400)
        .json({ message: "projectId and investmentAmount are required" });
    }

    const result = await service.assignPartnerToProject(
      partnerId,
      Number(projectId),
      Number(investmentAmount),
      req.user.id
    );

    res.json({
      message: "Partner assigned to project",
      result
    });
  } catch (err) {
    next(err);
  }
};


/* ================= GET PARTNER PROJECTS ================= */
const getPartnerProjects = async (req, res, next) => {
  try {
    const projects = await service.getPartnerProjects(
      req.params.id,
      req.user.id
    );
    res.json(projects);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createPartner,
  getPartners,
  getPartnerById,
  updatePartner,
  updatePartnerStatus,
  assignPartnerToProject,
  getPartnerProjects
};
