/**
 * Standardized API Response Utilities
 */

/**
 * Sends a successful JSON response
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {any} [data]
 */
function sendSuccess(res, statusCode, message, data = null) {
  const response = {
    success: true,
    message,
  };

  if (data !== null && data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
}

/**
 * Sends an error JSON response
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {any} [errors]
 */
function sendError(res, statusCode, message, errors = null) {
  const response = {
    success: false,
    message,
  };

  if (errors !== null && errors !== undefined) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
}

module.exports = {
  sendSuccess,
  sendError,
};
