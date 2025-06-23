import React, { useState, useEffect } from 'react';
import { 
  Calendar, Users, Clock, TrendingUp, Download, Search, 
  Bell, Eye, Plus, X, Check, ChevronDown, Filter, 
  BarChart2, FileText, Settings, LogOut, User,
  BookOpen, UserPlus, Briefcase, ChevronRight, ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AttendanceDashboard = () => {
  // State management
  const [activeTab, setActiveTab] = useState('student');
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [newEntry, setNewEntry] = useState({
    name: '',
    id: '',
    type: 'student',
    class: '10-A',
    contact: '',
    email: ''
  });
  
  // Persistent user database
  const [userDatabase, setUserDatabase] = useState({
    student: [
      { id: 'S001', name: 'Aarav Sharma', class: '10-A', contact: '9876543210', email: 'aarav@example.com' },
      { id: 'S002', name: 'Priya Singh', class: '10-A', contact: '9876543211', email: 'priya@example.com' },
      { id: 'S003', name: 'Rohit Kumar', class: '10-B', contact: '9876543212', email: 'rohit@example.com' }
    ],
    teacher: [
      { id: 'T001', name: 'Mrs. Sharma', subject: 'Math', contact: '9876543220', email: 'sharma@example.com' },
      { id: 'T002', name: 'Mr. Patel', subject: 'Science', contact: '9876543221', email: 'patel@example.com' }
    ],
    employee: [
      { id: 'E001', name: 'Rajesh Kumar', role: 'Librarian', contact: '9876543230', email: 'rajesh@example.com' },
      { id: 'E002', name: 'Sunita Devi', role: 'Accountant', contact: '9876543231', email: 'sunita@example.com' }
    ]
  });

  // Attendance records
  const [attendanceRecords, setAttendanceRecords] = useState([
    // Student records
    { id: 'S001', date: '2023-06-01', status: 'present', time: '08:30' },
    { id: 'S002', date: '2023-06-01', status: 'absent', time: '-' },
    { id: 'S003', date: '2023-06-01', status: 'present', time: '08:45' },
    // Teacher records
    { id: 'T001', date: '2023-06-01', status: 'present', time: '08:00' },
    { id: 'T002', date: '2023-06-01', status: 'present', time: '08:05' },
    // Employee records
    { id: 'E001', date: '2023-06-01', status: 'present', time: '08:15' },
    { id: 'E002', date: '2023-06-01', status: 'late', time: '09:30' }
  ]);

  // Get current month and year
  const currentDate = new Date(dateFilter);
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  // Add new user to database
  const handleAddUser = () => {
    if (!newEntry.name || !newEntry.id || !newEntry.contact || !newEntry.email) {
      alert('Please fill all required fields');
      return;
    }

    const userType = newEntry.type;
    const newUser = {
      id: newEntry.id,
      name: newEntry.name,
      contact: newEntry.contact,
      email: newEntry.email
    };

    // Add additional fields based on type
    if (userType === 'student') {
      newUser.class = newEntry.class;
    } else if (userType === 'teacher') {
      newUser.subject = newEntry.class; // Using class field for subject
    } else {
      newUser.role = newEntry.class; // Using class field for role
    }

    setUserDatabase({
      ...userDatabase,
      [userType]: [...userDatabase[userType], newUser]
    });

    setShowAddModal(false);
    setNewEntry({ 
      name: '', 
      id: '', 
      type: 'student',
      class: '10-A', 
      contact: '',
      email: ''
    });
  };

  // Mark attendance
  const handleMarkAttendance = (userId, status) => {
    const existingRecordIndex = attendanceRecords.findIndex(
      record => record.id === userId && record.date === dateFilter
    );

    if (existingRecordIndex >= 0) {
      // Update existing record
      const updatedRecords = [...attendanceRecords];
      updatedRecords[existingRecordIndex] = {
        ...updatedRecords[existingRecordIndex],
        status,
        time: status === 'absent' ? '-' : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setAttendanceRecords(updatedRecords);
    } else {
      // Add new record
      const newRecord = {
        id: userId,
        date: dateFilter,
        status,
        time: status === 'absent' ? '-' : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setAttendanceRecords([...attendanceRecords, newRecord]);
    }
  };

  // Get attendance status for a user on selected date
  const getAttendanceStatus = (userId) => {
    const record = attendanceRecords.find(
      r => r.id === userId && r.date === dateFilter
    );
    return record ? record.status : null;
  };

  // Filter users
  const filteredUsers = userDatabase[activeTab]
    .filter(user => {
      if (activeTab === 'student') {
        return user.class === selectedClass;
      }
      return true;
    })
    .filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.id.includes(searchTerm)
    );

  // Filter by status if not 'all'
  const filteredByStatus = statusFilter === 'all' 
    ? filteredUsers 
    : filteredUsers.filter(user => {
        const status = getAttendanceStatus(user.id);
        return status === statusFilter;
      });

  // Calculate monthly attendance stats
  const monthlyStats = filteredUsers.map(user => {
    const userRecords = attendanceRecords.filter(
      r => r.id === user.id && 
      new Date(r.date).getMonth() === currentDate.getMonth() &&
      new Date(r.date).getFullYear() === currentDate.getFullYear()
    );
    
    const presentCount = userRecords.filter(r => r.status === 'present').length;
    const absentCount = userRecords.filter(r => r.status === 'absent').length;
    const totalDays = userRecords.length;
    const percentage = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 0;

    return {
      ...user,
      presentCount,
      absentCount,
      percentage
    };
  });

  // Export data to CSV
  const exportToCSV = () => {
    const headers = activeTab === 'student' 
      ? ['ID', 'Name', 'Class', 'Status', 'Time', 'Contact', 'Email', 'Date']
      : activeTab === 'teacher'
      ? ['ID', 'Name', 'Subject', 'Status', 'Time', 'Contact', 'Email', 'Date']
      : ['ID', 'Name', 'Role', 'Status', 'Time', 'Contact', 'Email', 'Date'];
    
    const recordsToExport = filteredUsers.map(user => {
      const record = attendanceRecords.find(r => r.id === user.id && r.date === dateFilter) || {};
      return {
        ...user,
        status: record.status || '',
        time: record.time || '',
        date: dateFilter
      };
    });

    const csvContent = [
      headers.join(','),
      ...recordsToExport.map(entry => 
        [
          entry.id,
          `"${entry.name}"`,
          activeTab === 'student' ? entry.class : 
            activeTab === 'teacher' ? entry.subject : entry.role,
          entry.status,
          entry.time,
          entry.contact,
          entry.email,
          entry.date
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${activeTab}_attendance_${dateFilter}.csv`);
    link.click();
  };

  // Navigate to previous/next day
  const navigateDay = (direction) => {
    const current = new Date(dateFilter);
    current.setDate(current.getDate() + (direction === 'prev' ? -1 : 1));
    setDateFilter(current.toISOString().split('T')[0]);
  };

  return (
    <div className="attendance-portal-container">
      {/* Top Navigation */}
      <header className="attendance-topbar">
        <div className="topbar-left">
          <h1 className="topbar-brand">EduTrack</h1>
          
          <nav className="topbar-nav">
            <motion.button 
              className={`topbar-nav-item ${activeTab === 'student' ? 'active' : ''}`}
              onClick={() => setActiveTab('student')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BookOpen className="nav-icon" />
              <span>Student Attendance</span>
            </motion.button>
            <motion.button 
              className={`topbar-nav-item ${activeTab === 'teacher' ? 'active' : ''}`}
              onClick={() => setActiveTab('teacher')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <UserPlus className="nav-icon" />
              <span>Teacher Attendance</span>
            </motion.button>
            <motion.button 
              className={`topbar-nav-item ${activeTab === 'employee' ? 'active' : ''}`}
              onClick={() => setActiveTab('employee')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Briefcase className="nav-icon" />
              <span>Employee Attendance</span>
            </motion.button>
          </nav>
        </div>
        
        <div className="topbar-right">
          <div className="date-navigation">
            <motion.button 
              className="nav-button"
              onClick={() => navigateDay('prev')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft size={18} />
            </motion.button>
            
            <div className="date-selector">
              <Calendar className="date-selector-icon" />
              <input 
                type="date" 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="date-selector-input"
              />
            </div>
            
            <motion.button 
              className="nav-button"
              onClick={() => navigateDay('next')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight size={18} />
            </motion.button>
          </div>
          
          <motion.button 
            className="notification-button"
            onClick={() => setShowNotification(!showNotification)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Bell className="notification-icon" />
            <span className="notification-badge">3</span>
          </motion.button>
          
          <div 
            className="profile-dropdown"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="profile-avatar">
              <User size={20} />
            </div>
            <span className="profile-name">Admin</span>
            <ChevronDown className="dropdown-chevron" />
            
            {showProfileMenu && (
              <motion.div 
                className="profile-menu"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <button className="profile-menu-item">
                  <User className="menu-item-icon" />
                  <span>My Profile</span>
                </button>
                <button className="profile-menu-item">
                  <Settings className="menu-item-icon" />
                  <span>Settings</span>
                </button>
                <button className="profile-menu-item">
                  <LogOut className="menu-item-icon" />
                  <span>Logout</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </header>

      {/* Notification Panel */}
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            className="notification-panel"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="notification-header">
              <h3>Notifications</h3>
              <button 
                className="notification-close"
                onClick={() => setShowNotification(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="notification-list">
              <div className="notification-item unread">
                <div className="notification-icon">
                  <Bell size={16} />
                </div>
                <div className="notification-content">
                  <p>2 students absent in 10-A today</p>
                  <span className="notification-time">10:30 AM</span>
                </div>
              </div>
              <div className="notification-item">
                <div className="notification-icon">
                  <Bell size={16} />
                </div>
                <div className="notification-content">
                  <p>Monthly report is ready</p>
                  <span className="notification-time">Yesterday</span>
                </div>
              </div>
            </div>
            <button className="notification-view-all">
              View All Notifications
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="attendance-content-area">
        {/* Control Panel */}
        <div className="attendance-control-panel">
          {activeTab === 'student' && (
            <div className="class-selector-container">
              <label className="control-panel-label">Select Class</label>
              <select 
                value={selectedClass} 
                onChange={(e) => setSelectedClass(e.target.value)}
                className="class-selector"
              >
                <option value="10-A">Class 10-A</option>
                <option value="10-B">Class 10-B</option>
                <option value="10-C">Class 10-C</option>
              </select>
            </div>
          )}
          
          <div className="search-container">
            <label className="control-panel-label">Search {activeTab}s</label>
            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <input 
                type="text" 
                placeholder={`Search by name or ID...`} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="filter-container">
            <motion.button 
              className="filter-button"
              onClick={() => setShowFilters(!showFilters)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter className="filter-icon" />
              <span>Filters</span>
            </motion.button>
            
            <AnimatePresence>
              {showFilters && (
                <motion.div 
                  className="filter-dropdown"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="filter-option">
                    <label>Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="filter-select"
                    >
                      <option value="all">All Status</option>
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Month Summary */}
        <motion.div 
          className="month-summary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h3>{currentMonth} {currentYear} Attendance Summary</h3>
          <div className="summary-cards">
            <div className="summary-card">
              <span className="card-value">{filteredUsers.length}</span>
              <span className="card-label">Total {activeTab}s</span>
            </div>
            <div className="summary-card">
              <span className="card-value">
                {monthlyStats.filter(s => s.presentCount > 0).length}
              </span>
              <span className="card-label">Present Today</span>
            </div>
            <div className="summary-card">
              <span className="card-value">
                {monthlyStats.reduce((acc, curr) => acc + curr.presentCount, 0)}
              </span>
              <span className="card-label">Total Presents</span>
            </div>
            <div className="summary-card highlight">
              <span className="card-value">
                {filteredUsers.length > 0 
                  ? Math.round(monthlyStats.reduce((acc, curr) => acc + curr.percentage, 0) / filteredUsers.length)
                  : 0}%
              </span>
              <span className="card-label">Average Attendance</span>
            </div>
          </div>
        </motion.div>

        {/* Attendance Management */}
        <motion.div 
          className="attendance-management-container"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="attendance-header">
            <h3 className="attendance-title">
              {activeTab === 'student' ? `Class ${selectedClass} Attendance - ${dateFilter}` : 
               activeTab === 'teacher' ? `Teacher Attendance - ${dateFilter}` : `Employee Attendance - ${dateFilter}`}
            </h3>
            <div className="attendance-actions">
              <motion.button 
                className="action-button action-add"
                onClick={() => setShowAddModal(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus size={16} />
                <span>Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
              </motion.button>
              <motion.button 
                className="action-button action-export"
                onClick={exportToCSV}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={16} />
                <span>Export</span>
              </motion.button>
            </div>
          </div>
          
          <div className="attendance-table-container">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th className="column-id">ID</th>
                  <th className="column-name">Name</th>
                  {activeTab === 'student' && <th className="column-class">Class</th>}
                  {activeTab === 'teacher' && <th className="column-subject">Subject</th>}
                  {activeTab === 'employee' && <th className="column-role">Role</th>}
                  <th className="column-status">Status</th>
                  <th className="column-time">Time</th>
                  <th className="column-contact">Contact</th>
                </tr>
              </thead>
              <tbody>
                {filteredByStatus.length > 0 ? (
                  filteredByStatus.map(user => {
                    const attendance = attendanceRecords.find(
                      r => r.id === user.id && r.date === dateFilter
                    );
                    
                    return (
                      <motion.tr 
                        key={user.id}
                        className={`entry-row row-${attendance?.status || 'unmarked'}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td className="column-id">{user.id}</td>
                        <td className="column-name">
                          <div className="entry-avatar">
                            {user.name.charAt(0)}
                          </div>
                          {user.name}
                        </td>
                        {activeTab === 'student' && <td className="column-class">{user.class}</td>}
                        {activeTab === 'teacher' && <td className="column-subject">{user.subject}</td>}
                        {activeTab === 'employee' && <td className="column-role">{user.role}</td>}
                        <td className="column-status">
                          <div className="status-buttons">
                            <motion.button
                              className={`status-button present ${attendance?.status === 'present' ? 'active' : ''}`}
                              onClick={() => handleMarkAttendance(user.id, 'present')}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Check size={14} />
                              <span>Present</span>
                            </motion.button>
                            <motion.button
                              className={`status-button absent ${attendance?.status === 'absent' ? 'active' : ''}`}
                              onClick={() => handleMarkAttendance(user.id, 'absent')}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <X size={14} />
                              <span>Absent</span>
                            </motion.button>
                          </div>
                        </td>
                        <td className="column-time">
                          {attendance?.time || '-'}
                        </td>
                        <td className="column-contact">{user.contact}</td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr className="no-results-row">
                    <td colSpan={activeTab === 'student' ? 7 : 6} className="no-results-message">
                      No {activeTab}s found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-container"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="modal-header">
                <h3 className="modal-title">Add New {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
                <button 
                  className="modal-close"
                  onClick={() => setShowAddModal(false)}
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={newEntry.name}
                      onChange={(e) => setNewEntry({...newEntry, name: e.target.value})}
                      placeholder={`Enter ${activeTab}'s full name`}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">ID *</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={newEntry.id}
                      onChange={(e) => setNewEntry({...newEntry, id: e.target.value})}
                      placeholder={`Enter ${activeTab} ID`}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      {activeTab === 'student' ? 'Class' : 
                       activeTab === 'teacher' ? 'Subject' : 'Role'} *
                    </label>
                    {activeTab === 'student' ? (
                      <select
                        className="form-input"
                        value={newEntry.class}
                        onChange={(e) => setNewEntry({...newEntry, class: e.target.value})}
                      >
                        <option value="10-A">Class 10-A</option>
                        <option value="10-B">Class 10-B</option>
                        <option value="10-C">Class 10-C</option>
                      </select>
                    ) : (
                      <input 
                        type="text" 
                        className="form-input"
                        value={newEntry.class}
                        onChange={(e) => setNewEntry({...newEntry, class: e.target.value})}
                        placeholder={
                          activeTab === 'teacher' ? "Enter subject" : "Enter role"
                        }
                      />
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Contact Number *</label>
                    <input 
                      type="tel" 
                      className="form-input"
                      value={newEntry.contact}
                      onChange={(e) => setNewEntry({...newEntry, contact: e.target.value})}
                      placeholder="Enter contact number"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input 
                    type="email" 
                    className="form-input"
                    value={newEntry.email}
                    onChange={(e) => setNewEntry({...newEntry, email: e.target.value})}
                    placeholder={`Enter ${activeTab}'s email`}
                  />
                </div>
              </div>
              
              <div className="modal-footer">
                <motion.button 
                  className="modal-button modal-cancel"
                  onClick={() => setShowAddModal(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button 
                  className="modal-button modal-confirm"
                  onClick={handleAddUser}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// CSS Styles
const styles = `


/* Layout Styles */
.attendance-portal-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.attendance-topbar {
  height: 70px;
  background-color: white;
  box-shadow: var(--box-shadow);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 10;
  position: sticky;
  top: 0;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 30px;
}

.topbar-brand {
  font-size: 20px;
  font-weight: 700;
  color: var(--primary-color);
}

.topbar-nav {
  display: flex;
  gap: 10px;
}

.topbar-nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: var(--border-radius);
  background: transparent;
  border: none;
  color: var(--gray-color);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.topbar-nav-item:hover {
  background-color: var(--primary-light);
  color: var(--primary-color);
}

.topbar-nav-item.active {
  background-color: var(--primary-light);
  color: var(--primary-color);
}

.nav-icon {
  width: 18px;
  height: 18px;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.date-navigation {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-button {
  background: none;
  border: none;
  color: var(--gray-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: var(--transition);
}

.nav-button:hover {
  background-color: var(--primary-light);
  color: var(--primary-color);
}

.date-selector {
  display: flex;
  align-items: center;
  background-color: var(--light-color);
  border-radius: var(--border-radius);
  padding: 6px 12px;
}

.date-selector-icon {
  color: var(--gray-color);
  margin-right: 8px;
  width: 16px;
  height: 16px;
}

.date-selector-input {
  border: none;
  background: transparent;
  font-size: 14px;
  color: var(--dark-color);
  outline: none;
}

.notification-button {
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--gray-color);
  transition: var(--transition);
}

.notification-button:hover {
  color: var(--primary-color);
}

.notification-icon {
  width: 20px;
  height: 20px;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: var(--danger-color);
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
}

.profile-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.profile-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--primary-light);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}

.profile-name {
  font-size: 14px;
  font-weight: 500;
  margin-right: 6px;
}

.dropdown-chevron {
  width: 16px;
  height: 16px;
  color: var(--gray-color);
  transition: var(--transition);
}

.profile-dropdown:hover .dropdown-chevron {
  color: var(--primary-color);
}

.profile-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  width: 200px;
  padding: 8px 0;
  margin-top: 10px;
  z-index: 20;
}

.profile-menu-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 16px;
  background: none;
  border: none;
  text-align: left;
  font-size: 14px;
  color: var(--dark-color);
  cursor: pointer;
  transition: var(--transition);
}

.profile-menu-item:hover {
  background-color: var(--light-color);
  color: var(--primary-color);
}

.menu-item-icon {
  width: 16px;
  height: 16px;
  margin-right: 10px;
}

.notification-panel {
  position: absolute;
  top: 70px;
  right: 24px;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  width: 350px;
  z-index: 15;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--gray-light);
}

.notification-close {
  background: none;
  border: none;
  color: var(--gray-color);
  cursor: pointer;
}

.notification-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  padding: 12px 16px;
  border-bottom: 1px solid var(--gray-light);
  transition: var(--transition);
}

.notification-item.unread {
  background-color: var(--primary-light);
}

.notification-item:hover {
  background-color: var(--light-color);
}

.notification-icon {
  width: 16px;
  height: 16px;
  margin-right: 10px;
}

.notification-content {
  flex: 1;
}

.notification-content p {
  font-size: 14px;
  margin-bottom: 4px;
}

.notification-time {
  font-size: 12px;
  color: var(--gray-color);
}

.notification-view-all {
  width: 100%;
  padding: 12px;
  background: none;
  border: none;
  border-top: 1px solid var(--gray-light);
  color: var(--primary-color);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.notification-view-all:hover {
  background-color: var(--primary-light);
}

.attendance-content-area {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

/* Control Panel Styles */
.attendance-control-panel {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.control-panel-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: var(--gray-color);
  margin-bottom: 6px;
}

.class-selector, .search-input, .filter-select {
  height: 40px;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  padding: 0 12px;
  font-size: 14px;
  outline: none;
  transition: var(--transition);
}

.class-selector {
  min-width: 150px;
}

.class-selector:focus, .search-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px var(--primary-light);
}

.search-container {
  flex: 1;
  min-width: 250px;
}

.search-input-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-color);
  width: 16px;
  height: 16px;
}

.search-input {
  width: 100%;
  padding-left: 36px;
}

.filter-button {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  background-color: white;
  border: 1px solid var(--gray-light);
  color: var(--gray-color);
  font-size: 14px;
  cursor: pointer;
  transition: var(--transition);
}

.filter-button:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.filter-icon {
  width: 16px;
  height: 16px;
}

.filter-dropdown {
  position: absolute;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 16px;
  margin-top: 8px;
  width: 250px;
  z-index: 10;
}

.filter-option {
  margin-bottom: 12px;
}

.filter-option:last-child {
  margin-bottom: 0;
}

.filter-option label {
  display: block;
  font-size: 12px;
  margin-bottom: 6px;
}

/* Month Summary Styles */
.month-summary {
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 20px;
  margin-bottom: 24px;
}

.month-summary h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--dark-color);
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.summary-card {
  background-color: #f8f9fa;
  border-radius: var(--border-radius);
  padding: 16px;
  text-align: center;
}

.summary-card.highlight {
  background-color: var(--primary-light);
  color: var(--primary-color);
}

.card-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
}

.card-label {
  font-size: 14px;
  color: var(--gray-color);
}

/* Attendance Management Styles */
.attendance-management-container {
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
}

.attendance-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--gray-light);
}

.attendance-title {
  font-size: 16px;
  font-weight: 600;
}

.attendance-actions {
  display: flex;
  gap: 12px;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: var(--border-radius);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.action-add {
  background-color: var(--primary-color);
  color: white;
  border: none;
}

.action-add:hover {
  background-color: var(--secondary-color);
}

.action-export, .action-print {
  background-color: white;
  border: 1px solid var(--gray-light);
  color: var(--gray-color);
}

.action-export:hover, .action-print:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.attendance-table-container {
  overflow-x: auto;
}

.attendance-table {
  width: 100%;
  border-collapse: collapse;
}

.attendance-table th {
  text-align: left;
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 600;
  color: var(--gray-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background-color: #f8f9fa;
  border-bottom: 1px solid var(--gray-light);
}

.attendance-table td {
  padding: 16px;
  font-size: 14px;
  border-bottom: 1px solid var(--gray-light);
}

.entry-row:hover {
  background-color: #f8f9fa;
}

.entry-row.row-present {
  background-color: rgba(76, 201, 240, 0.05);
}

.entry-row.row-absent {
  background-color: rgba(247, 37, 133, 0.05);
}

.entry-row.row-unmarked {
  background-color: rgba(108, 117, 125, 0.05);
}

.column-id {
  width: 80px;
}

.column-name {
  min-width: 200px;
}

.entry-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--primary-light);
  color: var(--primary-color);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 10px;
}

.column-class, .column-subject, .column-role {
  min-width: 120px;
}

.status-buttons {
  display: flex;
  gap: 8px;
}

.status-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: var(--border-radius);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: var(--transition);
}

.status-button.present {
  background-color: rgba(76, 201, 240, 0.1);
  color: var(--success-color);
  border-color: rgba(76, 201, 240, 0.2);
}

.status-button.present.active {
  background-color: rgba(76, 201, 240, 0.2);
  border-color: var(--success-color);
}

.status-button.absent {
  background-color: rgba(247, 37, 133, 0.1);
  color: var(--danger-color);
  border-color: rgba(247, 37, 133, 0.2);
}

.status-button.absent.active {
  background-color: rgba(247, 37, 133, 0.2);
  border-color: var(--danger-color);
}

.column-time {
  width: 80px;
}

.column-contact {
  min-width: 120px;
}

.no-results-row td {
  text-align: center;
  padding: 40px;
  color: var(--gray-color);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-container {
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--gray-light);
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  color: var(--gray-color);
  cursor: pointer;
}

.modal-body {
  padding: 20px;
}

.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  flex: 1;
}

.form-label {
  display: block;
  font-size: 14px;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-label::after {
  content: ' *';
  color: var(--danger-color);
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 14px;
  transition: var(--transition);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px var(--primary-light);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid var(--gray-light);
}

.modal-button {
  padding: 10px 20px;
  border-radius: var(--border-radius);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.modal-cancel {
  background-color: white;
  border: 1px solid var(--gray-light);
  color: var(--gray-color);
}

.modal-cancel:hover {
  border-color: var(--danger-color);
  color: var(--danger-color);
}

.modal-confirm {
  background-color: var(--primary-color);
  border: none;
  color: white;
}

.modal-confirm:hover {
  background-color: var(--secondary-color);
}

/* Responsive Styles */
@media (max-width: 768px) {
  .topbar-left {
    gap: 15px;
  }
  
  .topbar-nav-item span {
    display: none;
  }
  
  .topbar-nav-item {
    padding: 8px;
  }
  
  .date-navigation {
    display: none;
  }
  
  .attendance-control-panel {
    flex-direction: column;
  }
  
  .form-row {
    flex-direction: column;
    gap: 16px;
  }
  
  .summary-cards {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 576px) {
  .attendance-topbar {
    padding: 0 16px;
  }
  
  .attendance-actions {
    flex-wrap: wrap;
    justify-content: flex-end;
  }
  
  .action-button span {
    display: none;
  }
  
  .summary-cards {
    grid-template-columns: 1fr;
  }
  
  .status-buttons {
    flex-direction: column;
    gap: 6px;
  }
  
  .status-button {
    justify-content: center;
  }
}
`;

// Inject styles into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default AttendanceDashboard;