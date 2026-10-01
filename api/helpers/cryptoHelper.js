const { BCRYPT: bcrypt, CRYPTO: crypto } = require("../../config/packages");
const envConfig = require("../../config/envConfig");
const { ENCRYPTION } = require("../../config/constants");

/**
 * @name hashPassword
 * @param {string} password - Raw plain-text password
 * @param {number} saltRounds - Number of bcrypt salt rounds (defaults to 10)
 * @description Hashes a password using bcrypt
 * @returns {Promise<string>}
 */
const hashPassword = async (password, saltRounds = 10) => {
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
};

/**
 * @name comparePassword
 * @param {string} password - Raw plain-text password to compare
 * @param {string} hash - Stored bcrypt hash string
 * @description Compares a raw password against a bcrypt hash
 * @returns {Promise<boolean>}
 */
const comparePassword = async (password, hash) => {
  if (!password || !hash) return false;
  return bcrypt.compare(password, hash);
};

/**
 * @name generateNumericOTP
 * @param {number} length - Number of digits (defaults to 6)
 * @description Generates a cryptographically secure numeric OTP string
 * @returns {string}
 */
const generateNumericOTP = (length = 6) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return crypto.randomInt(min, max + 1).toString();
};

/**
 * @name generateSecureToken
 * @param {number} bytes - Number of random bytes (defaults to 32)
 * @description Generates a cryptographically secure random hexadecimal token
 * @returns {string}
 */
const generateSecureToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString("hex");
};

/**
 * @name createHmacSignature
 * @param {string|Object} payload - Data payload to sign
 * @param {string} secret - Secret key used for signing
 * @param {string} algorithm - Hash algorithm (defaults to sha256)
 * @description Generates an HMAC signature for webhook or data integrity verification
 * @returns {string} Hexadecimal HMAC signature
 */
const createHmacSignature = (payload, secret, algorithm = "sha256") => {
  const data = typeof payload === "object" ? JSON.stringify(payload) : String(payload);
  return crypto.createHmac(algorithm, secret).update(data).digest("hex");
};

/**
 * @name verifyHmacSignature
 * @param {string|Object} payload - Data payload to verify
 * @param {string} signature - Incoming HMAC signature to verify against
 * @param {string} secret - Secret key used for signing
 * @param {string} algorithm - Hash algorithm (defaults to sha256)
 * @description Verifies HMAC signature using timing-safe constant-time comparison
 * @returns {boolean}
 */
const verifyHmacSignature = (payload, signature, secret, algorithm = "sha256") => {
  if (!payload || !signature || !secret) return false;
  try {
    const expected = createHmacSignature(payload, secret, algorithm);
    const expectedBuffer = Buffer.from(expected, "hex");
    const signatureBuffer = Buffer.from(signature, "hex");

    if (expectedBuffer.length !== signatureBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
  } catch {
    return false;
  }
};

/**
 * @name encryptData
 * @param {string} plainText - Plaintext string to encrypt
 * @param {string} [customKey] - Optional 32-byte secret key (defaults to env key)
 * @description Encrypts text using authenticated AES-256-GCM cipher
 * @returns {string} Combined base64 cipher payload (iv:tag:encrypted)
 */
const encryptData = (plainText, customKey) => {
  const rawKey = customKey || envConfig.ENCRYPTION.SECRET_KEY;
  const key = crypto.createHash("sha256").update(String(rawKey)).digest(); // 32 bytes
  const iv = crypto.randomBytes(ENCRYPTION.IV_LENGTH_BYTES);

  const cipher = crypto.createCipheriv(ENCRYPTION.ALGORITHM, key, iv);
  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  return Buffer.from(`${iv.toString("hex")}:${authTag}:${encrypted}`).toString("base64");
};

/**
 * @name decryptData
 * @param {string} encryptedBase64 - Base64 encoded encrypted payload (iv:tag:encrypted)
 * @param {string} [customKey] - Optional 32-byte secret key (defaults to env key)
 * @description Decrypts AES-256-GCM encrypted base64 payload
 * @returns {string|null} Decrypted plaintext string or null if failed
 */
const decryptData = (encryptedBase64, customKey) => {
  try {
    const rawKey = customKey || envConfig.ENCRYPTION.SECRET_KEY;
    const key = crypto.createHash("sha256").update(String(rawKey)).digest();

    const decoded = Buffer.from(encryptedBase64, "base64").toString("utf8");
    const [ivHex, tagHex, encryptedHex] = decoded.split(":");

    if (!ivHex || !tagHex || !encryptedHex) {
      return null;
    }

    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(tagHex, "hex");

    const decipher = crypto.createDecipheriv(ENCRYPTION.ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (err) {
    console.error("❌ [CryptoHelper] Decryption failed:", err.message);
    return null;
  }
};

module.exports = {
  hashPassword,
  comparePassword,
  generateNumericOTP,
  generateSecureToken,
  createHmacSignature,
  verifyHmacSignature,
  encryptData,
  decryptData,
};
