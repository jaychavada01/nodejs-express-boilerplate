const jwt = require("jsonwebtoken");
const envConfig = require("../../config/envConfig");
const { UNAUTHORIZED_RESPONSE } = require("../utils/response");

/**
 * @name isAuth
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @description Verifies Bearer JWT from request authorization headers
 */
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers["x-auth"];

  if (!authHeader) {
    return UNAUTHORIZED_RESPONSE(res, "AUTH001", "Missing authorization header");
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : authHeader.trim();

  try {
    const decoded = jwt.verify(token, envConfig.JWT.SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return UNAUTHORIZED_RESPONSE(res, "AUTH002", error.message);
  }
};
