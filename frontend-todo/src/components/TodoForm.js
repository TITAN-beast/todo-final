import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

const TodoForm = ({ onAddTodo, disabled }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setValidationError('Please enter a todo title');
      return;
    }

    setValidationError('');
    setIsSubmitting(true);

    try {
      const result = await onAddTodo({
        title: title.trim(),
        description: description.trim() || undefined,
      });

      if (result?.success) {
        setTitle('');
        setDescription('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="todo-form-card" id="todo-form-card">
      <h2>
        <PlusCircle size={20} color="var(--accent-primary)" />
        <span>Add New Todo</span>
      </h2>

      <form onSubmit={handleSubmit} className="todo-form" id="create-todo-form">
        <div className="form-group">
          <label htmlFor="todo-title-input" className="form-label">
            Title <span style={{ color: 'var(--accent-primary)' }}>*</span>
          </label>
          <input
            id="todo-title-input"
            type="text"
            className="form-input no-icon"
            placeholder="What needs to be done? (e.g. Learn React)"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (validationError) setValidationError('');
            }}
            disabled={disabled || isSubmitting}
            maxLength={255}
          />
          {validationError && (
            <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
              {validationError}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="todo-desc-input" className="form-label">
            Description <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>(optional)</span>
          </label>
          <textarea
            id="todo-desc-input"
            className="form-textarea"
            placeholder="Add extra notes, context, or instructions..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={disabled || isSubmitting}
            rows={2}
          />
        </div>

        <div className="todo-form-actions">
          <button
            type="submit"
            className="btn-add-todo"
            id="btn-submit-todo"
            disabled={disabled || isSubmitting || !title.trim()}
          >
            <PlusCircle size={17} />
            <span>{isSubmitting ? 'Adding...' : 'Add Todo'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default TodoForm;
