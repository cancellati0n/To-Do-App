import React, { useState, useRef } from 'react';
import './TaskImport.css';

function TaskImport({ onImport, categories, priorities }) {
  const [importFormat, setImportFormat] = useState('csv');
  const [importError, setImportError] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef(null);

  const validateTask = (task) => {
    const errors = [];

    if (!task.title) {
      errors.push('Title is required');
    }

    if (task.category && !categories.includes(task.category)) {
      errors.push(`Invalid category: ${task.category}`);
    }

    if (task.priority && !priorities.includes(task.priority)) {
      errors.push(`Invalid priority: ${task.priority}`);
    }

    if (task.dueDate) {
      const date = new Date(task.dueDate);
      if (isNaN(date.getTime())) {
        errors.push('Invalid due date format');
      }
    }

    if (task.dueTime) {
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(task.dueTime)) {
        errors.push('Invalid due time format (HH:mm)');
      }
    }

    if (task.reminder) {
      const date = new Date(task.reminder);
      if (isNaN(date.getTime())) {
        errors.push('Invalid reminder date format');
      }
    }

    if (task.tags && !Array.isArray(task.tags)) {
      errors.push('Tags must be an array');
    }

    return errors;
  };

  const parseCSV = (content) => {
    const lines = content.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const tasks = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const task = {};

      headers.forEach((header, index) => {
        if (values[index]) {
          switch (header.toLowerCase()) {
            case 'tags':
              task.tags = values[index].split(',').map(tag => tag.trim());
              break;
            case 'completed':
              task.completed = values[index].toLowerCase() === 'true';
              break;
            default:
              task[header.toLowerCase()] = values[index];
          }
        }
      });

      tasks.push(task);
    }

    return tasks;
  };

  const parseJSON = (content) => {
    try {
      return JSON.parse(content);
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let tasks;
        if (importFormat === 'csv') {
          tasks = parseCSV(e.target.result);
        } else {
          tasks = parseJSON(e.target.result);
        }

        // Validate all tasks
        const validationErrors = [];
        tasks.forEach((task, index) => {
          const errors = validateTask(task);
          if (errors.length > 0) {
            validationErrors.push(`Task ${index + 1}: ${errors.join(', ')}`);
          }
        });

        if (validationErrors.length > 0) {
          setImportError(validationErrors.join('\n'));
          return;
        }

        // Process valid tasks
        const processedTasks = tasks.map(task => ({
          ...task,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));

        onImport(processedTasks);
        setImportError(null);
      } catch (error) {
        setImportError(error.message);
      }
    };

    reader.onerror = () => {
      setImportError('Error reading file');
    };

    if (importFormat === 'csv') {
      reader.readAsText(file);
    } else {
      reader.readAsText(file);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="task-import">
      <h2>Import Tasks</h2>

      <div className="import-options">
        <div className="import-format">
          <label>Import Format</label>
          <select
            value={importFormat}
            onChange={(e) => setImportFormat(e.target.value)}
          >
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
          </select>
        </div>

        <div className="import-info">
          <h3>Import Requirements</h3>
          <ul>
            <li>CSV files should have headers matching task properties</li>
            <li>JSON files should contain an array of task objects</li>
            <li>Required fields: title</li>
            <li>Optional fields: description, category, priority, dueDate, dueTime, reminder, tags</li>
            <li>Categories must match: {categories.join(', ')}</li>
            <li>Priorities must match: {priorities.join(', ')}</li>
          </ul>
        </div>
      </div>

      {importError && (
        <div className="import-error">
          <h3>Import Errors</h3>
          <pre>{importError}</pre>
        </div>
      )}

      <div className="import-actions">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept={importFormat === 'csv' ? '.csv' : '.json'}
          style={{ display: 'none' }}
        />
        <button
          className="btn btn-primary"
          onClick={handleImportClick}
          disabled={isImporting}
        >
          {isImporting ? 'Importing...' : 'Import Tasks'}
        </button>
      </div>
    </div>
  );
}

export default TaskImport; 