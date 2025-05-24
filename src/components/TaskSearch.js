import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import './TaskSearch.css';

function TaskSearch({ tasks, onSearch, categories, priorities }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    priority: 'all',
    status: 'all',
    dateRange: 'all'
  });
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);

  useEffect(() => {
    const filteredTasks = tasks.filter(task => {
      // Text search
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        task.title.toLowerCase().includes(searchLower) ||
        (task.description && task.description.toLowerCase().includes(searchLower)) ||
        (task.tags && task.tags.some(tag => tag.toLowerCase().includes(searchLower)));

      // Category filter
      const matchesCategory =
        filters.category === 'all' || task.category === filters.category;

      // Priority filter
      const matchesPriority =
        filters.priority === 'all' || task.priority === filters.priority;

      // Status filter
      const matchesStatus =
        filters.status === 'all' ||
        (filters.status === 'completed' && task.completed) ||
        (filters.status === 'pending' && !task.completed) ||
        (filters.status === 'overdue' &&
          !task.completed &&
          task.dueDate &&
          new Date(task.dueDate) < new Date());

      // Date range filter
      let matchesDateRange = true;
      if (filters.dateRange !== 'all' && task.dueDate) {
        const dueDate = new Date(task.dueDate);
        const now = new Date();
        switch (filters.dateRange) {
          case 'today':
            matchesDateRange =
              format(dueDate, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');
            break;
          case 'thisWeek':
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            matchesDateRange = dueDate >= weekStart && dueDate <= weekEnd;
            break;
          case 'thisMonth':
            matchesDateRange =
              dueDate.getMonth() === now.getMonth() &&
              dueDate.getFullYear() === now.getFullYear();
            break;
          case 'overdue':
            matchesDateRange = dueDate < now;
            break;
          default:
            break;
        }
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPriority &&
        matchesStatus &&
        matchesDateRange
      );
    });

    // Sort tasks
    const sortedTasks = [...filteredTasks].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'dueDate':
          if (!a.dueDate) comparison = 1;
          else if (!b.dueDate) comparison = -1;
          else comparison = new Date(a.dueDate) - new Date(b.dueDate);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
          break;
        default:
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    onSearch(sortedTasks);
  }, [tasks, searchQuery, filters, sortBy, sortOrder, onSearch]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSortChange = (key, order) => {
    setSortBy(key);
    setSortOrder(order);
  };

  const handleReset = () => {
    setSearchQuery('');
    setFilters({
      category: 'all',
      priority: 'all',
      status: 'all',
      dateRange: 'all'
    });
    setSortBy('dueDate');
    setSortOrder('asc');
  };

  return (
    <div className="task-search">
      <div className="search-header">
        <div className="search-input">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="btn btn-icon"
            onClick={() => setIsAdvancedSearch(!isAdvancedSearch)}
          >
            {isAdvancedSearch ? '▼' : '▲'}
          </button>
        </div>
        <button className="btn btn-secondary" onClick={handleReset}>
          Reset
        </button>
      </div>

      {isAdvancedSearch && (
        <div className="search-filters">
          <div className="filter-group">
            <label>Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
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
              {priorities.map(priority => (
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
            <label>Date Range</label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
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
                <option value="title">Title</option>
                <option value="category">Category</option>
                <option value="priority">Priority</option>
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

export default TaskSearch; 