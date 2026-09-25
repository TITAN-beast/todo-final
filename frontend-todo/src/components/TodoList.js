import React, { useState, useMemo } from 'react';
import { Search, Inbox, CheckCircle2 } from 'lucide-react';
import TodoItem from './TodoItem';

const TodoList = ({ todos, onToggle, onUpdate, onDelete }) => {
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      // 1. Status Filter
      if (filter === 'active' && todo.completed) return false;
      if (filter === 'completed' && !todo.completed) return false;

      // 2. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = todo.title?.toLowerCase().includes(query);
        const matchesDesc = todo.description?.toLowerCase().includes(query);
        return matchesTitle || matchesDesc;
      }

      return true;
    });
  }, [todos, filter, searchQuery]);

  return (
    <div className="todo-list-wrapper" id="todo-list-section">
      {/* Controls Bar */}
      <div className="controls-bar">
        <div className="filter-tabs" id="filter-tabs-group" role="tablist">
          <button
            type="button"
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            id="tab-filter-all"
            role="tab"
            aria-selected={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            All ({todos.length})
          </button>
          <button
            type="button"
            className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
            id="tab-filter-active"
            role="tab"
            aria-selected={filter === 'active'}
            onClick={() => setFilter('active')}
          >
            Active ({todos.filter((t) => !t.completed).length})
          </button>
          <button
            type="button"
            className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
            id="tab-filter-completed"
            role="tab"
            aria-selected={filter === 'completed'}
            onClick={() => setFilter('completed')}
          >
            Completed ({todos.filter((t) => t.completed).length})
          </button>
        </div>

        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            id="todo-search-input"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Todo Items List */}
      {filteredTodos.length > 0 ? (
        <div className="todo-list" id="todo-items-container">
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state" id="todo-empty-state">
          {todos.length === 0 ? (
            <>
              <div className="empty-state-icon">
                <Inbox size={28} />
              </div>
              <h3>No tasks created yet</h3>
              <p>Add your first task above to start organizing your day.</p>
            </>
          ) : (
            <>
              <div className="empty-state-icon">
                <CheckCircle2 size={28} />
              </div>
              <h3>No matching tasks found</h3>
              <p>Try adjusting your search query or filter selection.</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TodoList;
