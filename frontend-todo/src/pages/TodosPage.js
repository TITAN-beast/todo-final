import React from 'react';
import { CheckCircle2, Clock, ListTodo } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTodos } from '../hooks/useTodos';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const TodosPage = () => {
  const { user } = useAuth();
  const {
    todos,
    loading,
    error,
    clearError,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
  } = useTodos();

  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = totalCount - completedCount;

  return (
    <div className="todos-page" id="todos-dashboard">
      {/* Header */}
      <div className="todos-header">
        <h1>My Tasks</h1>
        <p>
          Welcome back, <strong style={{ color: 'var(--text-main)' }}>{user?.name || 'User'}</strong>!
          Here is your productivity overview today.
        </p>
      </div>

      {/* Stats Summary Grid */}
      <div className="stats-grid" id="todos-stats-grid">
        <div className="stat-card" id="stat-card-total">
          <div className="stat-icon total">
            <ListTodo size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value" id="stat-value-total">{totalCount}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
        </div>

        <div className="stat-card" id="stat-card-active">
          <div className="stat-icon active">
            <Clock size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value" id="stat-value-active">{activeCount}</span>
            <span className="stat-label">In Progress</span>
          </div>
        </div>

        <div className="stat-card" id="stat-card-completed">
          <div className="stat-icon completed">
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value" id="stat-value-completed">{completedCount}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
      </div>

      {/* Global Error Notice */}
      <ErrorMessage message={error} onDismiss={clearError} />

      {/* Todo Creation Form */}
      <TodoForm onAddTodo={addTodo} disabled={loading} />

      {/* Todo List View */}
      {loading ? (
        <Loading message="Fetching your tasks from database..." />
      ) : (
        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onUpdate={updateTodo}
          onDelete={deleteTodo}
        />
      )}
    </div>
  );
};

export default TodosPage;
