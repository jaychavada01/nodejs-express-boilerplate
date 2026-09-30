const asyncHandler = require("../../utils/asyncHandler");
const {
  OK_RESPONSE,
  CREATED_RESPONSE,
  NOT_FOUND_RESPONSE,
  BAD_REQUEST_RESPONSE,
} = require("../../utils/response");
const SampleService = require("../../services/SampleService");
const {
  createSampleSchema,
  updateSampleSchema,
  getSampleDetailSchema,
  deleteSampleSchema,
  listSampleSchema,
} = require("../../utils/validations/schemas/SampleValidation");

/**
 * @name getById
 * @file SampleController.js
 * @param {Request} req
 * @param {Response} res
 * @description Retrieves a single sample record by id query parameter
 */
const getById = asyncHandler(async (req, res) => {
  /*
   * INPUT VALIDATION (JOI)
   */
  const { error, value: validatedQuery } = getSampleDetailSchema.validate(req.query);
  if (error) {
    return BAD_REQUEST_RESPONSE(res, "VAL001", error.details[0].message);
  }

  const { id } = validatedQuery;
  const item = await SampleService.findById({ id });
  if (!item) return NOT_FOUND_RESPONSE(res, "SUF001");
  return OK_RESPONSE(res, "SUF005", item);
});

/**
 * @name create
 * @file SampleController.js
 * @param {Request} req
 * @param {Response} res
 * @description Creates a new sample record and returns minimal identifier
 */
const create = asyncHandler(async (req, res) => {
  /*
   * INPUT VALIDATION (JOI)
   */
  const { error, value: validatedBody } = createSampleSchema.validate(req.body);
  if (error) {
    return BAD_REQUEST_RESPONSE(res, "VAL001", error.details[0].message);
  }

  const { title, description, status } = validatedBody;
  const newItem = await SampleService.create({ title, description, status });
  return CREATED_RESPONSE(res, "SUF002", { id: newItem.id });
});

/**
 * @name list
 * @file SampleController.js
 * @param {Request} req
 * @param {Response} res
 * @description Retrieves paginated sample records matching search and filters
 */
const list = asyncHandler(async (req, res) => {
  /*
   * INPUT VALIDATION (JOI)
   */
  const { error, value: validatedQuery } = listSampleSchema.validate(req.query);
  if (error) {
    return BAD_REQUEST_RESPONSE(res, "VAL001", error.details[0].message);
  }

  const { skip, limit, search, status } = validatedQuery;
  const items = await SampleService.list({ skip, limit, search, status });
  return OK_RESPONSE(res, "SUF005", items);
});

/**
 * @name update
 * @file SampleController.js
 * @param {Request} req
 * @param {Response} res
 * @description Updates a sample record using id and payload in req.body
 */
const update = asyncHandler(async (req, res) => {
  /*
   * INPUT VALIDATION (JOI)
   */
  const { error, value: validatedBody } = updateSampleSchema.validate(req.body);
  if (error) {
    return BAD_REQUEST_RESPONSE(res, "VAL001", error.details[0].message);
  }

  const { id, title, description, status } = validatedBody;
  const updated = await SampleService.update({ id, title, description, status });
  if (!updated) return NOT_FOUND_RESPONSE(res, "SUF001");
  return OK_RESPONSE(res, "SUF003", { id: updated.id });
});

/**
 * @name remove
 * @file SampleController.js
 * @param {Request} req
 * @param {Response} res
 * @description Soft-deletes a sample record using id in req.query
 */
const remove = asyncHandler(async (req, res) => {
  /*
   * INPUT VALIDATION (JOI)
   */
  const { error, value: validatedQuery } = deleteSampleSchema.validate(req.query);
  if (error) {
    return BAD_REQUEST_RESPONSE(res, "VAL001", error.details[0].message);
  }

  const { id } = validatedQuery;
  const deleted = await SampleService.remove({ id });
  if (!deleted) return NOT_FOUND_RESPONSE(res, "SUF001");
  return OK_RESPONSE(res, "SUF004", { id });
});

module.exports = {
  getById,
  create,
  list,
  update,
  remove,
};
