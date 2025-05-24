import StorageService from './StorageService';
import bcrypt from 'bcryptjs';

class UserService {
  constructor() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
  }

  // Register a new user
  async register(username, password) {
    try {
      // Check if user already exists
      const existingUser = await StorageService.getUser(username);
      if (existingUser) {
        throw new Error('Username already exists');
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const user = {
        id: Date.now().toString(),
        username,
        password: hashedPassword,
        createdAt: new Date().toISOString()
      };

      // Save user
      await StorageService.saveUser(username, user);

      // Initialize empty tasks array for new user
      await StorageService.saveUserTasks(username, []);

      // Set current user
      this.currentUser = { ...user, password: undefined };
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

      return this.currentUser;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Login user
  async login(username, password) {
    try {
      // Get user
      const user = await StorageService.getUser(username);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      // Set current user
      this.currentUser = { ...user, password: undefined };
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

      return this.currentUser;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout user
  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  // Update user credentials
  async updateCredentials(username, newPassword) {
    try {
      const user = await StorageService.getUser(username);
      if (!user) {
        throw new Error('User not found');
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update user
      const updatedUser = {
        ...user,
        password: hashedPassword,
        updatedAt: new Date().toISOString()
      };

      // Save updated user
      await StorageService.saveUser(username, updatedUser);

      // Update current user if it's the logged-in user
      if (this.currentUser && this.currentUser.username === username) {
        this.currentUser = { ...updatedUser, password: undefined };
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      }

      return this.currentUser;
    } catch (error) {
      console.error('Update error:', error);
      throw error;
    }
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Check if user is logged in
  isLoggedIn() {
    return !!this.currentUser;
  }

  // Get user's tasks
  async getUserTasks() {
    if (!this.currentUser) {
      throw new Error('User not logged in');
    }
    return await StorageService.getUserTasks(this.currentUser.username);
  }

  // Save user's tasks
  async saveUserTasks(tasks) {
    if (!this.currentUser) {
      throw new Error('User not logged in');
    }
    await StorageService.saveUserTasks(this.currentUser.username, tasks);
  }
}

export default new UserService(); 