import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, BookOpen, Filter, Search, Plus, Edit, Trash2, Download, Bell, Settings, User, ChevronDown, ChevronRight, X, Save } from 'lucide-react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import '../../../assets/css/time-table.css';

// Register Chart.js components
Chart.register(...registerables);

const TimetableDashboard = () => {
  // State for timetable view
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [viewMode, setViewMode] = useState('weekly');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('timetable');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [conflicts, setConflicts] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState('');

  // State for teacher management
  const [subjects, setSubjects] = useState([
    { id: 1, name: 'Hindi' },
    { id: 2, name: 'English' },
    { id: 3, name: 'Math' },
    { id: 4, name: 'History' },
    { id: 5, name: 'Polity'}
  ]);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [currentSubject, setCurrentSubject] = useState({ id: '', name: ''});

  const [teachers, setTeachers] = useState([
    { id: 1, name: 'Mr. Sharma', email: 'sharma@school.com', subjects: ['Hindi', 'English'], maxPeriods: 30 },
    { id: 2, name: 'Ms. Gupta', email: 'gupta@school.com', subjects: ['English', 'Polity'], maxPeriods: 28 },
    { id: 3, name: 'Dr. Singh', email: 'singh@school.com', subjects: ['Polity', 'English'], maxPeriods: 25 },
    { id: 4, name: 'Mrs. Patel', email: 'patel@school.com', subjects: ['Hindi', 'Polity'], maxPeriods: 26 },
    { id: 5, name: 'Mr. Kumar', email: 'kumar@school.com', subjects: ['English', 'Mathematics'], maxPeriods: 32 }
  ]);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState({ id: '', name: '', email: '', subjects: [], maxPeriods: 30 });
  const [subjectInput, setSubjectInput] = useState('');

  // State for room management
  const [rooms, setRooms] = useState([
    { id: 1, name: 'Room 101', capacity: 30, type: 'Classroom' },
    { id: 2, name: 'Room 102', capacity: 35, type: 'Classroom' },
    { id: 3, name: 'Lab 1', capacity: 20, type: 'Laboratory' },
    { id: 4, name: 'Lab 2', capacity: 25, type: 'Laboratory' },
    { id: 5, name: 'Auditorium', capacity: 100, type: 'Special' }
  ]);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [currentRoom, setCurrentRoom] = useState({ id: '', name: '', capacity: 30, type: 'Classroom' });

  // Sample data
  const classes = ['10-A', '10-B', '11-A', '11-B', '12-A', '12-B'];
  const timeSlots = ['9:00-9:45', '9:45-10:30', '10:45-11:30', '11:30-12:15', '1:00-1:45', '1:45-2:30', '2:30-3:15'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Enhanced timetable data with teacher and room information
  const [timetableData, setTimetableData] = useState({
    '10-A': {
      Monday: [
        { subject: 'Mathematics', teacher: 'Mr. Sharma', room: 'Room 101' },
        { subject: 'Physics', teacher: 'Mr. Sharma', room: 'Lab 1' },
        { subject: 'Break', teacher: '', room: '' },
        { subject: 'Chemistry', teacher: 'Ms. Gupta', room: 'Room 102' },
        { subject: 'Lunch', teacher: '', room: '' },
        { subject: 'English', teacher: 'Dr. Singh', room: 'Room 103' },
        { subject: 'Hindi', teacher: 'Mrs. Patel', room: 'Room 104' }
      ],
      Tuesday: [
        { subject: 'Physics', teacher: 'Mr. Sharma', room: 'Lab 1' },
        { subject: 'Mathematics', teacher: 'Mr. Sharma', room: 'Room 101' },
        { subject: 'Break', teacher: '', room: '' },
        { subject: 'Biology', teacher: 'Ms. Gupta', room: 'Lab 2' },
        { subject: 'Lunch', teacher: '', room: '' },
        { subject: 'History', teacher: 'Dr. Singh', room: 'Room 103' },
        { subject: 'English', teacher: 'Dr. Singh', room: 'Room 103' }
      ],
      Wednesday: [
        { subject: 'Chemistry', teacher: 'Ms. Gupta', room: 'Room 102' },
        { subject: 'Biology', teacher: 'Ms. Gupta', room: 'Lab 2' },
        { subject: 'Break', teacher: '', room: '' },
        { subject: 'Mathematics', teacher: 'Mr. Sharma', room: 'Room 101' },
        { subject: 'Lunch', teacher: '', room: '' },
        { subject: 'Physics', teacher: 'Mr. Sharma', room: 'Lab 1' },
        { subject: 'Hindi', teacher: 'Mrs. Patel', room: 'Room 104' }
      ],
      Thursday: [
        { subject: 'English', teacher: 'Dr. Singh', room: 'Room 103' },
        { subject: 'Hindi', teacher: 'Mrs. Patel', room: 'Room 104' },
        { subject: 'Break', teacher: '', room: '' },
        { subject: 'Physics', teacher: 'Mr. Sharma', room: 'Lab 1' },
        { subject: 'Lunch', teacher: '', room: '' },
        { subject: 'Mathematics', teacher: 'Mr. Sharma', room: 'Room 101' },
        { subject: 'Chemistry', teacher: 'Ms. Gupta', room: 'Room 102' }
      ],
      Friday: [
        { subject: 'Biology', teacher: 'Ms. Gupta', room: 'Lab 2' },
        { subject: 'Chemistry', teacher: 'Ms. Gupta', room: 'Room 102' },
        { subject: 'Break', teacher: '', room: '' },
        { subject: 'English', teacher: 'Dr. Singh', room: 'Room 103' },
        { subject: 'Lunch', teacher: '', room: '' },
        { subject: 'Hindi', teacher: 'Mrs. Patel', room: 'Room 104' },
        { subject: 'History', teacher: 'Dr. Singh', room: 'Room 103' }
      ],
      Saturday: [
        { subject: 'Mathematics', teacher: 'Mr. Sharma', room: 'Room 101' },
        { subject: 'Physics', teacher: 'Mr. Sharma', room: 'Lab 1' },
        { subject: 'Break', teacher: '', room: '' },
        { subject: 'Biology', teacher: 'Ms. Gupta', room: 'Lab 2' },
        { subject: 'Lunch', teacher: '', room: '' },
        { subject: 'Free', teacher: '', room: '' },
        { subject: 'Free', teacher: '', room: '' }
      ]
    },
    // Similar data for other classes...
  });

  // Statistics data
  const stats = {
    totalClasses: classes.length,
    totalTeachers: teachers.length,
    totalSubjects: subjects.length,
    weeklyPeriods: 42,
    conflicts: 3,
    utilization: 85
  };

  const notifications = [
    { id: 1, type: 'conflict', message: 'Teacher conflict detected in Period 3, Monday', time: '2 hours ago' },
    { id: 2, type: 'update', message: 'Timetable updated for Class 11-A', time: '5 hours ago' },
    { id: 3, type: 'request', message: 'Room change request for Physics Lab', time: '1 day ago' }
  ];

  // Analytics data
  const workloadData = {
    labels: teachers.map(t => t.name),
    datasets: [
      {
        label: 'Weekly Periods',
        data: teachers.map(t => Math.floor(Math.random() * 10) + 20), // Random data for demo
        backgroundColor: 'rgba(79, 70, 229, 0.8)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 1
      }
    ]
  };

  const subjectAllocationData = {
    labels: subjects.map(s => s.name),
    datasets: [
      {
        data: subjects.map(() => Math.floor(Math.random() * 20) + 5), // Random data for demo
        backgroundColor: [
          '#4f46e5', '#7c3aed', '#a78bfa', '#c4b5fd', '#8b5cf6',
          '#6366f1', '#818cf8', '#a5b4fc', '#d4d4d8'
        ],
        borderWidth: 1
      }
    ]
  };

  // Teacher management functions
  const handleAddTeacher = () => {
    setCurrentTeacher({ id: '', name: '', email: '', subjects: [], maxPeriods: 30 });
    setShowTeacherModal(true);
  };

  const handleEditTeacher = (teacher) => {
    setCurrentTeacher({ ...teacher });
    setShowTeacherModal(true);
  };

  const handleDeleteTeacher = (id) => {
    setTeachers(teachers.filter(t => t.id !== id));
  };

  const handleSaveTeacher = () => {
    if (currentTeacher.id) {
      // Update existing teacher
      setTeachers(teachers.map(t => t.id === currentTeacher.id ? currentTeacher : t));
    } else {
      // Add new teacher
      const newTeacher = {
        ...currentTeacher,
        id: Math.max(...teachers.map(t => t.id), 0) + 1
      };
      setTeachers([...teachers, newTeacher]);
    }
    setShowTeacherModal(false);
  };

  const addSubjectToTeacher = () => {
    if (subjectInput && !currentTeacher.subjects.includes(subjectInput)) {
      setCurrentTeacher({
        ...currentTeacher,
        subjects: [...currentTeacher.subjects, subjectInput]
      });
      setSubjectInput('');
    }
  };

  const removeSubjectFromTeacher = (subject) => {
    setCurrentTeacher({
      ...currentTeacher,
      subjects: currentTeacher.subjects.filter(s => s !== subject)
    });
  };

  // Subject management functions
  const handleAddSubject = () => {
    setCurrentSubject({ id: '', name: '' });
    setShowSubjectModal(true);
  };

  const handleEditSubject = (subject) => {
    setCurrentSubject({ ...subject });
    setShowSubjectModal(true);
  };

  const handleDeleteSubject = (id) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const handleSaveSubject = () => {
    if (currentSubject.id) {
      // Update existing subject
      setSubjects(subjects.map(s => s.id === currentSubject.id ? currentSubject : s));
    } else {
      // Add new subject
      const newSubject = {
        ...currentSubject,
        id: Math.max(...subjects.map(s => s.id), 0) + 1
      };
      setSubjects([...subjects, newSubject]);
    }
    setShowSubjectModal(false);
  };

  // Room management functions
  const handleAddRoom = () => {
    setCurrentRoom({ id: '', name: '', capacity: 30, type: 'Classroom' });
    setShowRoomModal(true);
  };

  const handleEditRoom = (room) => {
    setCurrentRoom({ ...room });
    setShowRoomModal(true);
  };

  const handleDeleteRoom = (id) => {
    setRooms(rooms.filter(r => r.id !== id));
  };

  const handleSaveRoom = () => {
    if (currentRoom.id) {
      // Update existing room
      setRooms(rooms.map(r => r.id === currentRoom.id ? currentRoom : r));
    } else {
      // Add new room
      const newRoom = {
        ...currentRoom,
        id: Math.max(...rooms.map(r => r.id), 0) + 1
      };
      setRooms([...rooms, newRoom]);
    }
    setShowRoomModal(false);
  };

  // Get teacher's timetable
  const getTeacherTimetable = (teacherName) => {
    const teacherTimetable = {};
    
    days.forEach(day => {
      teacherTimetable[day] = [];
      
      timeSlots.forEach((timeSlot, timeIndex) => {
        let foundPeriod = null;
        
        // Check all classes for this teacher's periods
        Object.keys(timetableData).forEach(className => {
          const daySchedule = timetableData[className][day];
          if (daySchedule && daySchedule[timeIndex] && daySchedule[timeIndex].teacher === teacherName) {
            foundPeriod = {
              ...daySchedule[timeIndex],
              className: className,
              timeSlot: timeSlot
            };
          }
        });
        
        teacherTimetable[day].push(foundPeriod || { subject: '', teacher: '', room: '' });
      });
    });
    
    return teacherTimetable;
  };

  // Enhanced timetable rendering with teacher and room info
  const renderTimetableGrid = () => {
    if (viewMode === 'teacher' && selectedTeacher) {
      const teacherTimetable = getTeacherTimetable(selectedTeacher);
      
      return (
        <div className="tt-grid-container">
          <div className="tt-grid-header">
            <div className="tt-time-slot-header">Time</div>
            {days.map(day => (
              <div key={day} className="tt-day-header">{day}</div>
            ))}
          </div>
          
          {timeSlots.map((timeSlot, timeIndex) => (
            <div key={timeSlot} className="tt-grid-row">
              <div className="tt-time-slot">{timeSlot}</div>
              {days.map(day => {
                const period = teacherTimetable[day][timeIndex];
                const isEmpty = !period || !period.subject;
                
                return (
                  <div 
                    key={`${day}-${timeIndex}`}
                    className={`tt-period-cell ${isEmpty ? 'tt-empty-cell' : ''}`}
                    onClick={() => setSelectedPeriod({day, timeIndex, ...period, timeSlot})}
                  >
                    {!isEmpty ? (
                      <>
                        <div className="tt-subject-name">{period.subject}</div>
                        <div className="tt-class-name">{period.className}</div>
                        <div className="tt-room-number">{period.room}</div>
                      </>
                    ) : (
                      <div className="tt-subject-name">Free</div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      );
    } else {
      const data = timetableData[selectedClass] || {};
      
      return (
        <div className="tt-grid-container">
          <div className="tt-grid-header">
            <div className="tt-time-slot-header">Time</div>
            {days.map(day => (
              <div key={day} className="tt-day-header">{day}</div>
            ))}
          </div>
          
          {timeSlots.map((timeSlot, timeIndex) => (
            <div key={timeSlot} className="tt-grid-row">
              <div className="tt-time-slot">{timeSlot}</div>
              {days.map(day => {
                const period = data[day] && data[day][timeIndex];
                const isBreak = period?.subject === 'Break' || period?.subject === 'Lunch';
                const isEmpty = !period || period?.subject === 'Free';
                
                return (
                  <div 
                    key={`${day}-${timeIndex}`}
                    className={`tt-period-cell ${isBreak ? 'tt-break-cell' : ''} ${isEmpty ? 'tt-empty-cell' : ''}`}
                    onClick={() => setSelectedPeriod({day, timeIndex, ...period, timeSlot})}
                  >
                    {period ? (
                      <>
                        <div className="tt-subject-name">{period.subject || 'Free'}</div>
                        {!isBreak && !isEmpty && (
                          <>
                            <div className="tt-teacher-name">{period.teacher}</div>
                            <div className="tt-room-number">{period.room}</div>
                          </>
                        )}
                      </>
                    ) : (
                      <div className="tt-subject-name">Free</div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      );
    }
  };

  // Subject management modal
  const renderSubjectModal = () => (
    <div className="tt-modal-overlay" onClick={() => setShowSubjectModal(false)}>
      <div className="tt-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="tt-modal-header">
          <h3>{currentSubject.id ? 'Edit Subject' : 'Add New Subject'}</h3>
          <button className="tt-close-btn" onClick={() => setShowSubjectModal(false)}>
            ×
          </button>
        </div>
        
        <div className="tt-modal-body">
          <div className="tt-form-group">
            <label>Subject Name:</label>
            <input 
              type="text" 
              value={currentSubject.name}
              onChange={(e) => setCurrentSubject({...currentSubject, name: e.target.value})}
              placeholder="Enter subject name"
            />
          </div>
        </div>
        
        <div className="tt-modal-footer">
          <button className="tt-btn-secondary" onClick={() => setShowSubjectModal(false)}>
            Cancel
          </button>
          <button className="tt-btn-primary" onClick={handleSaveSubject}>
            <Save size={16} /> Save Subject
          </button>
        </div>
      </div>
    </div>
  );

  // Subjects list component
  const renderSubjectsList = () => (
    <div className="tt-subjects-list-container">
      <div className="tt-content-header">
        <h2>Subject Management</h2>
        <div className="tt-action-buttons">
          <button className="tt-btn-secondary" onClick={() => setActiveTab('teachers')}>
            Manage Teachers
          </button>
          <button className="tt-btn-primary" onClick={handleAddSubject}>
            <Plus /> Add Subject
          </button>
        </div>
      </div>
      
      <div className="tt-subjects-table">
        <div className="tt-table-header">
          <div className="tt-table-row">
            <div className="tt-table-cell">ID</div>
            <div className="tt-table-cell">Name</div>
            <div className="tt-table-cell">Actions</div>
          </div>
        </div>
        
        <div className="tt-table-body">
          {subjects.map(subject => (
            <div key={subject.id} className="tt-table-row">
              <div className="tt-table-cell">{subject.id}</div>
              <div className="tt-table-cell">{subject.name}</div>
              <div className="tt-table-cell tt-actions-cell">
                <button 
                  className="tt-btn-icon"
                  onClick={() => handleEditSubject(subject)}
                >
                  <Edit size={16} />
                </button>
                <button 
                  className="tt-btn-icon tt-danger"
                  onClick={() => handleDeleteSubject(subject.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Teacher management modal
  const renderTeacherModal = () => (
    <div className="tt-modal-overlay" onClick={() => setShowTeacherModal(false)}>
      <div className="tt-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="tt-modal-header">
          <h3>{currentTeacher.id ? 'Edit Teacher' : 'Add New Teacher'}</h3>
          <button className="tt-close-btn" onClick={() => setShowTeacherModal(false)}>
            ×
          </button>
        </div>
        
        <div className="tt-modal-body">
          <div className="tt-form-group">
            <label>Name:</label>
            <input 
              type="text" 
              value={currentTeacher.name}
              onChange={(e) => setCurrentTeacher({...currentTeacher, name: e.target.value})}
              placeholder="Enter teacher's name"
            />
          </div>
          
          <div className="tt-form-group">
            <label>Email:</label>
            <input 
              type="email" 
              value={currentTeacher.email}
              onChange={(e) => setCurrentTeacher({...currentTeacher, email: e.target.value})}
              placeholder="Enter teacher's email"
            />
          </div>
          
          <div className="tt-form-group">
            <label>Max Weekly Periods:</label>
            <input 
              type="number" 
              value={currentTeacher.maxPeriods}
              onChange={(e) => setCurrentTeacher({...currentTeacher, maxPeriods: parseInt(e.target.value) || 0})}
              min="0"
            />
          </div>
          
          <div className="tt-form-group">
            <label>Subjects:</label>
            <div className="tt-subjects-input-container">
              <select 
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
              >
                <option value="">Select a subject</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.name}>{subject.name}</option>
                ))}
              </select>
              <button 
                className="tt-btn-primary tt-small-btn"
                onClick={addSubjectToTeacher}
              >
                Add
              </button>
            </div>
            
            <div className="tt-subjects-list">
              {currentTeacher.subjects.map(subject => (
                <div key={subject} className="tt-subject-tag">
                  {subject}
                  <button 
                    className="tt-remove-subject"
                    onClick={() => removeSubjectFromTeacher(subject)}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="tt-modal-footer">
          <button className="tt-btn-secondary" onClick={() => setShowTeacherModal(false)}>
            Cancel
          </button>
          <button className="tt-btn-primary" onClick={handleSaveTeacher}>
            <Save size={16} /> Save Teacher
          </button>
        </div>
      </div>
    </div>
  );

  // Room management modal
  const renderRoomModal = () => (
    <div className="tt-modal-overlay" onClick={() => setShowRoomModal(false)}>
      <div className="tt-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="tt-modal-header">
          <h3>{currentRoom.id ? 'Edit Room' : 'Add New Room'}</h3>
          <button className="tt-close-btn" onClick={() => setShowRoomModal(false)}>
            ×
          </button>
        </div>
        
        <div className="tt-modal-body">
          <div className="tt-form-group">
            <label>Room Name:</label>
            <input 
              type="text" 
              value={currentRoom.name}
              onChange={(e) => setCurrentRoom({...currentRoom, name: e.target.value})}
              placeholder="Enter room name"
            />
          </div>
          
          <div className="tt-form-group">
            <label>Capacity:</label>
            <input 
              type="number" 
              value={currentRoom.capacity}
              onChange={(e) => setCurrentRoom({...currentRoom, capacity: parseInt(e.target.value) || 0})}
              min="1"
            />
          </div>
          
          <div className="tt-form-group">
            <label>Room Type:</label>
            <select 
              value={currentRoom.type}
              onChange={(e) => setCurrentRoom({...currentRoom, type: e.target.value})}
            >
              <option value="Classroom">Classroom</option>
              <option value="Laboratory">Laboratory</option>
              <option value="Special">Special (Auditorium, etc.)</option>
            </select>
          </div>
        </div>
        
        <div className="tt-modal-footer">
          <button className="tt-btn-secondary" onClick={() => setShowRoomModal(false)}>
            Cancel
          </button>
          <button className="tt-btn-primary" onClick={handleSaveRoom}>
            <Save size={16} /> Save Room
          </button>
        </div>
      </div>
    </div>
  );

  // Teachers list component
  const renderTeachersList = () => (
    <div className="tt-teachers-list-container">
      <div className="tt-content-header">
        <h2>Teacher Management</h2>
        <div className="tt-action-buttons">
          <button className="tt-btn-secondary" onClick={() => setActiveTab('rooms')}>
            Manage Rooms
          </button>
          <button className="tt-btn-primary" onClick={handleAddTeacher}>
            <Plus /> Add Teacher
          </button>
        </div>
      </div>
      
      <div className="tt-teachers-table">
        <div className="tt-table-header">
          <div className="tt-table-row">
            <div className="tt-table-cell">Name</div>
            <div className="tt-table-cell">Email</div>
            <div className="tt-table-cell">Subjects</div>
            <div className="tt-table-cell">Max Periods</div>
            <div className="tt-table-cell">Actions</div>
          </div>
        </div>
        
        <div className="tt-table-body">
          {teachers.map(teacher => (
            <div key={teacher.id} className="tt-table-row">
              <div className="tt-table-cell">{teacher.name}</div>
              <div className="tt-table-cell">{teacher.email}</div>
              <div className="tt-table-cell">
                {teacher.subjects.join(', ')}
              </div>
              <div className="tt-table-cell">{teacher.maxPeriods}</div>
              <div className="tt-table-cell tt-actions-cell">
                <button 
                  className="tt-btn-icon"
                  onClick={() => handleEditTeacher(teacher)}
                >
                  <Edit size={16} />
                </button>
                <button 
                  className="tt-btn-icon tt-danger"
                  onClick={() => handleDeleteTeacher(teacher.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Rooms list component
  const renderRoomsList = () => (
    <div className="tt-rooms-list-container">
      <div className="tt-content-header">
        <h2>Room Management</h2>
        <div className="tt-action-buttons">
          <button className="tt-btn-secondary" onClick={() => setActiveTab('teachers')}>
            Manage Teachers
          </button>
          <button className="tt-btn-primary" onClick={handleAddRoom}>
            <Plus /> Add Room
          </button>
        </div>
      </div>
      
      <div className="tt-rooms-table">
        <div className="tt-table-header">
          <div className="tt-table-row">
            <div className="tt-table-cell">Room Name</div>
            <div className="tt-table-cell">Type</div>
            <div className="tt-table-cell">Capacity</div>
            <div className="tt-table-cell">Actions</div>
          </div>
        </div>
        
        <div className="tt-table-body">
          {rooms.map(room => (
            <div key={room.id} className="tt-table-row">
              <div className="tt-table-cell">{room.name}</div>
              <div className="tt-table-cell">{room.type}</div>
              <div className="tt-table-cell">{room.capacity}</div>
              <div className="tt-table-cell tt-actions-cell">
                <button 
                  className="tt-btn-icon"
                  onClick={() => handleEditRoom(room)}
                >
                  <Edit size={16} />
                </button>
                <button 
                  className="tt-btn-icon tt-danger"
                  onClick={() => handleDeleteRoom(room.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Analytics charts
  const renderAnalyticsCharts = () => (
    <div className="tt-analytics-section">
      <div className="tt-analytics-grid">
        <div className="tt-chart-container">
          <h3>Teacher Workload Distribution</h3>
          <div className="tt-chart-wrapper">
            <Bar 
              data={workloadData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Number of Periods'
                    }
                  }
                }
              }}
            />
          </div>
        </div>
        
        <div className="tt-chart-container">
          <h3>Subject Allocation</h3>
          <div className="tt-chart-wrapper">
            <Pie 
              data={subjectAllocationData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                }
              }}
            />
          </div>
        </div>
      </div>
      
      <div className="tt-chart-container">
        <h3>Room Utilization</h3>
        <div className="tt-chart-wrapper">
          <Line 
            data={{
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
              datasets: [
                {
                  label: 'Room 101',
                  data: [65, 59, 80, 81, 56, 55],
                  borderColor: 'rgb(79, 70, 229)',
                  backgroundColor: 'rgba(79, 70, 229, 0.5)',
                },
                {
                  label: 'Lab 1',
                  data: [28, 48, 40, 19, 86, 27],
                  borderColor: 'rgb(239, 68, 68)',
                  backgroundColor: 'rgba(239, 68, 68, 0.5)',
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Periods Used'
                  }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );

  // Settings section
  const renderSettings = () => (
    <div className="tt-settings-section">
      <div className="tt-settings-grid">
        <div className="tt-settings-card">
          <h3>General Settings</h3>
          <div className="tt-setting-item">
            <label>Academic Year</label>
            <select>
              <option>2024-2025</option>
              <option>2025-2026</option>
            </select>
          </div>
          <div className="tt-setting-item">
            <label>Working Days</label>
            <select>
              <option>Monday to Saturday</option>
              <option>Monday to Friday</option>
            </select>
          </div>
          <div className="tt-setting-item">
            <label>Period Duration</label>
            <input type="number" defaultValue="45" /> minutes
          </div>
        </div>
        
        <div className="tt-settings-card">
          <h3>Timetable Settings</h3>
          <div className="tt-setting-item">
            <label>Break Duration</label>
            <input type="number" defaultValue="15" /> minutes
          </div>
          <div className="tt-setting-item">
            <label>Lunch Duration</label>
            <input type="number" defaultValue="45" /> minutes
          </div>
          <div className="tt-setting-item">
            <label>First Period Start Time</label>
            <input type="time" defaultValue="09:00" />
          </div>
        </div>
      </div>
      
      <div className="tt-settings-actions">
        <button className="tt-btn-primary">
          <Save size={16} /> Save Settings
        </button>
        <button className="tt-btn-secondary">
          Reset to Defaults
        </button>
      </div>
    </div>
  );

  // Period management modal
  const renderPeriodModal = () => {
    if (!showAddModal && !selectedPeriod) return null;
    
    return (
      <div className="tt-modal-overlay" onClick={() => {setShowAddModal(false); setSelectedPeriod(null);}}>
        <div className="tt-modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="tt-modal-header">
            <h3>{selectedPeriod ? 'Edit Period' : 'Add New Period'}</h3>
            <button 
              className="tt-close-btn"
              onClick={() => {setShowAddModal(false); setSelectedPeriod(null);}}
            >
              ×
            </button>
          </div>
          
          <div className="tt-modal-body">
            <div className="tt-form-group">
              <label>Subject:</label>
              <select defaultValue={selectedPeriod?.subject || ''}>
                <option value="">Select a subject</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.name}>{subject.name}</option>
                ))}
              </select>
            </div>
            
            <div className="tt-form-group">
              <label>Teacher:</label>
              <select defaultValue={selectedPeriod?.teacher || ''}>
                <option value="">Select a teacher</option>
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.name}>{teacher.name}</option>
                ))}
              </select>
            </div>
            
            <div className="tt-form-group">
              <label>Room:</label>
              <select defaultValue={selectedPeriod?.room || ''}>
                <option value="">Select a room</option>
                {rooms.map(room => (
                  <option key={room.id} value={room.name}>{room.name}</option>
                ))}
              </select>
            </div>
            
            {selectedPeriod && (
              <div className="tt-form-group">
                <label>Time:</label>
                <input type="text" value={selectedPeriod.timeSlot} readOnly />
              </div>
            )}
          </div>
          
          <div className="tt-modal-footer">
            <button className="tt-btn-secondary" onClick={() => {setShowAddModal(false); setSelectedPeriod(null);}}>
              Cancel
            </button>
            <button className="tt-btn-primary">
              {selectedPeriod ? 'Update' : 'Add'} Period
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="tt-dashboard-container">
      {/* Header */}
      <header className="tt-dashboard-header">
        <div className="tt-header-left">
          <h1>Timetable Management System</h1>
          <p>Comprehensive school timetable management solution</p>
        </div>
        <div className="tt-header-right">
          <div className="tt-icon-dropdown-container">
            <button 
              className={`tt-btn-icon ${showNotifications ? 'tt-active' : ''}`} 
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowSettingsMenu(false);
              }}
            >
              <Bell />
              <span className="tt-notification-badge">3</span>
            </button>
            {showNotifications && (
              <div className="tt-notifications-dropdown">
                <div className="tt-dropdown-header">
                  <h4>Notifications</h4>
                  <button className="tt-mark-all-read">Mark all as read</button>
                </div>
                <div className="tt-dropdown-content">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`tt-notification-item tt-${notification.type}`}
                    >
                      <div className="tt-notification-content">
                        <p>{notification.message}</p>
                        <span className="tt-notification-time">{notification.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="tt-dropdown-footer">
                  <button className="tt-view-all">View All Notifications</button>
                </div>
              </div>
            )}
          </div>
          
          <div className="tt-icon-dropdown-container">
            <button 
              className={`tt-btn-icon ${showSettingsMenu ? 'tt-active' : ''}`}
              onClick={() => {
                setShowSettingsMenu(!showSettingsMenu);
                setShowNotifications(false);
              }}
            >
              <Settings />
            </button>
            {showSettingsMenu && (
              <div className="tt-settings-dropdown">
                <div className="tt-dropdown-item">
                  <Settings size={16} />
                  <span>Dashboard Settings</span>
                </div>
                <div className="tt-dropdown-item">
                  <Edit size={16} />
                  <span>Edit Profile</span>
                </div>
                <div className="tt-dropdown-item">
                  <Clock size={16} />
                  <span>Activity Log</span>
                </div>
                <div className="tt-dropdown-divider"></div>
                <div className="tt-dropdown-item">
                  <Trash2 size={16} />
                  <span>Clear Cache</span>
                </div>
              </div>
            )}
          </div>
          
          <div 
            className={`tt-user-profile ${isMenuOpen ? 'tt-open' : ''}`} 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="tt-user-avatar">A</div>
            <span>Admin</span>
            <ChevronDown className={`tt-dropdown-icon ${isMenuOpen ? 'tt-open' : ''}`} />
            {isMenuOpen && (
              <div className="tt-profile-menu">
                <div className="tt-menu-item">My Profile</div>
                <div className="tt-menu-item">Settings</div>
                <div className="tt-menu-divider"></div>
                <div className="tt-menu-item">Logout</div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="tt-nav-tabs">
        <button 
          className={`tt-tab ${activeTab === 'timetable' ? 'tt-active' : ''}`}
          onClick={() => setActiveTab('timetable')}
        >
          <Calendar /> Timetable
        </button>
        <button 
          className={`tt-tab ${activeTab === 'subject' ? 'tt-active' : ''}`}
          onClick={() => setActiveTab('subject')}
        >
          <BookOpen /> Subjects
        </button>
        <button 
          className={`tt-tab ${activeTab === 'teachers' ? 'tt-active' : ''}`}
          onClick={() => setActiveTab('teachers')}
        >
          <Users /> Teachers
        </button>
        <button 
          className={`tt-tab ${activeTab === 'rooms' ? 'tt-active' : ''}`}
          onClick={() => setActiveTab('rooms')}
        >
          <Users /> Rooms
        </button>
        <button 
          className={`tt-tab ${activeTab === 'analytics' ? 'tt-active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BookOpen /> Analytics
        </button>
        <button 
          className={`tt-tab ${activeTab === 'settings' ? 'tt-active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings /> Settings
        </button>
      </nav>

      {/* Main Content */}
      <main className="tt-main-content">
        {activeTab === 'timetable' && (
          <>
            {/* Stats Cards */}
            <div className="tt-stats-grid">
              <div className="tt-stat-card">
                <div className="tt-stat-icon">
                  <Users />
                </div>
                <div className="tt-stat-content">
                  <h3>{stats.totalClasses}</h3>
                  <p>Total Classes</p>
                </div>
              </div>
              
              <div className="tt-stat-card">
                <div className="tt-stat-icon">
                  <User />
                </div>
                <div className="tt-stat-content">
                  <h3>{stats.totalTeachers}</h3>
                  <p>Total Teachers</p>
                </div>
              </div>
              
              <div className="tt-stat-card">
                <div className="tt-stat-icon">
                  <BookOpen />
                </div>
                <div className="tt-stat-content">
                  <h3>{stats.totalSubjects}</h3>
                  <p>Total Subjects</p>
                </div>
              </div>
              
              <div className="tt-stat-card">
                <div className="tt-stat-icon">
                  <Clock />
                </div>
                <div className="tt-stat-content">
                  <h3>{stats.weeklyPeriods}</h3>
                  <p>Weekly Periods</p>
                </div>
              </div>
              
              <div className="tt-stat-card tt-conflict-card">
                <div className="tt-stat-icon">
                  <Bell />
                </div>
                <div className="tt-stat-content">
                  <h3>{stats.conflicts}</h3>
                  <p>Conflicts</p>
                </div>
              </div>
              
              <div className="tt-stat-card">
                <div className="tt-stat-icon">
                  <Calendar />
                </div>
                <div className="tt-stat-content">
                  <h3>{stats.utilization}%</h3>
                  <p>Utilization</p>
                </div>
              </div>
            </div>
            
            {/* Filters and Actions */}
            <div className="tt-content-header">
              <div className="tt-filters-section">
                {viewMode !== 'teacher' && (
                  <div className="tt-filter-group">
                    <label>Class:</label>
                    <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                      {classes.map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                {viewMode === 'teacher' && (
                  <div className="tt-filter-group">
                    <label>Teacher:</label>
                    <select 
                      value={selectedTeacher} 
                      onChange={(e) => setSelectedTeacher(e.target.value)}
                    >
                      <option value="">Select Teacher</option>
                      {teachers.map(teacher => (
                        <option key={teacher.id} value={teacher.name}>{teacher.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div className="tt-filter-group">
                  <label>Week:</label>
                  <select value={selectedWeek} onChange={(e) => setSelectedWeek(e.target.value)}>
                    <option value="current">Current Week</option>
                    <option value="next">Next Week</option>
                    <option value="previous">Previous Week</option>
                  </select>
                </div>
                
                <div className="tt-filter-group">
                  <label>View:</label>
                  <select 
                    value={viewMode} 
                    onChange={(e) => {
                      setViewMode(e.target.value);
                      if (e.target.value !== 'teacher') {
                        setSelectedTeacher('');
                      }
                    }}
                  >
                    <option value="weekly">Weekly View</option>
                    <option value="daily">Daily View</option>
                    <option value="teacher">Teacher View</option>
                  </select>
                </div>
                
                <div className="tt-search-group">
                  <Search className="tt-search-icon" />
                  <input
                    type="text"
                    placeholder="Search subjects, teachers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="tt-search-input"
                  />
                </div>
              </div>
              <div className="tt-action-buttons">
                <button className="tt-btn-secondary">
                  <Download /> Export
                </button>
                <button className="tt-btn-primary" onClick={() => setShowAddModal(true)}>
                  <Plus /> Add Period
                </button>
              </div>
            </div>

            {/* Timetable Grid */}
            <div className="tt-timetable-container">
              <div className="tt-timetable-header">
                <h2>
                  {viewMode === 'teacher' && selectedTeacher 
                    ? `${selectedTeacher}'s Weekly Timetable` 
                    : `Class ${selectedClass} - Weekly Timetable`}
                </h2>
                <div className="tt-view-controls">
                  <button 
                    className={viewMode === 'weekly' ? 'tt-active' : ''}
                    onClick={() => {
                      setViewMode('weekly');
                      setSelectedTeacher('');
                    }}
                  >
                    Weekly
                  </button>
                  <button 
                    className={viewMode === 'daily' ? 'tt-active' : ''}
                    onClick={() => {
                      setViewMode('daily');
                      setSelectedTeacher('');
                    }}
                  >
                    Daily
                  </button>
                  <button 
                    className={viewMode === 'teacher' ? 'tt-active' : ''}
                    onClick={() => setViewMode('teacher')}
                  >
                    Teacher
                  </button>
                </div>
              </div>
              {renderTimetableGrid()}
            </div>
          </>
        )}

        {activeTab === 'subject' && renderSubjectsList()}
        {activeTab === 'teachers' && renderTeachersList()}
        {activeTab === 'rooms' && renderRoomsList()}
        {activeTab === 'analytics' && renderAnalyticsCharts()}
        {activeTab === 'settings' && renderSettings()}
      </main>

      {/* Modals */}
      {showSubjectModal && renderSubjectModal()}
      {showTeacherModal && renderTeacherModal()}
      {showRoomModal && renderRoomModal()}
      {renderPeriodModal()}
    </div>
  );
};

export default TimetableDashboard;