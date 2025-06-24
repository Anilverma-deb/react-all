import React, { useState, useEffect } from 'react';
import { Calendar, User, Clock, CheckCircle, XCircle, Plus, Filter, Search } from 'lucide-react';
import '../Leave-Management/Leavemanage.css';

const LeaveManagement = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState('admin');
  const [leaves, setLeaves] = useState([
    {
      id: 1,
      name: 'Rahul Sharma',
      role: 'student',
      type: 'Sick Leave',
      from: '2025-06-25',
      to: '2025-06-26',
      reason: 'Fever and cold',
      status: 'pending',
      appliedDate: '2025-06-24'
    },
    {
      id: 2,
      name: 'Priya Singh',
      role: 'teacher',
      type: 'Personal Leave',
      from: '2025-06-28',
      to: '2025-06-30',
      reason: 'Family function',
      status: 'approved',
      appliedDate: '2025-06-23'
    },
    {
      id: 3,
      name: 'Amit Kumar',
      role: 'student',
      type: 'Medical Leave',
      from: '2025-06-27',
      to: '2025-06-29',
      reason: 'Medical checkup',
      status: 'rejected',
      appliedDate: '2025-06-22'
    }
  ]);

  const [newLeave, setNewLeave] = useState({
    name: '',
    role: 'student',
    type: '',
    from: '',
    to: '',
    reason: ''
  });

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const leaveTypes = ['Sick Leave', 'Personal Leave', 'Medical Leave', 'Emergency Leave', 'Casual Leave'];

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLeaveSubmit = () => {
    if (newLeave.name && newLeave.type && newLeave.from && newLeave.to && newLeave.reason) {
      const leave = {
        id: leaves.length + 1,
        ...newLeave,
        status: 'pending',
        appliedDate: new Date().toISOString().split('T')[0]
      };
      setLeaves([...leaves, leave]);
      setNewLeave({
        name: '',
        role: 'student',
        type: '',
        from: '',
        to: '',
        reason: ''
      });
      alert('Leave application submitted successfully!');
    } else {
      alert('Please fill all required fields!');
    }
  };

  const handleStatusChange = (id, status) => {
    setLeaves(leaves.map(leave => 
      leave.id === id ? {...leave, status} : leave
    ));
  };

  const filteredLeaves = leaves.filter(leave => {
    const matchesFilter = filter === 'all' || leave.status === filter || leave.role === filter;
    const matchesSearch = leave.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leave.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStats = () => {
    const pending = leaves.filter(l => l.status === 'pending').length;
    const approved = leaves.filter(l => l.status === 'approved').length;
    const rejected = leaves.filter(l => l.status === 'rejected').length;
    const students = leaves.filter(l => l.role === 'student').length;
    const teachers = leaves.filter(l => l.role === 'teacher').length;
    
    return { pending, approved, rejected, students, teachers, total: leaves.length };
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading Leave Management System...</p>
      </div>
    );
  }

  return (
    <div className="leave-management-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-container">
            <Calendar className="logo-icon" />
            <h1>Leave Management System</h1>
          </div>
          <div className="user-controls">
            <select 
              value={userRole} 
              onChange={(e) => setUserRole(e.target.value)}
              className="role-selector"
            >
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
            <div className="user-info">
              <User className="user-icon" />
              <span className="user-role">{userRole}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="app-tabs">
        {['dashboard', 'apply-leave', 'manage-leaves'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
          >
            {tab === 'dashboard' && 'Dashboard'}
            {tab === 'apply-leave' && 'Apply Leave'}
            {tab === 'manage-leaves' && 'Manage Leaves'}
          </button>
        ))}
      </nav>

      <main className="app-main-content">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-container">
            <h2>Dashboard Overview</h2>
            
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card pending">
                <Clock className="stat-icon" />
                <div className="stat-info">
                  <p>Pending Requests</p>
                  <h3>{stats.pending}</h3>
                </div>
              </div>
              
              <div className="stat-card approved">
                <CheckCircle className="stat-icon" />
                <div className="stat-info">
                  <p>Approved Leaves</p>
                  <h3>{stats.approved}</h3>
                </div>
              </div>
              
              <div className="stat-card rejected">
                <XCircle className="stat-icon" />
                <div className="stat-info">
                  <p>Rejected Leaves</p>
                  <h3>{stats.rejected}</h3>
                </div>
              </div>
              
              <div className="stat-card student">
                <User className="stat-icon" />
                <div className="stat-info">
                  <p>Student Requests</p>
                  <h3>{stats.students}</h3>
                </div>
              </div>
              
              <div className="stat-card teacher">
                <User className="stat-icon" />
                <div className="stat-info">
                  <p>Teacher Requests</p>
                  <h3>{stats.teachers}</h3>
                </div>
              </div>
              
              <div className="stat-card total">
                <Calendar className="stat-icon" />
                <div className="stat-info">
                  <p>Total Requests</p>
                  <h3>{stats.total}</h3>
                </div>
              </div>
            </div>

            {/* Recent Leaves */}
            <div className="recent-leaves">
              <div className="section-header">
                <h3>Recent Leave Requests</h3>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Type</th>
                      <th>Duration</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaves.slice(0, 5).map((leave) => (
                      <tr key={leave.id}>
                        <td>{leave.name}</td>
                        <td className="capitalize">{leave.role}</td>
                        <td>{leave.type}</td>
                        <td>{leave.from} to {leave.to}</td>
                        <td>
                          <span className={`status-badge ${leave.status}`}>
                            {leave.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Apply Leave Tab */}
        {activeTab === 'apply-leave' && (
          <div className="apply-leave-container">
            <div className="leave-form">
              <div className="form-header">
                <h3>
                  <Plus className="form-icon" />
                  Apply for Leave
                </h3>
              </div>
              <div className="form-content">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={newLeave.name}
                      onChange={(e) => setNewLeave({...newLeave, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Role</label>
                    <select
                      value={newLeave.role}
                      onChange={(e) => setNewLeave({...newLeave, role: e.target.value})}
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Leave Type</label>
                  <select
                    value={newLeave.type}
                    onChange={(e) => setNewLeave({...newLeave, type: e.target.value})}
                    required
                  >
                    <option value="">Select Leave Type</option>
                    {leaveTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>From Date</label>
                    <input
                      type="date"
                      value={newLeave.from}
                      onChange={(e) => setNewLeave({...newLeave, from: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>To Date</label>
                    <input
                      type="date"
                      value={newLeave.to}
                      onChange={(e) => setNewLeave({...newLeave, to: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Reason</label>
                  <textarea
                    value={newLeave.reason}
                    onChange={(e) => setNewLeave({...newLeave, reason: e.target.value})}
                    rows="4"
                    placeholder="Please provide a detailed reason for your leave"
                    required
                  ></textarea>
                </div>

                <div className="form-actions">
                  <button
                    onClick={handleLeaveSubmit}
                    className="submit-button"
                  >
                    Submit Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Manage Leaves Tab */}
        {activeTab === 'manage-leaves' && (
          <div className="manage-leaves-container">
            <div className="manage-header">
              <h2>Manage Leave Requests</h2>
              
              <div className="controls">
                <div className="search-container">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search by name or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="student">Students</option>
                  <option value="teacher">Teachers</option>
                </select>
              </div>
            </div>

            <div className="leaves-table-container">
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Applicant</th>
                      <th>Role</th>
                      <th>Leave Type</th>
                      <th>Duration</th>
                      <th>Reason</th>
                      <th>Applied Date</th>
                      <th>Status</th>
                      {userRole === 'admin' && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeaves.map((leave) => (
                      <tr key={leave.id} className="leave-row">
                        <td>
                          <div className="applicant-info">
                            <div className="avatar">
                              <User className="avatar-icon" />
                            </div>
                            <div className="name">{leave.name}</div>
                          </div>
                        </td>
                        <td className="capitalize">{leave.role}</td>
                        <td>{leave.type}</td>
                        <td>{leave.from} to {leave.to}</td>
                        <td className="reason-cell">{leave.reason}</td>
                        <td>{leave.appliedDate}</td>
                        <td>
                          <span className={`status-badge ${leave.status}`}>
                            {leave.status}
                          </span>
                        </td>
                        {userRole === 'admin' && (
                          <td>
                            {leave.status === 'pending' && (
                              <div className="action-buttons">
                                <button
                                  onClick={() => handleStatusChange(leave.id, 'approved')}
                                  className="approve-button"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleStatusChange(leave.id, 'rejected')}
                                  className="reject-button"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredLeaves.length === 0 && (
                <div className="empty-state">
                  <Calendar className="empty-icon" />
                  <h3>No leave requests found</h3>
                  <p>
                    {searchTerm || filter !== 'all' 
                      ? 'Try adjusting your search or filter criteria.' 
                      : 'Get started by applying for a leave.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default LeaveManagement;