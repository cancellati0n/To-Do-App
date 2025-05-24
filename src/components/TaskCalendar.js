import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import './TaskCalendar.css';

function TaskCalendar({ tasks, onTaskClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      return isSameDay(new Date(task.dueDate), date);
    });
  };

  const getTasksForSelectedDate = () => {
    if (!selectedDate) return [];
    return getTasksForDate(selectedDate);
  };

  return (
    <div className="task-calendar">
      <div className="calendar-header">
        <button className="btn btn-icon" onClick={handlePrevMonth}>
          ←
        </button>
        <h2>{format(currentDate, 'MMMM yyyy')}</h2>
        <button className="btn btn-icon" onClick={handleNextMonth}>
          →
        </button>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="weekday">
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-days">
          {days.map(day => {
            const dateTasks = getTasksForDate(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentDate);

            return (
              <div
                key={day.toString()}
                className={`calendar-day ${isSelected ? 'selected' : ''} ${
                  !isCurrentMonth ? 'other-month' : ''
                }`}
                onClick={() => handleDateClick(day)}
              >
                <span className="day-number">{format(day, 'd')}</span>
                {dateTasks.length > 0 && (
                  <div className="day-tasks">
                    {dateTasks.slice(0, 3).map(task => (
                      <div
                        key={task.id}
                        className={`task-dot ${task.priority}`}
                        title={task.title}
                        onClick={(e) => {
                          e.stopPropagation();
                          onTaskClick(task);
                        }}
                      />
                    ))}
                    {dateTasks.length > 3 && (
                      <span className="more-tasks">+{dateTasks.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="selected-date-tasks">
          <h3>{format(selectedDate, 'MMMM d, yyyy')}</h3>
          <div className="tasks-list">
            {getTasksForSelectedDate().map(task => (
              <div
                key={task.id}
                className="task-item"
                onClick={() => onTaskClick(task)}
              >
                <div className="task-priority" data-priority={task.priority} />
                <div className="task-content">
                  <h4>{task.title}</h4>
                  {task.dueTime && (
                    <span className="task-time">{task.dueTime}</span>
                  )}
                </div>
              </div>
            ))}
            {getTasksForSelectedDate().length === 0 && (
              <p className="no-tasks">No tasks for this date</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskCalendar; 