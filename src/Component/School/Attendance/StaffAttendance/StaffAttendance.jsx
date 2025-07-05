import React, { useState, useMemo } from 'react';
import { Calendar, Clock, Users, Filter, Download, Search, TrendingUp, UserCheck, UserX, Clock3, X } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './StaffAttendance.css';

const StaffAttendance = () => {
  const [filters, setFilters] = useState({
    department: 'all',
    role: 'all',
    dateFrom: '',
    dateTo: '',
    status: 'all',
    searchTerm: ''
  });

  const [editingCell, setEditingCell] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [attendanceData, setAttendanceData] = useState([
    { id: 1, name: 'John Smith', role: 'Teacher', dept: 'Teaching', date: '2024-06-26', status: 'Present', timeIn: '08:30', timeOut: '16:30' },
    { id: 2, name: 'Sarah Johnson', role: 'Principal', dept: 'Admin', date: '2024-06-26', status: 'Present', timeIn: '08:00', timeOut: '17:00' },
    { id: 3, name: 'Mike Wilson', role: 'Driver', dept: 'Transport', date: '2024-06-26', status: 'Present', timeIn: '07:30', timeOut: '15:30' },
    { id: 4, name: 'Emma Davis', role: 'Teacher', dept: 'Teaching', date: '2024-06-26', status: 'Absent', timeIn: '-', timeOut: '-' },
    { id: 5, name: 'David Brown', role: 'Clerk', dept: 'Admin', date: '2024-06-26', status: 'Late', timeIn: '09:15', timeOut: '17:15' },
    { id: 6, name: 'Lisa Anderson', role: 'Teacher', dept: 'Teaching', date: '2024-06-26', status: 'Present', timeIn: '08:25', timeOut: '16:25' },
    { id: 7, name: 'Robert Taylor', role: 'Security', dept: 'Security', date: '2024-06-26', status: 'Present', timeIn: '08:00', timeOut: '20:00' },
    { id: 8, name: 'Jennifer Lee', role: 'Librarian', dept: 'Admin', date: '2024-06-26', status: 'Present', timeIn: '08:30', timeOut: '16:00' },
    { id: 9, name: 'Tom Garcia', role: 'Driver', dept: 'Transport', date: '2024-06-26', status: 'Present', timeIn: '07:45', timeOut: '15:45' },
    { id: 10, name: 'Anna Martinez', role: 'Teacher', dept: 'Teaching', date: '2024-06-26', status: 'Sick Leave', timeIn: '-', timeOut: '-' },
  ]);

  const departments = ['all', 'Teaching', 'Admin', 'Transport', 'Security'];
  const roles = ['all', 'Teacher', 'Principal', 'Driver', 'Clerk', 'Security', 'Librarian'];
  const statuses = ['all', 'Present', 'Absent', 'Late', 'Sick Leave'];

  const filteredData = useMemo(() => {
    return attendanceData.filter(item => {
      const matchesDept = filters.department === 'all' || item.dept === filters.department;
      const matchesRole = filters.role === 'all' || item.role === filters.role;
      const matchesStatus = filters.status === 'all' || item.status === filters.status;
      const matchesSearch = filters.searchTerm === '' || 
        item.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
      return matchesDept && matchesRole && matchesStatus && matchesSearch;
    });
  }, [filters, attendanceData]);

  const statusData = useMemo(() => {
    const counts = {};
    filteredData.forEach(item => {
      counts[item.status] = (counts[item.status] || 0) + 1;
    });
    return Object.entries(counts).map(([status, count]) => ({ status, count }));
  }, [filteredData]);

  const deptData = useMemo(() => {
    const counts = {};
    filteredData.forEach(item => {
      counts[item.dept] = (counts[item.dept] || 0) + 1;
    });
    return Object.entries(counts).map(([dept, count]) => ({ dept, count }));
  }, [filteredData]);

  const getStatusColor = (status) => {
    const colors = {
      'Present': '#10b981',
      'Absent': '#ef4444',
      'Late': '#f59e0b',
      'Sick Leave': '#8b5cf6'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Present': return <UserCheck className="w-4 h-4" />;
      case 'Absent': return <UserX className="w-4 h-4" />;
      case 'Late': return <Clock3 className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCellEdit = (id, field, value) => {
    console.log(`Updating ${field} for ID ${id} to ${value}`);
    setEditingCell(null);
  };

  const openStatusModal = (staff) => {
    setSelectedStaff(staff);
    setNewStatus(staff.status);
    setShowStatusModal(true);
  };

  const updateStatus = () => {
    if (!selectedStaff) return;
    
    const updatedData = attendanceData.map(item => {
      if (item.id === selectedStaff.id) {
        const timeFields = (newStatus === 'Present' || newStatus === 'Late') ? 
          { timeIn: newStatus === 'Late' ? '09:15' : '08:30', timeOut: newStatus === 'Late' ? '17:15' : '16:30' } : 
          { timeIn: '-', timeOut: '-' };
        
        return { 
          ...item, 
          status: newStatus,
          ...timeFields
        };
      }
      return item;
    });
    
    setAttendanceData(updatedData);
    setShowStatusModal(false);
  };

  const stats = useMemo(() => {
    const total = filteredData.length;
    const present = filteredData.filter(item => item.status === 'Present').length;
    const absent = filteredData.filter(item => item.status === 'Absent').length;
    const late = filteredData.filter(item => item.status === 'Late').length;
    return { total, present, absent, late, presentRate: total > 0 ? (present / total * 100).toFixed(1) : 0 };
  }, [filteredData]);

  return (
    <div className="staff-attendance-container">
      {/* Status Change Modal */}
      {showStatusModal && selectedStaff && (
        <div className="status-modal-overlay">
          <div className="status-modal">
            <div className="modal-header">
              <h3>Change Attendance Status</h3>
              <button onClick={() => setShowStatusModal(false)} className="close-btn">
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="staff-info">
                <div className="staff-avatar">{selectedStaff.name.charAt(0)}</div>
                <div>
                  <h4>{selectedStaff.name}</h4>
                  <p>{selectedStaff.role} • {selectedStaff.dept}</p>
                </div>
              </div>
              
              <div className="status-selection">
                <div className="current-status">
                  <span>Current Status:</span>
                  <div className={`status-badge status-${selectedStaff.status.toLowerCase().replace(' ', '-')}`}>
                    {getStatusIcon(selectedStaff.status)}
                    {selectedStaff.status}
                  </div>
                </div>
                
                <div className="new-status">
                  <span>Change to:</span>
                  <div className="status-options">
                    {['Present', 'Absent', 'Late', 'Sick Leave'].map(status => (
                      <button
                        key={status}
                        className={`status-option ${newStatus === status ? 'active' : ''}`}
                        onClick={() => setNewStatus(status)}
                      >
                        {getStatusIcon(status)}
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button onClick={() => setShowStatusModal(false)} className="cancel-btn">
                Cancel
              </button>
              <button onClick={updateStatus} className="confirm-btn">
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="staff-attendance-header">
        <div className="staff-attendance-title">
          <Users className="w-8 h-8 text-blue-600" />
          <div>
            <h1>Staff Attendance</h1>
            <p>Manage and track staff attendance across all departments</p>
          </div>
        </div>
        <div className="staff-attendance-actions">
          <button className="btn-primary">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="staff-attendance-stats">
        <div className="stat-card stat-card-blue">
          <div className="stat-icon">
            <Users className="w-6 h-6" />
          </div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Total Staff</p>
          </div>
        </div>
        <div className="stat-card stat-card-green">
          <div className="stat-icon">
            <UserCheck className="w-6 h-6" />
          </div>
          <div className="stat-content">
            <h3>{stats.present}</h3>
            <p>Present</p>
          </div>
        </div>
        <div className="stat-card stat-card-red">
          <div className="stat-icon">
            <UserX className="w-6 h-6" />
          </div>
          <div className="stat-content">
            <h3>{stats.absent}</h3>
            <p>Absent</p>
          </div>
        </div>
        <div className="stat-card stat-card-yellow">
          <div className="stat-icon">
            <Clock3 className="w-6 h-6" />
          </div>
          <div className="stat-content">
            <h3>{stats.late}</h3>
            <p>Late</p>
          </div>
        </div>
      </div>

      <div className="staff-attendance-filters">
        <div className="filter-group">
          <label>Department</label>
          <select 
            value={filters.department}
            onChange={(e) => handleFilterChange('department', e.target.value)}
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept === 'all' ? 'All Departments' : dept}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Role</label>
          <select 
            value={filters.role}
            onChange={(e) => handleFilterChange('role', e.target.value)}
          >
            {roles.map(role => (
              <option key={role} value={role}>{role === 'all' ? 'All Roles' : role}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Status</label>
          <select 
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status === 'all' ? 'All Status' : status}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>From Date</label>
          <input 
            type="date" 
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>To Date</label>
          <input 
            type="date" 
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Search</label>
          <div className="search-input">
            <Search className="w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search staff..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="staff-attendance-charts">
        <div className="chart-container">
          <h3>Attendance by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, count }) => `${status}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-container">
          <h3>Staff by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deptData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dept" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="staff-attendance-table-container">
        <div className="table-header">
          <h3>Staff Attendance Records</h3>
          <span className="record-count">{filteredData.length} records</span>
        </div>
        <div className="table-wrapper">
          <table className="staff-attendance-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Department</th>
                <th>Date</th>
                <th>Status</th>
                <th>Time In</th>
                <th>Time Out</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(item => (
                <tr key={item.id}>
                  <td>
                    <div className="staff-name">
                      <div className="avatar">{item.name.charAt(0)}</div>
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td>{item.role}</td>
                  <td>
                    <span className={`dept-badge dept-${item.dept.toLowerCase()}`}>
                      {item.dept}
                    </span>
                  </td>
                  <td>{item.date}</td>
                  <td>
                    <div className="status-cell">
                      <span className={`status-badge status-${item.status.toLowerCase().replace(' ', '-')}`}>
                        {getStatusIcon(item.status)}
                        {item.status}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="time-cell">
                      {item.timeIn}
                    </span>
                  </td>
                  <td>
                    <span className="time-cell">
                      {item.timeOut}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon" 
                        title="Change Status"
                        onClick={() => openStatusModal(item)}
                      >
                        <Filter className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffAttendance;