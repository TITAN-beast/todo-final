const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');
const { generateToken } = require('../utils/jwt');

const BCRYPT_SALT_ROUNDS = 10;

class AuthService {
  /**
   * Register a new user
   * @param {object} params
   * @param {string} params.name
   * @param {string} params.email
   * @param {string} params.password
   * @returns {Promise<{ user: object, token: string }>}
   */
  static async register({ name, email, password }) {
    // 1. Check whether email already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      const error = new Error('An account with this email address already exists');
      error.statusCode = 409;
      throw error;
    }

    // 2. Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    // 3. Store user in database
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    // 4. Generate JWT authentication token
    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
    });

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.created_at,
        updatedAt: newUser.updated_at,
      },
      token,
    };
  }

  /**
   * Authenticate user with email and password
   * @param {object} params
   * @param {string} params.email
   * @param {string} params.password
   * @returns {Promise<{ user: object, token: string }>}
   */
  static async login({ email, password }) {
    // 1. Find user by email
    const user = await UserModel.findByEmail(email);
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // 2. Verify password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // 3. Generate JWT authentication token
    const token = generateToken({
      id: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
      token,
    };
  }

  /**
   * Get current authenticated user details
   * @param {string} userId
   * @returns {Promise<object>}
   */
  static async getCurrentUser(userId) {
    const user = await UserModel.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }
}

module.exports = AuthService;
