const TodoModel = require('../models/todoModel');

class TodoService {
  /**
   * Create a new todo for the authenticated user
   * @param {string} userId - Authenticated user UUID
   * @param {object} todoData
   * @param {string} todoData.title
   * @param {string} [todoData.description]
   * @returns {Promise<object>}
   */
  static async createTodo(userId, { title, description }) {
    return await TodoModel.create({
      userId,
      title,
      description,
    });
  }

  /**
   * Retrieve all todos belonging to the authenticated user
   * @param {string} userId - Authenticated user UUID
   * @returns {Promise<Array>}
   */
  static async getAllTodos(userId) {
    return await TodoModel.findAllByUserId(userId);
  }

  /**
   * Retrieve a specific todo by ID for the authenticated user
   * @param {string} userId - Authenticated user UUID
   * @param {string} todoId - Todo UUID
   * @returns {Promise<object>}
   */
  static async getTodoById(userId, todoId) {
    const todo = await TodoModel.findByIdAndUserId(todoId, userId);
    if (!todo) {
      const error = new Error('Todo not found');
      error.statusCode = 404;
      throw error;
    }
    return todo;
  }

  /**
   * Update a specific todo for the authenticated user
   * @param {string} userId - Authenticated user UUID
   * @param {string} todoId - Todo UUID
   * @param {object} updates - Fields to update
   * @returns {Promise<object>}
   */
  static async updateTodo(userId, todoId, updates) {
    // Check if the todo exists and belongs to the user
    const existing = await TodoModel.findByIdAndUserId(todoId, userId);
    if (!existing) {
      const error = new Error('Todo not found or you do not have permission to modify it');
      error.statusCode = 404;
      throw error;
    }

    const updatedTodo = await TodoModel.update(todoId, userId, updates);
    return updatedTodo;
  }

  /**
   * Delete a specific todo for the authenticated user
   * @param {string} userId - Authenticated user UUID
   * @param {string} todoId - Todo UUID
   * @returns {Promise<boolean>}
   */
  static async deleteTodo(userId, todoId) {
    // Check if the todo exists and belongs to the user
    const existing = await TodoModel.findByIdAndUserId(todoId, userId);
    if (!existing) {
      const error = new Error('Todo not found or you do not have permission to delete it');
      error.statusCode = 404;
      throw error;
    }

    return await TodoModel.delete(todoId, userId);
  }
}

module.exports = TodoService;
