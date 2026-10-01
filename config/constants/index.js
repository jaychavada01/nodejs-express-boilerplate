const HTTP_STATUS_CODE = require("./statusCodes");

const DEVICE_TYPE = {
  IOS: "ios",
  ANDROID: "android",
  WEB: "web",
};

const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
};

const STATUS_TYPES = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
};

const NOTIFICATION_EVENTS = {
  USER_WELCOME: "user_welcome",
  SAMPLE_CREATED: "sample_created",
  SAMPLE_UPDATED: "sample_updated",
  SAMPLE_DELETED: "sample_deleted",
  SYSTEM_ALERT: "system_alert",
};

const LANGUAGES = {
  EN: "EN",
  NL: "NL",
  ES: "ES",
  FR: "FR",
};

const PAGINATION = {
  DEFAULT_SKIP: 0,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

const SORT_ORDER = {
  ASC: "ASC",
  DESC: "DESC",
};

const SORT_BY_FIELD = {
  CREATED_AT: "created_at",
  UPDATED_AT: "updated_at",
  ID: "id",
};

const QUEUE_NAMES = {
  NOTIFICATIONS: "app.notifications.queue",
  EMAILS: "app.emails.queue",
  EVENTS: "app.events.queue",
};

const EXCHANGES = {
  NOTIFICATIONS_DLX: "app.notifications.dlx.exchange",
};

const DLQ_NAMES = {
  NOTIFICATIONS_DLQ: "app.notifications.dlq",
};

const STORAGE_PROVIDERS = {
  S3: "s3",
  R2: "r2",
};

const ALLOWED_MIME_TYPES = {
  IMAGES: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
  ],
  VIDEOS: [
    "video/mp4",
    "video/mpeg",
    "video/quicktime",
    "video/x-msvideo",
    "video/webm",
    "video/x-matroska",
    "video/3gpp",
  ],
  DOCUMENTS: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "application/rtf",
  ],
  SPREADSHEETS: [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
  ],
  ALL_MEDIA: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
    "video/mp4",
    "video/mpeg",
    "video/quicktime",
    "video/x-msvideo",
    "video/webm",
    "video/x-matroska",
    "video/3gpp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
  ],
};

const FILE_LIMITS = {
  MAX_IMAGE_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
  MAX_VIDEO_SIZE_BYTES: 100 * 1024 * 1024, // 100MB
  MAX_DOC_SIZE_BYTES: 25 * 1024 * 1024, // 25MB
  MAX_FILE_SIZE_BYTES: 100 * 1024 * 1024, // 100MB general ceiling
  MAX_FILES_COUNT: 10,
};

const S3_FOLDERS = {
  IMAGES: "images",
  VIDEOS: "videos",
  DOCUMENTS: "documents",
  GENERAL: "uploads",
};

const CACHE_TTL_SECONDS = {
  ONE_MINUTE: 60,
  FIVE_MINUTES: 300,
  FIFTEEN_MINUTES: 900,
  ONE_HOUR: 3600,
  ONE_DAY: 86400,
};

const CRON_SCHEDULES = {
  EVERY_MINUTE: "* * * * *",
  EVERY_FIFTEEN_MINUTES: "*/15 * * * *",
  EVERY_HOUR: "0 * * * *",
  DAILY_MIDNIGHT: "0 0 * * *",
};

const ENCRYPTION = {
  ALGORITHM: "aes-256-gcm",
  IV_LENGTH_BYTES: 12,
  AUTH_TAG_LENGTH_BYTES: 16,
};

module.exports = {
  HTTP_STATUS_CODE,
  DEVICE_TYPE,
  USER_ROLES,
  STATUS_TYPES,
  NOTIFICATION_EVENTS,
  LANGUAGES,
  PAGINATION,
  SORT_ORDER,
  SORT_BY_FIELD,
  QUEUE_NAMES,
  EXCHANGES,
  DLQ_NAMES,
  STORAGE_PROVIDERS,
  ALLOWED_MIME_TYPES,
  FILE_LIMITS,
  CACHE_TTL_SECONDS,
  CRON_SCHEDULES,
  ENCRYPTION,
};
