import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import './CalendarView.css';

function CalendarView({ tasks, onTaskClick, onCreateTask }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    generateCalendarDays();
  }, [currentDate, tasks]);

  const isTaskOverdue = (task) => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    return !task.completed && dueDate < now;
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
    onCreateTask(date);
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get first day of month and last day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the day of week for first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();
    
    // Calculate total days to display (including previous month's days)
    const totalDays = firstDayOfWeek + lastDay.getDate();
    
    // Calculate number of weeks to display
    const weeks = Math.ceil(totalDays / 7);
    
    const days = [];
    let dayCount = 1;
    
    // Generate calendar grid
    for (let week = 0; week < weeks; week++) {
      for (let day = 0; day < 7; day++) {
        if (week === 0 && day < firstDayOfWeek) {
          // Add empty cells for days before first day of month
          const prevMonthLastDay = new Date(year, month, 0).getDate();
          const prevMonthDay = prevMonthLastDay - (firstDayOfWeek - day - 1);
          days.push({
            date: new Date(year, month - 1, prevMonthDay),
            isCurrentMonth: false,
            tasks: []
          });
        } else if (dayCount <= lastDay.getDate()) {
          // Add current month's days
          const date = new Date(year, month, dayCount);
          const dayTasks = tasks.filter(task => {
            const taskDate = new Date(task.dueDate);
            return (
              taskDate.getDate() === dayCount &&
              taskDate.getMonth() === month &&
              taskDate.getFullYear() === year
            );
          });
          
          days.push({
            date,
            isCurrentMonth: true,
            tasks: dayTasks
          });
          dayCount++;
        } else {
          // Add empty cells for days after last day of month
          const nextMonthDay = dayCount - lastDay.getDate();
          days.push({
            date: new Date(year, month + 1, nextMonthDay),
            isCurrentMonth: false,
            tasks: []
          });
          dayCount++;
        }
      }
    }
    
    setCalendarDays(days);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const formatMonthYear = () => {
    return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const formatDayHeader = (day) => {
    return new Date(0, 0, day).toLocaleString('default', { weekday: 'short' });
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <div className="calendar-nav">
          <button onClick={handlePrevMonth} className="nav-button">
            ←
          </button>
          <button onClick={handleToday} className="today-button">
            Today
          </button>
          <button onClick={handleNextMonth} className="nav-button">
            →
          </button>
        </div>
        <h2 className="month-year">{formatMonthYear()}</h2>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {[0, 1, 2, 3, 4, 5, 6].map(day => (
            <div key={day} className="weekday-header">
              {formatDayHeader(day)}
            </div>
          ))}
        </div>

        <div className="calendar-days">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${
                isToday(day.date) ? 'today' : ''
              }`}
              onClick={() => handleDayClick(day.date)}
            >
              <div className="day-number">{day.date.getDate()}</div>
              <div className="day-tasks">
                {day.tasks.map(task => (
                  <div
                    key={task.id}
                    className={`task-item ${task.completed ? 'completed' : ''} ${
                      isTaskOverdue(task) ? 'overdue' : ''
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTaskClick(task);
                    }}
                  >
                    <span className="task-title">{task.title}</span>
                    {task.priority && (
                      <span className={`priority-dot ${task.priority}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CalendarView; 