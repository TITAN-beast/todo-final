const { getSupabase } = require('../config/supabase');

/**
 * Todo Model - Handles database operations for the `todos` table
 */
class TodoModel {
  /**
   * Find all todos belonging to a specific user
   * @param {string} userId - UUID
   * @returns {Promise<Array>}
   */
  static async findAllByUserId(userId) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('todos')
      .select('id, user_id, title, description, completed, created_at, updated_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Database error while fetching todos: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Find a single todo by its ID and owner's user ID
   * @param {string} id - Todo UUID
   * @param {string} userId - User UUID
   * @returns {Promise<object|null>}
   */
  static async findByIdAndUserId(id, userId) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('todos')
      .select('id, user_id, title, description, completed, created_at, updated_at')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw new Error(`Database error while fetching todo: ${error.message}`);
    }

    return data;
  }

  /**
   * Create a new todo item for a user
   * @param {object} params
   * @param {string} params.userId
   * @param {string} params.title
   * @param {string} [params.description]
   * @returns {Promise<object>}
   */
  static async create({ userId, title, description = null }) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('todos')
      .insert([
        {
          user_id: userId,
          title: title.trim(),
          description: description !== undefined && description !== null ? description.trim() : null,
          completed: false,
        },
      ])
      .select('id, user_id, title, description, completed, created_at, updated_at')
      .single();

    if (error) {
      throw new Error(`Database error while creating todo: ${error.message}`);
    }

    return data;
  }

  /**
   * Update a todo owned by the specified user
   * @param {string} id - Todo UUID
   * @param {string} userId - User UUID
   * @param {object} updates - Fields to update { title, description, completed }
   * @returns {Promise<object|null>}
   */
  static async update(id, userId, updates) {
    const supabase = getSupabase();
    const sanitizedUpdates = {};

    if (updates.title !== undefined) {
      sanitizedUpdates.title = updates.title.trim();
    }
    if (updates.description !== undefined) {
      sanitizedUpdates.description = updates.description !== null ? updates.description.trim() : null;
    }
    if (updates.completed !== undefined) {
      sanitizedUpdates.completed = Boolean(updates.completed);
    }

    const { data, error } = await supabase
      .from('todos')
      .update(sanitizedUpdates)
      .eq('id', id)
      .eq('user_id', userId)
      .select('id, user_id, title, description, completed, created_at, updated_at')
      .maybeSingle();

    if (error) {
      throw new Error(`Database error while updating todo: ${error.message}`);
    }

    return data;
  }

  /**
   * Delete a todo owned by the specified user
   * @param {string} id - Todo UUID
   * @param {string} userId - User UUID
   * @returns {Promise<boolean>}
   */
  static async delete(id, userId) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
      .select('id')
      .maybeSingle();

    if (error) {
      throw new Error(`Database error while deleting todo: ${error.message}`);
    }

    return Boolean(data);
  }
}

module.exports = TodoModel;
