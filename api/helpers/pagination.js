const { PAGINATION } = require("../../config/constants");

/**
 * @name getPagingData
 * @param {Object} params - Object containing data { count, rows }, skip, and limit
 * @description Formats Sequelize findAndCountAll or in-memory arrays into structured pagination response
 * @returns {Object} Structured pagination envelope
 */
const getPagingData = ({ data, skip = PAGINATION.DEFAULT_SKIP, limit = PAGINATION.DEFAULT_LIMIT }) => {
  const totalItems = data.count || 0;
  const items = data.rows || [];
  const totalPages = Math.ceil(totalItems / limit) || 1;
  const currentPage = Math.floor(skip / limit) + 1;

  return {
    totalItems,
    items,
    totalPages,
    currentPage,
    skip,
    limit,
    hasNext: skip + limit < totalItems,
    hasPrev: skip > 0,
  };
};

module.exports = { getPagingData };
