const { Joi, numberSchema, stringSchema } = require("./baseSchemas");
const { PAGINATION } = require("../../../../../config/constants");

const skipLimitSearchingSchema = Joi.object({
  skip: numberSchema.integer().min(0).optional().default(PAGINATION.DEFAULT_SKIP),
  limit: numberSchema.integer().min(1).max(PAGINATION.MAX_LIMIT).optional().default(PAGINATION.DEFAULT_LIMIT),
  search: stringSchema.allow("").optional().default(""),
});

module.exports = {
  skipLimitSearchingSchema,
};
