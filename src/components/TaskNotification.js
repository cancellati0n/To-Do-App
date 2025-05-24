import React, { useState, useEffect } from 'react';
import { format, isAfter, isBefore, addMinutes } from 'date-fns';
import './TaskNotification.css';

function TaskNotification({ tasks, onTaskClick }) {
  const [notifications, setNotifications] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date();
      const newNotifications = tasks
        .filter(task => {
          if (task.completed) return false;
          if (!task.dueDate) return false;

          const dueDate = new Date(task.dueDate);
          if (task.dueTime) {
            const [hours, minutes] = task.dueTime.split(':');
            dueDate.setHours(parseInt(hours), parseInt(minutes));
          }

          // Check for overdue tasks
          if (isBefore(dueDate, now)) {
            return true;
          }

          // Check for upcoming tasks (within next 24 hours)
          if (isAfter(dueDate, now) && isBefore(dueDate, addMinutes(now, 1440))) {
            return true;
          }

          // Check for reminders
          if (task.reminder) {
            const reminderDate = new Date(task.reminder);
            return isAfter(reminderDate, now) && isBefore(reminderDate, addMinutes(now, 5));
          }

          return false;
        })
        .map(task => ({
          id: task.id,
          title: task.title,
          type: isBefore(new Date(task.dueDate), now) ? 'overdue' : 'upcoming',
          dueDate: task.dueDate,
          dueTime: task.dueTime,
          priority: task.priority
        }));

      setNotifications(newNotifications);
    };

    // Check notifications immediately
    checkNotifications();

    // Set up interval to check notifications every minute
    const interval = setInterval(checkNotifications, 60000);

    return () => clearInterval(interval);
  }, [tasks]);

  const handleNotificationClick = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      onTaskClick(task);
    }
  };

  const handleDismiss = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="task-notifications">
      <div className="notifications-header">
        <button
          className="btn btn-icon"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '▼' : '▲'}
        </button>
        <span className="notification-count">{notifications.length}</span>
      </div>

      {isExpanded && (
        <div className="notifications-list">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`notification-item ${notification.type} ${
                notification.priority
              }`}
            >
              <div
                className="notification-content"
                onClick={() => handleNotificationClick(notification.id)}
              >
                <h4>{notification.title}</h4>
                <div className="notification-details">
                  <span className="notification-type">
                    {notification.type === 'overdue' ? 'Overdue' : 'Upcoming'}
                  </span>
                  <span className="notification-time">
                    {format(new Date(notification.dueDate), 'MMM dd, yyyy')}
                    {notification.dueTime && ` at ${notification.dueTime}`}
                  </span>
                </div>
              </div>
              <button
                className="btn btn-icon"
                onClick={() => handleDismiss(notification.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskNotification; 