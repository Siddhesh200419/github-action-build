import React, { useState } from 'react';
import { Plus, Tag, AlertOctagon, ClipboardList } from 'lucide-react';

export default function TodoForm({ onAddTodo }) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('Personal');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    onAddTodo({
      text: text.trim(),
      category,
      priority,
      dueDate: dueDate || null,
    });

    setText('');
    setCategory('Personal');
    setPriority('Medium');
    setDueDate('');
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit} id="todo-entry-form">
      <div className="form-row-main">
        <div className="todo-input-wrapper">
          <ClipboardList className="todo-input-icon" size={18} />
          <input
            type="text"
            className="todo-input"
            id="todo-input-field"
            placeholder="Add a new task..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={100}
            required
          />
        </div>
        <button type="submit" className="submit-btn" id="add-todo-btn">
          <Plus size={18} />
          <span>Add</span>
        </button>
      </div>

      <div className="form-row-options">
        <div className="form-select-wrapper">
          <Tag className="form-select-icon" size={14} />
          <select
            className="form-select"
            id="todo-category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Personal">Personal</option>
            <option value="Work">Work</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-select-wrapper">
          <AlertOctagon className="form-select-icon" size={14} />
          <select
            className="form-select"
            id="todo-priority-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
        </div>

        <input
          type="date"
          className="form-date-input"
          id="todo-due-date-input"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
    </form>
  );
}
