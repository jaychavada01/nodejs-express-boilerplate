const moment = require("moment");

/**
 * @name GET_CURRENT_TIMESTAMP
 * @param {string} [timezone="UTC"]
 * @description Returns the current Unix timestamp in seconds
 * @returns {number} Unix timestamp in seconds
 */
const GET_CURRENT_TIMESTAMP = (timezone = "UTC") => {
  return moment().utc().unix();
};

/**
 * @name GET_FORMATTED_TIMESTAMP
 * @param {string} [format="YYYY-MM-DD HH:mm:ss"]
 * @description Returns formatted current date string
 * @returns {string} Formatted timestamp
 */
const GET_FORMATTED_TIMESTAMP = (format = "YYYY-MM-DD HH:mm:ss") => {
  return moment().utc().format(format);
};

module.exports = {
  GET_CURRENT_TIMESTAMP,
  GET_FORMATTED_TIMESTAMP,
};
