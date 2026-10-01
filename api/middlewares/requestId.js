const { UUIDV4: uuidv4 } = require("../../config/packages");

/**
 * @name requestId
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {NextFunction} next - Express next function
 * @description Injects or preserves a unique X-Request-Id UUID header for distributed request tracing
 */
const requestId = (req, res, next) => {
  /*
   * REQUEST CORRELATION ID GENERATION
   * Reuses incoming X-Request-Id if supplied by an API gateway or upstream proxy,
   * otherwise generates a unique UUIDv4.
   */
  const reqId = req.headers["x-request-id"] || uuidv4();
  req.id = reqId;
  res.setHeader("X-Request-Id", reqId);

  next();
};

module.exports = requestId;
