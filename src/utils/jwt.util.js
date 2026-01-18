const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt.config");

module.exports = {
  signToken: (payload) => {
    return jwt.sign(payload, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn
    });
  },

  verifyToken: (token) => {
    return jwt.verify(token, jwtConfig.secret);
  }
};
