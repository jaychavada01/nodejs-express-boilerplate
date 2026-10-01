const { REDIS: Redis } = require("./packages");
const envConfig = require("./envConfig");

let redisClient = null;
let isConnected = false;

/**
 * @name initRedis
 * @description Initializes Redis client connection when enabled via env flag
 * @returns {Object|null} Redis client instance or null
 */
const initRedis = () => {
  if (envConfig.REDIS.ENABLE !== "Y") {
    console.log("ℹ️ [Redis] Disabled via configuration (ENABLE_REDIS!=Y). Caching running in mock mode.");
    return null;
  }

  try {
    /*
     * REDIS CLIENT CONFIGURATION
     * Connects via REDIS_URL or individual host/port/password parameters.
     * Configures retry strategy with exponential backoff.
     */
    const options = {
      retryStrategy(times) {
        const delay = Math.min(times * 200, 3000);
        return delay;
      },
      maxRetriesPerRequest: 3,
      lazyConnect: false,
    };

    if (envConfig.REDIS.PASSWORD) {
      options.password = envConfig.REDIS.PASSWORD;
    }
    if (envConfig.REDIS.DB) {
      options.db = envConfig.REDIS.DB;
    }

    redisClient = envConfig.REDIS.URL
      ? new Redis(envConfig.REDIS.URL, options)
      : new Redis({
          host: envConfig.REDIS.HOST,
          port: envConfig.REDIS.PORT,
          ...options,
        });

    redisClient.on("connect", () => {
      isConnected = true;
      console.log("✅ [Redis] Connection established successfully.");
    });

    redisClient.on("error", (err) => {
      isConnected = false;
      console.error("❌ [Redis] Connection error:", err.message);
    });

    redisClient.on("close", () => {
      isConnected = false;
      console.warn("⚠️ [Redis] Connection closed.");
    });

    return redisClient;
  } catch (error) {
    console.error("❌ [Redis] Initialization failed:", error.message);
    isConnected = false;
    return null;
  }
};

initRedis();

/**
 * @name getRedisClient
 * @description Returns the active Redis client instance
 * @returns {Object|null}
 */
const getRedisClient = () => redisClient;

/**
 * @name isRedisConnected
 * @description Returns true if Redis connection is established and healthy
 * @returns {boolean}
 */
const isRedisConnected = () => isConnected && redisClient !== null;

/**
 * @name closeRedis
 * @description Gracefully closes Redis connection
 * @returns {Promise<void>}
 */
const closeRedis = async () => {
  if (redisClient) {
    try {
      await redisClient.quit();
      console.log("🔒 [Redis] Connection closed gracefully.");
    } catch (err) {
      console.error("⚠️ [Redis] Error closing connection:", err.message);
    }
  }
};

module.exports = {
  getRedisClient,
  isRedisConnected,
  closeRedis,
};
