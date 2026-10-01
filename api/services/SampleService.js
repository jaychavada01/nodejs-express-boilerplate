const { Sample } = require("../../models");
const { getPagingData } = require("../helpers/pagination");
const { UUIDV4: uuidv4 } = require("../../config/packages");
const { PAGINATION, STATUS_TYPES } = require("../../config/constants");
const { GET_CURRENT_TIMESTAMP } = require("../utils/momentUtils");

// In-memory fallback repository when DB is not connected
const inMemoryStore = new Map();

/**
 * @name findById
 * @param {Object} params - Parameter object containing id
 * @description Retrieves a single sample record by its primary UUID
 * @returns {Promise<Object|null>} Sample record or null
 */
const findById = async ({ id }) => {
  if (Sample) {
    return Sample.findOne({ where: { id, is_deleted: false } });
  }
  return inMemoryStore.get(id) || null;
};

/**
 * @name create
 * @param {Object} params - Parameter object containing title, description, and status
 * @description Inserts a new sample record
 * @returns {Promise<Object>} Created record identifier
 */
const create = async ({ title, description, status = STATUS_TYPES.ACTIVE }) => {
  if (Sample) {
    const record = await Sample.create({ title, description, status });
    return { id: record.id };
  }

  const now = GET_CURRENT_TIMESTAMP();
  const item = {
    id: uuidv4(),
    title,
    description,
    status,
    is_active: true,
    created_at: now,
    created_by: null,
    updated_at: now,
    updated_by: null,
    deleted_at: null,
    deleted_by: null,
    is_deleted: false,
  };
  inMemoryStore.set(item.id, item);
  return { id: item.id };
};

/**
 * @name list
 * @param {Object} params - Parameter object containing skip, limit, search, and status
 * @description Queries paginated sample records using skip and limit
 * @returns {Promise<Object>} Paginated envelope
 */
const list = async ({
  skip = PAGINATION.DEFAULT_SKIP,
  limit = PAGINATION.DEFAULT_LIMIT,
  search = "",
  status,
}) => {
  if (Sample) {
    const whereClause = { is_deleted: false };
    if (status) whereClause.status = status;

    const data = await Sample.findAndCountAll({
      where: whereClause,
      offset: skip,
      limit,
      order: [["created_at", "DESC"]],
    });

    return getPagingData({ data, skip, limit });
  }

  let items = Array.from(inMemoryStore.values()).filter((item) => !item.is_deleted);

  if (status) {
    items = items.filter((item) => item.status === status);
  }

  if (search) {
    const lowerSearch = search.toLowerCase();
    items = items.filter(
      (item) =>
        (item.title && item.title.toLowerCase().includes(lowerSearch)) ||
        (item.description && item.description.toLowerCase().includes(lowerSearch))
    );
  }

  const pagedItems = items.slice(skip, skip + limit);
  return getPagingData({
    data: { count: items.length, rows: pagedItems },
    skip,
    limit,
  });
};

/**
 * @name update
 * @param {Object} params - Parameter object containing id, title, description, and status
 * @description Updates an existing sample record by ID
 * @returns {Promise<Object|null>} Minimal identifier or null
 */
const update = async ({ id, title, description, status }) => {
  const now = GET_CURRENT_TIMESTAMP();

  if (Sample) {
    const item = await Sample.findOne({ where: { id, is_deleted: false } });
    if (!item) return null;

    const updateFields = { updated_at: now };
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (status !== undefined) updateFields.status = status;

    await item.update(updateFields);
    return { id: item.id };
  }

  const item = inMemoryStore.get(id);
  if (!item || item.is_deleted) return null;

  if (title !== undefined) item.title = title;
  if (description !== undefined) item.description = description;
  if (status !== undefined) item.status = status;
  item.updated_at = now;

  inMemoryStore.set(id, item);
  return { id: item.id };
};

/**
 * @name remove
 * @param {Object} params - Parameter object containing id
 * @description Soft-deletes a sample record by ID
 * @returns {Promise<boolean>} Success boolean
 */
const remove = async ({ id }) => {
  const now = GET_CURRENT_TIMESTAMP();

  if (Sample) {
    const item = await Sample.findOne({ where: { id, is_deleted: false } });
    if (!item) return false;
    await item.update({ is_deleted: true, deleted_at: now, is_active: false });
    return true;
  }

  const item = inMemoryStore.get(id);
  if (!item || item.is_deleted) return false;
  item.is_deleted = true;
  item.deleted_at = now;
  item.is_active = false;
  inMemoryStore.set(id, item);
  return true;
};

module.exports = {
  findById,
  create,
  list,
  update,
  remove,
};
