class NotificationService {
  constructor() {
    this.hasPermission = false;
    this.checkPermission();
  }

  async checkPermission() {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    try {
      if (Notification.permission === 'granted') {
        this.hasPermission = true;
        return true;
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        this.hasPermission = permission === 'granted';
        return this.hasPermission;
      }
      return false;
    } catch (error) {
      console.error('Error checking notification permission:', error);
      return false;
    }
  }

  async requestPermission() {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.hasPermission = permission === 'granted';
      return this.hasPermission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  showNotification(title, options = {}) {
    if (!this.hasPermission) {
      console.log('Notification permission not granted');
      return false;
    }

    try {
      const defaultOptions = {
        icon: '/logo192.png',
        badge: '/logo192.png',
        vibrate: [200, 100, 200],
        requireInteraction: true
      };

      new Notification(title, { ...defaultOptions, ...options });
      return true;
    } catch (error) {
      console.error('Error showing notification:', error);
      return false;
    }
  }

  showTaskReminder(task) {
    if (!task.reminder) return false;

    try {
      const reminderTime = new Date(task.reminder);
      const now = new Date();
      const timeDiff = reminderTime - now;

      if (timeDiff > 0 && timeDiff <= 3600000) { // Within 1 hour
        return this.showNotification('Task Reminder', {
          body: `"${task.title}" is due in less than an hour!`,
          tag: `task-${task.id}`,
          data: { taskId: task.id }
        });
      }
      return false;
    } catch (error) {
      console.error('Error showing task reminder:', error);
      return false;
    }
  }

  showTaskOverdue(task) {
    if (!task.dueDate || task.completed) return false;

    try {
      const dueDate = new Date(task.dueDate);
      const now = new Date();

      if (dueDate < now) {
        return this.showNotification('Task Overdue', {
          body: `"${task.title}" is overdue!`,
          tag: `task-${task.id}`,
          data: { taskId: task.id }
        });
      }
      return false;
    } catch (error) {
      console.error('Error showing task overdue notification:', error);
      return false;
    }
  }

  showTaskCompleted(task) {
    try {
      return this.showNotification('Task Completed', {
        body: `"${task.title}" has been completed!`,
        tag: `task-${task.id}`,
        data: { taskId: task.id }
      });
    } catch (error) {
      console.error('Error showing task completed notification:', error);
      return false;
    }
  }

  showTaskCreated(task) {
    try {
      return this.showNotification('New Task Created', {
        body: `"${task.title}" has been added to your tasks.`,
        tag: `task-${task.id}`,
        data: { taskId: task.id }
      });
    } catch (error) {
      console.error('Error showing task created notification:', error);
      return false;
    }
  }

  showTaskUpdated(task) {
    try {
      return this.showNotification('Task Updated', {
        body: `"${task.title}" has been updated.`,
        tag: `task-${task.id}`,
        data: { taskId: task.id }
      });
    } catch (error) {
      console.error('Error showing task updated notification:', error);
      return false;
    }
  }

  showTaskDeleted(task) {
    try {
      return this.showNotification('Task Deleted', {
        body: `"${task.title}" has been deleted.`,
        tag: `task-${task.id}`,
        data: { taskId: task.id }
      });
    } catch (error) {
      console.error('Error showing task deleted notification:', error);
      return false;
    }
  }

  showError(message) {
    try {
      return this.showNotification('Error', {
        body: message,
        tag: 'error',
        icon: '/error-icon.png'
      });
    } catch (error) {
      console.error('Error showing error notification:', error);
      return false;
    }
  }

  showSuccess(message) {
    try {
      return this.showNotification('Success', {
        body: message,
        tag: 'success',
        icon: '/success-icon.png'
      });
    } catch (error) {
      console.error('Error showing success notification:', error);
      return false;
    }
  }
}

export default new NotificationService(); 