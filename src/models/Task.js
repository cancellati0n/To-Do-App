class Task {
  constructor({
    id = null,
    title = '',
    description = '',
    category = 'general',
    priority = 'medium',
    dueDate = null,
    completed = false,
    subtasks = [],
    createdAt = new Date(),
    updatedAt = new Date(),
    userId = null,
    reminder = null,
    tags = [],
    notes = '',
    attachments = [],
    parentTaskId = null,
    order = 0
  } = {}) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.category = category;
    this.priority = priority;
    this.dueDate = dueDate;
    this.completed = completed;
    this.subtasks = subtasks;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.userId = userId;
    this.reminder = reminder;
    this.tags = tags;
    this.notes = notes;
    this.attachments = attachments;
    this.parentTaskId = parentTaskId;
    this.order = order;
  }

  toFirestore() {
    return {
      title: this.title,
      description: this.description,
      category: this.category,
      priority: this.priority,
      dueDate: this.dueDate,
      completed: this.completed,
      subtasks: this.subtasks,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      userId: this.userId,
      reminder: this.reminder,
      tags: this.tags,
      notes: this.notes,
      attachments: this.attachments,
      parentTaskId: this.parentTaskId,
      order: this.order
    };
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new Task({
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date(),
      updatedAt: data.updatedAt?.toDate?.() || new Date()
    });
  }

  isOverdue() {
    if (!this.dueDate || this.completed) return false;
    return new Date(this.dueDate) < new Date();
  }

  hasSubtasks() {
    return this.subtasks && this.subtasks.length > 0;
  }

  getCompletedSubtasksCount() {
    return this.subtasks.filter(subtask => subtask.completed).length;
  }

  getProgress() {
    if (!this.hasSubtasks()) return this.completed ? 100 : 0;
    return Math.round((this.getCompletedSubtasksCount() / this.subtasks.length) * 100);
  }

  addSubtask(subtask) {
    this.subtasks.push(subtask);
    this.updatedAt = new Date();
  }

  removeSubtask(subtaskId) {
    this.subtasks = this.subtasks.filter(subtask => subtask.id !== subtaskId);
    this.updatedAt = new Date();
  }

  updateSubtask(subtaskId, updates) {
    const index = this.subtasks.findIndex(subtask => subtask.id === subtaskId);
    if (index !== -1) {
      this.subtasks[index] = { ...this.subtasks[index], ...updates };
      this.updatedAt = new Date();
    }
  }

  toggleComplete() {
    this.completed = !this.completed;
    this.updatedAt = new Date();
    return this.completed;
  }

  setReminder(reminder) {
    this.reminder = reminder;
    this.updatedAt = new Date();
  }

  addTag(tag) {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
      this.updatedAt = new Date();
    }
  }

  removeTag(tag) {
    this.tags = this.tags.filter(t => t !== tag);
    this.updatedAt = new Date();
  }

  addAttachment(attachment) {
    this.attachments.push(attachment);
    this.updatedAt = new Date();
  }

  removeAttachment(attachmentId) {
    this.attachments = this.attachments.filter(attachment => attachment.id !== attachmentId);
    this.updatedAt = new Date();
  }
}

export default Task; 