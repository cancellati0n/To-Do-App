import React, { useState, useMemo } from 'react';
import TaskCard from './TaskCard';
import './TodoList.css';

function TodoList({ todos, onUpdate, onDelete, onToggleComplete }) {
  const [sortBy, setSortBy] = useState('priority');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getPriorityWeight = (priority) => {
    const weights = {
      low: 1,
      medium: 2,
      high: 3
    };
    return weights[priority] || 2;
  };

  const sortedAndFilteredTodos = useMemo(() => {
    let filtered = todos;
    
    // Apply category filter
    if (filter !== 'all') {
      filtered = filtered.filter(todo => todo.category === filter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(todo => 
        todo.title.toLowerCase().includes(query) ||
        todo.description?.toLowerCase().includes(query)
      );
    }

    // Sort tasks
    return [...filtered].sort((a, b) => {
      if (sortBy === 'priority') {
        return getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
      } else if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return 0;
    });
  }, [todos, sortBy, filter, searchQuery]);

  const getCategoryCount = (category) => {
    return todos.filter(todo => todo.category === category).length;
  };

  return (
    <div className="todo-list-container">
      <div className="todo-controls">
        <div className="todo-header">
          <h2>Your Tasks</h2>
          <div className="todo-stats">
            <span className="total-tasks">Total: {todos.length}</span>
            <span className="completed-tasks">
              Completed: {todos.filter(t => t.completed).length}
            </span>
          </div>
        </div>
        <div className="todo-filters">
          <div className="search-box">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="search-input"
            />
          </div>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="priority">Sort by Priority</option>
            <option value="dueDate">Sort by Due Date</option>
          </select>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            <option value="general">General ({getCategoryCount('general')})</option>
            <option value="work">Work ({getCategoryCount('work')})</option>
            <option value="personal">Personal ({getCategoryCount('personal')})</option>
            <option value="shopping">Shopping ({getCategoryCount('shopping')})</option>
            <option value="health">Health ({getCategoryCount('health')})</option>
          </select>
        </div>
      </div>
      
      <div className="todo-list-scroll">
        {sortedAndFilteredTodos.length === 0 ? (
          <div className="no-tasks">
            <p>No tasks found</p>
            {searchQuery && <p>Try adjusting your search</p>}
          </div>
        ) : (
          <div className="todo-list">
            {sortedAndFilteredTodos.map(todo => (
              <TaskCard
                key={todo.id}
                task={todo}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onToggleComplete={onToggleComplete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TodoList;
