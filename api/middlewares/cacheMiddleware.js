const { getCache, setCache } = require("../helpers/redisHelper");
const { CACHE_TTL_SECONDS } = require("../../config/constants");

/**
 * @name cacheMiddleware
 * @param {number} ttlSeconds - Time-to-live in seconds for cached response (defaults to 5 minutes)
 * @param {string} keyPrefix - Optional prefix for cache key scoping
 * @description Route-level middleware to cache successful GET JSON responses in Redis
 * @returns {Function} Express middleware
 */
const cacheMiddleware = (ttlSeconds = CACHE_TTL_SECONDS.FIVE_MINUTES, keyPrefix = "route_cache") => {
  return async (req, res, next) => {
    /*
     * CACHE ELIGIBILITY CHECK
     * Only cache idempotent GET requests.
     */
    if (req.method !== "GET") {
      return next();
    }

    const cacheKey = `${keyPrefix}:${req.originalUrl || req.url}`;

    try {
      const cachedData = await getCache(cacheKey);

      if (cachedData) {
        res.setHeader("X-Cache", "HIT");
        return res.json(cachedData);
      }

      res.setHeader("X-Cache", "MISS");

      /*
       * RESPONSE INTERCEPTION
       * Wraps res.json to capture response payload and populate cache on HTTP 200.
       */
      const originalJson = res.json.bind(res);

      res.json = (body) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // Fire-and-forget cache write so response is not blocked
          setCache(cacheKey, body, ttlSeconds).catch((err) => {
            console.error("⚠️ [CacheMiddleware] Error setting cache:", err.message);
          });
        }
        return originalJson(body);
      };

      next();
    } catch (error) {
      console.error("⚠️ [CacheMiddleware] Redis cache read failed:", error.message);
      next();
    }
  };
};

module.exports = cacheMiddleware;
