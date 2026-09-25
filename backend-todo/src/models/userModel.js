const { getSupabase } = require('../config/supabase');

/**
 * User Model - Handles database operations for the `users` table
 */
class UserModel {
  /**
   * Find a user by their email address
   * @param {string} email
   * @returns {Promise<object|null>}
   */
  static async findByEmail(email) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, password, created_at, updated_at')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (error) {
      throw new Error(`Database error while finding user by email: ${error.message}`);
    }

    return data;
  }

  /**
   * Find a user by their ID
   * @param {string} id - UUID
   * @returns {Promise<object|null>}
   */
  static async findById(id) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, created_at, updated_at')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Database error while finding user by ID: ${error.message}`);
    }

    return data;
  }

  /**
   * Insert a new user into the database
   * @param {object} params
   * @param {string} params.name
   * @param {string} params.email
   * @param {string} params.password - Bcrypt hashed password
   * @returns {Promise<object>} Created user (without password)
   */
  static async create({ name, email, password }) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password,
        },
      ])
      .select('id, name, email, created_at, updated_at')
      .single();

    if (error) {
      throw new Error(`Database error while creating user: ${error.message}`);
    }

    return data;
  }
}

module.exports = UserModel;
