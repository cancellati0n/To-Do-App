class StorageService {
  constructor() {
    this.USERS_KEY = 'todo_app_users';
    this.TASKS_KEY = 'todo_app_tasks';
    this.initializeStorage();
  }

  initializeStorage() {
    if (!localStorage.getItem(this.USERS_KEY)) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify({}));
    }
    if (!localStorage.getItem(this.TASKS_KEY)) {
      localStorage.setItem(this.TASKS_KEY, JSON.stringify({}));
    }
  }

  async saveUser(username, userData) {
    const users = JSON.parse(localStorage.getItem(this.USERS_KEY));
    users[username] = userData;
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  async getUser(username) {
    const users = JSON.parse(localStorage.getItem(this.USERS_KEY));
    return users[username] || null;
  }

  async saveUserTasks(username, tasks) {
    const allTasks = JSON.parse(localStorage.getItem(this.TASKS_KEY));
    allTasks[username] = tasks;
    localStorage.setItem(this.TASKS_KEY, JSON.stringify(allTasks));
  }

  async getUserTasks(username) {
    const allTasks = JSON.parse(localStorage.getItem(this.TASKS_KEY));
    return allTasks[username] || [];
  }

  async deleteUser(username) {
    const users = JSON.parse(localStorage.getItem(this.USERS_KEY));
    const allTasks = JSON.parse(localStorage.getItem(this.TASKS_KEY));
    
    delete users[username];
    delete allTasks[username];
    
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    localStorage.setItem(this.TASKS_KEY, JSON.stringify(allTasks));
  }

  async getAllUsers() {
    return JSON.parse(localStorage.getItem(this.USERS_KEY));
  }

  async getAllTasks() {
    return JSON.parse(localStorage.getItem(this.TASKS_KEY));
  }
}

export default new StorageService(); 