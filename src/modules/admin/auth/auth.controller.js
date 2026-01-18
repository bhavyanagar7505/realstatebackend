const authService = require("./auth.service");

module.exports = {
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const data = await authService.login({ email, password });

      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }
};
