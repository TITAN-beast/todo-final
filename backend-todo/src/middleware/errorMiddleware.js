const { sendError } = require('../utils/response');

/**
 * 404 Route Not Found Handler
 */
function notFoundHandler(req, res, next) {
  return sendError(res, 404, `Endpoint ${req.method} ${req.originalUrl} not found`);
}

/**
 * Centralized Error Handling Middleware
 */
function errorHandler(err, req, res, next) {
  // Log internal error for debugging
  console.error('[Error Handler]', {
    method: req.method,
    url: req.originalUrl,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // Determine status code
  const statusCode = err.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);

  // Determine friendly message
  let message = err.message || 'An unexpected internal server error occurred';

  // Sanitize internal database details in production
  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    message = 'An unexpected server error occurred. Please try again later.';
  }

  return sendError(res, statusCode, message);
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
