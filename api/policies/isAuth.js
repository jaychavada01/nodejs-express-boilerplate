const { JWT: jwt } = require("../../config/packages");
const envConfig = require("../../config/envConfig");
const { UNAUTHORIZED_RESPONSE } = require("../utils/response");
const { isTokenBlacklisted } = require("../helpers/redisHelper");

/**
 * @name isAuth
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @description Verifies Bearer JWT and confirms token is not blacklisted
 */
module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers["x-auth"];

  if (!authHeader) {
    return UNAUTHORIZED_RESPONSE(res, "AUTH001", "Missing authorization header");
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : authHeader.trim();

  /*
   * TOKEN REVOCATION CHECK
   * Rejects immediately if token has been revoked / blacklisted in Redis.
   */
  const isRevoked = await isTokenBlacklisted(token);
  if (isRevoked) {
    return UNAUTHORIZED_RESPONSE(res, "AUTH002", "Token has been revoked");
  }

  try {
    const decoded = jwt.verify(token, envConfig.JWT.SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return UNAUTHORIZED_RESPONSE(res, "AUTH002", error.message);
  }
};

