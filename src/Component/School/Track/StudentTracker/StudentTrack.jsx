
import React, { useState, useRef, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import Chart from 'chart.js/auto';
import { 
  Users, TrendingUp, AlertTriangle, Star, Award, Filter, Search, 
  Download, Eye, Edit2, Trash2, X, BookOpen, TrendingDown,
  User, Book, Clock, Calendar, GraduationCap, ChevronDown,
  CheckCircle, XCircle, Clock4, AlertCircle, Crown, Medal
} from 'lucide-react';
import './StudentTrack.css';

const StudentTrack = () => {
  const chartRef1 = useRef(null);
  const chartRef2 = useRef(null);
  const chartInstance1 = useRef(null);
  const chartInstance2 = useRef(null);

  // Sample data with enhanced fields
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Anjali Sharma",
      rollNo: "CSE21001",
      department: "CSE",
      branch: "CSE-A",
      semester: "6th",
      attendance: 96.5,
      currentStatus: "Present",
      rating: 4.9,
      rank: 1,
      cgpa: 9.2,
      flags: [],
      reason: "Perfect Attendance",
      photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      attendancePdf: "attendance_anjali.pdf",
      resultPdf: "result_anjali.pdf",
      lastSemesterAttendance: 92.3,
      lastSemesterCGPA: 8.9
    },
    {
      id: 2,
      name: "Rohit Kumar",
      rollNo: "CSE21002",
      department: "CSE",
      branch: "CSE-A",
      semester: "6th",
      attendance: 89.2,
      currentStatus: "Present",
      rating: 4.7,
      rank: 2,
      cgpa: 8.8,
      flags: [],
      reason: "Consistent Performance",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      attendancePdf: "attendance_rohit.pdf",
      resultPdf: "result_rohit.pdf",
      lastSemesterAttendance: 85.0,
      lastSemesterCGPA: 8.5
    },
    {
      id: 3,
      name: "Priya Singh",
      rollNo: "ME21001",
      department: "ME",
      branch: "ME-A",
      semester: "4th",
      attendance: 72.3,
      currentStatus: "Absent",
      rating: 3.2,
      rank: 8,
      cgpa: 6.5,
      flags: ["Low Attendance", "Academic Warning"],
      reason: "Low Attendance",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      attendancePdf: "attendance_priya.pdf",
      resultPdf: "result_priya.pdf",
      lastSemesterAttendance: 75.1,
      lastSemesterCGPA: 6.8
    },
    {
      id: 4,
      name: "Arjun Patel",
      rollNo: "CSE21003",
      department: "CSE",
      branch: "CSE-B",
      semester: "6th",
      attendance: 94.1,
      currentStatus: "Present",
      rating: 4.8,
      rank: 3,
      cgpa: 9.0,
      flags: [],
      reason: "Excellent Performance",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      attendancePdf: "attendance_arjun.pdf",
      resultPdf: "result_arjun.pdf",
      lastSemesterAttendance: 90.5,
      lastSemesterCGPA: 8.7
    },
    {
      id: 5,
      name: "Sneha Reddy",
      rollNo: "EE21001",
      department: "EE",
      branch: "EE-A",
      semester: "2nd",
      attendance: 68.7,
      currentStatus: "Leave",
      rating: 2.8,
      rank: 12,
      cgpa: 5.9,
      flags: ["Critical Attendance", "Poor Performance"],
      reason: "Critical Attendance",
      photo: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
      attendancePdf: "attendance_sneha.pdf",
      resultPdf: "result_sneha.pdf",
      lastSemesterAttendance: 70.2,
      lastSemesterCGPA: 6.2
    },
    {
      id: 6,
      name: "Vikram Joshi",
      rollNo: "ME21002",
      department: "ME",
      branch: "ME-B",
      semester: "8th",
      attendance: 87.5,
      currentStatus: "Present",
      rating: 4.3,
      rank: 5,
      cgpa: 8.2,
      flags: [],
      reason: "Good Performance",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      attendancePdf: "attendance_vikram.pdf",
      resultPdf: "result_vikram.pdf",
      lastSemesterAttendance: 83.0,
      lastSemesterCGPA: 7.9
    }
  ]);

  // Filters state
  const [filters, setFilters] = useState({
    department: '',
    branch: '',
    semester: '',
    nameSearch: '',
    ratingFilter: ''
  });

  // Modal states
  const [editModal, setEditModal] = useState({ open: false, student: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, student: null });
  const [pdfModal, setPdfModal] = useState({ open: false, pdfName: '', pdfType: '' });

  // Filter logic
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchDept = !filters.department || student.department === filters.department;
      const matchBranch = !filters.branch || student.branch === filters.branch;
      const matchSem = !filters.semester || student.semester === filters.semester;
      const matchName = !filters.nameSearch || 
        student.name.toLowerCase().includes(filters.nameSearch.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(filters.nameSearch.toLowerCase());
      const matchRating = !filters.ratingFilter || student.rating >= parseFloat(filters.ratingFilter);
      
      return matchDept && matchBranch && matchSem && matchName && matchRating;
    });
  }, [students, filters]);

  // Summary calculations
  const totalStudents = filteredStudents.length;
  const presentToday = filteredStudents.filter(s => s.currentStatus === 'Present').length;
  const below75Attendance = filteredStudents.filter(s => s.attendance < 75).length;
  const avgRating = filteredStudents.reduce((sum, s) => sum + s.rating, 0) / totalStudents || 0;
  const topPerformer = filteredStudents.length > 0 ? filteredStudents.sort((a, b) => b.rating - a.rating)[0] : null;

  // Get top 3 performers based on filters
  const topPerformers = filteredStudents
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  // Chart data based on filtered students
  const attendanceImprovementData = useMemo(() => {
    return filteredStudents.map(student => ({
      name: student.name.split(' ')[0],
      current: student.attendance,
      previous: student.lastSemesterAttendance || student.attendance - 5,
      improvement: student.attendance - (student.lastSemesterAttendance || student.attendance - 5)
    })).slice(0, 6);
  }, [filteredStudents]);

  const cgpaImprovementData = useMemo(() => {
    return filteredStudents.map(student => ({
      name: student.name.split(' ')[0],
      current: student.cgpa,
      previous: student.lastSemesterCGPA || student.cgpa - 0.5,
      improvement: student.cgpa - (student.lastSemesterCGPA || student.cgpa - 0.5)
    })).slice(0, 6);
  }, [filteredStudents]);

  // Chart.js setup
  useEffect(() => {
    if (chartRef1.current && attendanceImprovementData.length > 0) {
      if (chartInstance1.current) {
        chartInstance1.current.destroy();
      }
      
      const ctx1 = chartRef1.current.getContext('2d');
      chartInstance1.current = new Chart(ctx1, {
        type: 'bar',
        data: {
          labels: attendanceImprovementData.map(d => d.name),
          datasets: [
            {
              label: 'Current Semester',
              data: attendanceImprovementData.map(d => d.current),
              backgroundColor: 'rgba(59, 130, 246, 0.8)',
              borderColor: 'rgba(59, 130, 246, 1)',
              borderWidth: 2,
              borderRadius: 8,
              borderSkipped: false,
            },
            {
              label: 'Previous Semester',
              data: attendanceImprovementData.map(d => d.previous),
              backgroundColor: 'rgba(156, 163, 175, 0.8)',
              borderColor: 'rgba(156, 163, 175, 1)',
              borderWidth: 2,
              borderRadius: 8,
              borderSkipped: false,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Attendance Improvement Comparison'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.dataset.label}: ${context.raw}%`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: function(value) {
                  return value + '%';
                }
              }
            }
          }
        }
      });
    }

    if (chartRef2.current && cgpaImprovementData.length > 0) {
      if (chartInstance2.current) {
        chartInstance2.current.destroy();
      }
      
      const ctx2 = chartRef2.current.getContext('2d');
      chartInstance2.current = new Chart(ctx2, {
        type: 'line',
        data: {
          labels: cgpaImprovementData.map(d => d.name),
          datasets: [
            {
              label: 'Current CGPA',
              data: cgpaImprovementData.map(d => d.current),
              borderColor: 'rgba(16, 185, 129, 1)',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: 'rgba(16, 185, 129, 1)',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 6,
            },
            {
              label: 'Previous CGPA',
              data: cgpaImprovementData.map(d => d.previous),
              borderColor: 'rgba(239, 68, 68, 1)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: 'rgba(239, 68, 68, 1)',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 6,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'CGPA Progress Tracking'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.dataset.label}: ${context.raw.toFixed(2)}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 10,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance1.current) {
        chartInstance1.current.destroy();
      }
      if (chartInstance2.current) {
        chartInstance2.current.destroy();
      }
    };
  }, [attendanceImprovementData, cgpaImprovementData]);

  // Export to Excel
  const exportToExcel = () => {
    const exportData = filteredStudents.map(student => ({
      Name: student.name,
      'Roll No': student.rollNo,
      Department: student.department,
      Branch: student.branch,
      Semester: student.semester,
      'Attendance %': student.attendance,
      'Current Status': student.currentStatus,
      Rating: student.rating,
      Rank: student.rank,
      CGPA: student.cgpa,
      'Last Semester CGPA': student.lastSemesterCGPA || '',
      'CGPA Improvement': student.lastSemesterCGPA ? (student.cgpa - student.lastSemesterCGPA).toFixed(2) : '',
      'Attendance Improvement': student.lastSemesterAttendance ? (student.attendance - student.lastSemesterAttendance).toFixed(2) : '',
      Flags: student.flags.join(', '),
      'Attendance PDF': student.attendancePdf,
      'Result PDF': student.resultPdf
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    XLSX.writeFile(wb, 'enhanced_student_performance.xlsx');
  };

  // Function to generate and download PDF
  const generatePdf = (student, type) => {
    // In a real app, this would call your PDF generation API
    // For demo, we'll create a simple PDF download
    const pdfDoc = {
      title: `${student.name} - ${type === 'attendance' ? 'Attendance Report' : 'Academic Results'}`,
      content: [
        `Student: ${student.name}`,
        `Roll No: ${student.rollNo}`,
        `Department: ${student.department}`,
        `Semester: ${student.semester}`,
        type === 'attendance' 
          ? `Current Attendance: ${student.attendance}%`
          : `Current CGPA: ${student.cgpa}`,
        `Generated on: ${new Date().toLocaleDateString()}`
      ].join('\n\n')
    };
    
    const blob = new Blob([pdfDoc.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${student.name.replace(/\s+/g, '_')}_${type}_report.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`student-track-star ${i < Math.floor(rating) ? 'student-track-star-filled' : ''}`}
        size={16}
      />
    ));
  };

  const handleEdit = (student) => {
    setEditModal({ open: true, student: { ...student } });
  };

  const handleSaveEdit = () => {
    if (editModal.student) {
      setStudents(prev => prev.map(s => 
        s.id === editModal.student.id ? editModal.student : s
      ));
      setEditModal({ open: false, student: null });
    }
  };

  const handleDelete = (studentId) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
    setDeleteModal({ open: false, student: null });
  };

  const viewPdf = (pdfName, pdfType) => {
    setPdfModal({ open: true, pdfName, pdfType });
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Present':
        return <CheckCircle className="student-track-status-icon student-track-status-present" size={16} />;
      case 'Absent':
        return <XCircle className="student-track-status-icon student-track-status-absent" size={16} />;
      case 'Leave':
        return <Clock4 className="student-track-status-icon student-track-status-leave" size={16} />;
      default:
        return <AlertCircle className="student-track-status-icon student-track-status-default" size={16} />;
    }
  };

  const getImprovementIcon = (current, previous) => {
    if (current > previous) return <TrendingUp className="student-track-trend-icon student-track-trend-up" size={16} />;
    if (current < previous) return <TrendingDown className="student-track-trend-icon student-track-trend-down" size={16} />;
    return <div className="student-track-trend-icon student-track-trend-neutral">—</div>;
  };

  const getRankBadge = (index) => {
    switch(index) {
      case 0:
        return <Crown className="student-track-rank-badge student-track-rank-gold" size={18} />;
      case 1:
        return <Medal className="student-track-rank-badge student-track-rank-silver" size={18} />;
      case 2:
        return <Medal className="student-track-rank-badge student-track-rank-bronze" size={18} />;
      default:
        return null;
    }
  };

  const handleFlagChange = (studentId, flag, isChecked) => {
    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        const newFlags = isChecked 
          ? [...student.flags, flag]
          : student.flags.filter(f => f !== flag);
        return { ...student, flags: newFlags };
      }
      return student;
    }));
  };

  return (
    <div className="student-track">
      {/* Header */}
      <div className="student-track-header">
        <div className="student-track-header-content">
          <h1 className="student-track-title">Enhanced Student Track Dashboard</h1>
          <p className="student-track-subtitle">Comprehensive Performance Analytics & Management</p>
        </div>
        <div className="student-track-badges">
          <span className="student-track-badge student-track-badge-live">Live Data</span>
          <span className="student-track-badge student-track-badge-students">{totalStudents} Students</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="student-track-summary-grid">
        <div className="student-track-card student-track-card-blue">
          <div className="student-track-card-content">
            <div>
              <p className="student-track-card-label">Total Students</p>
              <p className="student-track-card-value">{totalStudents}</p>
              <p className="student-track-card-subtext">Active Records</p>
            </div>
            <div className="student-track-card-icon">
              <Users size={20} />
            </div>
          </div>
        </div>

        <div className="student-track-card student-track-card-green">
          <div className="student-track-card-content">
            <div>
              <p className="student-track-card-label">Present Today</p>
              <p className="student-track-card-value">{presentToday}</p>
              <p className="student-track-card-subtext">{totalStudents > 0 ? ((presentToday/totalStudents)*100).toFixed(1) : 0}% Attendance</p>
            </div>
            <div className="student-track-card-icon">
              <TrendingUp size={20} />
            </div>
          </div>
        </div>

        <div className="student-track-card student-track-card-red">
          <div className="student-track-card-content">
            <div>
              <p className="student-track-card-label">Below 75% Attendance</p>
              <p className="student-track-card-value">{below75Attendance}</p>
              <p className="student-track-card-subtext">At Risk Students</p>
            </div>
            <div className="student-track-card-icon">
              <AlertTriangle size={20} />
            </div>
          </div>
        </div>

        <div className="student-track-card student-track-card-purple">
          <div className="student-track-card-content">
            <div>
              <p className="student-track-card-label">Average Rating</p>
              <p className="student-track-card-value">{avgRating.toFixed(1)}★</p>
              <p className="student-track-card-subtext">Overall Performance</p>
            </div>
            <div className="student-track-card-icon">
              <Star size={20} />
            </div>
          </div>
        </div>

        <div className="student-track-card student-track-card-orange">
          <div className="student-track-card-content">
            <div>
              <p className="student-track-card-label">Top Performer</p>
              <p className="student-track-card-value">{topPerformer?.name || 'N/A'}</p>
              <p className="student-track-card-subtext">#{topPerformer?.rank || 'N/A'} Rank</p>
            </div>
            <div className="student-track-card-icon">
              <Award size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="student-track-filter-section">
        <div className="student-track-filter-header">
          <Filter size={18} />
          <h3 className="student-track-filter-title">Smart Filters</h3>
        </div>
        
        <div className="student-track-filter-grid">
          <div className="student-track-filter-group">
            <select
              className="student-track-select"
              value={filters.department}
              onChange={(e) => setFilters({...filters, department: e.target.value})}
            >
              <option value="">All Departments</option>
              <option value="CSE">Computer Science</option>
              <option value="ME">Mechanical</option>
              <option value="EE">Electrical</option>
            </select>
            <ChevronDown className="student-track-select-icon" size={16} />
          </div>

          <div className="student-track-filter-group">
            <select
              className="student-track-select"
              value={filters.branch}
              onChange={(e) => setFilters({...filters, branch: e.target.value})}
            >
              <option value="">All Branches</option>
              <option value="CSE-A">CSE-A</option>
              <option value="CSE-B">CSE-B</option>
              <option value="ME-A">ME-A</option>
              <option value="ME-B">ME-B</option>
              <option value="EE-A">EE-A</option>
            </select>
            <ChevronDown className="student-track-select-icon" size={16} />
          </div>

          <div className="student-track-filter-group">
            <select
              className="student-track-select"
              value={filters.semester}
              onChange={(e) => setFilters({...filters, semester: e.target.value})}
            >
              <option value="">All Semesters</option>
              <option value="1st">1st Semester</option>
              <option value="2nd">2nd Semester</option>
              <option value="3rd">3rd Semester</option>
              <option value="4th">4th Semester</option>
              <option value="5th">5th Semester</option>
              <option value="6th">6th Semester</option>
              <option value="7th">7th Semester</option>
              <option value="8th">8th Semester</option>
            </select>
            <ChevronDown className="student-track-select-icon" size={16} />
          </div>

          <div className="student-track-search-group">
            <Search className="student-track-search-icon" size={16} />
            <input
              type="text"
              placeholder="Search students..."
              className="student-track-search-input"
              value={filters.nameSearch}
              onChange={(e) => setFilters({...filters, nameSearch: e.target.value})}
            />
          </div>

          <input
            type="number"
            placeholder="Min rating (e.g., 3.5)"
            className="student-track-input"
            value={filters.ratingFilter}
            onChange={(e) => setFilters({...filters, ratingFilter: e.target.value})}
            min="0"
            max="5"
            step="0.1"
          />
        </div>
      </div>

      {/* Top Performers */}
      <div className="student-track-top-performers">
        <h3 className="student-track-section-title">
          <Award className="student-track-section-icon" size={20} />
          Top Performers
        </h3>
        <div className="student-track-performers-grid">
          {topPerformers.map((student, index) => (
            <div key={student.id} className={`student-track-performer-card ${index === 0 ? 'student-track-performer-gold' : index === 1 ? 'student-track-performer-silver' : 'student-track-performer-bronze'}`}>
              <div className="student-track-performer-header">
                <img
                  src={student.photo}
                  alt={student.name}
                  className="student-track-performer-avatar"
                />
                <div className="student-track-performer-info">
                  <h4 className="student-track-performer-name">{student.name}</h4>
                  <p className="student-track-performer-meta">{student.department} - {student.semester}</p>
                  <p className="student-track-performer-roll">{student.rollNo}</p>
                </div>
                <div className="student-track-performer-rank">
                  {getRankBadge(index)}
                  <span className="student-track-performer-rank-text">#{index + 1}</span>
                </div>
              </div>
              
              <div className="student-track-performer-stats">
                <div className="student-track-performer-stat">
                  <p className="student-track-performer-stat-label">Attendance</p>
                  <p className="student-track-performer-stat-value">{student.attendance}%</p>
                  {getImprovementIcon(student.attendance, student.lastSemesterAttendance || student.attendance - 5)}
                </div>
                <div className="student-track-performer-stat">
                  <p className="student-track-performer-stat-label">CGPA</p>
                  <p className="student-track-performer-stat-value">{student.cgpa}</p>
                  {getImprovementIcon(student.cgpa, student.lastSemesterCGPA || student.cgpa - 0.5)}
                </div>
                <div className="student-track-performer-stat">
                  <p className="student-track-performer-stat-label">Rating</p>
                  <p className="student-track-performer-stat-value">{student.rating}★</p>
                </div>
              </div>
              
              <div className="student-track-performer-footer">
                <p className="student-track-performer-rank-text">Rank: {student.rank}</p>
                <p className="student-track-performer-reason">{student.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="student-track-charts-grid">
        <div className="student-track-chart-container">
          <h3 className="student-track-section-title">
            <TrendingUp className="student-track-section-icon" size={20} />
            Attendance Progress
          </h3>
          <div className="student-track-chart-wrapper">
            <canvas ref={chartRef1}></canvas>
          </div>
        </div>

        <div className="student-track-chart-container">
          <h3 className="student-track-section-title">
            <Book className="student-track-section-icon" size={20} />
            CGPA Improvement
          </h3>
          <div className="student-track-chart-wrapper">
            <canvas ref={chartRef2}></canvas>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="student-track-export-section">
        <h3 className="student-track-section-title">Student Performance Records</h3>
        <button className="student-track-export-button" onClick={exportToExcel}>
          <Download className="student-track-export-icon" size={16} />
          Export to Excel
        </button>
      </div>

      {/* Student Table */}
      <div className="student-track-table-container">
        <table className="student-track-table">
          <thead className="student-track-table-header">
            <tr>
              <th className="student-track-table-th">Photo</th>
              <th className="student-track-table-th">Name & Roll No</th>
              <th className="student-track-table-th">Department</th>
              <th className="student-track-table-th">Semester</th>
              <th className="student-track-table-th">Attendance</th>
              <th className="student-track-table-th">CGPA</th>
              <th className="student-track-table-th">Rating</th>
              <th className="student-track-table-th">Status</th>
              <th className="student-track-table-th">PDFs</th>
              <th className="student-track-table-th">Actions</th>
            </tr>
          </thead>
          <tbody className="student-track-table-body">
            {filteredStudents.map(student => (
              <tr key={student.id} className={`student-track-table-row ${student.flags.length > 0 ? 'student-track-table-row-warning' : ''}`}>
                <td className="student-track-table-td">
                  <img src={student.photo} alt={student.name} className="student-track-table-avatar" />
                </td>
                <td className="student-track-table-td">
                  <div className="student-track-student-info">
                    <div className="student-track-student-name">{student.name}</div>
                    <div className="student-track-student-roll">{student.rollNo}</div>
                  </div>
                </td>
                <td className="student-track-table-td">
                  <div className="student-track-department-info">
                    <span className="student-track-department-name">{student.department}</span>
                    <span className="student-track-branch-name">{student.branch}</span>
                  </div>
                </td>
                <td className="student-track-table-td">{student.semester}</td>
                <td className="student-track-table-td">
                  <div className="student-track-attendance-info">
                    <span className="student-track-attendance-value">{student.attendance}%</span>
                    {getImprovementIcon(student.attendance, student.lastSemesterAttendance || student.attendance - 5)}
                  </div>
                </td>
                <td className="student-track-table-td">
                  <div className="student-track-cgpa-info">
                    <span className="student-track-cgpa-value">{student.cgpa}</span>
                    {getImprovementIcon(student.cgpa, student.lastSemesterCGPA || student.cgpa - 0.5)}
                  </div>
                </td>
                <td className="student-track-table-td">
                  <div className="student-track-rating-info">
                    <div className="student-track-stars">
                      {renderStars(student.rating)}
                    </div>
                    <span className="student-track-rating-value">{student.rating.toFixed(1)}</span>
                  </div>
                </td>
                <td className="student-track-table-td">
                  <div className={`student-track-status-badge student-track-status-${student.currentStatus.toLowerCase()}`}>
                    {getStatusIcon(student.currentStatus)}
                    <span>{student.currentStatus}</span>
                  </div>
                  {student.flags.length > 0 && (
                    <div className="student-track-flags-container">
                      {student.flags.map((flag, i) => (
                        <span key={i} className="student-track-flag-badge">{flag}</span>
                      ))}
                    </div>
                  )}
                </td>
                <td className="student-track-table-td">
                  <div className="student-track-pdf-buttons">
                    <button 
                      className="student-track-pdf-btn student-track-pdf-attendance"
                      onClick={() => generatePdf(student, 'attendance')}
                    >
                      <Download size={14} />
                      <span>Attendance</span>
                    </button>
                    <button 
                      className="student-track-pdf-btn student-track-pdf-result"
                      onClick={() => generatePdf(student, 'result')}
                    >
                      <Download size={14} />
                      <span>Result</span>
                    </button>
                  </div>
                </td>
                <td className="student-track-table-td">
                  <div className="student-track-action-buttons">
                    <button 
                      className="student-track-action-btn student-track-action-view" 
                      onClick={() => viewPdf(student.attendancePdf, 'attendance')}
                      title="View Attendance"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      className="student-track-action-btn student-track-action-edit" 
                      onClick={() => handleEdit(student)}
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className="student-track-action-btn student-track-action-delete" 
                      onClick={() => setDeleteModal({ open: true, student })}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editModal.open && (
        <div className="student-track-modal-overlay">
          <div className="student-track-modal-content">
            <div className="student-track-modal-header">
              <h3 className="student-track-modal-title">Edit Student Details</h3>
              <button 
                className="student-track-modal-close" 
                onClick={() => setEditModal({ open: false, student: null })}
              >
                <X size={18} />
              </button>
            </div>
            <div className="student-track-modal-body">
              <div className="student-track-form-row">
                <div className="student-track-form-group">
                  <label className="student-track-form-label">Name</label>
                  <input
                    type="text"
                    className="student-track-form-input"
                    value={editModal.student?.name || ''}
                    onChange={(e) => setEditModal(prev => ({
                      ...prev,
                      student: { ...prev.student, name: e.target.value }
                    }))}
                  />
                </div>
                <div className="student-track-form-group">
                  <label className="student-track-form-label">Roll No</label>
                  <input
                    type="text"
                    className="student-track-form-input"
                    value={editModal.student?.rollNo || ''}
                    onChange={(e) => setEditModal(prev => ({
                      ...prev,
                      student: { ...prev.student, rollNo: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <div className="student-track-form-row">
                <div className="student-track-form-group">
                  <label className="student-track-form-label">Department</label>
                  <select
                    className="student-track-form-input"
                    value={editModal.student?.department || 'CSE'}
                    onChange={(e) => setEditModal(prev => ({
                      ...prev,
                      student: { ...prev.student, department: e.target.value }
                    }))}
                  >
                    <option value="CSE">Computer Science</option>
                    <option value="ME">Mechanical</option>
                    <option value="EE">Electrical</option>
                  </select>
                </div>
                <div className="student-track-form-group">
                  <label className="student-track-form-label">Branch</label>
                  <select
                    className="student-track-form-input"
                    value={editModal.student?.branch || 'CSE-A'}
                    onChange={(e) => setEditModal(prev => ({
                      ...prev,
                      student: { ...prev.student, branch: e.target.value }
                    }))}
                  >
                    <option value="CSE-A">CSE-A</option>
                    <option value="CSE-B">CSE-B</option>
                    <option value="ME-A">ME-A</option>
                    <option value="ME-B">ME-B</option>
                    <option value="EE-A">EE-A</option>
                  </select>
                </div>
              </div>

              <div className="student-track-form-row">
                <div className="student-track-form-group">
                  <label className="student-track-form-label">Semester</label>
                  <select
                    className="student-track-form-input"
                    value={editModal.student?.semester || '1st'}
                    onChange={(e) => setEditModal(prev => ({
                      ...prev,
                      student: { ...prev.student, semester: e.target.value }
                    }))}
                  >
                    <option value="1st">1st Semester</option>
                    <option value="2nd">2nd Semester</option>
                    <option value="3rd">3rd Semester</option>
                    <option value="4th">4th Semester</option>
                    <option value="5th">5th Semester</option>
                    <option value="6th">6th Semester</option>
                    <option value="7th">7th Semester</option>
                    <option value="8th">8th Semester</option>
                  </select>
                </div>
                <div className="student-track-form-group">
                  <label className="student-track-form-label">Rank</label>
                  <input
                    type="number"
                    className="student-track-form-input"
                    value={editModal.student?.rank || ''}
                    onChange={(e) => setEditModal(prev => ({
                      ...prev,
                      student: { ...prev.student, rank: parseInt(e.target.value) }
                    }))}
                    min="1"
                  />
                </div>
              </div>

              <div className="student-track-form-row">
                <div className="student-track-form-group">
                  <label className="student-track-form-label">Attendance (%)</label>
                  <input
                    type="number"
                    className="student-track-form-input"
                    value={editModal.student?.attendance || ''}
                    onChange={(e) => setEditModal(prev => ({
                      ...prev,
                      student: { ...prev.student, attendance: parseFloat(e.target.value) }
                    }))}
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
                <div className="student-track-form-group">
                  <label className="student-track-form-label">Last Sem Attendance</label>
                  <input
                    type="number"
                    className="student-track-form-input"
                    value={editModal.student?.lastSemesterAttendance || ''}
                    onChange={(e) => setEditModal(prev => ({
                      ...prev,
                      student: { ...prev.student, lastSemesterAttendance: parseFloat(e.target.value) }
                    }))}
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="student-track-form-row">
                <div className="student-track-form-group">
                  <label className="student-track-form-label">CGPA</label>
                  <input
                    type="number"
                    className="student-track-form-input"
                    value={editModal.student?.cgpa || ''}
                    onChange={(e) => setEditModal(prev => ({
                      ...prev,
                      student: { ...prev.student, cgpa: parseFloat(e.target.value) }
                    }))}
                    min="0"
                    max="10"
                    step="0.1"
                  />
                </div>
                <div className="student-track-form-group">
                  <label className="student-track-form-label">Last Sem CGPA</label>
                  <input
                    type="number"
                    className="student-track-form-input"
                    value={editModal.student?.lastSemesterCGPA || ''}
                    onChange={(e) => setEditModal(prev => ({
                      ...prev,
                      student: { ...prev.student, lastSemesterCGPA: parseFloat(e.target.value) }
                    }))}
                    min="0"
                    max="10"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="student-track-form-row">
                <div className="student-track-form-group">
                  <label className="student-track-form-label">Rating</label>
                  <input
                    type="number"
                    className="student-track-form-input"
                    value={editModal.student?.rating || ''}
                    onChange={(e) => setEditModal(prev => ({
                      ...prev,
                      student: { ...prev.student, rating: parseFloat(e.target.value) }
                    }))}
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </div>
                <div className="student-track-form-group">
                  <label className="student-track-form-label">Status</label>
                  <select
                    className="student-track-form-input"
                    value={editModal.student?.currentStatus || 'Present'}
                    onChange={(e) => setEditModal(prev => ({
                      ...prev,
                      student: { ...prev.student, currentStatus: e.target.value }
                    }))}
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Leave">Leave</option>
                  </select>
                </div>
              </div>

              <div className="student-track-form-group">
                <label className="student-track-form-label">Flags</label>
                <div className="student-track-flags-edit">
                  <label className="student-track-flag-checkbox">
                    <input
                      type="checkbox"
                      checked={editModal.student?.flags.includes('Low Attendance') || false}
                      onChange={(e) => {
                        const newFlags = e.target.checked
                          ? [...editModal.student.flags, 'Low Attendance']
                          : editModal.student.flags.filter(f => f !== 'Low Attendance');
                        setEditModal(prev => ({
                          ...prev,
                          student: { ...prev.student, flags: newFlags }
                        }));
                      }}
                    />
                    <span>Low Attendance</span>
                  </label>
                  <label className="student-track-flag-checkbox">
                    <input
                      type="checkbox"
                      checked={editModal.student?.flags.includes('Academic Warning') || false}
                      onChange={(e) => {
                        const newFlags = e.target.checked
                          ? [...editModal.student.flags, 'Academic Warning']
                          : editModal.student.flags.filter(f => f !== 'Academic Warning');
                        setEditModal(prev => ({
                          ...prev,
                          student: { ...prev.student, flags: newFlags }
                        }));
                      }}
                    />
                    <span>Academic Warning</span>
                  </label>
                  <label className="student-track-flag-checkbox">
                    <input
                      type="checkbox"
                      checked={editModal.student?.flags.includes('Critical Attendance') || false}
                      onChange={(e) => {
                        const newFlags = e.target.checked
                          ? [...editModal.student.flags, 'Critical Attendance']
                          : editModal.student.flags.filter(f => f !== 'Critical Attendance');
                        setEditModal(prev => ({
                          ...prev,
                          student: { ...prev.student, flags: newFlags }
                        }));
                      }}
                    />
                    <span>Critical Attendance</span>
                  </label>
                  <label className="student-track-flag-checkbox">
                    <input
                      type="checkbox"
                      checked={editModal.student?.flags.includes('Poor Performance') || false}
                      onChange={(e) => {
                        const newFlags = e.target.checked
                          ? [...editModal.student.flags, 'Poor Performance']
                          : editModal.student.flags.filter(f => f !== 'Poor Performance');
                        setEditModal(prev => ({
                          ...prev,
                          student: { ...prev.student, flags: newFlags }
                        }));
                      }}
                    />
                    <span>Poor Performance</span>
                  </label>
                </div>
              </div>

              <div className="student-track-form-group">
                <label className="student-track-form-label">Reason/Comment</label>
                <textarea
                  className="student-track-form-textarea"
                  value={editModal.student?.reason || ''}
                  onChange={(e) => setEditModal(prev => ({
                    ...prev,
                    student: { ...prev.student, reason: e.target.value }
                  }))}
                  rows="3"
                />
              </div>
            </div>
            <div className="student-track-modal-footer">
              <button
                className="student-track-modal-btn student-track-modal-btn-cancel"
                onClick={() => setEditModal({ open: false, student: null })}
              >
                Cancel
              </button>
              <button
                className="student-track-modal-btn student-track-modal-btn-save"
                onClick={handleSaveEdit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="student-track-modal-overlay">
          <div className="student-track-modal-content student-track-modal-delete">
            <div className="student-track-modal-header">
              <h3 className="student-track-modal-title">Confirm Deletion</h3>
              <button 
                className="student-track-modal-close" 
                onClick={() => setDeleteModal({ open: false, student: null })}
              >
                <X size={18} />
              </button>
            </div>
            <div className="student-track-modal-body">
              <p className="student-track-modal-text">Are you sure you want to delete {deleteModal.student?.name}'s record?</p>
              <p className="student-track-modal-subtext">This action cannot be undone.</p>
            </div>
            <div className="student-track-modal-footer">
              <button
                className="student-track-modal-btn student-track-modal-btn-cancel"
                onClick={() => setDeleteModal({ open: false, student: null })}
              >
                Cancel
              </button>
              <button
                className="student-track-modal-btn student-track-modal-btn-delete"
                onClick={() => handleDelete(deleteModal.student.id)}
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {pdfModal.open && (
        <div className="student-track-modal-overlay">
          <div className="student-track-modal-content student-track-modal-pdf">
            <div className="student-track-modal-header">
              <h3 className="student-track-modal-title">
                {pdfModal.pdfType === 'attendance' ? 'Attendance Report' : 'Academic Results'}
              </h3>
              <button 
                className="student-track-modal-close" 
                onClick={() => setPdfModal({ open: false, pdfName: '', pdfType: '' })}
              >
                <X size={18} />
              </button>
            </div>
            <div className="student-track-modal-body student-track-pdf-viewer">
              <div className="student-track-pdf-placeholder">
                <BookOpen size={48} className="student-track-pdf-icon" />
                <p className="student-track-pdf-text">
                  Preview of {pdfModal.pdfName}
                </p>
                <p className="student-track-pdf-subtext">
                  {pdfModal.pdfType === 'attendance' 
                    ? 'Attendance details and statistics would be displayed here' 
                    : 'Academic results and performance analysis would be displayed here'}
                </p>
                <button 
                  className="student-track-pdf-download-btn"
                  onClick={() => {
                    const student = students.find(s => 
                      pdfModal.pdfType === 'attendance' 
                        ? s.attendancePdf === pdfModal.pdfName 
                        : s.resultPdf === pdfModal.pdfName
                    );
                    if (student) {
                      generatePdf(student, pdfModal.pdfType);
                    }
                  }}
                >
                  <Download size={16} className="student-track-pdf-download-icon" />
                  Download PDF
                </button>
              </div>
            </div>
            <div className="student-track-modal-footer">
              <button
                className="student-track-modal-btn student-track-modal-btn-close"
                onClick={() => setPdfModal({ open: false, pdfName: '', pdfType: '' })}
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <div className="student-track-empty-state">
          <div className="student-track-empty-content">
            <User size={48} className="student-track-empty-icon" />
            <h3 className="student-track-empty-title">No Students Found</h3>
            <p className="student-track-empty-text">
              No students match your current filters. Try adjusting your search criteria.
            </p>
            <button 
              className="student-track-empty-btn"
              onClick={() => setFilters({
                department: '',
                branch: '',
                semester: '',
                nameSearch: '',
                ratingFilter: ''
              })}
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTrack;
