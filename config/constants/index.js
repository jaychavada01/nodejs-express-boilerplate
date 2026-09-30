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
  NOTIFICATIONS: "swp.notifications.queue",
  EMAILS: "swp.emails.queue",
  EVENTS: "swp.events.queue",
};

const EXCHANGES = {
  NOTIFICATIONS_DLX: "swp.notifications.dlx.exchange",
};

const DLQ_NAMES = {
  NOTIFICATIONS_DLQ: "swp.notifications.dlq",
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
};
