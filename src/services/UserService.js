class UserService {
  constructor() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    this.API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
  }

  // Register a new user
  async register(username, password) {
    try {
      const response = await fetch(`${this.API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const user = await response.json();
      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Login user
  async login(username, password) {
    try {
      const response = await fetch(`${this.API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Invalid credentials');
      }

      const user = await response.json();
      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
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
      const response = await fetch(`${this.API_URL}/users/${this.currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.currentUser.token}`,
        },
        body: JSON.stringify({ username, password: newPassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Update failed');
      }

      const updatedUser = await response.json();
      this.currentUser = updatedUser;
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      return updatedUser;
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
    try {
      const response = await fetch(`${this.API_URL}/users/${this.currentUser.id}/tasks`, {
        headers: {
          'Authorization': `Bearer ${this.currentUser.token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch tasks');
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch tasks error:', error);
      throw error;
    }
  }

  // Save user's tasks
  async saveUserTasks(tasks) {
    try {
      const response = await fetch(`${this.API_URL}/users/${this.currentUser.id}/tasks`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.currentUser.token}`,
        },
        body: JSON.stringify({ tasks }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save tasks');
      }

      return await response.json();
    } catch (error) {
      console.error('Save tasks error:', error);
      throw error;
    }
  }
}

export default new UserService(); 