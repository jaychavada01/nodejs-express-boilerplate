const { Joi, uuidSchemaRequired, requiredStringSchema, optionalStringSchema } = require("./common/baseSchemas");
const { skipLimitSearchingSchema } = require("./common/skipLimitSearchSchema");
const { STATUS_TYPES } = require("../../../../config/constants");

const createSampleSchema = Joi.object({
  title: requiredStringSchema.min(3).max(100),
  description: optionalStringSchema.max(500),
  status: Joi.string()
    .valid(STATUS_TYPES.ACTIVE, STATUS_TYPES.INACTIVE, STATUS_TYPES.PENDING)
    .default(STATUS_TYPES.ACTIVE),
});

const updateSampleSchema = Joi.object({
  id: uuidSchemaRequired,
  title: optionalStringSchema.min(3).max(100),
  description: optionalStringSchema.max(500),
  status: Joi.string().valid(STATUS_TYPES.ACTIVE, STATUS_TYPES.INACTIVE, STATUS_TYPES.PENDING),
}).min(2); // must have id + at least 1 field to update

const getSampleDetailSchema = Joi.object({
  id: uuidSchemaRequired,
});

const deleteSampleSchema = Joi.object({
  id: uuidSchemaRequired,
});

const listSampleSchema = Joi.object({
  status: Joi.string()
    .valid(STATUS_TYPES.ACTIVE, STATUS_TYPES.INACTIVE, STATUS_TYPES.PENDING)
    .optional(),
}).concat(skipLimitSearchingSchema);

module.exports = {
  createSampleSchema,
  updateSampleSchema,
  getSampleDetailSchema,
  deleteSampleSchema,
  listSampleSchema,
};
