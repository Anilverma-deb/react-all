
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Edit2, Trash2, Calendar, Clock, MapPin, FileText } from 'lucide-react';
import './Calendar.css'
const EventCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Weekly Meeting Projects',
      date: '2024-12-15',
      time: '7:00 AM - 7:30 AM',
      color: 'bg-blue-100 border-blue-300',
      description: 'Weekly project review meeting',
      location: 'Conference Room A'
    },
    {
      id: 2,
      title: 'UI/UX Workshops by Peterdrow Studios',
      date: '2024-12-17',
      time: '7:00 AM - 9:00 AM',
      color: 'bg-cyan-100 border-cyan-300',
      description: 'Design workshop session',
      location: 'Studio 1'
    },
    {
      id: 3,
      title: 'International Business Seminar',
      date: '2024-12-15',
      time: '8:00 AM - 9:30 AM',
      color: 'bg-pink-100 border-pink-300',
      description: 'Global business strategies',
      location: 'Main Hall'
    },
    {
      id: 4,
      title: 'Gym',
      date: '2024-12-15',
      time: '10:00 AM - 11:00 AM',
      color: 'bg-yellow-100 border-yellow-300',
      description: 'Workout session',
      location: 'Fitness Center'
    },
    {
      id: 5,
      title: 'Meeting',
      date: '2024-12-18',
      time: '9:00 PM - 9:30 PM',
      color: 'bg-green-100 border-green-300',
      description: 'Team meeting',
      location: 'Meeting Room B'
    }
  ]);
  
  const [viewMode, setViewMode] = useState('Monthly');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
    location: '',
    color: 'bg-blue-100 border-blue-300'
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const colors = [
    { name: 'Blue', class: 'bg-blue-100 border-blue-300' },
    { name: 'Green', class: 'bg-green-100 border-green-300' },
    { name: 'Yellow', class: 'bg-yellow-100 border-yellow-300' },
    { name: 'Pink', class: 'bg-pink-100 border-pink-300' },
    { name: 'Purple', class: 'bg-purple-100 border-purple-300' },
    { name: 'Cyan', class: 'bg-cyan-100 border-cyan-300' }
  ];

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    const dateStr = formatDate(date);
    return events.filter(event => event.date === dateStr);
  };

  const handleDateClick = (date) => {
    if (!date) return;
    setSelectedDate(date);
    const dateEvents = getEventsForDate(date);
    if (dateEvents.length === 0) {
      openAddEventModal(date);
    }
  };

  const openAddEventModal = (date = null) => {
    setModalMode('add');
    setEventForm({
      title: '',
      date: date ? formatDate(date) : formatDate(new Date()),
      time: '',
      description: '',
      location: '',
      color: 'bg-blue-100 border-blue-300'
    });
    setShowModal(true);
  };

  const openEditEventModal = (event) => {
    setModalMode('edit');
    setSelectedEvent(event);
    setEventForm({
      title: event.title,
      date: event.date,
      time: event.time,
      description: event.description,
      location: event.location,
      color: event.color
    });
    setShowModal(true);
  };

  const openViewEventModal = (event) => {
    setModalMode('view');
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleSaveEvent = () => {
    if (!eventForm.title || !eventForm.date) return;

    if (modalMode === 'add') {
      const newEvent = {
        id: Date.now(),
        ...eventForm
      };
      setEvents([...events, newEvent]);
    } else if (modalMode === 'edit') {
      setEvents(events.map(event => 
        event.id === selectedEvent.id ? { ...selectedEvent, ...eventForm } : event
      ));
    }
    
    setShowModal(false);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
    setShowModal(false);
    setSelectedEvent(null);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const navigateYear = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(currentDate.getFullYear() + direction);
    setCurrentDate(newDate);
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return formatDate(date) === formatDate(today);
  };

  const renderMonthlyView = () => {
    const days = getDaysInMonth(currentDate);
    const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    return (
      <div className="monthly-view">
        <div className="weekdays">
          {weekDays.map((day, index) => (
            <div key={index} className="weekday-header">
              {day}
            </div>
          ))}
        </div>
        <div className="calendar-grid">
          {days.map((date, index) => {
            const dayEvents = getEventsForDate(date);
            return (
              <div
                key={index}
                className={`calendar-day ${!date ? 'empty' : ''} ${isToday(date) ? 'today' : ''}`}
                onClick={() => handleDateClick(date)}
              >
                {date && (
                  <>
                    <div className="day-number">{date.getDate()}</div>
                    <div className="day-events">
                      {dayEvents.slice(0, 3).map((event, eventIndex) => (
                        <div
                          key={eventIndex}
                          className={`event-item ${event.color}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            openViewEventModal(event);
                          }}
                        >
                          <span className="event-title">{event.title}</span>
                          <span className="event-time">{event.time}</span>
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="more-events">+{dayEvents.length - 3} more</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeeklyView = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(currentDate.getDate() - day);
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDays.push(date);
    }

    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="weekly-view">
        <div className="week-header">
          {weekDays.map((date, index) => (
            <div key={index} className={`week-day-header ${isToday(date) ? 'today' : ''}`}>
              <div className="day-name">{['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][index]}</div>
              <div className="day-date">{date.getDate()}</div>
            </div>
          ))}
        </div>
        <div className="week-content">
          <div className="time-column">
            {hours.map(hour => (
              <div key={hour} className="time-slot">
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </div>
            ))}
          </div>
          <div className="week-days">
            {weekDays.map((date, dayIndex) => {
              const dayEvents = getEventsForDate(date);
              return (
                <div key={dayIndex} className="week-day" onClick={() => handleDateClick(date)}>
                  {hours.map(hour => (
                    <div key={hour} className="week-time-slot">
                      {dayEvents
                        .filter(event => {
                          const eventHour = parseInt(event.time.split(':')[0]);
                          return eventHour === hour;
                        })
                        .map(event => (
                          <div
                            key={event.id}
                            className={`week-event ${event.color}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              openViewEventModal(event);
                            }}
                          >
                            <div className="event-title">{event.title}</div>
                            <div className="event-time">{event.time}</div>
                          </div>
                        ))
                      }
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderDailyView = () => {
    const dayEvents = getEventsForDate(currentDate);
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="daily-view">
        <div className="day-header">
          <h3>{currentDate.toDateString()}</h3>
        </div>
        <div className="day-content">
          <div className="time-column">
            {hours.map(hour => (
              <div key={hour} className="time-slot">
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </div>
            ))}
          </div>
          <div className="day-events">
            {hours.map(hour => (
              <div key={hour} className="day-time-slot" onClick={() => handleDateClick(currentDate)}>
                {dayEvents
                  .filter(event => {
                    const eventHour = parseInt(event.time.split(':')[0]);
                    return eventHour === hour;
                  })
                  .map(event => (
                    <div
                      key={event.id}
                      className={`day-event ${event.color}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        openViewEventModal(event);
                      }}
                    >
                      <div className="event-title">{event.title}</div>
                      <div className="event-time">{event.time}</div>
                      <div className="event-location">{event.location}</div>
                    </div>
                  ))
                }
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderYearlyView = () => {
    const year = currentDate.getFullYear();
    const monthsGrid = [];
    
    for (let month = 0; month < 12; month++) {
      const monthDate = new Date(year, month, 1);
      const monthEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getFullYear() === year && eventDate.getMonth() === month;
      });
      
      monthsGrid.push({
        date: monthDate,
        events: monthEvents
      });
    }

    return (
      <div className="yearly-view">
        <div className="year-grid">
          {monthsGrid.map((monthData, index) => (
            <div
              key={index}
              className="year-month"
              onClick={() => {
                setCurrentDate(monthData.date);
                setViewMode('Monthly');
              }}
            >
              <div className="month-name">{months[index]}</div>
              <div className="month-events-count">
                {monthData.events.length} events
              </div>
              <div className="month-preview">
                {monthData.events.slice(0, 3).map(event => (
                  <div key={event.id} className={`mini-event ${event.color}`}>
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderView = () => {
    switch (viewMode) {
      case 'Daily':
        return renderDailyView();
      case 'Weekly':
        return renderWeeklyView();
      case 'Monthly':
        return renderMonthlyView();
      case 'Yearly':
        return renderYearlyView();
      default:
        return renderMonthlyView();
    }
  };

  return (
    <div className="calendar-container">
      {/* Header */}
      <div className="calendar-header">
        <div className="header-left">
          <h1 className="calendar-title">Calendar</h1>
          <div className="date-navigation">
            <button 
              className="nav-button"
              onClick={() => viewMode === 'Yearly' ? navigateYear(-1) : navigateMonth(-1)}
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="current-date">
              {viewMode === 'Yearly' 
                ? currentDate.getFullYear()
                : `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`
              }
            </h2>
            <button 
              className="nav-button"
              onClick={() => viewMode === 'Yearly' ? navigateYear(1) : navigateMonth(1)}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        <div className="header-right">
          <div className="view-tabs">
            {['Daily', 'Weekly', 'Monthly', 'Yearly'].map(view => (
              <button
                key={view}
                className={`view-tab ${viewMode === view ? 'active' : ''}`}
                onClick={() => setViewMode(view)}
              >
                {view}
              </button>
            ))}
          </div>
          <button className="add-event-btn" onClick={() => openAddEventModal()}>
            <Plus size={16} />
            New Schedule
          </button>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="calendar-content">
        {renderView()}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {modalMode === 'add' && 'Add New Event'}
                {modalMode === 'edit' && 'Edit Event'}
                {modalMode === 'view' && 'Event Details'}
              </h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              {modalMode === 'view' ? (
                <div className="event-details">
                  <h4>{selectedEvent?.title}</h4>
                  <div className="detail-item">
                    <Calendar size={16} />
                    <span>{selectedEvent?.date}</span>
                  </div>
                  <div className="detail-item">
                    <Clock size={16} />
                    <span>{selectedEvent?.time}</span>
                  </div>
                  {selectedEvent?.location && (
                    <div className="detail-item">
                      <MapPin size={16} />
                      <span>{selectedEvent?.location}</span>
                    </div>
                  )}
                  {selectedEvent?.description && (
                    <div className="detail-item">
                      <FileText size={16} />
                      <span>{selectedEvent?.description}</span>
                    </div>
                  )}
                  <div className="event-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => openEditEventModal(selectedEvent)}
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteEvent(selectedEvent.id)}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <form className="event-form">
                  <div className="form-group">
                    <label>Event Title</label>
                    <input
                      type="text"
                      value={eventForm.title}
                      onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                      placeholder="Enter event title"
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Date</label>
                      <input
                        type="date"
                        value={eventForm.date}
                        onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Time</label>
                      <input
                        type="text"
                        value={eventForm.time}
                        onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                        placeholder="e.g., 9:00 AM - 10:00 AM"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={eventForm.location}
                      onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                      placeholder="Enter location"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={eventForm.description}
                      onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                      placeholder="Enter description"
                      rows="3"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Color</label>
                    <div className="color-picker">
                      {colors.map((color, index) => (
                        <button
                          key={index}
                          type="button"
                          className={`color-option ${color.class} ${eventForm.color === color.class ? 'selected' : ''}`}
                          onClick={() => setEventForm({...eventForm, color: color.class})}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="form-actions">
                    <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="button" className="save-btn" onClick={handleSaveEvent}>
                      {modalMode === 'add' ? 'Add Event' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
        
    </div>
  );
};

export default EventCalendar;
