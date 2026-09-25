import { api } from './api';

export const authService = {
  /**
   * Register a new user
   * @param {object} credentials
   * @param {string} credentials.name
   * @param {string} credentials.email
   * @param {string} credentials.password
   */
  register: async (credentials) => {
    return await api.post('/auth/register', credentials);
  },

  /**
   * Log in user
   * @param {object} credentials
   * @param {string} credentials.email
   * @param {string} credentials.password
   */
  login: async (credentials) => {
    return await api.post('/auth/login', credentials);
  },

  /**
   * Get current authenticated user profile
   */
  getCurrentUser: async () => {
    return await api.get('/auth/me');
  },

  /**
   * Notify server of logout
   */
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    }
  },
};
