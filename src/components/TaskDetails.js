import React, { useState } from 'react';
import { format } from 'date-fns';
import './TaskDetails.css';

function TaskDetails({ task, onClose, onSubmit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    ...task,
    subtasks: task.subtasks || [],
    tags: task.tags || [],
    description: task.description || '',
    category: task.category || 'personal',
    priority: task.priority || 'medium',
    dueDate: task.dueDate || null,
    dueTime: task.dueTime || '',
    reminder: task.reminder || null
  });

  const handleEdit = () => {
    setIsEditing(true);
    setEditedTask({
      ...task,
      subtasks: task.subtasks || [],
      tags: task.tags || [],
      description: task.description || '',
      category: task.category || 'personal',
      priority: task.priority || 'medium',
      dueDate: task.dueDate || null,
      dueTime: task.dueTime || '',
      reminder: task.reminder || null
    });
  };

  const handleSave = () => {
    onSubmit(editedTask);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTask({
      ...task,
      subtasks: task.subtasks || [],
      tags: task.tags || [],
      description: task.description || '',
      category: task.category || 'personal',
      priority: task.priority || 'medium',
      dueDate: task.dueDate || null,
      dueTime: task.dueTime || '',
      reminder: task.reminder || null
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
      onClose();
    }
  };

  const handleSubtaskToggle = (subtaskId) => {
    const updatedSubtasks = editedTask.subtasks.map(subtask =>
      subtask.id === subtaskId
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    );
    setEditedTask({ ...editedTask, subtasks: updatedSubtasks });
  };

  const handleSubtaskAdd = (e) => {
    e.preventDefault();
    const newSubtask = {
      id: Date.now().toString(),
      title: e.target.subtaskTitle.value,
      completed: false
    };
    setEditedTask({
      ...editedTask,
      subtasks: [...editedTask.subtasks, newSubtask]
    });
    e.target.subtaskTitle.value = '';
  };

  const handleSubtaskDelete = (subtaskId) => {
    const updatedSubtasks = editedTask.subtasks.filter(
      subtask => subtask.id !== subtaskId
    );
    setEditedTask({ ...editedTask, subtasks: updatedSubtasks });
  };

  return (
    <div className="task-details">
      <div className="task-details-header">
        <h2>{isEditing ? 'Edit Task' : 'Task Details'}</h2>
        <div className="task-details-actions">
          {isEditing ? (
            <>
              <button className="btn btn-primary" onClick={handleSave}>
                Save
              </button>
              <button className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-primary" onClick={handleEdit}>
                Edit
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Delete
              </button>
              <button className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
            </>
          )}
        </div>
      </div>

      <div className="task-details-content">
        {isEditing ? (
          <div className="task-edit-form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={editedTask.title}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, title: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={editedTask.description}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, description: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={editedTask.category}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, category: e.target.value })
                }
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="shopping">Shopping</option>
                <option value="health">Health</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                value={editedTask.priority}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, priority: e.target.value })
                }
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                type="date"
                id="dueDate"
                value={editedTask.dueDate ? format(new Date(editedTask.dueDate), 'yyyy-MM-dd') : ''}
                onChange={(e) =>
                  setEditedTask({
                    ...editedTask,
                    dueDate: e.target.value ? new Date(e.target.value).toISOString() : null
                  })
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="dueTime">Due Time</label>
              <input
                type="time"
                id="dueTime"
                value={editedTask.dueTime || ''}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, dueTime: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="reminder">Reminder</label>
              <input
                type="datetime-local"
                id="reminder"
                value={editedTask.reminder ? format(new Date(editedTask.reminder), "yyyy-MM-dd'T'HH:mm") : ''}
                onChange={(e) =>
                  setEditedTask({
                    ...editedTask,
                    reminder: e.target.value ? new Date(e.target.value).toISOString() : null
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Tags</label>
              <div className="tags-input">
                {editedTask.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                    <button
                      type="button"
                      onClick={() =>
                        setEditedTask({
                          ...editedTask,
                          tags: editedTask.tags.filter((_, i) => i !== index)
                        })
                      }
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder="Add a tag"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      e.preventDefault();
                      setEditedTask({
                        ...editedTask,
                        tags: [...editedTask.tags, e.target.value.trim()]
                      });
                      e.target.value = '';
                    }
                  }}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Subtasks</label>
              <form onSubmit={handleSubtaskAdd} className="subtask-form">
                <input
                  type="text"
                  name="subtaskTitle"
                  placeholder="Add a subtask"
                  required
                />
                <button type="submit" className="btn btn-secondary">
                  Add
                </button>
              </form>
              <ul className="subtask-list">
                {editedTask.subtasks.map((subtask) => (
                  <li key={subtask.id} className="subtask-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={() => handleSubtaskToggle(subtask.id)}
                      />
                      <span className={subtask.completed ? 'completed' : ''}>
                        {subtask.title}
                      </span>
                    </label>
                    <button
                      type="button"
                      className="delete-subtask"
                      onClick={() => handleSubtaskDelete(subtask.id)}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="task-view">
            <div className="task-info">
              <h3>{task.title}</h3>
              {task.description && <p className="description">{task.description}</p>}
              
              <div className="task-meta">
                {task.category && (
                  <span className="category-badge">{task.category}</span>
                )}
                {task.priority && (
                  <span className={`priority-badge ${task.priority}`}>
                    {task.priority}
                  </span>
                )}
              </div>

              {task.dueDate && (
                <div className="due-date">
                  <strong>Due:</strong>{' '}
                  {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                  {task.dueTime && ` at ${task.dueTime}`}
                </div>
              )}

              {task.reminder && (
                <div className="reminder">
                  <strong>Reminder:</strong>{' '}
                  {format(new Date(task.reminder), 'MMM dd, yyyy HH:mm')}
                </div>
              )}

              {task.tags && task.tags.length > 0 && (
                <div className="tags">
                  {task.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {task.subtasks && task.subtasks.length > 0 && (
                <div className="subtasks">
                  <h4>Subtasks</h4>
                  <ul>
                    {task.subtasks.map((subtask) => (
                      <li
                        key={subtask.id}
                        className={subtask.completed ? 'completed' : ''}
                      >
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          onChange={() => handleSubtaskToggle(subtask.id)}
                        />
                        <span>{subtask.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskDetails; 