const { Joi, requiredStringSchema, optionalStringSchema, emailSchema } = require("./common/baseSchemas");
const { DEVICE_TYPE, NOTIFICATION_EVENTS, LANGUAGES } = require("../../../../config/constants");

const pushDemoSchema = Joi.object({
  deviceToken: requiredStringSchema,
  title: optionalStringSchema,
  body: optionalStringSchema,
  type: Joi.string()
    .valid(...Object.values(NOTIFICATION_EVENTS))
    .optional(),
  language: Joi.string()
    .valid(...Object.values(LANGUAGES))
    .default(LANGUAGES.EN),
  replaceData: Joi.object().optional().default({}),
  osType: Joi.string()
    .valid(DEVICE_TYPE.IOS, DEVICE_TYPE.ANDROID, DEVICE_TYPE.WEB)
    .default(DEVICE_TYPE.ANDROID),
  data: Joi.object().optional().default({}),
}).or("title", "type"); // requires either direct title or template type

const emailDemoSchema = Joi.object({
  to: emailSchema.required(),
  subject: requiredStringSchema,
  name: optionalStringSchema.default("User"),
  message: optionalStringSchema.default("Welcome to the microservice platform!"),
});

const queueDemoSchema = Joi.object({
  queueName: optionalStringSchema,
  payload: Joi.object().required(),
});

module.exports = {
  pushDemoSchema,
  emailDemoSchema,
  queueDemoSchema,
};
