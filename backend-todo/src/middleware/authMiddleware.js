const { verifyToken } = require('../utils/jwt');
const { sendError } = require('../utils/response');
const UserModel = require('../models/userModel');

/**
 * Authentication Middleware
 * Validates the JWT Bearer token and attaches user information to req.user
 */
async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 401, 'Unauthorized: Access denied. No valid token provided.');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return sendError(res, 401, 'Unauthorized: Access denied. Bearer token missing.');
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return sendError(res, 401, 'Unauthorized: Token has expired. Please log in again.');
      }
      return sendError(res, 401, 'Unauthorized: Invalid authentication token.');
    }

    // Attach decoded user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    // Optionally verify user still exists in database
    try {
      const user = await UserModel.findById(decoded.id);
      if (!user) {
        return sendError(res, 401, 'Unauthorized: User account no longer exists.');
      }
      req.user.name = user.name;
    } catch (dbErr) {
      // In case of transient DB error during lookup, continue with token claims or pass error
      console.warn('[AuthMiddleware] User lookup warning:', dbErr.message);
    }

    next();
  } catch (error) {
    return sendError(res, 500, 'Authentication error: An unexpected error occurred.');
  }
}

module.exports = authMiddleware;
