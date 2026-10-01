const { RATE_LIMIT: rateLimit } = require("../../config/packages");
const envConfig = require("../../config/envConfig");
const { BAD_REQUEST_RESPONSE } = require("../utils/response");

/*
 * RATE LIMITER MIDDLEWARE CONFIGURATION
 * Protects APIs against brute-force and volumetric spamming.
 */
const createRateLimiter = () => {
  if (envConfig.RATELIMIT.ENABLE_RATE_LIMIT !== "Y") {
    return (req, res, next) => next();
  }

  return rateLimit({
    windowMs: envConfig.RATELIMIT.RATE_LIMIT_WINDOWS,
    max: envConfig.RATELIMIT.RATE_LIMIT_MAX,
    handler: (req, res) => {
      BAD_REQUEST_RESPONSE(res, "ERR429", envConfig.RATELIMIT.RATE_LIMIT_ERROR_MESSAGE);
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

module.exports = createRateLimiter();
