const { getRedisClient, isRedisConnected } = require("../../config/redis");
const { CACHE_TTL_SECONDS } = require("../../config/constants");

/**
 * @name getCache
 * @param {string} key - Cache key identifier
 * @description Retrieves and parses a JSON cache entry from Redis
 * @returns {Promise<any|null>} Cached payload or null
 */
const getCache = async (key) => {
  if (!isRedisConnected()) return null;

  try {
    const client = getRedisClient();
    const data = await client.get(key);
    if (!data) return null;
    return JSON.parse(data);
  } catch (err) {
    console.error(`⚠️ [RedisHelper] Failed to read key "${key}":`, err.message);
    return null;
  }
};

/**
 * @name setCache
 * @param {string} key - Cache key identifier
 * @param {any} value - Serializable data payload
 * @param {number} [ttlSeconds] - Time-to-live in seconds (defaults to 5 minutes)
 * @description Stores a serializable value in Redis with TTL
 * @returns {Promise<boolean>}
 */
const setCache = async (key, value, ttlSeconds = CACHE_TTL_SECONDS.FIVE_MINUTES) => {
  if (!isRedisConnected()) return false;

  try {
    const client = getRedisClient();
    const serialized = JSON.stringify(value);

    if (ttlSeconds > 0) {
      await client.set(key, serialized, "EX", ttlSeconds);
    } else {
      await client.set(key, serialized);
    }
    return true;
  } catch (err) {
    console.error(`⚠️ [RedisHelper] Failed to set key "${key}":`, err.message);
    return false;
  }
};

/**
 * @name deleteCache
 * @param {string} key - Cache key to remove
 * @description Deletes a key from Redis
 * @returns {Promise<boolean>}
 */
const deleteCache = async (key) => {
  if (!isRedisConnected()) return false;

  try {
    const client = getRedisClient();
    await client.del(key);
    return true;
  } catch (err) {
    console.error(`⚠️ [RedisHelper] Failed to delete key "${key}":`, err.message);
    return false;
  }
};

/**
 * @name flushAllCache
 * @description Clears all cached keys from the active Redis DB
 * @returns {Promise<boolean>}
 */
const flushAllCache = async () => {
  if (!isRedisConnected()) return false;

  try {
    const client = getRedisClient();
    await client.flushdb();
    return true;
  } catch (err) {
    console.error("⚠️ [RedisHelper] Failed to flush cache DB:", err.message);
    return false;
  }
};

/**
 * @name blacklistToken
 * @param {string} token - JWT token string to invalidate
 * @param {number} [expiresInSeconds] - Expiry TTL matching remaining token validity (defaults to 1 day)
 * @description Stores a revoked JWT token in Redis blacklist until expiration
 * @returns {Promise<boolean>}
 */
const blacklistToken = async (token, expiresInSeconds = CACHE_TTL_SECONDS.ONE_DAY) => {
  if (!token) return false;
  const blacklistKey = `blacklist:token:${token}`;
  return setCache(blacklistKey, { blacklistedAt: Date.now() }, expiresInSeconds);
};

/**
 * @name isTokenBlacklisted
 * @param {string} token - JWT token to check
 * @description Checks if a JWT token has been explicitly revoked / blacklisted
 * @returns {Promise<boolean>}
 */
const isTokenBlacklisted = async (token) => {
  if (!token) return false;
  const blacklistKey = `blacklist:token:${token}`;
  const data = await getCache(blacklistKey);
  return data !== null;
};

module.exports = {
  getCache,
  setCache,
  deleteCache,
  flushAllCache,
  blacklistToken,
  isTokenBlacklisted,
};
