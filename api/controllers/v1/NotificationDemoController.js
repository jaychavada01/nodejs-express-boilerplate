const asyncHandler = require("../../utils/asyncHandler");
const { OK_RESPONSE, BAD_REQUEST_RESPONSE } = require("../../utils/response");
const { sendToDevice } = require("../../helpers/push/pushNotificationService");
const { sendTemplateEmail } = require("../../helpers/mail/emailService");
const { publishToQueue } = require("../../helpers/queue/publisher");
const { QUEUE_NAMES } = require("../../../config/constants");
const {
  pushDemoSchema,
  emailDemoSchema,
  queueDemoSchema,
} = require("../../utils/validations/schemas/NotificationValidation");

/**
 * @name sendPushDemo
 * @file NotificationDemoController.js
 * @param {Request} req
 * @param {Response} res
 * @description Dispatches multi-platform push notification demo (direct title/body or template-based)
 */
const sendPushDemo = asyncHandler(async (req, res) => {
  /*
   * INPUT VALIDATION (JOI)
   */
  const { error, value: validatedBody } = pushDemoSchema.validate(req.body);
  if (error) {
    return BAD_REQUEST_RESPONSE(res, "VAL001", error.details[0].message);
  }

  const { deviceToken, title, body, type, language, replaceData, osType, data } =
    validatedBody;

  const result = await sendToDevice({
    token: deviceToken,
    title,
    body,
    type,
    language,
    replaceData,
    osType,
    data,
  });

  if (!result.success && result.isPermanent) {
    return BAD_REQUEST_RESPONSE(res, "NOTIF007", "Device token is invalid or uninstalled");
  }

  return OK_RESPONSE(res, "NOTIF001", result);
});

/**
 * @name sendEmailDemo
 * @file NotificationDemoController.js
 * @param {Request} req
 * @param {Response} res
 * @description Dispatches SendGrid template email demo (fire-and-forget in background)
 */
const sendEmailDemo = asyncHandler(async (req, res) => {
  /*
   * INPUT VALIDATION (JOI)
   */
  const { error, value: validatedBody } = emailDemoSchema.validate(req.body);
  if (error) {
    return BAD_REQUEST_RESPONSE(res, "VAL001", error.details[0].message);
  }

  const { to, subject, name, message } = validatedBody;

  /*
   * EMAIL DISPATCH
   * External email services run fire-and-forget without blocking DB transactions.
   */
  sendTemplateEmail({
    to,
    subject,
    templateName: "sample-welcome",
    templateData: {
      name: name || "User",
      message: message || "Welcome to the microservice platform!",
      year: new Date().getFullYear(),
    },
  }).catch((mailErr) => {
    console.error("❌ [Email Error]:", mailErr.message);
  });

  return OK_RESPONSE(res, "NOTIF003", { queued: true, recipient: to });
});

/**
 * @name publishQueueDemo
 * @file NotificationDemoController.js
 * @param {Request} req
 * @param {Response} res
 * @description Publishes demo payload to durable RabbitMQ queue
 */
const publishQueueDemo = asyncHandler(async (req, res) => {
  /*
   * INPUT VALIDATION (JOI)
   */
  const { error, value: validatedBody } = queueDemoSchema.validate(req.body);
  if (error) {
    return BAD_REQUEST_RESPONSE(res, "VAL001", error.details[0].message);
  }

  const { queueName = QUEUE_NAMES.NOTIFICATIONS, payload } = validatedBody;

  const published = await publishToQueue({
    queue: queueName,
    message: payload,
  });

  return OK_RESPONSE(res, "NOTIF005", { queue: queueName, published });
});

module.exports = {
  sendPushDemo,
  sendEmailDemo,
  publishQueueDemo,
};
