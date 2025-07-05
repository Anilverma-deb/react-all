
import React, { useState, useEffect } from 'react';
import { Users, Filter, Edit3, Check, X } from 'lucide-react';
import './TeacherAttendance.css';

const TeacherAttendance = () => {
  const [teacherData] = useState([
    { id: 1, name: "Dr. Rajesh Sharma", category: "Teaching", department: "Computer Science" },
    { id: 2, name: "Prof. Priya Verma", category: "Teaching", department: "Mathematics" },
    { id: 3, name: "Mr. Amit Kumar", category: "Teaching", department: "Physics" },
    { id: 4, name: "Ms. Sunita Gupta", category: "Teaching", department: "Chemistry" },
    { id: 5, name: "Dr. Neha Singh", category: "Teaching", department: "English" },
    { id: 6, name: "Prof. Vikram Joshi", category: "Teaching", department: "History" },
    { id: 7, name: "Mr. Ravi Patel", category: "Non-Teaching", department: "Administration" },
    { id: 8, name: "Ms. Kavita Rao", category: "Non-Teaching", department: "Library" },
    { id: 9, name: "Mr. Suresh Yadav", category: "Non-Teaching", department: "Laboratory" },
    { id: 10, name: "Ms. Anjali Mehta", category: "Non-Teaching", department: "Accounts" },
    
    // Drivers
    { id: 11, name: "Mr. Ramesh Kumar", category: "Driver", department: "Transport" },
    { id: 12, name: "Mr. Mohan Lal", category: "Driver", department: "Transport" },
    
    // Support Staff
    { id: 13, name: "Mr. Gopal Singh", category: "Support", department: "Maintenance" },
    { id: 14, name: "Ms. Rekha Devi", category: "Support", department: "Cleaning" },
  ]);

  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [submittedAttendance, setSubmittedAttendance] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editingId, setEditingId] = useState(null);

  const categories = ['All', 'Teaching', 'Non-Teaching', 'Driver', 'Support'];

  // Initialize attendance status
  useEffect(() => {
    const initialStatus = {};
    teacherData.forEach(teacher => {
      initialStatus[teacher.id] = 'Present';
    });
    setAttendanceStatus(initialStatus);
  }, [teacherData]);

  const handleStatusChange = (teacherId, status) => {
    setAttendanceStatus(prev => ({
      ...prev,
      [teacherId]: status
    }));
  };

  const handleSubmitAttendance = () => {
    const attendanceList = teacherData.map(teacher => ({
      ...teacher,
      status: attendanceStatus[teacher.id] || 'Present',
      timestamp: new Date().toLocaleString()
    }));
    setSubmittedAttendance(attendanceList);
  };

  const handleEditStatus = (teacherId, newStatus) => {
    setSubmittedAttendance(prev => 
      prev.map(teacher => 
        teacher.id === teacherId 
          ? { ...teacher, status: newStatus }
          : teacher
      )
    );
    setEditingId(null);
  };

  const filteredTeachers = teacherData.filter(teacher => 
    selectedCategory === 'All' || teacher.category === selectedCategory
  );

  const filteredSubmittedAttendance = submittedAttendance.filter(teacher => {
    const categoryMatch = selectedCategory === 'All' || teacher.category === selectedCategory;
    const statusMatch = statusFilter === 'All' || teacher.status === statusFilter;
    return categoryMatch && statusMatch;
  });

  const getStatusColor = (status) => {
    return status === 'Present' ? 'status-present' : 'status-absent';
  };

  const getTotalStats = () => {
    const filtered = submittedAttendance.filter(teacher => 
      selectedCategory === 'All' || teacher.category === selectedCategory
    );
    const present = filtered.filter(t => t.status === 'Present').length;
    const absent = filtered.filter(t => t.status === 'Absent').length;
    return { present, absent, total: filtered.length };
  };

  const stats = getTotalStats();

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <div className="header-content">
          <Users className="header-icon" />
          <h1>Manual Teacher Attendance System</h1>
          <p>Mark and manage daily attendance for all staff members</p>
        </div>
        <div className="date-display">
          {new Date().toLocaleDateString('en-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Category Filter */}
      <div className="category-tabs">
        {categories.map(category => (
          <button
            key={category}
            className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
            {category !== 'All' && (
              <span className="category-count">
                {teacherData.filter(t => t.category === category).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Attendance Marking Section */}
      {submittedAttendance.length === 0 && (
        <div className="attendance-form">
          <h2>Mark Attendance</h2>
          <div className="teachers-grid">
            {filteredTeachers.map(teacher => (
              <div key={teacher.id} className="teacher-card">
                <div className="teacher-info">
                  <h4>{teacher.name}</h4>
                  <p>{teacher.department}</p>
                  <span className="category-badge">{teacher.category}</span>
                </div>
                <div className="status-controls">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name={`teacher-${teacher.id}`}
                      value="Present"
                      checked={attendanceStatus[teacher.id] === 'Present'}
                      onChange={(e) => handleStatusChange(teacher.id, e.target.value)}
                    />
                    <span className="radio-custom present"></span>
                    Present
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name={`teacher-${teacher.id}`}
                      value="Absent"
                      checked={attendanceStatus[teacher.id] === 'Absent'}
                      onChange={(e) => handleStatusChange(teacher.id, e.target.value)}
                    />
                    <span className="radio-custom absent"></span>
                    Absent
                  </label>
                </div>
              </div>
            ))}
          </div>
          <button className="submit-btn" onClick={handleSubmitAttendance}>
            <Check size={20} />
            Submit Attendance
          </button>
        </div>
      )}

      {/* Submitted Attendance Display */}
      {submittedAttendance.length > 0 && (
        <div className="submitted-attendance">
          <div className="attendance-stats">
            <div className="stat-card total">
              <h3>{stats.total}</h3>
              <p>Total Staff</p>
            </div>
            <div className="stat-card present">
              <h3>{stats.present}</h3>
              <p>Present</p>
            </div>
            <div className="stat-card absent">
              <h3>{stats.absent}</h3>
              <p>Absent</p>
            </div>
          </div>

          <div className="filter-controls">
            <div className="filter-group">
              <Filter size={16} />
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="All">All Status</option>
                <option value="Present">Present Only</option>
                <option value="Absent">Absent Only</option>
              </select>
            </div>
            <button 
              className="reset-btn"
              onClick={() => {
                setSubmittedAttendance([]);
                const initialStatus = {};
                teacherData.forEach(teacher => {
                  initialStatus[teacher.id] = 'Present';
                });
                setAttendanceStatus(initialStatus);
                setStatusFilter('All');
              }}
            >
              Mark New Attendance
            </button>
          </div>

          <div className="attendance-list">
            <h2>Submitted Attendance ({filteredSubmittedAttendance.length})</h2>
            {filteredSubmittedAttendance.map(teacher => (
              <div key={teacher.id} className="attendance-item">
                <div className="teacher-details">
                  <h4>{teacher.name}</h4>
                  <p>{teacher.department} • {teacher.category}</p>
                </div>
                <div className="status-section">
                  {editingId === teacher.id ? (
                    <div className="edit-controls">
                      <button
                        className="status-btn present"
                        onClick={() => handleEditStatus(teacher.id, 'Present')}
                      >
                        Present
                      </button>
                      <button
                        className="status-btn absent"
                        onClick={() => handleEditStatus(teacher.id, 'Absent')}
                      >
                        Absent
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() => setEditingId(null)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="status-display">
                      <span className={`status-badge ${getStatusColor(teacher.status)}`}>
                        {teacher.status}
                      </span>
                      <button
                        className="edit-btn"
                        onClick={() => setEditingId(teacher.id)}
                      >
                        <Edit3 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

     
    </div>
  );
};

export default TeacherAttendance;
