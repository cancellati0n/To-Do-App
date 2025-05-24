import React, { useState } from 'react';
import './TaskExport.css';

function TaskExport({ tasks, onImport }) {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState(null);

  const handleExport = () => {
    setIsExporting(true);
    try {
      const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        tasks: tasks.map(task => ({
          ...task,
          id: undefined, // Remove Firebase IDs
          userId: undefined // Remove user IDs
        }))
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tasks-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting tasks:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsImporting(true);
    setImportError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target.result);
        
        // Validate import data
        if (!importData.version || !importData.tasks || !Array.isArray(importData.tasks)) {
          throw new Error('Invalid import file format');
        }

        // Validate each task
        const validTasks = importData.tasks.filter(task => {
          return (
            task.title &&
            typeof task.title === 'string' &&
            task.category &&
            typeof task.category === 'string' &&
            task.priority &&
            typeof task.priority === 'string'
          );
        });

        if (validTasks.length === 0) {
          throw new Error('No valid tasks found in import file');
        }

        onImport(validTasks);
      } catch (error) {
        console.error('Error importing tasks:', error);
        setImportError(error.message);
      } finally {
        setIsImporting(false);
      }
    };

    reader.onerror = () => {
      setImportError('Error reading file');
      setIsImporting(false);
    };

    reader.readAsText(file);
  };

  return (
    <div className="task-export">
      <div className="export-actions">
        <button
          onClick={handleExport}
          disabled={isExporting || tasks.length === 0}
          className="export-button"
        >
          {isExporting ? 'Exporting...' : 'Export Tasks'}
        </button>

        <div className="import-container">
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            disabled={isImporting}
            id="import-input"
            className="import-input"
          />
          <label htmlFor="import-input" className="import-button">
            {isImporting ? 'Importing...' : 'Import Tasks'}
          </label>
        </div>
      </div>

      {importError && (
        <div className="import-error">
          <p>Error: {importError}</p>
        </div>
      )}

      <div className="export-info">
        <h3>Export/Import Information</h3>
        <ul>
          <li>Exported files contain all your tasks in JSON format</li>
          <li>You can import previously exported files</li>
          <li>Task IDs and user IDs are removed during export</li>
          <li>Only valid tasks will be imported</li>
          <li>Importing will not delete existing tasks</li>
        </ul>
      </div>
    </div>
  );
}

export default TaskExport; 