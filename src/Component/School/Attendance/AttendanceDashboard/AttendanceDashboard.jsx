import React, { useState, useEffect, useRef } from 'react';
import { Calendar } from 'react-date-range';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import './AttendanceDashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AttendanceDashboard = () => {
  // State management
  const [date, setDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedDept, setSelectedDept] = useState('all');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const calendarRef = useRef(null);
  const [importData, setImportData] = useState(null);

  // Sample data
  const attendanceData = {
    summary: {
      students: { present: 520, absent: 35, leave: 15, total: 570 },
      staff: { present: 60, absent: 5, leave: 2, total: 67 },
      drivers: { present: 18, absent: 12, leave: 0, total: 30 }
    },
    records: [
      // ... (same record data as before)
    ],
    classes: ['10A', '10B', '9A', '11B', '12A', '8B', '10C', '9C', '11A'],
    departments: ['Math', 'Science', 'English', 'History', 'Art', 'Music', 'PE'],
    trends: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      students: [480, 490, 500, 510, 520],
      staff: [55, 56, 58, 59, 60],
      drivers: [15, 16, 17, 18, 18]
    }
  };

  // Filter departments/classes based on role
  const getFilterOptions = () => {
    if (selectedRole === 'student') {
      return attendanceData.classes.map(cls => ({ value: cls, label: `Class ${cls}` }));
    } else if (selectedRole === 'teacher') {
      return attendanceData.departments.map(dept => ({ value: dept, label: dept }));
    }
    return [{ value: 'all', label: 'All' }];
  };

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter data
  const filteredData = attendanceData.records.filter(record => {
    const matchesRole = selectedRole === 'all' || record.role === selectedRole;
    const matchesDept = selectedDept === 'all' || 
                       (record.class === selectedDept || record.dept === selectedDept);
    const matchesDate = !date || record.date === date.toISOString().split('T')[0];
    const matchesDateRange = (!startDate && !endDate) || 
                           (new Date(record.date) >= new Date(startDate) && 
                           new Date(record.date) <= new Date(endDate));
    
    return matchesRole && matchesDept && matchesDate && matchesDateRange;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Handle date selection
  const handleSelect = (date) => {
    setDate(date);
    setShowCalendar(false);
  };

  // Chart data for combined line graph
  const combinedTrendData = {
    labels: attendanceData.trends.labels,
    datasets: [
      {
        label: 'Students',
        data: attendanceData.trends.students,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Staff',
        data: attendanceData.trends.staff,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  // Export functions
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Data');
    XLSX.writeFile(workbook, 'Attendance_Data.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Attendance Report', 14, 16);
    
    const headers = [['ID', 'Name', 'Role', 'Class/Dept', 'Status', 'Date']];
    const data = filteredData.map(item => [
      item.id,
      item.name,
      item.role.charAt(0).toUpperCase() + item.role.slice(1),
      item.class || item.dept || 'N/A',
      item.status.charAt(0).toUpperCase() + item.status.slice(1),
      item.date
    ]);
    
    doc.autoTable({
      head: headers,
      body: data,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [52, 152, 219] },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 30 },
        2: { cellWidth: 20 },
        3: { cellWidth: 25 },
        4: { cellWidth: 20 },
        5: { cellWidth: 25 }
      }
    });
    
    doc.save('Attendance_Report.pdf');
  };

  // Import functions
  const handleImport = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);
      
      setImportData(jsonData);
      alert(`Successfully imported ${jsonData.length} records!`);
    };
    
    reader.readAsArrayBuffer(file);
  };

  // Calculate percentages
  const calculatePercentage = (value, total) => {
    return Math.round((value / total) * 100);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">
          <i className="fas fa-calendar-check"></i> Attendance Dashboard
        </h1>
        <div className="dashboard-actions">
          <div className="import-wrapper">
            <label htmlFor="file-import" className="import-btn">
              <i className="fas fa-upload"></i> Import
            </label>
            <input 
              id="file-import"
              type="file" 
              accept=".xlsx, .xls, .csv"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
          </div>
          <div className="export-dropdown">
            <button className="export-btn highlight">
              <i className="fas fa-download"></i> Export <i className="fas fa-caret-down"></i>
            </button>
            <div className="export-menu">
              <button onClick={exportToExcel}><i className="fas fa-file-excel"></i> Excel</button>
              <button onClick={exportToPDF}><i className="fas fa-file-pdf"></i> PDF</button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card student">
          <div className="card-icon">
            <i className="fas fa-user-graduate"></i>
          </div>
          <div className="card-content">
            <h3>Students</h3>
            <div className="card-stats">
              <div className="stat present">
                <span className="stat-value">{attendanceData.summary.students.present}</span>
                <span className="stat-label">Present</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${calculatePercentage(attendanceData.summary.students.present, attendanceData.summary.students.total)}%` }}
                  ></div>
                </div>
              </div>
              <div className="stat absent">
                <span className="stat-value">{attendanceData.summary.students.absent}</span>
                <span className="stat-label">Absent</span>
              </div>
              <div className="stat leave">
                <span className="stat-value">{attendanceData.summary.students.leave}</span>
                <span className="stat-label">On Leave</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="summary-card staff">
          <div className="card-icon">
            <i className="fas fa-chalkboard-teacher"></i>
          </div>
          <div className="card-content">
            <h3>Staff</h3>
            <div className="card-stats">
              <div className="stat present">
                <span className="stat-value">{attendanceData.summary.staff.present}</span>
                <span className="stat-label">Present</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${calculatePercentage(attendanceData.summary.staff.present, attendanceData.summary.staff.total)}%` }}
                  ></div>
                </div>
              </div>
              <div className="stat absent">
                <span className="stat-value">{attendanceData.summary.staff.absent}</span>
                <span className="stat-label">Absent</span>
              </div>
              <div className="stat leave">
                <span className="stat-value">{attendanceData.summary.staff.leave}</span>
                <span className="stat-label">On Leave</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="summary-card driver">
          <div className="card-icon">
            <i className="fas fa-bus"></i>
          </div>
          <div className="card-content">
            <h3>Drivers</h3>
            <div className="card-stats">
              <div className="stat present">
                <span className="stat-value">{attendanceData.summary.drivers.present}</span>
                <span className="stat-label">Present</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${calculatePercentage(attendanceData.summary.drivers.present, attendanceData.summary.drivers.total)}%` }}
                  ></div>
                </div>
              </div>
              <div className="stat absent">
                <span className="stat-value">{attendanceData.summary.drivers.absent}</span>
                <span className="stat-label">Absent</span>
              </div>
              <div className="stat leave">
                <span className="stat-value">{attendanceData.summary.drivers.leave}</span>
                <span className="stat-label">On Leave</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Combined Line Graph */}
      <div className="chart-section">
        <div className="section-header">
          <h2>
            <i className="fas fa-chart-line"></i> Weekly Attendance Trend
          </h2>
          <div className="chart-legend">
            <div className="legend-item student">
              <span className="legend-color"></span>
              <span>Students</span>
            </div>
            <div className="legend-item staff">
              <span className="legend-color"></span>
              <span>Staff</span>
            </div>
          </div>
        </div>
        <div className="chart-container">
          <Line 
            data={combinedTrendData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      return `${context.dataset.label}: ${context.raw}`;
                    }
                  }
                }
              },
              scales: {
                x: {
                  grid: { display: false }
                },
                y: {
                  beginAtZero: false,
                  ticks: { precision: 0 }
                }
              },
              animation: {
                duration: 1000
              }
            }}
          />
        </div>
      </div>
      
      {/* Data Section */}
      <div className="data-section">
        <div className="section-header">
          <h2>
            <i className="fas fa-table"></i> Attendance Records
          </h2>
          <div className="filters">
            <div className="filter-group">
              <label htmlFor="role-filter">
                <i className="fas fa-users"></i> Role
              </label>
              <select 
                id="role-filter"
                value={selectedRole} 
                onChange={(e) => {
                  setSelectedRole(e.target.value);
                  setSelectedDept('all');
                }}
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="teacher">Staff</option>
                <option value="driver">Drivers</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="dept-filter">
                {selectedRole === 'student' ? (
                  <i className="fas fa-graduation-cap"></i>
                ) : selectedRole === 'teacher' ? (
                  <i className="fas fa-building"></i>
                ) : (
                  <i className="fas fa-tags"></i>
                )}
                {selectedRole === 'student' ? 'Class' : 
                 selectedRole === 'teacher' ? 'Department' : 'Group'}
              </label>
              <select 
                id="dept-filter"
                value={selectedDept} 
                onChange={(e) => setSelectedDept(e.target.value)}
                disabled={selectedRole === 'all' || selectedRole === 'driver'}
              >
                {getFilterOptions().map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group date-filter">
              <label><i className="fas fa-calendar-alt"></i> Date Range</label>
              <div className="date-inputs">
                <input 
                  type="date" 
                  onChange={(e) => setStartDate(e.target.value)}
                  className="date-input"
                />
                <span>to</span>
                <input 
                  type="date" 
                  onChange={(e) => setEndDate(e.target.value)}
                  className="date-input"
                />
              </div>
            </div>
            
            <button 
              className="reset-filters"
              onClick={() => {
                setSelectedRole('all');
                setSelectedDept('all');
                setStartDate(null);
                setEndDate(null);
                setDate(new Date());
              }}
            >
              <i className="fas fa-sync-alt"></i> Reset
            </button>
          </div>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>{selectedRole === 'student' ? 'Class' : selectedRole === 'teacher' ? 'Department' : 'Group'}</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    <div className="user-info">
                      <span className="user-name">{item.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge ${item.role}`}>
                      {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
                    </span>
                  </td>
                  <td>{item.class || item.dept || 'N/A'}</td>
                  <td>
                    <span className={`status-badge ${item.status}`}>
                      <i className={`fas ${
                        item.status === 'present' ? 'fa-check-circle' :
                        item.status === 'absent' ? 'fa-times-circle' : 'fa-calendar-minus'
                      }`}></i>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
                  <td>{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredData.length === 0 && (
            <div className="no-results">
              <i className="fas fa-search"></i>
              <p>No attendance records found matching your filters</p>
            </div>
          )}
        </div>
        
        {filteredData.length > itemsPerPage && (
          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <i className="fas fa-chevron-left"></i> Previous
            </button>
            <div className="page-info">
              Page {currentPage} of {totalPages}
            </div>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceDashboard;