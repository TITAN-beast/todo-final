const AuthService = require('../services/authService');
const { sendSuccess } = require('../utils/response');

class AuthController {
  /**
   * Handle user registration
   * POST /api/auth/register
   */
  static async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const result = await AuthService.register({ name, email, password });
      return sendSuccess(res, 201, 'User registered successfully', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle user login
   * POST /api/auth/login
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login({ email, password });
      return sendSuccess(res, 200, 'Login successful', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle get current user profile
   * GET /api/auth/me
   */
  static async me(req, res, next) {
    try {
      const user = await AuthService.getCurrentUser(req.user.id);
      return sendSuccess(res, 200, 'Current user profile fetched successfully', { user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle user logout
   * POST /api/auth/logout
   */
  static async logout(req, res, next) {
    try {
      // In JWT-based stateless authentication, client destroys the stored token
      return sendSuccess(res, 200, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
