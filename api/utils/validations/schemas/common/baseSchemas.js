const Joi = require("joi");

const numberSchema = Joi.number();
const stringSchema = Joi.string().trim();
const booleanSchema = Joi.boolean();

const uuidSchema = stringSchema.uuid({ version: ["uuidv4"] });
const uuidSchemaRequired = uuidSchema.required();
const uuidSchemaOptional = uuidSchema.optional().default(null);

const emailSchema = stringSchema.email().lowercase();
const optionalEmailSchema = emailSchema.optional().default(null);

const requiredStringSchema = stringSchema.required();
const optionalStringSchema = stringSchema.optional().allow("", null).default(null);

module.exports = {
  Joi,
  numberSchema,
  stringSchema,
  booleanSchema,
  uuidSchema,
  uuidSchemaRequired,
  uuidSchemaOptional,
  emailSchema,
  optionalEmailSchema,
  requiredStringSchema,
  optionalStringSchema,
};
