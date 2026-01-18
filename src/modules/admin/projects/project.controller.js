const service = require("./project.service");

/**
 * Get projects (paginated)
 * SUPER_ADMIN -> all projects
 * ADMIN -> own projects
 */
exports.getProjects = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);

    const result = await service.getProjectsPaginated(
      req.user,
      page,
      limit
    );

    // IMPORTANT: do NOT wrap again
    res.json(result);
  } catch (e) {
    next(e);
  }
};

/**
 * Get single project
 */
exports.getProject = async (req, res, next) => {
  try {
    const project = await service.getProjectById(
      req.user,
      req.params.id
    );
    res.json(project);
  } catch (e) {
    next(e);
  }
};

/**
 * Create project
 */
exports.createProject = async (req, res, next) => {
  try {
    const project = await service.createProject(
      req.user.id,   
      req.body
    );
    res.status(201).json(project);
  } catch (e) {
    next(e);
  }
};


/**
 * Update project
 */
exports.updateProject = async (req, res, next) => {
  try {
    const project = await service.updateProject(
      req.user,
      req.params.id,
      req.body
    );
    res.json(project);
  } catch (e) {
    next(e);
  }
};

/**
 * Delete project
 */
exports.deleteProject = async (req, res, next) => {
  try {
    await service.deleteProject(
      req.user,
      req.params.id
    );
    res.json({ message: "Project deleted successfully" });
  } catch (e) {
    next(e);
  }
};
