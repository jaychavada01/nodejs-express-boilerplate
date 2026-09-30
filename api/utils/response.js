const HTTP_STATUS_CODE = require("../../config/constants/statusCodes");

const SEND_RESPONSE = (res, status, message, data = "", error = "") =>
  res.status(status).json({ status, message, data, error });

const OK_RESPONSE = (res, message, data = "") =>
  SEND_RESPONSE(res, HTTP_STATUS_CODE.OK, message, data);

const CREATED_RESPONSE = (res, message, data = "") =>
  SEND_RESPONSE(res, HTTP_STATUS_CODE.CREATED, message, data);

const BAD_REQUEST_RESPONSE = (res, message, error = "") =>
  SEND_RESPONSE(res, HTTP_STATUS_CODE.BAD_REQUEST, message, "", error);

const UNAUTHORIZED_RESPONSE = (res, message, error = "") =>
  SEND_RESPONSE(res, HTTP_STATUS_CODE.UNAUTHORIZED, message, "", error);

const NOT_FOUND_RESPONSE = (res, message, error = "") =>
  SEND_RESPONSE(res, HTTP_STATUS_CODE.NOT_FOUND, message, "", error);

const CONFLICT_RESPONSE = (res, message, error = "") =>
  SEND_RESPONSE(res, HTTP_STATUS_CODE.CONFLICT, message, "", error);

const SERVER_ERROR_RESPONSE = (res, message, error = "") =>
  SEND_RESPONSE(res, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR, message, "", error);

module.exports = {
  SEND_RESPONSE,
  OK_RESPONSE,
  CREATED_RESPONSE,
  BAD_REQUEST_RESPONSE,
  UNAUTHORIZED_RESPONSE,
  NOT_FOUND_RESPONSE,
  CONFLICT_RESPONSE,
  SERVER_ERROR_RESPONSE,
};
