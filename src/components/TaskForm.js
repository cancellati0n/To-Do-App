import React, { useState, useEffect } from 'react';
import './TaskForm.css';

function TaskForm({ task, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    priority: 'medium',
    dueDate: '',
    dueTime: '',
    reminder: '',
    tags: [],
    notes: ''
  });

  useEffect(() => {
    if (task) {
      const dueDate = task.dueDate ? new Date(task.dueDate) : null;
      setFormData({
        title: task.title,
        description: task.description || '',
        category: task.category,
        priority: task.priority,
        dueDate: dueDate ? dueDate.toISOString().split('T')[0] : '',
        dueTime: dueDate ? dueDate.toTimeString().slice(0, 5) : '',
        reminder: task.reminder || '',
        tags: task.tags || [],
        notes: task.notes || ''
      });
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const dueDateTime = formData.dueDate && formData.dueTime
      ? new Date(`${formData.dueDate}T${formData.dueTime}`).toISOString()
      : null;

    const reminderDateTime = formData.reminder
      ? new Date(formData.reminder).toISOString()
      : null;

    onSubmit({
      ...formData,
      dueDate: dueDateTime,
      reminder: reminderDateTime
    });
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
      e.target.value = '';
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-header">
        <h2>{task ? 'Edit Task' : 'New Task'}</h2>
        <button type="button" onClick={onCancel} className="close-button">
          ×
        </button>
      </div>

      <div className="form-group">
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Task title"
          className="task-title-input"
          required
        />
      </div>

      <div className="form-group">
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Task description"
          className="task-description-input"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="category-select"
          >
            <option value="general">General</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="shopping">Shopping</option>
            <option value="health">Health</option>
          </select>
        </div>

        <div className="form-group">
          <label>Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
            className="priority-select"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
            className="date-input"
          />
        </div>

        <div className="form-group">
          <label>Due Time</label>
          <input
            type="time"
            value={formData.dueTime}
            onChange={(e) => setFormData(prev => ({ ...prev, dueTime: e.target.value }))}
            className="time-input"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Reminder</label>
        <input
          type="datetime-local"
          value={formData.reminder}
          onChange={(e) => setFormData(prev => ({ ...prev, reminder: e.target.value }))}
          className="reminder-input"
        />
      </div>

      <div className="form-group">
        <label>Tags</label>
        <div className="tags-container">
          <input
            type="text"
            placeholder="Add a tag and press Enter"
            onKeyDown={handleTagInput}
            className="tag-input"
          />
          <div className="tags-list">
            {formData.tags.map(tag => (
              <span key={tag} className="tag">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="remove-tag"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Additional notes"
          className="notes-input"
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-button">
          {task ? 'Save Changes' : 'Create Task'}
        </button>
        <button type="button" onClick={onCancel} className="cancel-button">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default TaskForm; 