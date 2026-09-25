const TodoService = require('../services/todoService');
const { sendSuccess } = require('../utils/response');

class TodoController {
  /**
   * Create a new todo
   * POST /api/todos
   */
  static async createTodo(req, res, next) {
    try {
      const { title, description } = req.body;
      const userId = req.user.id; // Enforced from authenticated token, never user-provided

      const newTodo = await TodoService.createTodo(userId, { title, description });
      return sendSuccess(res, 201, 'Todo created successfully', { todo: newTodo });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all todos for authenticated user
   * GET /api/todos
   */
  static async getTodos(req, res, next) {
    try {
      const userId = req.user.id;
      const todos = await TodoService.getAllTodos(userId);
      return sendSuccess(res, 200, 'Todos retrieved successfully', { todos });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single todo by ID
   * GET /api/todos/:id
   */
  static async getTodoById(req, res, next) {
    try {
      const userId = req.user.id;
      const todoId = req.params.id;

      const todo = await TodoService.getTodoById(userId, todoId);
      return sendSuccess(res, 200, 'Todo retrieved successfully', { todo });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a todo
   * PUT /api/todos/:id
   */
  static async updateTodo(req, res, next) {
    try {
      const userId = req.user.id;
      const todoId = req.params.id;
      const { title, description, completed } = req.body;

      const updatedTodo = await TodoService.updateTodo(userId, todoId, {
        title,
        description,
        completed,
      });

      return sendSuccess(res, 200, 'Todo updated successfully', { todo: updatedTodo });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a todo
   * DELETE /api/todos/:id
   */
  static async deleteTodo(req, res, next) {
    try {
      const userId = req.user.id;
      const todoId = req.params.id;

      await TodoService.deleteTodo(userId, todoId);
      return sendSuccess(res, 200, 'Todo deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TodoController;
