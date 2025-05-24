import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  getDocs,
  limit,
  startAfter,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import Task from '../models/Task';

class TaskService {
  constructor() {
    this.tasksCollection = collection(db, 'tasks');
  }

  // Create a new task
  async createTask(taskData) {
    try {
      console.log('Creating task with data:', taskData);
      const task = new Task(taskData);
      const taskToCreate = {
        ...task.toFirestore(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(this.tasksCollection, taskToCreate);
      console.log('Task created with ID:', docRef.id);
      
      return new Task({
        id: docRef.id,
        ...taskToCreate,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  // Update an existing task
  async updateTask(taskId, taskData) {
    try {
      console.log('Updating task:', taskId, 'with data:', taskData);
      const taskRef = doc(db, 'tasks', taskId);
      const task = new Task(taskData);
      const taskToUpdate = {
        ...task.toFirestore(),
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(taskRef, taskToUpdate);
      return new Task({
        id: taskId,
        ...taskToUpdate,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  }

  // Delete a task
  async deleteTask(taskId) {
    try {
      console.log('Deleting task:', taskId);
      const taskRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskRef);
      return taskId;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }

  // Toggle task completion
  async toggleTaskCompletion(taskId, completed) {
    try {
      console.log('Toggling task completion:', taskId, 'to:', completed);
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, { 
        completed,
        updatedAt: serverTimestamp()
      });
      return { id: taskId, completed };
    } catch (error) {
      console.error("Error toggling task completion:", error);
      throw error;
    }
  }

  // Get all tasks for a user
  subscribeToUserTasks(userId, callback) {
    console.log('Subscribing to all tasks for user:', userId);
    const q = query(
      this.tasksCollection,
      where('userId', '==', userId),
      where('parentTaskId', '==', null),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const tasks = querySnapshot.docs.map(doc => Task.fromFirestore(doc));
      console.log('Received tasks:', tasks);
      callback(tasks);
    }, (error) => {
      console.error('Error in task subscription:', error);
    });
  }

  // Get tasks by category
  subscribeToTasksByCategory(userId, category, callback) {
    console.log('Subscribing to tasks for category:', category, 'user:', userId);
    const q = query(
      this.tasksCollection,
      where('userId', '==', userId),
      where('category', '==', category),
      where('parentTaskId', '==', null),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const tasks = querySnapshot.docs.map(doc => Task.fromFirestore(doc));
      console.log('Received tasks for category:', category, tasks);
      callback(tasks);
    }, (error) => {
      console.error('Error in category task subscription:', error);
    });
  }

  // Get subtasks for a parent task
  async getSubtasks(parentTaskId) {
    try {
      const q = query(
        this.tasksCollection,
        where('parentTaskId', '==', parentTaskId),
        orderBy('order', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => Task.fromFirestore(doc));
    } catch (error) {
      console.error('Error getting subtasks:', error);
      throw error;
    }
  }

  // Get tasks due today
  subscribeToTasksDueToday(userId, callback) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const q = query(
      this.tasksCollection,
      where('userId', '==', userId),
      where('dueDate', '>=', today),
      where('dueDate', '<', tomorrow),
      orderBy('dueDate', 'asc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const tasks = querySnapshot.docs.map(doc => Task.fromFirestore(doc));
      callback(tasks);
    });
  }

  // Get upcoming tasks
  subscribeToUpcomingTasks(userId, callback) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const q = query(
      this.tasksCollection,
      where('userId', '==', userId),
      where('dueDate', '>', today),
      orderBy('dueDate', 'asc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const tasks = querySnapshot.docs.map(doc => Task.fromFirestore(doc));
      callback(tasks);
    });
  }

  // Get completed tasks
  subscribeToCompletedTasks(userId, callback) {
    const q = query(
      this.tasksCollection,
      where('userId', '==', userId),
      where('completed', '==', true),
      orderBy('updatedAt', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const tasks = querySnapshot.docs.map(doc => Task.fromFirestore(doc));
      callback(tasks);
    });
  }

  // Get tasks with reminders
  subscribeToTasksWithReminders(userId, callback) {
    const q = query(
      this.tasksCollection,
      where('userId', '==', userId),
      where('reminder', '!=', null),
      orderBy('reminder', 'asc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const tasks = querySnapshot.docs.map(doc => Task.fromFirestore(doc));
      callback(tasks);
    });
  }

  // Search tasks
  async searchTasks(userId, searchQuery) {
    try {
      const q = query(
        this.tasksCollection,
        where('userId', '==', userId),
        orderBy('title'),
        limit(20)
      );
      
      const querySnapshot = await getDocs(q);
      const tasks = querySnapshot.docs.map(doc => Task.fromFirestore(doc));
      
      return tasks.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    } catch (error) {
      console.error('Error searching tasks:', error);
      throw error;
    }
  }

  // Get task statistics
  async getTaskStatistics(userId) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const weekStart = new Date(today);
      weekStart.setDate(weekStart.getDate() - today.getDay());
      
      const q = query(
        this.tasksCollection,
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const tasks = querySnapshot.docs.map(doc => Task.fromFirestore(doc));
      
      return {
        total: tasks.length,
        completed: tasks.filter(t => t.completed).length,
        overdue: tasks.filter(t => t.isOverdue()).length,
        dueToday: tasks.filter(t => {
          const dueDate = new Date(t.dueDate);
          return dueDate >= today && dueDate < new Date(today.getTime() + 86400000);
        }).length,
        completedThisWeek: tasks.filter(t => {
          const completedDate = new Date(t.updatedAt);
          return t.completed && completedDate >= weekStart;
        }).length
      };
    } catch (error) {
      console.error('Error getting task statistics:', error);
      throw error;
    }
  }
}

export default new TaskService(); 