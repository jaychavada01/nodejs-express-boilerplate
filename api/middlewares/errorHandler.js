const { SERVER_ERROR_RESPONSE, SEND_RESPONSE } = require("../utils/response");
const HTTP_STATUS_CODE = require("../../config/constants/statusCodes");

/**
 * @name errorHandler
 * @param {Error} err - Error object
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {NextFunction} next - Express next function
 * @description Centralized error middleware returning standardized JSON responses with error codes
 */
module.exports = (err, req, res, _next) => {
  const status = err.statusCode || err.status || HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
  const message = err.code || "ERR500";
  const errorDetail =
    process.env.NODE_ENV === "development" ? err.message || err.toString() : "";

  console.error(`[Error] [${req.method} ${req.originalUrl}] Status: ${status} -`, err);

  if (status === HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR) {
    return SERVER_ERROR_RESPONSE(res, message, errorDetail);
  }

  return SEND_RESPONSE(res, status, message, "", errorDetail);
};
