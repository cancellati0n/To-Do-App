import React, { useState } from 'react';
import './TaskFilter.css';

function TaskFilter({ onFilterChange, onSortChange, categories, priorities }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    priority: 'all',
    status: 'all',
    dueDate: 'all',
    search: ''
  });
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (key, order) => {
    setSortBy(key);
    setSortOrder(order);
    onSortChange(key, order);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    handleFilterChange('search', value);
  };

  const handleReset = () => {
    const defaultFilters = {
      category: 'all',
      priority: 'all',
      status: 'all',
      dueDate: 'all',
      search: ''
    };
    setFilters(defaultFilters);
    setSortBy('dueDate');
    setSortOrder('asc');
    onFilterChange(defaultFilters);
    onSortChange('dueDate', 'asc');
  };

  return (
    <div className="task-filter">
      <div className="filter-header">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={handleSearchChange}
          />
          <button
            className="btn btn-icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '▼' : '▲'}
          </button>
        </div>
        <button className="btn btn-secondary" onClick={handleReset}>
          Reset
        </button>
      </div>

      {isExpanded && (
        <div className="filter-options">
          <div className="filter-group">
            <label>Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            >
              <option value="all">All Priorities</option>
              {priorities.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Due Date</label>
            <select
              value={filters.dueDate}
              onChange={(e) => handleFilterChange('dueDate', e.target.value)}
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="thisWeek">This Week</option>
              <option value="nextWeek">Next Week</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <div className="sort-options">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value, sortOrder)}
              >
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
                <option value="category">Category</option>
                <option value="createdAt">Created Date</option>
              </select>
              <button
                className="btn btn-icon"
                onClick={() => handleSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskFilter; 