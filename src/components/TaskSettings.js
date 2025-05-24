import React, { useState, useEffect } from 'react';
import './TaskSettings.css';

function TaskSettings({ settings, onSave, categories, priorities }) {
  const [localSettings, setLocalSettings] = useState(settings);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleSave = () => {
    onSave(localSettings);
    setIsDirty(false);
  };

  const handleReset = () => {
    setLocalSettings(settings);
    setIsDirty(false);
  };

  return (
    <div className="task-settings">
      <h2>Settings</h2>

      <div className="settings-sections">
        <section className="settings-section">
          <h3>Appearance</h3>
          <div className="settings-group">
            <label>Theme</label>
            <select
              value={localSettings.theme}
              onChange={(e) => handleChange('theme', e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>

          <div className="settings-group">
            <label>Color Scheme</label>
            <select
              value={localSettings.colorScheme}
              onChange={(e) => handleChange('colorScheme', e.target.value)}
            >
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="purple">Purple</option>
              <option value="orange">Orange</option>
            </select>
          </div>
        </section>

        <section className="settings-section">
          <h3>Notifications</h3>
          <div className="settings-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={localSettings.notifications.enabled}
                onChange={(e) =>
                  handleChange('notifications', {
                    ...localSettings.notifications,
                    enabled: e.target.checked
                  })
                }
              />
              Enable Notifications
            </label>
          </div>

          <div className="settings-group">
            <label>Reminder Time</label>
            <select
              value={localSettings.notifications.reminderTime}
              onChange={(e) =>
                handleChange('notifications', {
                  ...localSettings.notifications,
                  reminderTime: e.target.value
                })
              }
              disabled={!localSettings.notifications.enabled}
            >
              <option value="5">5 minutes before</option>
              <option value="15">15 minutes before</option>
              <option value="30">30 minutes before</option>
              <option value="60">1 hour before</option>
            </select>
          </div>

          <div className="settings-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={localSettings.notifications.sound}
                onChange={(e) =>
                  handleChange('notifications', {
                    ...localSettings.notifications,
                    sound: e.target.checked
                  })
                }
                disabled={!localSettings.notifications.enabled}
              />
              Enable Sound
            </label>
          </div>
        </section>

        <section className="settings-section">
          <h3>Default Task Properties</h3>
          <div className="settings-group">
            <label>Default Category</label>
            <select
              value={localSettings.defaults.category}
              onChange={(e) =>
                handleChange('defaults', {
                  ...localSettings.defaults,
                  category: e.target.value
                })
              }
            >
              <option value="">None</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="settings-group">
            <label>Default Priority</label>
            <select
              value={localSettings.defaults.priority}
              onChange={(e) =>
                handleChange('defaults', {
                  ...localSettings.defaults,
                  priority: e.target.value
                })
              }
            >
              <option value="">None</option>
              {priorities.map(priority => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="settings-section">
          <h3>Display</h3>
          <div className="settings-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={localSettings.display.showCompleted}
                onChange={(e) =>
                  handleChange('display', {
                    ...localSettings.display,
                    showCompleted: e.target.checked
                  })
                }
              />
              Show Completed Tasks
            </label>
          </div>

          <div className="settings-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={localSettings.display.groupByCategory}
                onChange={(e) =>
                  handleChange('display', {
                    ...localSettings.display,
                    groupByCategory: e.target.checked
                  })
                }
              />
              Group Tasks by Category
            </label>
          </div>

          <div className="settings-group">
            <label>Tasks per Page</label>
            <select
              value={localSettings.display.tasksPerPage}
              onChange={(e) =>
                handleChange('display', {
                  ...localSettings.display,
                  tasksPerPage: parseInt(e.target.value)
                })
              }
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </section>
      </div>

      <div className="settings-actions">
        <button
          className="btn btn-secondary"
          onClick={handleReset}
          disabled={!isDirty}
        >
          Reset
        </button>
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={!isDirty}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default TaskSettings; 