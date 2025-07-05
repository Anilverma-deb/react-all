import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, UserX, Calendar, FileDown, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';
import './StudentAttendance.css';

const StudentAttendance = () => {
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [dateFrom, setDateFrom] = useState('2024-06-01');
  const [dateTo, setDateTo] = useState('2024-06-26');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('All');
  const [filterSection, setFilterSection] = useState('All');
  const itemsPerPage = 10;

  // Mock data for classes and sections
  const classes = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
  const sections = ['A', 'B', 'C', 'D'];

  // Mock attendance data that changes based on class and section
  const getAttendanceStats = () => {
    const baseStats = {
      'Class 10-A': { totalStudents: 45, presentStudents: 38, absentStudents: 4, onLeave: 3 },
      'Class 10-B': { totalStudents: 42, presentStudents: 35, absentStudents: 5, onLeave: 2 },
      'Class 9-A': { totalStudents: 40, presentStudents: 36, absentStudents: 2, onLeave: 2 },
      'Class 9-B': { totalStudents: 38, presentStudents: 32, absentStudents: 4, onLeave: 2 },
    };
    return baseStats[`${selectedClass}-${selectedSection}`] || { totalStudents: 45, presentStudents: 38, absentStudents: 4, onLeave: 3 };
  };

  const attendanceStats = getAttendanceStats();

  // Mock chart data that changes based on class and section
  const getChartData = () => {
    const baseData = {
      'Class 10-A': [
        { date: '2024-06-20', present: 42, absent: 2, leave: 1 },
        { date: '2024-06-21', present: 40, absent: 3, leave: 2 },
        { date: '2024-06-22', present: 43, absent: 1, leave: 1 },
        { date: '2024-06-23', present: 38, absent: 4, leave: 3 },
        { date: '2024-06-24', present: 41, absent: 2, leave: 2 },
        { date: '2024-06-25', present: 39, absent: 3, leave: 3 },
        { date: '2024-06-26', present: 38, absent: 4, leave: 3 }
      ],
      'Class 10-B': [
        { date: '2024-06-20', present: 38, absent: 3, leave: 1 },
        { date: '2024-06-21', present: 36, absent: 4, leave: 2 },
        { date: '2024-06-22', present: 39, absent: 2, leave: 1 },
        { date: '2024-06-23', present: 35, absent: 5, leave: 2 },
        { date: '2024-06-24', present: 37, absent: 3, leave: 2 },
        { date: '2024-06-25', present: 36, absent: 4, leave: 2 },
        { date: '2024-06-26', present: 35, absent: 5, leave: 2 }
      ]
    };
    return baseData[`${selectedClass}-${selectedSection}`] || baseData['Class 10-A'];
  };

  const chartData = getChartData();

  // Mock student data
  const allStudents = [
    { id: 1, name: 'Aarav Sharma', rollNo: '001', class: 'Class 10', section: 'A', status: 'Present', date: '2024-06-26', parentContact: '+91 98765 43210' },
    { id: 2, name: 'Priya Singh', rollNo: '002', class: 'Class 10', section: 'A', status: 'Absent', date: '2024-06-26', parentContact: '+91 98765 43211' },
    { id: 3, name: 'Arjun Patel', rollNo: '003', class: 'Class 10', section: 'A', status: 'On Leave', date: '2024-06-26', parentContact: '+91 98765 43212' },
    { id: 4, name: 'Sneha Gupta', rollNo: '004', class: 'Class 10', section: 'A', status: 'Present', date: '2024-06-26', parentContact: '+91 98765 43213' },
    { id: 5, name: 'Rohit Kumar', rollNo: '005', class: 'Class 10', section: 'A', status: 'Present', date: '2024-06-26', parentContact: '+91 98765 43214' },
    { id: 6, name: 'Ananya Reddy', rollNo: '006', class: 'Class 10', section: 'B', status: 'Absent', date: '2024-06-26', parentContact: '+91 98765 43215' },
    { id: 7, name: 'Vikram Joshi', rollNo: '007', class: 'Class 10', section: 'B', status: 'Present', date: '2024-06-26', parentContact: '+91 98765 43216' },
    { id: 8, name: 'Kavya Nair', rollNo: '008', class: 'Class 9', section: 'A', status: 'On Leave', date: '2024-06-26', parentContact: '+91 98765 43217' },
    { id: 9, name: 'Aditya Verma', rollNo: '009', class: 'Class 9', section: 'A', status: 'Present', date: '2024-06-26', parentContact: '+91 98765 43218' },
    { id: 10, name: 'Ishita Agarwal', rollNo: '010', class: 'Class 9', section: 'B', status: 'Present', date: '2024-06-26', parentContact: '+91 98765 43219' },
    { id: 11, name: 'Karan Malhotra', rollNo: '011', class: 'Class 10', section: 'A', status: 'Present', date: '2024-06-26', parentContact: '+91 98765 43220' },
    { id: 12, name: 'Riya Bansal', rollNo: '012', class: 'Class 10', section: 'A', status: 'Absent', date: '2024-06-26', parentContact: '+91 98765 43221' },
    { id: 13, name: 'Siddharth Rao', rollNo: '013', class: 'Class 10', section: 'B', status: 'Present', date: '2024-06-26', parentContact: '+91 98765 43222' },
    { id: 14, name: 'Tanvi Saxena', rollNo: '014', class: 'Class 9', section: 'A', status: 'On Leave', date: '2024-06-26', parentContact: '+91 98765 43223' },
    { id: 15, name: 'Harsh Mehta', rollNo: '015', class: 'Class 9', section: 'B', status: 'Present', date: '2024-06-26', parentContact: '+91 98765 43224' }
  ];

  // Filter students based on search term and filters
  const filteredStudents = allStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNo.includes(searchTerm);
    const matchesClass = filterClass === 'All' || student.class === filterClass;
    const matchesSection = filterSection === 'All' || student.section === filterSection;
    
    return matchesSearch && matchesClass && matchesSection;
  });

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,Roll No,Class,Section,Status,Date,Parent Contact\n" +
      filteredStudents.map(student => 
        `${student.name},${student.rollNo},${student.class},${student.section},${student.status},${student.date},${student.parentContact}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_${dateFrom}_to_${dateTo}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Present': return 'status-present';
      case 'Absent': return 'status-absent';
      case 'On Leave': return 'status-leave';
      default: return 'status-default';
    }
  };

  return (
    <div className="student-attendance-container">
      <div className="attendance-header">
        <h1 className="attendance-title">Student Attendance</h1>
        <div className="header-actions">
          <button className="export-btn" onClick={handleExport}>
            <FileDown size={18} />
            Export Data
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card total-students">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Students</h3>
            <p className="stat-number">{attendanceStats.totalStudents}</p>
          </div>
        </div>
        
        <div className="stat-card present-students">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>Present Students</h3>
            <p className="stat-number">{attendanceStats.presentStudents}</p>
          </div>
        </div>
        
        <div className="stat-card absent-students">
          <div className="stat-icon">
            <UserX size={24} />
          </div>
          <div className="stat-content">
            <h3>Absent Students</h3>
            <p className="stat-number">{attendanceStats.absentStudents}</p>
          </div>
        </div>
        
        <div className="stat-card leave-students">
          <div className="stat-icon">
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <h3>On Leave</h3>
            <p className="stat-number">{attendanceStats.onLeave}</p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="chart-section">
        <div className="chart-header">
          <h2>Attendance Trends</h2>
          <div className="chart-controls">
            <select 
              className="selector"
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
            <select 
              className="selector"
              value={selectedSection} 
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              {sections.map(section => (
                <option key={section} value={section}>Section {section}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill="#4ade80" name="Present" />
              <Bar dataKey="absent" fill="#f87171" name="Absent" />
              <Bar dataKey="leave" fill="#fbbf24" name="On Leave" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters and List */}
      <div className="list-section">
        <div className="list-header">
          <h2>Student Attendance Records</h2>
          <div className="filters-container">
            <div className="date-filters">
              <input
                type="date"
                className="date-input"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
              <span>to</span>
              <input
                type="date"
                className="date-input"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            
            <div className="dropdown-filters">
              <select 
                className="filter-select"
                value={filterClass} 
                onChange={(e) => setFilterClass(e.target.value)}
              >
                <option value="All">All Classes</option>
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
              
              <select 
                className="filter-select"
                value={filterSection} 
                onChange={(e) => setFilterSection(e.target.value)}
              >
                <option value="All">All Sections</option>
                {sections.map(section => (
                  <option key={section} value={section}>Section {section}</option>
                ))}
              </select>
            </div>
            
            <div className="search-container">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search by name or roll number..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="table-container">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Class</th>
                <th>Section</th>
                <th>Status</th>
                <th>Date</th>
                <th>Parent Contact</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map(student => (
                <tr key={student.id} className="table-row">
                  <td>{student.rollNo}</td>
                  <td className="student-name">{student.name}</td>
                  <td>{student.class}</td>
                  <td>{student.section}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(student.status)}`}>
                      {student.status}
                    </span>
                  </td>
                  <td>{student.date}</td>
                  <td>{student.parentContact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination-container">
          <div className="pagination-info">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredStudents.length)} of {filteredStudents.length} records
          </div>
          <div className="pagination-controls">
            <button 
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={18} />
              Previous
            </button>
            
            <div className="page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`page-number ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button 
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;