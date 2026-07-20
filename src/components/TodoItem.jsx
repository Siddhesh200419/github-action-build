import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Edit3, Calendar, Check } from 'lucide-react';

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [pulse, setPulse] = useState(false);
  const editInputRef = useRef(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const handleToggle = () => {
    if (!todo.completed) {
      setPulse(true);
      setTimeout(() => setPulse(false), 400);
    }
    onToggle(todo.id);
  };

  const handleEditSubmit = () => {
    if (editText.trim() && editText.trim() !== todo.text) {
      onEdit(todo.id, { text: editText.trim() });
    } else {
      setEditText(todo.text);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleEditSubmit();
    if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  const getDueDateInfo = (dateStr) => {
    if (!dateStr) return null;
    
    // Parse user input date in local time
    const [year, month, day] = dateStr.split('-').map(Number);
    const due = new Date(year, month - 1, day);
    due.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: 'Overdue', className: 'overdue' };
    } else if (diffDays === 0) {
      return { text: 'Today', className: 'today' };
    } else if (diffDays === 1) {
      return { text: 'Tomorrow', className: 'tomorrow' };
    } else {
      const options = { month: 'short', day: 'numeric', year: 'numeric' };
      // Check if it's the current year to omit the year for simplicity
      const currentYear = new Date().getFullYear();
      const showOptions = due.getFullYear() === currentYear 
        ? { month: 'short', day: 'numeric' }
        : options;
      return { text: due.toLocaleDateString(undefined, showOptions), className: '' };
    }
  };

  const dateInfo = getDueDateInfo(todo.dueDate);

  return (
    <div 
      className={`todo-item ${todo.completed ? 'completed' : ''} ${pulse ? 'completed-animation' : ''}`}
      id={`todo-item-${todo.id}`}
    >
      <div className="todo-item-left">
        <div className="checkbox-container">
          <button 
            type="button"
            className={`custom-checkbox ${todo.completed ? 'checked' : ''}`}
            onClick={handleToggle}
            aria-label={todo.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
            id={`todo-checkbox-${todo.id}`}
          >
            <Check className="custom-checkbox-icon" size={14} strokeWidth={3} />
          </button>
        </div>

        <div className="todo-content-area">
          {isEditing ? (
            <div className="edit-input-wrapper">
              <input
                ref={editInputRef}
                type="text"
                className="edit-input"
                id={`todo-edit-input-${todo.id}`}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={handleEditSubmit}
                onKeyDown={handleKeyDown}
                maxLength={100}
              />
            </div>
          ) : (
            <span 
              className="todo-title"
              onDoubleClick={() => setIsEditing(true)}
              id={`todo-text-${todo.id}`}
            >
              {todo.text}
            </span>
          )}

          <div className="todo-meta-tags">
            {/* Priority Badge */}
            <span className={`badge badge-priority-${todo.priority.toLowerCase()}`} id={`todo-priority-${todo.id}`}>
              {todo.priority}
            </span>

            {/* Category Badge */}
            <span className={`badge badge-category-${todo.category.toLowerCase()}`} id={`todo-category-${todo.id}`}>
              {todo.category}
            </span>

            {/* Due Date Tag */}
            {dateInfo && (
              <span className={`badge-due-date ${dateInfo.className}`} id={`todo-due-${todo.id}`}>
                <Calendar size={11} />
                <span>{dateInfo.text}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="todo-actions">
        {!isEditing && (
          <button 
            type="button"
            className="action-btn edit"
            onClick={() => setIsEditing(true)}
            aria-label="Edit task title"
            id={`todo-edit-btn-${todo.id}`}
          >
            <Edit3 size={15} />
          </button>
        )}
        <button 
          type="button"
          className="action-btn delete"
          onClick={() => onDelete(todo.id)}
          aria-label="Delete task"
          id={`todo-delete-btn-${todo.id}`}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
