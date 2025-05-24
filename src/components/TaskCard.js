import React, { useState } from 'react';
import './TaskCard.css';

function TaskCard({ task, onUpdate, onDelete, onToggleComplete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedTask(task);
  };

  const handleSave = async () => {
    await onUpdate(editedTask);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTask(task);
    setIsEditing(false);
  };

  const handleDateChange = (e) => {
    setEditedTask({
      ...editedTask,
      dueDate: e.target.value ? new Date(e.target.value).toISOString() : null
    });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  const getPriorityColor = (priority) => {
    const colors = {
      low: '#4CAF50',
      medium: '#FF9800',
      high: '#F44336'
    };
    return colors[priority] || colors.medium;
  };

  const getCategoryColor = (category) => {
    const colors = {
      general: '#808080',
      work: '#4CAF50',
      personal: '#2196F3',
      shopping: '#FF9800',
      health: '#F44336'
    };
    return colors[category] || colors.general;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  return (
    <div 
      className={`task-card ${isExpanded ? 'expanded' : ''} ${isOverdue ? 'overdue' : ''}`}
      style={{ 
        borderLeft: `4px solid ${getCategoryColor(task.category)}`,
        borderRight: `4px solid ${getPriorityColor(task.priority)}`
      }}
    >
      {isEditing ? (
        <div className="task-edit-form">
          <input
            type="text"
            value={editedTask.title}
            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
            className="task-title-input"
            placeholder="Task title"
          />
          <textarea
            value={editedTask.description || ''}
            onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
            className="task-description-input"
            placeholder="Task description"
          />
          <div className="task-edit-controls">
            <select
              value={editedTask.priority}
              onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
              className="task-priority-select"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <select
              value={editedTask.category}
              onChange={(e) => setEditedTask({ ...editedTask, category: e.target.value })}
              className="task-category-select"
            >
              <option value="general">General</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="shopping">Shopping</option>
              <option value="health">Health</option>
            </select>
            <input
              type="datetime-local"
              value={editedTask.dueDate ? new Date(editedTask.dueDate).toISOString().slice(0, 16) : ''}
              onChange={handleDateChange}
              className="task-date-input"
            />
          </div>
          <div className="task-edit-actions">
            <button onClick={handleSave} className="save-button">Save</button>
            <button onClick={handleCancel} className="cancel-button">Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="task-header" onClick={() => setIsExpanded(!isExpanded)}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={(e) => onToggleComplete(task.id, e.target.checked)}
              className="task-checkbox"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="task-title-container">
              <h3 className={`task-title ${task.completed ? 'completed' : ''}`}>
                {task.title}
              </h3>
              {isOverdue && (
                <span className="overdue-badge">Overdue</span>
              )}
            </div>
            <div className="task-meta">
              {task.dueDate && (
                <span className="due-date">
                  Due: {formatDate(task.dueDate)}
                </span>
              )}
              <span className="category" style={{ color: getCategoryColor(task.category) }}>
                {task.category}
              </span>
              <span className="priority" style={{ color: getPriorityColor(task.priority) }}>
                {task.priority}
              </span>
            </div>
          </div>
          {isExpanded && (
            <div className="task-details">
              {task.description && (
                <p className="task-description">{task.description}</p>
              )}
              <div className="task-actions">
                <button onClick={handleEdit} className="edit-button">
                  Edit
                </button>
                <button onClick={() => onDelete(task.id)} className="delete-button">
                  Delete
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TaskCard; 