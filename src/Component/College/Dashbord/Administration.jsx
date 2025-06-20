import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import "../../../assets/css/Administration.css"
const AdministrationDashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(27);
  const [admissionProgress, setAdmissionProgress] = useState(0);
  const [feeProgress, setFeeProgress] = useState(0);
  const [syllabusProgress, setSyllabusProgress] = useState(0);
  const [sportsProgress, setSportsProgress] = useState(0);

  // Animation effect for progress circles
  useEffect(() => {
    const timer = setTimeout(() => {
      setAdmissionProgress(90);
      setFeeProgress(50);
      setSyllabusProgress(80);
      setSportsProgress(100);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Generate calendar days for June 2024
  const generateCalendarDays = () => {
    const daysInMonth = 30; // June has 30 days
    const startDay = 6; // June 1, 2024 started on Saturday (6)
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Student Performance Chart Data
  const performanceData = [
    { month: 'JAN', math: 20, science: 15 },
    { month: 'FEB', math: 30, science: 25 },
    { month: 'MAR', math: 45, science: 35 },
    { month: 'APR', math: 55, science: 45 },
    { month: 'MAY', math: 65, science: 55 },
    { month: 'JUN', math: 75, science: 65 },
    { month: 'JUL', math: 70, science: 60 },
    { month: 'AUG', math: 80, science: 70 },
    { month: 'SEP', math: 85, science: 75 },
    { month: 'OCT', math: 90, science: 80 },
    { month: 'NOV', math: 95, science: 85 },
    { month: 'DEC', math: 100, science: 90 }
  ];

  // Revenue Data for area chart
  const revenueData = [
    { month: 'Jan', value: 200 },
    { month: 'Feb', value: 150 },
    { month: 'Mar', value: 300 },
    { month: 'Apr', value: 250 },
    { month: 'May', value: 400 },
    { month: 'Jun', value: 350 },
    { month: 'Jul', value: 450 },
    { month: 'Aug', value: 500 },
    { month: 'Sep', value: 550 },
    { month: 'Oct', value: 600 },
    { month: 'Nov', value: 650 },
    { month: 'Dec', value: 700 }
  ];

  const ProgressCircle = ({ percentage, color, label, size = 120 }) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="progress-container">
        <div className="progress-circle-wrapper">
          <svg width={size} height={size} className="progress-svg">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#f0f0f0"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={color}
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="progress-bar"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </svg>
          <div className="progress-text">
            <span className="progress-percentage">{percentage}%</span>
          </div>
        </div>
        <div className="progress-label">{label}</div>
      </div>
    );
  };

  return (
    <div className="dashboard">
    

      {/* Header */}
      <div className="header">
        <h1>Administration Dashboard</h1>
        <div className="search-container">
          <Search className="search-icon" size={16} />
          <input 
            type="text" 
            placeholder="Search Here" 
            className="search-input"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-number">3256</div>
          <div className="stat-label">Students</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-number">250</div>
          <div className="stat-label">Faculties</div>
        </div>
        <div className="stat-card green">
          <div className="stat-number">150</div>
          <div className="stat-label">Courses</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-number">3,47,500</div>
          <div className="stat-label">Revenue</div>
        </div>
      </div>

      {/* Progress Cards and Calendar */}
      <div className="content-grid">
        <div className="progress-grid">
          <div className="progress-card">
            <ProgressCircle 
              percentage={admissionProgress} 
              color="#3b82f6" 
              label="Admissions" 
            />
          </div>
          <div className="progress-card">
            <ProgressCircle 
              percentage={feeProgress} 
              color="#ef4444" 
              label="Fees Collection" 
            />
          </div>
          <div className="progress-card">
            <ProgressCircle 
              percentage={syllabusProgress} 
              color="#8b5cf6" 
              label="Syllabus" 
            />
          </div>
          <div className="progress-card">
            <ProgressCircle 
              percentage={sportsProgress} 
              color="#f59e0b" 
              label="Sports Activity" 
            />
          </div>
        </div>

        {/* Calendar */}
        <div className="calendar-container">
          <div className="calendar-header">
            <h3 className="calendar-title">Calendar</h3>
            <div className="calendar-nav">
              <button className="nav-button">
                <ChevronLeft size={16} />
              </button>
              <span className="month-year">June 2024</span>
              <button className="nav-button">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          
          <div className="calendar-weekdays">
            {dayNames.map(day => (
              <div key={day} className="weekday">{day}</div>
            ))}
          </div>
          
          <div className="calendar-days">
            {calendarDays.map((day, index) => (
              <div 
                key={index}
                className={`calendar-day ${
                  day === 15 ? 'highlighted' : ''
                } ${day === selectedDate ? 'selected' : ''}`}
                onClick={() => day && setSelectedDate(day)}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>

    
    </div>
  );
};

export default AdministrationDashboard;