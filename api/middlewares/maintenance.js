const envConfig = require("../../config/envConfig");
const { SEND_RESPONSE } = require("../utils/response");
const { HTTP_STATUS_CODE } = require("../../config/constants");

/**
 * @name maintenanceMiddleware
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {NextFunction} next - Express next function
 * @description Gates API traffic when MAINTENANCE_MODE=Y, with healthcheck, IP, and secret bypass support
 */
const maintenanceMiddleware = (req, res, next) => {
  if (envConfig.MAINTENANCE.ENABLE !== "Y") {
    return next();
  }

  /*
   * HEALTHCHECK & BYPASS ROUTE ALLOWLIST
   * Always allow healthcheck endpoint to facilitate load balancer status checks.
   */
  if (req.path === "/health" || req.path === "/api/health") {
    return next();
  }

  /*
   * BYPASS TOKEN VERIFICATION
   * Allows developer / admin requests containing secret bypass header.
   */
  const bypassHeader = req.headers["x-maintenance-bypass"];
  if (
    envConfig.MAINTENANCE.BYPASS_SECRET &&
    bypassHeader === envConfig.MAINTENANCE.BYPASS_SECRET
  ) {
    return next();
  }

  /*
   * IP ALLOWLIST VERIFICATION
   * Allows requests originating from whitelisted IP addresses.
   */
  const clientIp = req.ip || req.connection.remoteAddress || "";
  if (
    envConfig.MAINTENANCE.ALLOWED_IPS.length > 0 &&
    envConfig.MAINTENANCE.ALLOWED_IPS.includes(clientIp)
  ) {
    return next();
  }

  return SEND_RESPONSE(
    res,
    HTTP_STATUS_CODE.SERVICE_UNAVAILABLE,
    "MAINT001",
    "",
    "ERR503"
  );
};

module.exports = maintenanceMiddleware;
