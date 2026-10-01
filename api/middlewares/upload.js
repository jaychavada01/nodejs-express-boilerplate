const { MULTER: multer } = require("../../config/packages");
const { ALLOWED_MIME_TYPES, FILE_LIMITS } = require("../../config/constants");
const { BAD_REQUEST_RESPONSE } = require("../utils/response");

// In-memory buffer storage for immediate processing or direct cloud upload to AWS S3
const memoryStorage = multer.memoryStorage();

/**
 * @name createFileFilter
 * @param {Array<string>} allowedTypes - Array of permitted MIME type strings
 * @description Generates a multer file filter checking against permitted MIME types
 * @returns {Function}
 */
const createFileFilter = (allowedTypes) => (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error("FILE002");
    error.code = "FILE002";
    cb(error, false);
  }
};

/*
 * MULTER INSTANCE FACTORY
 * Builds configured multer instances with memory storage, size limits, and MIME filters.
 */
const createMulterInstance = (allowedTypes, maxSizeBytes = FILE_LIMITS.MAX_FILE_SIZE_BYTES) =>
  multer({
    storage: memoryStorage,
    limits: {
      fileSize: maxSizeBytes,
    },
    fileFilter: createFileFilter(allowedTypes),
  });

// Image upload instance (JPEG, PNG, WEBP, GIF, SVG up to 10MB)
const imageUpload = createMulterInstance(
  ALLOWED_MIME_TYPES.IMAGES,
  FILE_LIMITS.MAX_IMAGE_SIZE_BYTES
);

// Video upload instance (MP4, MOV, AVI, WEBM, MKV, 3GP up to 100MB)
const videoUpload = createMulterInstance(
  ALLOWED_MIME_TYPES.VIDEOS,
  FILE_LIMITS.MAX_VIDEO_SIZE_BYTES
);

// Document upload instance (PDF, DOC, DOCX, TXT up to 25MB)
const documentUpload = createMulterInstance(
  ALLOWED_MIME_TYPES.DOCUMENTS,
  FILE_LIMITS.MAX_DOC_SIZE_BYTES
);

// Spreadsheet upload instance (XLS, XLSX, CSV up to 25MB)
const spreadsheetUpload = createMulterInstance(
  ALLOWED_MIME_TYPES.SPREADSHEETS,
  FILE_LIMITS.MAX_DOC_SIZE_BYTES
);

// General media upload instance (Images, Videos, Documents, Spreadsheets)
const mediaUpload = createMulterInstance(
  ALLOWED_MIME_TYPES.ALL_MEDIA,
  FILE_LIMITS.MAX_VIDEO_SIZE_BYTES
);

/**
 * @name handleUploadMiddleware
 * @param {Function} multerMiddleware - Configured multer middleware function
 * @description Error-handling wrapper for multer to catch and format upload errors cleanly
 * @returns {Function} Express middleware
 */
const handleUploadMiddleware = (multerMiddleware) => (req, res, next) => {
  multerMiddleware(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return BAD_REQUEST_RESPONSE(res, "FILE003", "File size exceeds allowed limit");
        }
        return BAD_REQUEST_RESPONSE(res, "VAL001", err.message);
      }
      if (err.code === "FILE002") {
        return BAD_REQUEST_RESPONSE(res, "FILE002", "File MIME type is not supported");
      }
      return BAD_REQUEST_RESPONSE(res, "VAL001", err.message || "File upload failed");
    }
    next();
  });
};

module.exports = {
  // Image Uploads
  uploadSingleImage: (fieldName = "image") => handleUploadMiddleware(imageUpload.single(fieldName)),
  uploadMultipleImages: (fieldName = "images", maxCount = FILE_LIMITS.MAX_FILES_COUNT) =>
    handleUploadMiddleware(imageUpload.array(fieldName, maxCount)),

  // Video Uploads
  uploadSingleVideo: (fieldName = "video") => handleUploadMiddleware(videoUpload.single(fieldName)),
  uploadMultipleVideos: (fieldName = "videos", maxCount = 3) =>
    handleUploadMiddleware(videoUpload.array(fieldName, maxCount)),

  // Document Uploads
  uploadSingleDocument: (fieldName = "document") =>
    handleUploadMiddleware(documentUpload.single(fieldName)),
  uploadMultipleDocuments: (fieldName = "documents", maxCount = FILE_LIMITS.MAX_FILES_COUNT) =>
    handleUploadMiddleware(documentUpload.array(fieldName, maxCount)),

  // Spreadsheet Uploads
  uploadSpreadsheet: (fieldName = "file") =>
    handleUploadMiddleware(spreadsheetUpload.single(fieldName)),

  // Multi-Media Uploads (Images / Videos / Documents)
  uploadSingleMedia: (fieldName = "file") => handleUploadMiddleware(mediaUpload.single(fieldName)),
  uploadMultipleMedia: (fieldName = "files", maxCount = FILE_LIMITS.MAX_FILES_COUNT) =>
    handleUploadMiddleware(mediaUpload.array(fieldName, maxCount)),
};
