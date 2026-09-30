const jwt = require("jsonwebtoken");
const envConfig = require("../../config/envConfig");

/**
 * @name signToken
 * @param {Object} params - Object containing payload and optional expiresIn
 * @description Generates and signs a JSON Web Token
 * @returns {string} Signed JWT string
 */
const signToken = ({ payload, expiresIn = envConfig.JWT.EXPIRES_IN }) => {
  return jwt.sign(payload, envConfig.JWT.SECRET, { expiresIn });
};

/**
 * @name verifyToken
 * @param {Object} params - Object containing token string
 * @description Verifies and decodes a JSON Web Token
 * @returns {Object} Decoded payload
 */
const verifyToken = ({ token }) => {
  return jwt.verify(token, envConfig.JWT.SECRET);
};

module.exports = { signToken, verifyToken };
