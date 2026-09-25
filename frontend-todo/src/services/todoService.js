import { api } from './api';

export const todoService = {
  /**
   * Fetch all todos for the authenticated user
   */
  getTodos: async () => {
    return await api.get('/todos');
  },

  /**
   * Fetch a single todo by ID
   */
  getTodoById: async (id) => {
    return await api.get(`/todos/${id}`);
  },

  /**
   * Create a new todo
   * @param {object} todoData
   * @param {string} todoData.title
   * @param {string} [todoData.description]
   */
  createTodo: async (todoData) => {
    return await api.post('/todos', todoData);
  },

  /**
   * Update an existing todo
   * @param {string} id
   * @param {object} updates
   */
  updateTodo: async (id, updates) => {
    return await api.put(`/todos/${id}`, updates);
  },

  /**
   * Delete a todo
   * @param {string} id
   */
  deleteTodo: async (id) => {
    return await api.delete(`/todos/${id}`);
  },
};
