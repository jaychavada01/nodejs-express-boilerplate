const { messaging, isFCMReady } = require("../../../config/firebase");
const { DEVICE_TYPE, LANGUAGES } = require("../../../config/constants");
const { getPushMessage } = require("./pushMessageResolver");

// Permanent invalid token codes that should be removed from database
const EXPIRED_TOKEN_CODES = new Set([
  "messaging/registration-token-not-registered",
  "messaging/invalid-registration-token",
  "messaging/mismatched-credential",
]);

// Transient network codes that can be retried
const TRANSIENT_ERROR_CODES = new Set([
  "messaging/server-unavailable",
  "messaging/internal-error",
  "messaging/unknown-error",
]);

/**
 * @name buildPlatformPayload
 * @param {Object} params - Parameter object containing token, title, body, data, osType, badge, sound, and imageUrl
 * @description Builds platform-specific FCM payload for iOS, Android, or Web
 * @returns {Object} Structured FCM message payload
 */
const buildPlatformPayload = ({
  token,
  title,
  body,
  data = {},
  osType = DEVICE_TYPE.ANDROID,
  badge = 1,
  sound = "default",
  imageUrl,
}) => {
  const stringifiedData = {};
  for (const [k, v] of Object.entries(data)) {
    stringifiedData[k] = typeof v === "string" ? v : JSON.stringify(v);
  }

  const baseMessage = {
    token,
    notification: {
      title,
      body,
      ...(imageUrl ? { imageUrl } : {}),
    },
    data: stringifiedData,
  };

  /*
   * PLATFORM-SPECIFIC PAYLOAD TAILORING
   * Adapts notifications for APNs (iOS), Android high priority, and WebPush.
   */
  switch (osType) {
    case DEVICE_TYPE.IOS:
      baseMessage.apns = {
        headers: {
          "apns-priority": "10",
        },
        payload: {
          aps: {
            alert: { title, body },
            badge,
            sound,
            "content-available": 1,
          },
        },
      };
      break;

    case DEVICE_TYPE.ANDROID:
      baseMessage.android = {
        priority: "high",
        notification: {
          sound,
          clickAction: "FLUTTER_NOTIFICATION_CLICK",
          ...(imageUrl ? { imageUrl } : {}),
        },
      };
      break;

    case DEVICE_TYPE.WEB:
      baseMessage.webpush = {
        headers: {
          Urgency: "high",
        },
        notification: {
          icon: "/favicon.ico",
          ...(imageUrl ? { image: imageUrl } : {}),
        },
      };
      break;

    default:
      break;
  }

  return baseMessage;
};

/**
 * @name sendToDevice
 * @param {Object} params - Parameter object containing token, title, body, type, language, replaceData, data, osType, and imageUrl
 * @description Dispatches push notification to a single device with automated template resolution or direct title/body
 * @returns {Promise<Object>} Delivery result object
 */
const sendToDevice = async ({
  token,
  title: explicitTitle,
  body: explicitBody,
  type,
  language = LANGUAGES.EN,
  replaceData = {},
  data = {},
  osType = DEVICE_TYPE.ANDROID,
  imageUrl,
}) => {
  /*
   * TITLE & BODY RESOLUTION
   * If template type is provided, resolve from pushMessages.js with {{placeholder}} interpolation.
   */
  let finalTitle = explicitTitle || "";
  let finalBody = explicitBody || "";

  if (type) {
    const resolved = await getPushMessage({ type, language, replaceData });
    finalTitle = finalTitle || resolved.title;
    finalBody = finalBody || resolved.body;
  }

  if (!isFCMReady() || !messaging) {
    console.log(`🔔 [FCM Mock] Push to token: "${token?.substring(0, 12)}..." | Title: "${finalTitle}" | Body: "${finalBody}" (Firebase not configured)`);
    return { success: true, mocked: true, title: finalTitle, body: finalBody };
  }

  const message = buildPlatformPayload({
    token,
    title: finalTitle,
    body: finalBody,
    data: { ...data, ...(type ? { notificationType: type } : {}) },
    osType,
    imageUrl,
  });

  try {
    const response = await messaging.send(message);
    return { success: true, messageId: response, title: finalTitle, body: finalBody };
  } catch (error) {
    const errorCode = error.code || "";
    const isPermanent = EXPIRED_TOKEN_CODES.has(errorCode);
    const isTransient = TRANSIENT_ERROR_CODES.has(errorCode);

    console.error(`❌ [FCM Error] [Code: ${errorCode}]: ${error.message}`);

    return {
      success: false,
      isPermanent,
      isTransient,
      errorCode,
      error: error.message,
    };
  }
};

/**
 * @name sendMulticast
 * @param {Object} params - Parameter object containing tokens array, title, body, type, language, replaceData, and data
 * @description Dispatches multicast push notification to multiple device tokens
 * @returns {Promise<Object>} Multicast delivery summary
 */
const sendMulticast = async ({
  tokens = [],
  title: explicitTitle,
  body: explicitBody,
  type,
  language = LANGUAGES.EN,
  replaceData = {},
  data = {},
}) => {
  if (!tokens || tokens.length === 0) {
    return { success: false, message: "No tokens provided" };
  }

  let finalTitle = explicitTitle || "";
  let finalBody = explicitBody || "";

  if (type) {
    const resolved = await getPushMessage({ type, language, replaceData });
    finalTitle = finalTitle || resolved.title;
    finalBody = finalBody || resolved.body;
  }

  if (!isFCMReady() || !messaging) {
    console.log(`🔔 [FCM Mock Multicast] Push to ${tokens.length} devices | Title: "${finalTitle}" | Body: "${finalBody}"`);
    return { success: true, mocked: true, recipientCount: tokens.length, title: finalTitle, body: finalBody };
  }

  const stringifiedData = {};
  const mergedData = { ...data, ...(type ? { notificationType: type } : {}) };
  for (const [k, v] of Object.entries(mergedData)) {
    stringifiedData[k] = typeof v === "string" ? v : JSON.stringify(v);
  }

  const multicastMessage = {
    tokens,
    notification: { title: finalTitle, body: finalBody },
    data: stringifiedData,
  };

  try {
    const response = await messaging.sendEachForMulticast(multicastMessage);
    const expiredTokens = [];
    const transientTokens = [];

    response.responses.forEach((resp, idx) => {
      if (!resp.success && resp.error) {
        const code = resp.error.code;
        if (EXPIRED_TOKEN_CODES.has(code)) {
          expiredTokens.push(tokens[idx]);
        } else if (TRANSIENT_ERROR_CODES.has(code)) {
          transientTokens.push(tokens[idx]);
        }
      }
    });

    return {
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
      expiredTokens,
      transientTokens,
      title: finalTitle,
      body: finalBody,
    };
  } catch (error) {
    console.error("❌ [FCM Multicast Error]:", error);
    throw error;
  }
};

module.exports = {
  sendToDevice,
  sendMulticast,
  EXPIRED_TOKEN_CODES,
  TRANSIENT_ERROR_CODES,
};
