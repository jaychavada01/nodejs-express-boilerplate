const ERROR_MESSAGES = {
  // ── Common / System Error Codes ──────────────────────────────────────────
  ERR500: "Internal Server Error",
  ERR404: "Requested endpoint or resource not found",
  ERR401: "Unauthorized access",
  ERR403: "Forbidden: You do not have permission to perform this action",
  VAL001: "Validation error occurred",

  // ── Authentication & Token Policy ─────────────────────────────────────────
  AUTH001: "Authentication token is missing from request headers",
  AUTH002: "Invalid or expired authentication token",
  AUTH003: "User associated with token not found or inactive",
  AUTH004: "Admin authorization required",

  // ── Sample Resource Codes ────────────────────────────────────────────────
  SUF001: "Sample item not found",
  SUF002: "Sample item created successfully",
  SUF003: "Sample item updated successfully",
  SUF004: "Sample item deleted successfully",
  SUF005: "Sample item(s) fetched successfully",
  SUF006: "Sample title is already in use",

  // ── Push Notification & Communication Codes ──────────────────────────────
  NOTIF001: "Push notification dispatched successfully",
  NOTIF002: "Failed to dispatch push notification",
  NOTIF003: "Email sent successfully",
  NOTIF004: "Failed to send email",
  NOTIF005: "Message published to queue successfully",
  NOTIF006: "Failed to publish message to queue",
  NOTIF007: "Target device token is missing or invalid",
};

module.exports = ERROR_MESSAGES;
