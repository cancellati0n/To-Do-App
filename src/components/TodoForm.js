import React, { useState } from 'react';
import './TodoForm.css'; // Import styles

function TodoForm({ addTodo }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [category, setCategory] = useState('general');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      const dueDateTime = dueDate && dueTime 
        ? new Date(`${dueDate}T${dueTime}`).toISOString()
        : null;

      addTodo({
        title,
        description,
        dueDate: dueDateTime,
        category,
        priority
      });
      setTitle('');
      setDescription('');
      setDueDate('');
      setDueTime('');
      setCategory('general');
      setPriority('medium');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <div className="form-group">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="todo-input"
          required
        />
      </div>
      <div className="form-group">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description (optional)"
          className="todo-textarea"
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="date-input"
          />
        </div>
        <div className="form-group">
          <label>Due Time</label>
          <input
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            className="time-input"
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="priority-select"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
      <button type="submit" className="add-button">Add Task</button>
    </form>
  );
}

export default TodoForm;
