import React, { useState } from 'react';
import { Pencil, Trash2, Check, X, Calendar } from 'lucide-react';

const TodoItem = ({ todo, onToggle, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    setIsSaving(true);
    try {
      const result = await onUpdate(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || null,
      });
      if (result?.success) {
        setIsEditing(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${todo.title}"?`)) {
      setIsDeleting(true);
      await onDelete(todo.id);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <div
      className={`todo-item ${todo.completed ? 'completed' : ''}`}
      id={`todo-item-${todo.id}`}
    >
      <input
        type="checkbox"
        className="todo-checkbox"
        id={`todo-check-${todo.id}`}
        checked={Boolean(todo.completed)}
        onChange={() => onToggle(todo.id, todo.completed)}
        aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'completed'}`}
      />

      {isEditing ? (
        <form onSubmit={handleSave} className="edit-form" id={`edit-form-${todo.id}`}>
          <input
            type="text"
            className="form-input no-icon"
            id={`edit-title-${todo.id}`}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            disabled={isSaving}
            required
            autoFocus
          />
          <textarea
            className="form-textarea"
            id={`edit-desc-${todo.id}`}
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            disabled={isSaving}
            rows={2}
            placeholder="Description (optional)"
          />
          <div className="edit-actions">
            <button
              type="button"
              className="btn-cancel"
              id={`btn-cancel-${todo.id}`}
              onClick={handleCancelEdit}
              disabled={isSaving}
            >
              <X size={14} style={{ marginRight: '4px' }} />
              Cancel
            </button>
            <button
              type="submit"
              className="btn-save"
              id={`btn-save-${todo.id}`}
              disabled={isSaving || !editTitle.trim()}
            >
              <Check size={14} style={{ marginRight: '4px' }} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="todo-content">
            <div className="todo-title" id={`todo-title-${todo.id}`}>
              {todo.title}
            </div>
            {todo.description && (
              <div className="todo-description" id={`todo-desc-${todo.id}`}>
                {todo.description}
              </div>
            )}
            <div className="todo-meta">
              <Calendar size={13} />
              <span>Created {formatDate(todo.created_at)}</span>
              {todo.completed && (
                <span style={{ color: 'var(--success)', fontWeight: 600 }}>• Completed</span>
              )}
            </div>
          </div>

          <div className="todo-actions">
            <button
              type="button"
              className="btn-icon edit"
              id={`btn-edit-${todo.id}`}
              onClick={() => setIsEditing(true)}
              title="Edit Todo"
              aria-label="Edit todo"
            >
              <Pencil size={15} />
            </button>

            <button
              type="button"
              className="btn-icon delete"
              id={`btn-delete-${todo.id}`}
              onClick={handleDelete}
              disabled={isDeleting}
              title="Delete Todo"
              aria-label="Delete todo"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TodoItem;
