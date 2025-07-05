import React, { useState, useEffect } from 'react';
import './Cctv-Management.css';

const CCTVManagement = () => {
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [newStudent, setNewStudent] = useState({ name: '', className: '', id: '' });
  const [editIndex, setEditIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('students');
  const [attendance, setAttendance] = useState([]);
  const [alertStatus, setAlertStatus] = useState({ show: false, message: '', type: '' });

  // Sample class-wise camera stream URLs
  const cameraFeeds = {
    'Class 1': 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    'Class 2': 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    'Class 3': 'https://mojanesia.sgp1.cdn.digitaloceanspaces.com/ads/stream.m3u8',
  };

  // Classrooms data
  const classrooms = [
    { name: 'Class 1', capacity: 30, location: 'Building A, Floor 1' },
    { name: 'Class 2', capacity: 25, location: 'Building A, Floor 2' },
    { name: 'Class 3', capacity: 35, location: 'Building B, Floor 1' },
  ];

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Simulate loading some initial data
      setStudents([
        { name: 'John Doe', className: 'Class 1', id: 'S001' },
        { name: 'Jane Smith', className: 'Class 1', id: 'S002' },
        { name: 'Mike Johnson', className: 'Class 2', id: 'S003' },
      ]);
      setAttendance([
        { studentId: 'S001', date: '2023-05-01', status: 'present' },
        { studentId: 'S002', date: '2023-05-01', status: 'absent' },
        { studentId: 'S003', date: '2023-05-01', status: 'present' },
      ]);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Show alert message
  const showAlert = (message, type) => {
    setAlertStatus({ show: true, message, type });
    setTimeout(() => {
      setAlertStatus({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Add or update student
  const handleAddOrUpdateStudent = (e) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.className || !newStudent.id) {
      showAlert('Please fill in all fields.', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      if (editIndex !== null) {
        const updated = [...students];
        updated[editIndex] = newStudent;
        setStudents(updated);
        setEditIndex(null);
        showAlert('Student updated successfully!', 'success');
      } else {
        setStudents([...students, newStudent]);
        showAlert('Student added successfully!', 'success');
      }
      setNewStudent({ name: '', className: '', id: '' });
      setIsLoading(false);
    }, 800);
  };

  // Handle student edit
  const handleEdit = (index) => {
    setNewStudent(students[index]);
    setEditIndex(index);
    document.querySelector('.cctv-form-container').scrollIntoView({ behavior: 'smooth' });
  };

  // Handle student delete
  const handleDelete = (index) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    
    setIsLoading(true);
    setTimeout(() => {
      const updated = [...students];
      updated.splice(index, 1);
      setStudents(updated);
      if (editIndex === index) {
        setNewStudent({ name: '', className: '', id: '' });
        setEditIndex(null);
      }
      setIsLoading(false);
      showAlert('Student deleted successfully!', 'success');
    }, 800);
  };

  // Mark attendance
  const markAttendance = (studentId, status) => {
    const today = new Date().toISOString().split('T')[0];
    const updatedAttendance = attendance.filter(a => !(a.studentId === studentId && a.date === today));
    setAttendance([...updatedAttendance, { studentId, date: today, status }]);
    showAlert(`Attendance marked as ${status}`, 'success');
  };

  // Filter students by selected class
  const filteredStudents = selectedClass ? students.filter((s) => s.className === selectedClass) : students;

  if (isLoading && students.length === 0) {
    return (
      <div className="cctv-loading-screen">
        <div className="cctv-spinner"></div>
        <p>Loading CCTV Management System...</p>
      </div>
    );
  }

  return (
    <div className="cctv-management-container">
      {/* Alert Notification */}
      {alertStatus.show && (
        <div className={`cctv-alert cctv-alert-${alertStatus.type} slide-down`}>
          {alertStatus.message}
        </div>
      )}

      <header className="cctv-header">
        <h1 className="cctv-title">
          <span className="cctv-icon">🎓</span> 
          School Surveillance System
          <span className="cctv-subtitle">Intelligent Classroom Monitoring</span>
        </h1>
        
        <div className="cctv-tabs">
          <button 
            className={`cctv-tab ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            <span className="cctv-tab-icon">👨‍🎓</span> Students
          </button>
          <button 
            className={`cctv-tab ${activeTab === 'classrooms' ? 'active' : ''}`}
            onClick={() => setActiveTab('classrooms')}
          >
            <span className="cctv-tab-icon">🏫</span> Classrooms
          </button>
          <button 
            className={`cctv-tab ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <span className="cctv-tab-icon">📊</span> Reports
          </button>
        </div>
      </header>

      <div className="cctv-content-wrapper">
        {/* Left Panel - Student Management */}
        <div className="cctv-left-panel">
          {activeTab === 'students' && (
            <>
              {/* Add or Edit Student Form */}
              <div className="cctv-form-container slide-in">
                <h3 className="cctv-form-title">
                  {editIndex !== null ? (
                    <><span className="cctv-form-icon">✏️</span> Edit Student Record</>
                  ) : (
                    <><span className="cctv-form-icon">➕</span> Register New Student</>
                  )}
                </h3>
                <form onSubmit={handleAddOrUpdateStudent} className="cctv-student-form">
                  <div className="cctv-form-group">
                    <label htmlFor="studentId" className="cctv-form-label">
                      Student ID
                    </label>
                    <input
                      id="studentId"
                      type="text"
                      placeholder="Enter student ID"
                      value={newStudent.id}
                      onChange={(e) => setNewStudent({ ...newStudent, id: e.target.value })}
                      className="cctv-form-input"
                    />
                  </div>
                  
                  <div className="cctv-form-group">
                    <label htmlFor="studentName" className="cctv-form-label">
                      Full Name
                    </label>
                    <input
                      id="studentName"
                      type="text"
                      placeholder="Enter student name"
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                      className="cctv-form-input"
                    />
                  </div>
                  
                  <div className="cctv-form-group">
                    <label htmlFor="studentClass" className="cctv-form-label">
                      Assign Class
                    </label>
                    <select
                      id="studentClass"
                      value={newStudent.className}
                      onChange={(e) => setNewStudent({ ...newStudent, className: e.target.value })}
                      className="cctv-form-select"
                    >
                      <option value="">-- Select Class --</option>
                      {Object.keys(cameraFeeds).map((cls, i) => (
                        <option key={i} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>
                  
                  <button type="submit" className="cctv-form-submit">
                    {editIndex !== null ? 'Update Student' : 'Register Student'}
                  </button>
                  
                  {editIndex !== null && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setNewStudent({ name: '', className: '', id: '' });
                        setEditIndex(null);
                      }}
                      className="cctv-form-cancel"
                    >
                      Cancel
                    </button>
                  )}
                </form>
              </div>

              {/* Class Selection for Viewing */}
              <div className="cctv-class-selector fade-in">
                <div className="cctv-form-group">
                  <label htmlFor="viewClass" className="cctv-form-label">
                    <span className="cctv-selector-icon">📚</span> Filter by Classroom
                  </label>
                  <select
                    id="viewClass"
                    value={selectedClass}
                    onChange={(e) => {
                      setSelectedClass(e.target.value);
                      setVideoLoading(true);
                    }}
                    className="cctv-form-select"
                  >
                    <option value="">-- All Classrooms --</option>
                    {Object.keys(cameraFeeds).map((className, i) => (
                      <option key={i} value={className}>{className}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Students List */}
              <div className="cctv-student-list slide-up">
                <h3 className="cctv-student-list-title">
                  <span className="cctv-list-icon">👩‍🎓</span> 
                  {selectedClass ? `Students in ${selectedClass}` : 'All Students'}
                  <span className="cctv-student-count">{filteredStudents.length}</span>
                </h3>
                
                {filteredStudents.length > 0 ? (
                  <div className="cctv-student-table-container">
                    <table className="cctv-student-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Class</th>
                          <th>Today's Attendance</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map((s, idx) => {
                          const todayAttendance = attendance.find(
                            a => a.studentId === s.id && a.date === new Date().toISOString().split('T')[0]
                          );
                          return (
                            <tr key={idx} className="cctv-student-row">
                              <td>{s.id}</td>
                              <td>{s.name}</td>
                              <td>{s.className}</td>
                              <td>
                                {todayAttendance ? (
                                  <span className={`cctv-attendance-badge ${todayAttendance.status}`}>
                                    {todayAttendance.status}
                                  </span>
                                ) : (
                                  <div className="cctv-attendance-actions">
                                    <button 
                                      onClick={() => markAttendance(s.id, 'present')}
                                      className="cctv-attendance-present"
                                    >
                                      Present
                                    </button>
                                    <button 
                                      onClick={() => markAttendance(s.id, 'absent')}
                                      className="cctv-attendance-absent"
                                    >
                                      Absent
                                    </button>
                                  </div>
                                )}
                              </td>
                              <td>
                                <div className="cctv-student-actions">
                                  <button 
                                    onClick={() => handleEdit(students.findIndex(stu => stu.id === s.id))}
                                    className="cctv-edit-btn"
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(students.findIndex(stu => stu.id === s.id))}
                                    className="cctv-delete-btn"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="cctv-empty-state">
                    <p>No students found{selectedClass ? ' in this class' : ''}.</p>
                    <button 
                      onClick={() => setNewStudent(prev => ({ ...prev, className: selectedClass || '' }))}
                      className="cctv-add-to-class"
                    >
                      + Register New Student
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'classrooms' && (
            <div className="cctv-classrooms-list">
              <h3 className="cctv-section-title">
                <span className="cctv-section-icon">🏫</span>
                Classroom Information
              </h3>
              
              <div className="cctv-classroom-cards">
                {classrooms.map((room, index) => (
                  <div key={index} className="cctv-classroom-card" onClick={() => setSelectedClass(room.name)}>
                    <div className="cctv-classroom-header">
                      <h4>{room.name}</h4>
                      <span className="cctv-classroom-status active">Live</span>
                    </div>
                    <div className="cctv-classroom-details">
                      <p><span>Capacity:</span> {room.capacity} students</p>
                      <p><span>Location:</span> {room.location}</p>
                      <p><span>Current Students:</span> {students.filter(s => s.className === room.name).length}</p>
                    </div>
                    <div className="cctv-classroom-footer">
                      <button className="cctv-view-feed-btn" onClick={(e) => {
                        e.stopPropagation();
                        setSelectedClass(room.name);
                        setActiveTab('students');
                      }}>
                        View Feed
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="cctv-reports-section">
              <h3 className="cctv-section-title">
                <span className="cctv-section-icon">📊</span>
                Monitoring Reports
              </h3>
              
              <div className="cctv-report-cards">
                <div className="cctv-report-card">
                  <div className="cctv-report-icon total-students">
                    <span>👨‍🎓</span>
                  </div>
                  <h4>Total Students</h4>
                  <p className="cctv-report-value">{students.length}</p>
                </div>
                
                <div className="cctv-report-card">
                  <div className="cctv-report-icon present-today">
                    <span>✅</span>
                  </div>
                  <h4>Present Today</h4>
                  <p className="cctv-report-value">
                    {attendance.filter(a => a.date === new Date().toISOString().split('T')[0] && a.status === 'present').length}
                  </p>
                </div>
                
                <div className="cctv-report-card">
                  <div className="cctv-report-icon absent-today">
                    <span>❌</span>
                  </div>
                  <h4>Absent Today</h4>
                  <p className="cctv-report-value">
                    {attendance.filter(a => a.date === new Date().toISOString().split('T')[0] && a.status === 'absent').length}
                  </p>
                </div>
                
                <div className="cctv-report-card">
                  <div className="cctv-report-icon classrooms">
                    <span>🏫</span>
                  </div>
                  <h4>Active Classrooms</h4>
                  <p className="cctv-report-value">{classrooms.length}</p>
                </div>
              </div>
              
              <div className="cctv-attendance-chart">
                <h4>Weekly Attendance Trend</h4>
                <div className="cctv-chart-placeholder">
                  <p>Attendance visualization chart will appear here</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - CCTV Feed */}
        <div className="cctv-right-panel">
          {selectedClass && cameraFeeds[selectedClass] && (
            <div className="cctv-feed-container">
              <div className="cctv-feed-header">
                <h3 className="cctv-feed-title">
                  <span className="cctv-camera-icon">📹</span> 
                  {selectedClass} Live Feed
                </h3>
                <div className="cctv-feed-controls">
                  <button className="cctv-feed-control-btn">
                    <span>🔍</span> Zoom
                  </button>
                  <button className="cctv-feed-control-btn">
                    <span>⏸️</span> Pause
                  </button>
                  <button className="cctv-feed-control-btn">
                    <span>📸</span> Snapshot
                  </button>
                </div>
              </div>
              
              <div className="cctv-video-wrapper">
                {videoLoading && (
                  <div className="cctv-video-loading">
                    <div className="cctv-spinner"></div>
                    <p>Connecting to {selectedClass} CCTV feed...</p>
                  </div>
                )}
                <video 
                  width="100%" 
                  height="auto" 
                  controls 
                  autoPlay
                  muted
                  onCanPlay={() => setVideoLoading(false)}
                  className={`cctv-video-feed ${videoLoading ? 'cctv-video-hidden' : ''}`}
                >
                  <source src={cameraFeeds[selectedClass]} type="application/x-mpegURL" />
                  Your browser does not support the video tag.
                </video>
              </div>
              
              <div className="cctv-feed-info">
                <div className="cctv-feed-stat">
                  <span className="cctv-stat-icon">👀</span>
                  <span>Live Monitoring</span>
                </div>
                <div className="cctv-feed-stat">
                  <span className="cctv-stat-icon">🕒</span>
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
                <div className="cctv-feed-stat">
                  <span className="cctv-stat-icon">👨‍🎓</span>
                  <span>{filteredStudents.length} Students</span>
                </div>
                <div className="cctv-feed-stat">
                  <span className="cctv-stat-icon">🏫</span>
                  <span>{classrooms.find(c => c.name === selectedClass)?.location || 'Unknown'}</span>
                </div>
              </div>
              
              <div className="cctv-feed-activity">
                <h4>Recent Activity</h4>
                <ul className="cctv-activity-list">
                  <li className="cctv-activity-item">
                    <span className="cctv-activity-time">10:42 AM</span>
                    <span className="cctv-activity-text">Motion detected near whiteboard</span>
                  </li>
                  <li className="cctv-activity-item">
                    <span className="cctv-activity-time">10:38 AM</span>
                    <span className="cctv-activity-text">Class session started</span>
                  </li>
                  <li className="cctv-activity-item">
                    <span className="cctv-activity-time">10:30 AM</span>
                    <span className="cctv-activity-text">Students entering classroom</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
          
          {!selectedClass && (
            <div className="cctv-feed-placeholder">
              <div className="cctv-placeholder-icon">📷</div>
              <h3>No Classroom Selected</h3>
              <p>Select a classroom from the list to view the live CCTV feed</p>
              <div className="cctv-placeholder-features">
                <div className="cctv-feature">
                  <span>🔒</span>
                  <p>Secure encrypted streams</p>
                </div>
                <div className="cctv-feature">
                  <span>🔄</span>
                  <p>Real-time updates</p>
                </div>
                <div className="cctv-feature">
                  <span>📈</span>
                  <p>Activity analytics</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <footer className="cctv-footer">
        <p>School Surveillance System © {new Date().getFullYear()} | v2.1.0</p>
        <div className="cctv-footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Help Center</a>
        </div>
      </footer>
    </div>
  );
};

export default CCTVManagement;