const { UNAUTHORIZED_RESPONSE } = require("../utils/response");
const { USER_ROLES } = require("../../config/constants");

/**
 * @name isAdmin
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @description Requires authenticated user to have admin role
 */
module.exports = (req, res, next) => {
  if (!req.user || req.user.role !== USER_ROLES.ADMIN) {
    return UNAUTHORIZED_RESPONSE(res, "AUTH004", "User is not authorized as admin");
  }
  next();
};
