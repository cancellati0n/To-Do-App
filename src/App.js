import React, { useState, useEffect } from 'react';
import UserService from './services/UserService';
import AuthForm from './components/AuthForm';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskDetails from './components/TaskDetails';
import TaskStats from './components/TaskStats';
import TaskExport from './components/TaskExport';
import CalendarView from './components/CalendarView';
import Logo from './components/Logo';
import './App.css';

const CATEGORIES = [
  { id: 'all', name: 'All Tasks', icon: '📋' },
  { id: 'work', name: 'Work', icon: '💼' },
  { id: 'personal', name: 'Personal', icon: '👤' },
  { id: 'shopping', name: 'Shopping', icon: '🛒' },
  { id: 'health', name: 'Health', icon: '🏥' }
];

function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [view, setView] = useState('list');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    // Check for existing user session
    const currentUser = UserService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      // Load user's tasks
      const savedTasks = JSON.parse(localStorage.getItem(`tasks_${currentUser.id}`)) || [];
      setTasks(savedTasks);
    }
  }, []);

  useEffect(() => {
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const handleLogin = async (username, password) => {
    const loggedInUser = UserService.login(username, password);
    setUser(loggedInUser);
    // Load user's tasks
    const savedTasks = JSON.parse(localStorage.getItem(`tasks_${loggedInUser.id}`)) || [];
    setTasks(savedTasks);
  };

  const handleRegister = async (username, password) => {
    const newUser = UserService.register(username, password);
    setUser(newUser);
    setTasks([]); // Initialize empty tasks array for new user
  };

  const handleLogout = () => {
    UserService.logout();
    setUser(null);
    setTasks([]);
  };

  const handleThemeToggle = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
  };

  const handleAddTask = () => {
    setIsTaskFormOpen(true);
    setSelectedTask(null);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsTaskFormOpen(true);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsTaskDetailsOpen(true);
  };

  const handleTaskComplete = async (taskId, completed) => {
    // Update task completion status
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem(`tasks_${user.id}`, JSON.stringify(updatedTasks));
  };

  const handleTaskSubmit = async (taskData) => {
    let updatedTasks;
    if (selectedTask) {
      // Update existing task
      updatedTasks = tasks.map(task =>
        task.id === selectedTask.id ? { ...task, ...taskData } : task
      );
    } else {
      // Create new task
      const newTask = {
        id: Date.now().toString(),
        ...taskData,
        userId: user.id,
        createdAt: new Date().toISOString()
      };
      updatedTasks = [...tasks, newTask];
    }
    setTasks(updatedTasks);
    localStorage.setItem(`tasks_${user.id}`, JSON.stringify(updatedTasks));
    setIsTaskFormOpen(false);
    setSelectedTask(null);
  };

  const handleTaskDelete = async (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem(`tasks_${user.id}`, JSON.stringify(updatedTasks));
    setIsTaskDetailsOpen(false);
    setSelectedTask(null);
  };

  const handleTaskImport = async (importedTasks) => {
    try {
      const updatedTasks = [...tasks, ...importedTasks.map(task => ({
        ...task,
        id: Date.now().toString(),
        userId: user.id,
        createdAt: new Date().toISOString()
      }))];
      setTasks(updatedTasks);
      localStorage.setItem(`tasks_${user.id}`, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Error importing tasks:', error);
    }
  };

  const handleCreateTask = (date) => {
    // Create a new date object and set it to midnight UTC to avoid timezone issues
    const selectedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    setSelectedTask({
      dueDate: selectedDate.toISOString(),
      dueTime: '',
      category: 'personal',
      priority: 'medium',
      subtasks: [],
      tags: []
    });
    setIsTaskFormOpen(true);
  };

  const filteredTasks = tasks.filter(task => {
    if (selectedCategory === 'all') return true;
    return task.category === selectedCategory;
  });

  if (!user) {
    return (
      <div className="auth-container">
        <h1>Welcome to Task Manager</h1>
        <p>Please sign in to continue</p>
        <AuthForm onLogin={handleLogin} onRegister={handleRegister} />
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>
            <Logo />
          </h1>
          <div className="header-actions">
            <button onClick={() => setShowStats(!showStats)} className="stats-toggle">
              {showStats ? '📊 Hide Stats' : '📊 Show Stats'}
            </button>
            <button onClick={() => setShowExport(!showExport)} className="export-toggle">
              {showExport ? '📤 Hide Export' : '📤 Show Export'}
            </button>
            <button onClick={handleThemeToggle} className="theme-toggle">
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={handleLogout} className="sign-out">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="app-content">
        <aside className="sidebar">
          <nav className="category-nav">
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </nav>
          <div className="view-toggle">
            <button
              className={`view-button ${view === 'list' ? 'active' : ''}`}
              onClick={() => setView('list')}
            >
              📋 List
            </button>
            <button
              className={`view-button ${view === 'calendar' ? 'active' : ''}`}
              onClick={() => setView('calendar')}
            >
              📅 Calendar
            </button>
          </div>
        </aside>

        <main className="main-content">
          {showStats && <TaskStats tasks={tasks} />}
          {showExport && <TaskExport tasks={tasks} onImport={handleTaskImport} />}
          {view === 'list' ? (
            <TaskList
              tasks={filteredTasks}
              onTaskClick={handleTaskClick}
              onTaskComplete={handleTaskComplete}
              onTaskDelete={handleTaskDelete}
            />
          ) : (
            <CalendarView
              tasks={filteredTasks}
              onTaskClick={handleTaskClick}
              onTaskComplete={handleTaskComplete}
              onTaskDelete={handleTaskDelete}
              onCreateTask={handleCreateTask}
            />
          )}
          <button className="fab" onClick={handleAddTask}>
            <span className="fab-icon">+</span>
          </button>
        </main>
      </div>

      {isTaskFormOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{selectedTask ? 'Edit Task' : 'Create New Task'}</h3>
              <button className="close-btn" onClick={() => setIsTaskFormOpen(false)}>×</button>
            </div>
            <TaskForm
              task={selectedTask}
              onSubmit={handleTaskSubmit}
              onCancel={() => setIsTaskFormOpen(false)}
            />
          </div>
        </div>
      )}

      {isTaskDetailsOpen && selectedTask && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Task Details</h3>
              <button className="close-btn" onClick={() => setIsTaskDetailsOpen(false)}>×</button>
            </div>
            <TaskDetails
              task={selectedTask}
              onEdit={() => {
                setIsTaskDetailsOpen(false);
                handleEditTask(selectedTask);
              }}
              onSubmit={handleTaskSubmit}
              onDelete={() => handleTaskDelete(selectedTask.id)}
              onClose={() => setIsTaskDetailsOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
