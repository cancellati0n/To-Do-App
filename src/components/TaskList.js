import React, { useState } from 'react';
import { format } from 'date-fns';
import './TaskList.css';

function TaskList({ tasks, onTaskClick, onTaskComplete, onTaskDelete, viewMode = 'list' }) {
  const [selectedTask, setSelectedTask] = useState(null);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    onTaskClick(task);
  };

  const handleTaskComplete = (e, task) => {
    e.stopPropagation();
    onTaskComplete(task.id, !task.completed);
  };

  const handleTaskDelete = (e, task) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      onTaskDelete(task.id);
    }
  };

  const renderTaskItem = (task) => {
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
    const isSelected = selectedTask && selectedTask.id === task.id;

    return (
      <div
        key={task.id}
        className={`task-item ${task.completed ? 'completed' : ''} ${
          isOverdue ? 'overdue' : ''
        } ${isSelected ? 'selected' : ''}`}
        onClick={() => handleTaskClick(task)}
      >
        <div className="task-checkbox">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={(e) => handleTaskComplete(e, task)}
          />
        </div>

        <div className="task-content">
          <div className="task-header">
            <h3 className={task.completed ? 'completed' : ''}>{task.title}</h3>
            <div className="task-meta">
              {task.priority && (
                <span className={`priority-badge ${task.priority}`}>
                  {task.priority}
                </span>
              )}
              {task.category && (
                <span className="category-badge">{task.category}</span>
              )}
            </div>
          </div>

          {task.description && (
            <p className="task-description">{task.description}</p>
          )}

          <div className="task-footer">
            {task.dueDate && (
              <span className={`due-date ${isOverdue ? 'overdue' : ''}`}>
                {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                {task.dueTime && ` at ${task.dueTime}`}
              </span>
            )}

            {task.tags && task.tags.length > 0 && (
              <div className="task-tags">
                {task.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <button
              className="btn btn-icon delete-btn"
              onClick={(e) => handleTaskDelete(e, task)}
            >
              ×
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderGridView = () => (
    <div className="task-grid">
      {tasks.map(renderTaskItem)}
    </div>
  );

  const renderListView = () => (
    <div className="task-list">
      {tasks.map(renderTaskItem)}
    </div>
  );

  const renderKanbanView = () => {
    const columns = {
      pending: tasks.filter(task => !task.completed),
      completed: tasks.filter(task => task.completed)
    };

    return (
      <div className="task-kanban">
        <div className="kanban-column">
          <h3>Pending</h3>
          <div className="kanban-tasks">
            {columns.pending.map(renderTaskItem)}
          </div>
        </div>
        <div className="kanban-column">
          <h3>Completed</h3>
          <div className="kanban-tasks">
            {columns.completed.map(renderTaskItem)}
          </div>
        </div>
      </div>
    );
  };

  if (tasks.length === 0) {
    return (
      <div className="task-empty">
        <p>No tasks found</p>
      </div>
    );
  }

  switch (viewMode) {
    case 'grid':
      return renderGridView();
    case 'kanban':
      return renderKanbanView();
    default:
      return renderListView();
  }
}

export default TaskList; 