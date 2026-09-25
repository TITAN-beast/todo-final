import { useState, useEffect, useCallback } from 'react';
import { todoService } from '../services/todoService';

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await todoService.getTodos();
      if (response && response.data && Array.isArray(response.data.todos)) {
        setTodos(response.data.todos);
      }
    } catch (err) {
      setError(err.message || 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = async ({ title, description }) => {
    try {
      setError(null);
      const response = await todoService.createTodo({ title, description });
      const newTodo = response.data?.todo;
      if (newTodo) {
        setTodos((prev) => [newTodo, ...prev]);
      }
      return { success: true, todo: newTodo };
    } catch (err) {
      setError(err.message || 'Failed to create todo');
      return { success: false, error: err.message };
    }
  };

  const updateTodo = async (id, updates) => {
    const previousTodos = [...todos];
    // Optimistic update
    setTodos((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );

    try {
      setError(null);
      const response = await todoService.updateTodo(id, updates);
      const updated = response.data?.todo;
      if (updated) {
        setTodos((prev) =>
          prev.map((item) => (item.id === id ? updated : item))
        );
      }
      return { success: true, todo: updated };
    } catch (err) {
      // Rollback on failure
      setTodos(previousTodos);
      setError(err.message || 'Failed to update todo');
      return { success: false, error: err.message };
    }
  };

  const toggleTodo = async (id, currentCompleted) => {
    return await updateTodo(id, { completed: !currentCompleted });
  };

  const deleteTodo = async (id) => {
    const previousTodos = [...todos];
    // Optimistic delete
    setTodos((prev) => prev.filter((item) => item.id !== id));

    try {
      setError(null);
      await todoService.deleteTodo(id);
      return { success: true };
    } catch (err) {
      // Rollback on failure
      setTodos(previousTodos);
      setError(err.message || 'Failed to delete todo');
      return { success: false, error: err.message };
    }
  };

  return {
    todos,
    loading,
    error,
    clearError: () => setError(null),
    refreshTodos: fetchTodos,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
  };
};
