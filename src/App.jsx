import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Sun, 
  Moon, 
  Search, 
  SlidersHorizontal, 
  RotateCcw,
  Inbox,
  Filter
} from 'lucide-react';
import TodoStats from './components/TodoStats';
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';

// Initial preloaded tasks for demonstration
const defaultTodos = [
  {
    id: 'demo-1',
    text: 'Design a glassmorphic dashboard interface 🎨',
    category: 'Work',
    priority: 'High',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    completed: false
  },
  {
    id: 'demo-2',
    text: 'Review project guidelines & checklist 📝',
    category: 'Work',
    priority: 'Medium',
    dueDate: new Date().toISOString().split('T')[0], // Today
    completed: true
  },
  {
    id: 'demo-3',
    text: 'Pick up fresh ingredients for dinner 🥗',
    category: 'Shopping',
    priority: 'Low',
    dueDate: null,
    completed: false
  },
  {
    id: 'demo-4',
    text: 'Morning mindfulness & meditation 🧘',
    category: 'Personal',
    priority: 'Low',
    dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday (Overdue)
    completed: false
  }
];

export default function App() {
  // --- STATE ---
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('aura_todos');
    return saved ? JSON.parse(saved) : defaultTodos;
  });

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('aura_theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Active' | 'Completed'
  const [categoryFilter, setCategoryFilter] = useState('All'); // 'All' | 'Personal' | 'Work' | 'Shopping' | 'Other'
  const [priorityFilter, setPriorityFilter] = useState('All'); // 'All' | 'Low' | 'Medium' | 'High'

  // --- EFFECTS ---
  // Save todos to localStorage
  useEffect(() => {
    localStorage.setItem('aura_todos', JSON.stringify(todos));
  }, [todos]);

  // Apply theme class to HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light-mode');
    } else {
      root.classList.remove('light-mode');
    }
    localStorage.setItem('aura_theme', theme);
  }, [theme]);

  // --- ACTIONS ---
  const handleAddTodo = (newTodoData) => {
    const newTodo = {
      id: `task-${Date.now()}`,
      ...newTodoData,
      completed: false
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const handleToggleTodo = (id) => {
    setTodos((prev) => 
      prev.map((todo) => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const handleEditTodo = (id, updatedFields) => {
    setTodos((prev) => 
      prev.map((todo) => 
        todo.id === id ? { ...todo, ...updatedFields } : todo
      )
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setCategoryFilter('All');
    setPriorityFilter('All');
  };

  // --- DERIVED STATE ---
  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  const isFilterActive = 
    searchQuery !== '' || 
    statusFilter !== 'All' || 
    categoryFilter !== 'All' || 
    priorityFilter !== 'All';

  // Apply search and filters
  const filteredTodos = todos.filter((todo) => {
    // 1. Search filter
    const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 2. Status filter
    let matchesStatus = true;
    if (statusFilter === 'Active') matchesStatus = !todo.completed;
    if (statusFilter === 'Completed') matchesStatus = todo.completed;

    // 3. Category filter
    const matchesCategory = categoryFilter === 'All' || todo.category === categoryFilter;

    // 4. Priority filter
    const matchesPriority = priorityFilter === 'All' || todo.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  return (
    <div className="app-container" id="aura-todo-app-root">
      {/* Brand & Theme Header */}
      <header className="app-header">
        <div className="brand-section">
          <div className="brand-logo">
            <CheckSquare size={24} strokeWidth={2.5} />
          </div>
          <div className="app-title-wrapper">
            <h1>Aura Todo</h1>
            <p>Your minimalist workspace</p>
          </div>
        </div>

        <button 
          type="button" 
          className="theme-toggle-btn"
          id="theme-toggle-btn"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      {/* Progress & Quick Stats Dashboard */}
      <TodoStats total={totalCount} completed={completedCount} />

      {/* Interactive Todo Entry Form */}
      <TodoForm onAddTodo={handleAddTodo} />

      {/* Filter and Search controls */}
      <section className="controls-container">
        <div className="search-and-filters">
          {/* Text Search */}
          <div className="search-wrapper">
            <Search className="search-icon" size={14} />
            <input
              type="text"
              className="search-input"
              id="search-input-field"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Completion Status tabs */}
          <div className="filter-tabs">
            <button
              type="button"
              className={`filter-tab ${statusFilter === 'All' ? 'active' : ''}`}
              id="filter-tab-all"
              onClick={() => setStatusFilter('All')}
            >
              All
            </button>
            <button
              type="button"
              className={`filter-tab ${statusFilter === 'Active' ? 'active' : ''}`}
              id="filter-tab-active"
              onClick={() => setStatusFilter('Active')}
            >
              Active
            </button>
            <button
              type="button"
              className={`filter-tab ${statusFilter === 'Completed' ? 'active' : ''}`}
              id="filter-tab-completed"
              onClick={() => setStatusFilter('Completed')}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Secondary filters (Category / Priority) */}
        <div className="advanced-filters-row">
          <div className="form-select-wrapper" style={{ flex: 'none', width: '135px', minWidth: 'auto' }}>
            <Filter className="form-select-icon" size={12} />
            <select
              className="form-select"
              id="filter-category-select"
              style={{ fontSize: '12px', padding: '6px 8px 6px 30px' }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
              <option value="Shopping">Shopping</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-select-wrapper" style={{ flex: 'none', width: '135px', minWidth: 'auto' }}>
            <SlidersHorizontal className="form-select-icon" size={12} />
            <select
              className="form-select"
              id="filter-priority-select"
              style={{ fontSize: '12px', padding: '6px 8px 6px 30px' }}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
          </div>

          {isFilterActive && (
            <button 
              type="button" 
              className="reset-filters-btn"
              id="reset-filters-btn"
              onClick={handleResetFilters}
            >
              <RotateCcw size={12} />
              Reset Filters
            </button>
          )}
        </div>
      </section>

      {/* Todo List View */}
      <main className="todo-list-container" id="todo-list-viewport">
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggleTodo}
              onDelete={handleDeleteTodo}
              onEdit={handleEditTodo}
            />
          ))
        ) : (
          <div className="empty-state" id="empty-state-view">
            <Inbox size={32} strokeWidth={1.5} />
            <h3>No tasks found</h3>
            <p>
              {isFilterActive 
                ? "Try adjusting or clearing your filters to view more tasks." 
                : "Your workspace is clear. Type a task above to get started!"}
            </p>
            {isFilterActive && (
              <button 
                type="button" 
                className="submit-btn" 
                style={{ padding: '8px 16px', fontSize: '13px', marginTop: '4px' }}
                onClick={handleResetFilters}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="app-footer">
        <p>Aura Todo Workspace © 2026. Made with ❤️ and Minimal Code.</p>
      </footer>
    </div>
  );
}
