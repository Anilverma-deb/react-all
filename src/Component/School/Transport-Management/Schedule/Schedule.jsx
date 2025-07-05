import React, { useState, useEffect } from 'react';
import './Schedule.css';

const ScheduleManagement = () => {
  const [drivers, setDrivers] = useState([
    { id: 'driver_1', name: 'Mr. A' },
    { id: 'driver_2', name: 'Ms. B' },
    { id: 'driver_3', name: 'Mr. C' },
  ]);

  const [buses, setBuses] = useState([
    { id: 'bus_1', number: 'UP12-2345' },
    { id: 'bus_2', number: 'UP13-3456' },
    { id: 'bus_3', number: 'UP14-4567' },
  ]);

  const [routes, setRoutes] = useState([
    { id: 'route_1', name: 'Route 7' },
    { id: 'route_2', name: 'Route 12' },
    { id: 'route_3', name: 'Route 15' },
  ]);

  const [schedules, setSchedules] = useState([
    {
      id: 'schedule_1',
      driverId: 'driver_1',
      busId: 'bus_1',
      routeId: 'route_1',
      day: 'Monday',
      timeSlot: 'Morning',
      recurring: false
    },
    {
      id: 'schedule_2',
      driverId: 'driver_2',
      busId: 'bus_2',
      routeId: 'route_2',
      day: 'Tuesday',
      timeSlot: 'Afternoon',
      recurring: true
    },
  ]);

  const [newSchedule, setNewSchedule] = useState({
    driverId: '',
    busId: '',
    routeId: '',
    day: 'Monday',
    timeSlot: 'Morning',
    recurring: false
  });

  const [editingId, setEditingId] = useState(null);
  const [conflicts, setConflicts] = useState([]);
  const [activeView, setActiveView] = useState('weekly');
  const [isDragging, setIsDragging] = useState(false);
  const [dragItem, setDragItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = ['Morning', 'Afternoon', 'Evening'];

  // Check for conflicts
  useEffect(() => {
    const newConflicts = [];
    schedules.forEach((schedule, i) => {
      schedules.forEach((otherSchedule, j) => {
        if (i !== j && 
            schedule.day === otherSchedule.day && 
            schedule.timeSlot === otherSchedule.timeSlot) {
          if (schedule.driverId === otherSchedule.driverId) {
            newConflicts.push({
              type: 'driver',
              scheduleId1: schedule.id,
              scheduleId2: otherSchedule.id,
              message: `Driver ${getDriverName(schedule.driverId)} is double-booked`
            });
          }
          if (schedule.busId === otherSchedule.busId) {
            newConflicts.push({
              type: 'bus',
              scheduleId1: schedule.id,
              scheduleId2: otherSchedule.id,
              message: `Bus ${getBusNumber(schedule.busId)} is double-booked`
            });
          }
        }
      });
    });
    setConflicts(newConflicts);
  }, [schedules]);

  const getDriverName = (id) => {
    const driver = drivers.find(d => d.id === id);
    return driver ? driver.name : 'Unknown';
  };

  const getBusNumber = (id) => {
    const bus = buses.find(b => b.id === id);
    return bus ? bus.number : 'Unknown';
  };

  const getRouteName = (id) => {
    const route = routes.find(r => r.id === id);
    return route ? route.name : 'Unknown';
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewSchedule({
      ...newSchedule,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddSchedule = (e) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing schedule
      setSchedules(schedules.map(schedule => 
        schedule.id === editingId ? { ...newSchedule, id: editingId } : schedule
      ));
      setEditingId(null);
    } else {
      // Add new schedule
      const scheduleToAdd = {
        ...newSchedule,
        id: `schedule_${Date.now()}`
      };
      setSchedules([...schedules, scheduleToAdd]);
    }
    
    // Reset form
    setNewSchedule({
      driverId: '',
      busId: '',
      routeId: '',
      day: 'Monday',
      timeSlot: 'Morning',
      recurring: false
    });
  };

  const handleEdit = (schedule) => {
    setNewSchedule({
      driverId: schedule.driverId,
      busId: schedule.busId,
      routeId: schedule.routeId,
      day: schedule.day,
      timeSlot: schedule.timeSlot,
      recurring: schedule.recurring
    });
    setEditingId(schedule.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    setSchedules(schedules.filter(schedule => schedule.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setNewSchedule({
        driverId: '',
        busId: '',
        routeId: '',
        day: 'Monday',
        timeSlot: 'Morning',
        recurring: false
      });
    }
  };

  const clearForm = () => {
    setEditingId(null);
    setNewSchedule({
      driverId: '',
      busId: '',
      routeId: '',
      day: 'Monday',
      timeSlot: 'Morning',
      recurring: false
    });
  };

  const hasConflict = (scheduleId) => {
    return conflicts.some(conflict => 
      conflict.scheduleId1 === scheduleId || conflict.scheduleId2 === scheduleId
    );
  };

  // Drag and drop functionality
  const handleDragStart = (e, schedule) => {
    setIsDragging(true);
    setDragItem(schedule);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target);
  };

  const handleDragOver = (e, day, timeSlot) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, day, timeSlot) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (dragItem) {
      const updatedSchedule = {
        ...dragItem,
        day,
        timeSlot
      };
      
      setSchedules(schedules.map(schedule => 
        schedule.id === dragItem.id ? updatedSchedule : schedule
      ));
    }
  };

  const filteredSchedules = schedules.filter(schedule => {
    const driverName = getDriverName(schedule.driverId).toLowerCase();
    const busNumber = getBusNumber(schedule.busId).toLowerCase();
    const routeName = getRouteName(schedule.routeId).toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return (
      driverName.includes(searchLower) ||
      busNumber.includes(searchLower) ||
      routeName.includes(searchLower) ||
      schedule.day.toLowerCase().includes(searchLower) ||
      schedule.timeSlot.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="bus-schedule-manager">
      <div className="bus-schedule-header">
        <h2 className="bus-schedule-title">Bus Schedule Manager</h2>
        <div className="bus-schedule-search">
          <input
            type="text"
            placeholder="Search schedules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bus-schedule-search-input"
          />
          <span className="bus-schedule-search-icon">🔍</span>
        </div>
      </div>
      
      <div className="bus-schedule-view-toggle">
        <button 
          className={`bus-schedule-view-btn ${activeView === 'weekly' ? 'bus-schedule-view-active' : ''}`}
          onClick={() => setActiveView('weekly')}
        >
          <span className="bus-schedule-view-icon">📅</span> Weekly View
        </button>
        <button 
          className={`bus-schedule-view-btn ${activeView === 'list' ? 'bus-schedule-view-active' : ''}`}
          onClick={() => setActiveView('list')}
        >
          <span className="bus-schedule-view-icon">📋</span> List View
        </button>
      </div>
      
      <div className="bus-schedule-form-container">
        <div className={`bus-schedule-form-card ${editingId ? 'bus-schedule-form-editing' : ''}`}>
          <h3 className="bus-schedule-form-title">
            {editingId ? '✏️ Edit Schedule' : '➕ Add New Schedule'}
          </h3>
          <form onSubmit={handleAddSchedule} className="bus-schedule-form">
            <div className="bus-schedule-form-grid">
              <div className="bus-schedule-form-group">
                <label className="bus-schedule-form-label">Driver</label>
                <select 
                  name="driverId" 
                  value={newSchedule.driverId} 
                  onChange={handleInputChange}
                  className="bus-schedule-form-select"
                  required
                >
                  <option value="">Select Driver</option>
                  {drivers.map(driver => (
                    <option key={driver.id} value={driver.id}>{driver.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="bus-schedule-form-group">
                <label className="bus-schedule-form-label">Bus</label>
                <select 
                  name="busId" 
                  value={newSchedule.busId} 
                  onChange={handleInputChange}
                  className="bus-schedule-form-select"
                  required
                >
                  <option value="">Select Bus</option>
                  {buses.map(bus => (
                    <option key={bus.id} value={bus.id}>{bus.number}</option>
                  ))}
                </select>
              </div>
              
              <div className="bus-schedule-form-group">
                <label className="bus-schedule-form-label">Route</label>
                <select 
                  name="routeId" 
                  value={newSchedule.routeId} 
                  onChange={handleInputChange}
                  className="bus-schedule-form-select"
                  required
                >
                  <option value="">Select Route</option>
                  {routes.map(route => (
                    <option key={route.id} value={route.id}>{route.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="bus-schedule-form-group">
                <label className="bus-schedule-form-label">Day</label>
                <select 
                  name="day" 
                  value={newSchedule.day} 
                  onChange={handleInputChange}
                  className="bus-schedule-form-select"
                  required
                >
                  {daysOfWeek.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              
              <div className="bus-schedule-form-group">
                <label className="bus-schedule-form-label">Time Slot</label>
                <select 
                  name="timeSlot" 
                  value={newSchedule.timeSlot} 
                  onChange={handleInputChange}
                  className="bus-schedule-form-select"
                  required
                >
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
              
              <div className="bus-schedule-form-group bus-schedule-form-checkbox">
                <label className="bus-schedule-form-label">
                  <input 
                    type="checkbox" 
                    name="recurring" 
                    checked={newSchedule.recurring} 
                    onChange={handleInputChange}
                    className="bus-schedule-form-checkbox-input"
                  />
                  <span className="bus-schedule-form-checkbox-custom"></span>
                  Recurring Weekly
                </label>
              </div>
            </div>
            
            <div className="bus-schedule-form-actions">
              <button type="submit" className="bus-schedule-form-submit">
                {editingId ? 'Update Schedule' : 'Add Schedule'}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={clearForm}
                  className="bus-schedule-form-cancel"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      
      {conflicts.length > 0 && (
        <div className="bus-schedule-conflicts">
          <div className="bus-schedule-conflicts-header">
            <span className="bus-schedule-conflicts-icon">⚠️</span>
            <h3 className="bus-schedule-conflicts-title">Schedule Conflicts Detected</h3>
          </div>
          <ul className="bus-schedule-conflicts-list">
            {conflicts.map((conflict, index) => (
              <li key={index} className="bus-schedule-conflict-item">
                {conflict.message}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {activeView === 'weekly' ? (
        <div className="bus-schedule-weekly-view">
          <h3 className="bus-schedule-view-heading">Weekly Schedule View</h3>
          <div className="bus-schedule-grid">
            <div className="bus-schedule-grid-header">
              <div className="bus-schedule-time-header"></div>
              {daysOfWeek.map(day => (
                <div key={day} className="bus-schedule-day-header">
                  <span className="bus-schedule-day-name">{day.substring(0, 3)}</span>
                </div>
              ))}
            </div>
            
            {timeSlots.map(slot => (
              <div key={slot} className="bus-schedule-grid-row">
                <div className="bus-schedule-time-cell">
                  <span className="bus-schedule-time-label">{slot}</span>
                </div>
                {daysOfWeek.map(day => {
                  const daySchedules = filteredSchedules.filter(
                    s => s.day === day && s.timeSlot === slot
                  );
                  return (
                    <div 
                      key={`${day}-${slot}`} 
                      className={`bus-schedule-day-cell ${isDragging ? 'bus-schedule-day-cell-dragging' : ''}`}
                      onDragOver={(e) => handleDragOver(e, day, slot)}
                      onDrop={(e) => handleDrop(e, day, slot)}
                    >
                      {daySchedules.map(schedule => (
                        <div 
                          key={schedule.id} 
                          className={`bus-schedule-item ${hasConflict(schedule.id) ? 'bus-schedule-item-conflict' : ''}`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, schedule)}
                        >
                          <div className="bus-schedule-item-content">
                            <div className="bus-schedule-item-driver">
                              <span className="bus-schedule-item-icon">👤</span>
                              {getDriverName(schedule.driverId)}
                            </div>
                            <div className="bus-schedule-item-bus">
                              <span className="bus-schedule-item-icon">🚌</span>
                              {getBusNumber(schedule.busId)}
                            </div>
                            <div className="bus-schedule-item-route">
                              <span className="bus-schedule-item-icon">📍</span>
                              {getRouteName(schedule.routeId)}
                            </div>
                            {schedule.recurring && (
                              <div className="bus-schedule-item-recurring">
                                <span className="bus-schedule-item-icon">🔁</span>
                                Recurring
                              </div>
                            )}
                          </div>
                          <div className="bus-schedule-item-actions">
                            <button 
                              onClick={() => handleEdit(schedule)}
                              className="bus-schedule-item-edit"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(schedule.id)}
                              className="bus-schedule-item-delete"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bus-schedule-list-view">
          <h3 className="bus-schedule-view-heading">List View</h3>
          {filteredSchedules.length === 0 ? (
            <div className="bus-schedule-empty">
              <p className="bus-schedule-empty-message">No schedules found. Add a new schedule to get started.</p>
            </div>
          ) : (
            <div className="bus-schedule-table-container">
              <table className="bus-schedule-table">
                <thead className="bus-schedule-table-head">
                  <tr>
                    <th>Day</th>
                    <th>Time</th>
                    <th>Driver</th>
                    <th>Bus</th>
                    <th>Route</th>
                    <th>Recurring</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="bus-schedule-table-body">
                  {filteredSchedules.map(schedule => (
                    <tr 
                      key={schedule.id} 
                      className={`bus-schedule-table-row ${hasConflict(schedule.id) ? 'bus-schedule-table-row-conflict' : ''}`}
                    >
                      <td>{schedule.day}</td>
                      <td>{schedule.timeSlot}</td>
                      <td>
                        <div className="bus-schedule-table-driver">
                          <span className="bus-schedule-table-icon">👤</span>
                          {getDriverName(schedule.driverId)}
                        </div>
                      </td>
                      <td>
                        <div className="bus-schedule-table-bus">
                          <span className="bus-schedule-table-icon">🚌</span>
                          {getBusNumber(schedule.busId)}
                        </div>
                      </td>
                      <td>
                        <div className="bus-schedule-table-route">
                          <span className="bus-schedule-table-icon">📍</span>
                          {getRouteName(schedule.routeId)}
                        </div>
                      </td>
                      <td>
                        {schedule.recurring ? (
                          <span className="bus-schedule-table-recurring">Yes</span>
                        ) : (
                          <span className="bus-schedule-table-not-recurring">No</span>
                        )}
                      </td>
                      <td className="bus-schedule-table-actions">
                        <button 
                          onClick={() => handleEdit(schedule)}
                          className="bus-schedule-table-edit"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(schedule.id)}
                          className="bus-schedule-table-delete"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScheduleManagement;