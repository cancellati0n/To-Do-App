class NotificationService {
  constructor() {
    this.hasPermission = false;
    this.checkPermission();
  }

  async checkPermission() {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return;
    }

    if (Notification.permission === 'granted') {
      this.hasPermission = true;
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      this.hasPermission = permission === 'granted';
    }
  }

  async requestPermission() {
    if (!('Notification' in window)) {
      return false;
    }

    const permission = await Notification.requestPermission();
    this.hasPermission = permission === 'granted';
    return this.hasPermission;
  }

  showNotification(title, options = {}) {
    if (!this.hasPermission) {
      console.log('Notification permission not granted');
      return;
    }

    const defaultOptions = {
      icon: '/logo192.png',
      badge: '/logo192.png',
      vibrate: [200, 100, 200],
      requireInteraction: true
    };

    new Notification(title, { ...defaultOptions, ...options });
  }

  showTaskReminder(task) {
    if (!task.reminder) return;

    const reminderTime = new Date(task.reminder);
    const now = new Date();
    const timeDiff = reminderTime - now;

    if (timeDiff > 0 && timeDiff <= 3600000) { // Within 1 hour
      this.showNotification('Task Reminder', {
        body: `"${task.title}" is due in less than an hour!`,
        tag: `task-${task.id}`,
        data: { taskId: task.id }
      });
    }
  }

  showTaskOverdue(task) {
    if (!task.dueDate || task.completed) return;

    const dueDate = new Date(task.dueDate);
    const now = new Date();

    if (dueDate < now) {
      this.showNotification('Task Overdue', {
        body: `"${task.title}" is overdue!`,
        tag: `task-${task.id}`,
        data: { taskId: task.id }
      });
    }
  }

  showTaskCompleted(task) {
    this.showNotification('Task Completed', {
      body: `"${task.title}" has been completed!`,
      tag: `task-${task.id}`,
      data: { taskId: task.id }
    });
  }

  showTaskCreated(task) {
    this.showNotification('New Task Created', {
      body: `"${task.title}" has been added to your tasks.`,
      tag: `task-${task.id}`,
      data: { taskId: task.id }
    });
  }

  showTaskUpdated(task) {
    this.showNotification('Task Updated', {
      body: `"${task.title}" has been updated.`,
      tag: `task-${task.id}`,
      data: { taskId: task.id }
    });
  }

  showTaskDeleted(task) {
    this.showNotification('Task Deleted', {
      body: `"${task.title}" has been deleted.`,
      tag: `task-${task.id}`,
      data: { taskId: task.id }
    });
  }

  showError(message) {
    this.showNotification('Error', {
      body: message,
      tag: 'error',
      icon: '/error-icon.png'
    });
  }

  showSuccess(message) {
    this.showNotification('Success', {
      body: message,
      tag: 'success',
      icon: '/success-icon.png'
    });
  }
}

export default new NotificationService(); 