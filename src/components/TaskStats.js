import React from 'react';
import './TaskStats.css';

function TaskStats({ tasks }) {
  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  // Category distribution
  const categoryStats = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {});

  // Priority distribution
  const priorityStats = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {});

  // Overdue tasks
  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date();
  }).length;

  // Upcoming tasks (due in next 7 days)
  const upcomingTasks = tasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    return dueDate >= today && dueDate <= nextWeek;
  }).length;

  return (
    <div className="task-stats">
      <h2>Task Statistics</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Completion Rate</h3>
          <div className="stat-value">
            <div className="completion-circle">
              <svg viewBox="0 0 36 36" className="completion-chart">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#eee"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--primary-color)"
                  strokeWidth="3"
                  strokeDasharray={`${completionRate}, 100`}
                />
              </svg>
              <span className="completion-text">{Math.round(completionRate)}%</span>
            </div>
          </div>
          <p>{completedTasks} of {totalTasks} tasks completed</p>
        </div>

        <div className="stat-card">
          <h3>Task Status</h3>
          <div className="stat-value">
            <div className="status-bars">
              <div className="status-bar">
                <span className="status-label">Overdue</span>
                <div className="status-progress">
                  <div 
                    className="status-fill error"
                    style={{ width: `${(overdueTasks / totalTasks) * 100}%` }}
                  />
                </div>
                <span className="status-count">{overdueTasks}</span>
              </div>
              <div className="status-bar">
                <span className="status-label">Upcoming</span>
                <div className="status-progress">
                  <div 
                    className="status-fill warning"
                    style={{ width: `${(upcomingTasks / totalTasks) * 100}%` }}
                  />
                </div>
                <span className="status-count">{upcomingTasks}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <h3>Category Distribution</h3>
          <div className="stat-value">
            <div className="category-chart">
              {Object.entries(categoryStats).map(([category, count]) => (
                <div key={category} className="category-bar">
                  <span className="category-label">{category}</span>
                  <div className="category-progress">
                    <div 
                      className="category-fill"
                      style={{ width: `${(count / totalTasks) * 100}%` }}
                    />
                  </div>
                  <span className="category-count">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <h3>Priority Breakdown</h3>
          <div className="stat-value">
            <div className="priority-chart">
              {Object.entries(priorityStats).map(([priority, count]) => (
                <div key={priority} className="priority-bar">
                  <span className="priority-label">{priority}</span>
                  <div className="priority-progress">
                    <div 
                      className={`priority-fill ${priority.toLowerCase()}`}
                      style={{ width: `${(count / totalTasks) * 100}%` }}
                    />
                  </div>
                  <span className="priority-count">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskStats; 