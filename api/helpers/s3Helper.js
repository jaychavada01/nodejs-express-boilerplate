const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  getSignedUrl,
  PATH: path,
  UUIDV4: uuidv4,
} = require("../../config/packages");
const envConfig = require("../../config/envConfig");
const { S3_FOLDERS } = require("../../config/constants");

/*
 * AWS S3 CLIENT INITIALIZATION
 * Configures S3 client with region, credentials, and optional custom endpoint (MinIO / Cloudflare R2).
 */
const s3Config = {
  region: envConfig.AWS_S3.REGION || "us-east-1",
};

if (envConfig.AWS_S3.ACCESS_KEY_ID && envConfig.AWS_S3.SECRET_ACCESS_KEY) {
  s3Config.credentials = {
    accessKeyId: envConfig.AWS_S3.ACCESS_KEY_ID,
    secretAccessKey: envConfig.AWS_S3.SECRET_ACCESS_KEY,
  };
}

if (envConfig.AWS_S3.ENDPOINT) {
  s3Config.endpoint = envConfig.AWS_S3.ENDPOINT;
}

if (envConfig.AWS_S3.FORCE_PATH_STYLE) {
  s3Config.forcePathStyle = true;
}

const s3Client = new S3Client(s3Config);

/**
 * @name getPublicUrl
 * @param {string} key - S3 object key
 * @description Constructs the public CDN or S3 bucket URL for an object key
 * @returns {string}
 */
const getPublicUrl = (key) => {
  if (!key) return "";

  if (envConfig.AWS_S3.CUSTOM_DOMAIN) {
    const domain = envConfig.AWS_S3.CUSTOM_DOMAIN.replace(/\/$/, "");
    return `https://${domain}/${key}`;
  }

  const bucket = envConfig.AWS_S3.BUCKET_NAME;
  const region = envConfig.AWS_S3.REGION || "us-east-1";

  if (envConfig.AWS_S3.ENDPOINT) {
    const endpoint = envConfig.AWS_S3.ENDPOINT.replace(/\/$/, "");
    return `${endpoint}/${bucket}/${key}`;
  }

  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
};

/**
 * @name extractKeyFromUrl
 * @param {string} keyOrUrl - S3 Key or complete public S3 URL
 * @description Extracts raw S3 key if a full HTTP/HTTPS URL is supplied
 * @returns {string}
 */
const extractKeyFromUrl = (keyOrUrl) => {
  if (!keyOrUrl) return "";
  if (!keyOrUrl.startsWith("http://") && !keyOrUrl.startsWith("https://")) {
    return keyOrUrl;
  }

  try {
    const parsedUrl = new URL(keyOrUrl);
    // Removes leading slash from pathname
    return parsedUrl.pathname.replace(/^\//, "");
  } catch {
    return keyOrUrl;
  }
};

/**
 * @name uploadToS3
 * @param {Object} params - Upload parameters object { buffer, originalname, mimetype, folder, customKey }
 * @description Uploads a file buffer directly to AWS S3 bucket
 * @returns {Promise<Object>} { key, url, bucket, size, mimetype }
 */
const uploadToS3 = async ({
  buffer,
  originalname = "file",
  mimetype = "application/octet-stream",
  folder = S3_FOLDERS.GENERAL,
  customKey = null,
}) => {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error("Invalid or missing file buffer");
  }

  /*
   * S3 OBJECT KEY RESOLUTION
   * Preserves file extension and generates collision-free UUIDv4 identifier.
   */
  const ext = path.extname(originalname);
  const fileName = customKey || `${uuidv4()}${ext}`;
  const key = folder ? `${folder}/${fileName}` : fileName;
  const bucket = envConfig.AWS_S3.BUCKET_NAME;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: mimetype,
  });

  await s3Client.send(command);

  return {
    key,
    url: getPublicUrl(key),
    bucket,
    size: buffer.length,
    mimetype,
  };
};

/**
 * @name getPresignedUploadUrl
 * @param {Object} params - Pre-signed URL parameter object { fileName, mimetype, folder, expiresIn }
 * @description Generates a pre-signed S3 PUT URL for direct client-to-S3 uploads
 * @returns {Promise<Object>} { uploadUrl, key, fileUrl, expiresIn }
 */
const getPresignedUploadUrl = async ({
  fileName = "file",
  mimetype = "application/octet-stream",
  folder = S3_FOLDERS.GENERAL,
  expiresIn = 3600,
}) => {
  const ext = path.extname(fileName);
  const uniqueName = `${uuidv4()}${ext}`;
  const key = folder ? `${folder}/${uniqueName}` : uniqueName;
  const bucket = envConfig.AWS_S3.BUCKET_NAME;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: mimetype,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn });

  return {
    uploadUrl,
    key,
    fileUrl: getPublicUrl(key),
    expiresIn,
  };
};

/**
 * @name getPresignedDownloadUrl
 * @param {Object} params - Download URL parameter object { key, expiresIn }
 * @description Generates a time-limited pre-signed S3 GET URL for private objects
 * @returns {Promise<Object>} { downloadUrl, key, expiresIn }
 */
const getPresignedDownloadUrl = async ({ key, expiresIn = 3600 }) => {
  const cleanKey = extractKeyFromUrl(key);
  const bucket = envConfig.AWS_S3.BUCKET_NAME;

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: cleanKey,
  });

  const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn });

  return {
    downloadUrl,
    key: cleanKey,
    expiresIn,
  };
};

/**
 * @name deleteFromS3
 * @param {string} keyOrUrl - S3 object key or full S3 URL to delete
 * @description Deletes an object from AWS S3 bucket
 * @returns {Promise<boolean>}
 */
const deleteFromS3 = async (keyOrUrl) => {
  try {
    const key = extractKeyFromUrl(keyOrUrl);
    if (!key) return false;

    const command = new DeleteObjectCommand({
      Bucket: envConfig.AWS_S3.BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    return true;
  } catch (err) {
    console.warn("⚠️ [S3Helper] Failed to delete object:", err.message);
    return false;
  }
};

module.exports = {
  s3Client,
  uploadToS3,
  getPresignedUploadUrl,
  getPresignedDownloadUrl,
  deleteFromS3,
  getPublicUrl,
};
