
import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, Edit, Trash2, Star, Award, TrendingUp, TrendingDown, Filter, X,
  Calendar, BarChart2, ChevronUp, ChevronDown, User, AlertCircle, HelpCircle,
  Book, Clipboard, Users, Shield, BadgePercent, Trophy
} from 'lucide-react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import './StaffTracker.css';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const StaffTracker = () => {
  // Initial data for educational institution
  const initialStaffData = [
    { id: 1, name: 'Dr. Sarah Johnson', department: 'Mathematics', type: 'Teaching', 
      role: 'Professor', attendance: 95, rating: 4.9, warnings: 0, classes: 5, lastEvaluation: '2023-05-15', 
      avatar: 'https://i.pravatar.cc/150?img=2', performance: 'Exceptional', yearsOfService: 8 },
    { id: 2, name: 'Michael Chen', department: 'Science', type: 'Teaching', 
      role: 'Associate Professor', attendance: 92, rating: 4.7, warnings: 0, classes: 4, lastEvaluation: '2023-04-20', 
      avatar: 'https://i.pravatar.cc/150?img=3', performance: 'Excellent', yearsOfService: 5 },
    { id: 3, name: 'Emily Davis', department: 'Administration', type: 'Non-Teaching', 
      role: 'Registrar', attendance: 88, rating: 4.5, warnings: 0, projects: 7, lastEvaluation: '2023-06-10', 
      avatar: 'https://i.pravatar.cc/150?img=4', performance: 'Outstanding', yearsOfService: 10 },
    { id: 4, name: 'David Wilson', department: 'IT', type: 'Non-Teaching', 
      role: 'System Administrator', attendance: 90, rating: 4.3, warnings: 0, projects: 5, lastEvaluation: '2023-03-05', 
      avatar: 'https://i.pravatar.cc/150?img=5', performance: 'Very Good', yearsOfService: 3 },
    { id: 5, name: 'Lisa Wong', department: 'English', type: 'Teaching', 
      role: 'Assistant Professor', attendance: 89, rating: 4.2, warnings: 1, classes: 6, lastEvaluation: '2023-06-22', 
      avatar: 'https://i.pravatar.cc/150?img=6', performance: 'Good', yearsOfService: 4 },
    { id: 6, name: 'Robert Garcia', department: 'Maintenance', type: 'Other Staff', 
      role: 'Facility Manager', attendance: 85, rating: 3.9, warnings: 0, projects: 3, lastEvaluation: '2023-05-30', 
      avatar: 'https://i.pravatar.cc/150?img=7', performance: 'Satisfactory', yearsOfService: 7 }
  ];

  const [staffData, setStaffData] = useState([]);
  const [filters, setFilters] = useState({
    department: 'all',
    type: 'all',
    role: 'all',
    search: '',
    ratingRange: [0, 5],
    performance: 'all'
  });
  const [editingStaff, setEditingStaff] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'rank', direction: 'asc' });
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Initialize and rank staff data
  useEffect(() => {
    const rankedData = initialStaffData
      .map(staff => ({
        ...staff,
        status: getStatus(staff),
        performanceTrend: Math.random() > 0.5 ? 'up' : 'down',
        rankScore: calculateRankScore(staff)
      }))
      .sort((a, b) => b.rankScore - a.rankScore)
      .map((staff, index) => ({ 
        ...staff, 
        rank: index + 1,
        percentile: Math.round(((initialStaffData.length - index) / initialStaffData.length) * 100)
      }));
    
    setStaffData(rankedData);
  }, []);

  // Calculate rank score
  const calculateRankScore = (staff) => {
    let score = staff.rating * 20;
    score += staff.attendance;
    score -= staff.warnings * 10;
    if (staff.type === 'Teaching') score += staff.classes * 2;
    else score += (staff.projects || 0) * 3;
    score += staff.yearsOfService;
    return score;
  };

  // Get staff status
  const getStatus = (staff) => {
    if (staff.rating >= 4.5) return 'excellent';
    if (staff.rating >= 4.0) return 'good';
    if (staff.rating >= 3.5) return 'average';
    return 'needs-improvement';
  };

  // Filter and sort data
  const filteredData = useMemo(() => {
    let result = [...staffData];
    
    if (filters.department !== 'all') {
      result = result.filter(staff => staff.department === filters.department);
    }
    
    if (filters.type !== 'all') {
      result = result.filter(staff => staff.type === filters.type);
    }
    
    if (filters.role !== 'all') {
      result = result.filter(staff => staff.role === filters.role);
    }
    
    if (filters.performance !== 'all') {
      result = result.filter(staff => staff.performance === filters.performance);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(staff => 
        staff.name.toLowerCase().includes(searchTerm) ||
        staff.department.toLowerCase().includes(searchTerm) ||
        staff.role.toLowerCase().includes(searchTerm)
      );
    }
    
    if (activeTab !== 'all') {
      result = result.filter(staff => staff.status === activeTab);
    }
    
    result = result.filter(staff => 
      staff.rating >= filters.ratingRange[0] && 
      staff.rating <= filters.ratingRange[1]
    );
    
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [staffData, filters, activeTab, sortConfig]);

  // Prepare chart data
  const chartData = useMemo(() => {
    const departmentCounts = {};
    const typeCounts = { 'Teaching': 0, 'Non-Teaching': 0, 'Other Staff': 0 };
    const performanceCounts = {};
    
    staffData.forEach(staff => {
      departmentCounts[staff.department] = (departmentCounts[staff.department] || 0) + 1;
      typeCounts[staff.type] = (typeCounts[staff.type] || 0) + 1;
      performanceCounts[staff.performance] = (performanceCounts[staff.performance] || 0) + 1;
    });
    
    return {
      department: {
        labels: Object.keys(departmentCounts),
        datasets: [{
          data: Object.values(departmentCounts),
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)', 'rgba(255, 99, 132, 0.7)', 'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)', 'rgba(255, 159, 64, 0.7)', 'rgba(255, 205, 86, 0.7)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)', 'rgba(255, 205, 86, 1)'
          ],
          borderWidth: 1,
        }]
      },
      type: {
        labels: Object.keys(typeCounts),
        datasets: [{
          data: Object.values(typeCounts),
          backgroundColor: [
            'rgba(75, 192, 192, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(255, 159, 64, 0.7)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1,
        }]
      },
      performance: {
        labels: Object.keys(performanceCounts),
        datasets: [{
          data: Object.values(performanceCounts),
          backgroundColor: [
            'rgba(46, 204, 113, 0.7)', 'rgba(52, 152, 219, 0.7)', 'rgba(155, 89, 182, 0.7)',
            'rgba(241, 196, 15, 0.7)', 'rgba(230, 126, 34, 0.7)'
          ],
          borderColor: [
            'rgba(46, 204, 113, 1)', 'rgba(52, 152, 219, 1)', 'rgba(155, 89, 182, 1)',
            'rgba(241, 196, 15, 1)', 'rgba(230, 126, 34, 1)'
          ],
          borderWidth: 1,
        }]
      }
    };
  }, [staffData]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingRangeChange = (min, max) => {
    setFilters(prev => ({ ...prev, ratingRange: [min, max] }));
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Staff CRUD operations
  const handleEdit = (staff) => {
    setEditingStaff(staff);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      setStaffData(prev => prev.filter(staff => staff.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedStaff = {
      ...editingStaff,
      name: formData.get('name'),
      department: formData.get('department'),
      type: formData.get('type'),
      role: formData.get('role'),
      attendance: Number(formData.get('attendance')),
      rating: Number(formData.get('rating')),
      warnings: Number(formData.get('warnings')),
      yearsOfService: Number(formData.get('yearsOfService')),
      lastEvaluation: formData.get('lastEvaluation')
    };
    
    if (updatedStaff.type === 'Teaching') {
      updatedStaff.classes = Number(formData.get('classes'));
    } else {
      updatedStaff.projects = Number(formData.get('projects'));
    }
    
    setStaffData(prev => 
      prev.map(staff => staff.id === updatedStaff.id ? {
        ...updatedStaff,
        status: getStatus(updatedStaff),
        rankScore: calculateRankScore(updatedStaff)
      } : staff)
    );
    
    setIsModalOpen(false);
  };

  // Helper functions
  const getPerformanceBadge = (performance) => {
    const badges = {
      'Exceptional': { color: 'staff-tracker__badge--exceptional', icon: <Trophy size={14} /> },
      'Outstanding': { color: 'staff-tracker__badge--outstanding', icon: <Award size={14} /> },
      'Excellent': { color: 'staff-tracker__badge--excellent', icon: <Star size={14} /> },
      'Very Good': { color: 'staff-tracker__badge--very-good', icon: <BadgePercent size={14} /> },
      'Good': { color: 'staff-tracker__badge--good', icon: <Book size={14} /> },
      'Satisfactory': { color: 'staff-tracker__badge--satisfactory', icon: <Clipboard size={14} /> }
    };
    return badges[performance] || { color: 'staff-tracker__badge--default', icon: <HelpCircle size={14} /> };
  };

  const getDepartmentIcon = (department) => {
    const icons = {
      'Mathematics': <Book size={14} />,
      'Science': <Book size={14} />,
      'English': <Book size={14} />,
      'Administration': <Shield size={14} />,
      'IT': <Shield size={14} />,
      'Library': <Book size={14} />,
      'Maintenance': <Users size={14} />
    };
    return icons[department] || <User size={14} />;
  };

  const getBestPerformers = (count = 3) => {
    return [...staffData].slice(0, count);
  };

  const bestPerformers = getBestPerformers();
  const departments = [...new Set(staffData.map(staff => staff.department))];
  const staffTypes = [...new Set(staffData.map(staff => staff.type))];
  const staffRoles = [...new Set(staffData.map(staff => staff.role))];
  const performances = [...new Set(staffData.map(staff => staff.performance))];

  // Sort indicator component
  const SortIndicator = ({ sortKey }) => {
    if (sortConfig.key !== sortKey) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  return (
    <div className="staff-tracker">
      {/* Header */}
      <header className="staff-tracker__header">
        <h1 className="staff-tracker__title">
          <Award className="staff-tracker__title-icon" /> 
          Educational Staff Performance Tracker
        </h1>
        
        <div className="staff-tracker__summary-cards">
          <div className="staff-tracker__summary-card staff-tracker__summary-card--total">
            <span className="staff-tracker__summary-count">{staffData.length}</span>
            <span className="staff-tracker__summary-label">Total Staff</span>
          </div>
          
          <div className="staff-tracker__summary-card staff-tracker__summary-card--teaching">
            <span className="staff-tracker__summary-count">
              {staffData.filter(s => s.type === 'Teaching').length}
            </span>
            <span className="staff-tracker__summary-label">
              <Book className="staff-tracker__summary-icon" /> Teaching
            </span>
          </div>
          
          <div className="staff-tracker__summary-card staff-tracker__summary-card--non-teaching">
            <span className="staff-tracker__summary-count">
              {staffData.filter(s => s.type === 'Non-Teaching').length}
            </span>
            <span className="staff-tracker__summary-label">
              <Shield className="staff-tracker__summary-icon" /> Non-Teaching
            </span>
          </div>
          
          <div className="staff-tracker__summary-card staff-tracker__summary-card--other">
            <span className="staff-tracker__summary-count">
              {staffData.filter(s => s.type === 'Other Staff').length}
            </span>
            <span className="staff-tracker__summary-label">
              <Users className="staff-tracker__summary-icon" /> Other Staff
            </span>
          </div>
          
          <div className="staff-tracker__summary-card staff-tracker__summary-card--warnings">
            <span className="staff-tracker__summary-count">
              {staffData.filter(s => s.warnings > 0).length}
            </span>
            <span className="staff-tracker__summary-label">With Warnings</span>
          </div>
        </div>
      </header>
      
      {/* Controls Section */}
      <div className="staff-tracker__controls">
        <div className="staff-tracker__search-box">
          <Search className="staff-tracker__search-icon" />
          <input
            type="text"
            name="search"
            placeholder="Search staff by name, department or role..."
            value={filters.search}
            onChange={handleFilterChange}
            className="staff-tracker__search-input"
          />
        </div>
        
        <button 
          className={`staff-tracker__filter-toggle ${showFilters ? 'staff-tracker__filter-toggle--active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="staff-tracker__filter-icon" /> 
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>
      
      {/* Filters Panel */}
      {showFilters && (
        <div className="staff-tracker__filters-panel">
          <div className="staff-tracker__filter-group">
            <label className="staff-tracker__filter-label">Department</label>
            <select 
              name="department" 
              value={filters.department}
              onChange={handleFilterChange}
              className="staff-tracker__filter-select"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div className="staff-tracker__filter-group">
            <label className="staff-tracker__filter-label">Staff Type</label>
            <select 
              name="type" 
              value={filters.type}
              onChange={handleFilterChange}
              className="staff-tracker__filter-select"
            >
              <option value="all">All Staff Types</option>
              {staffTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="staff-tracker__filter-group">
            <label className="staff-tracker__filter-label">Role</label>
            <select 
              name="role" 
              value={filters.role}
              onChange={handleFilterChange}
              className="staff-tracker__filter-select"
            >
              <option value="all">All Roles</option>
              {staffRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          
          <div className="staff-tracker__filter-group">
            <label className="staff-tracker__filter-label">Performance</label>
            <select 
              name="performance" 
              value={filters.performance}
              onChange={handleFilterChange}
              className="staff-tracker__filter-select"
            >
              <option value="all">All Performances</option>
              {performances.map(perf => (
                <option key={perf} value={perf}>{perf}</option>
              ))}
            </select>
          </div>
          
          <div className="staff-tracker__filter-group staff-tracker__filter-group--wide">
            <label className="staff-tracker__filter-label">
              Rating Range: {filters.ratingRange[0]} - {filters.ratingRange[1]}
            </label>
            <div className="staff-tracker__range-slider">
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={filters.ratingRange[0]}
                onChange={(e) => handleRatingRangeChange(parseFloat(e.target.value), filters.ratingRange[1])}
                className="staff-tracker__range-input"
              />
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={filters.ratingRange[1]}
                onChange={(e) => handleRatingRangeChange(filters.ratingRange[0], parseFloat(e.target.value))}
                className="staff-tracker__range-input"
              />
            </div>
          </div>
          
          <button 
            className="staff-tracker__clear-filters"
            onClick={() => setFilters({
              department: 'all',
              type: 'all',
              role: 'all',
              performance: 'all',
              search: '',
              ratingRange: [0, 5]
            })}
          >
            <X className="staff-tracker__clear-icon" /> Clear Filters
          </button>
        </div>
      )}
      
      {/* Tabs */}
      <div className="staff-tracker__tabs">
        <button 
          className={`staff-tracker__tab ${activeTab === 'all' ? 'staff-tracker__tab--active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Staff ({staffData.length})
        </button>
        <button 
          className={`staff-tracker__tab ${activeTab === 'excellent' ? 'staff-tracker__tab--active' : ''}`}
          onClick={() => setActiveTab('excellent')}
        >
          Excellent ({staffData.filter(s => s.status === 'excellent').length})
        </button>
        <button 
          className={`staff-tracker__tab ${activeTab === 'good' ? 'staff-tracker__tab--active' : ''}`}
          onClick={() => setActiveTab('good')}
        >
          Good ({staffData.filter(s => s.status === 'good').length})
        </button>
        <button 
          className={`staff-tracker__tab ${activeTab === 'average' ? 'staff-tracker__tab--active' : ''}`}
          onClick={() => setActiveTab('average')}
        >
          Average ({staffData.filter(s => s.status === 'average').length})
        </button>
        <button 
          className={`staff-tracker__tab ${activeTab === 'needs-improvement' ? 'staff-tracker__tab--active' : ''}`}
          onClick={() => setActiveTab('needs-improvement')}
        >
          Needs Help ({staffData.filter(s => s.status === 'needs-improvement').length})
        </button>
      </div>
      
      {/* Top Performers */}
      {bestPerformers.length > 0 && (
        <div className="staff-tracker__top-performers">
          <h3 className="staff-tracker__section-title">
            <Trophy className="staff-tracker__section-icon" /> Top Performers
          </h3>
          <div className="staff-tracker__performers-grid">
            {bestPerformers.map((staff, index) => (
              <div key={staff.id} className={`staff-tracker__performer-card staff-tracker__performer-card--${index + 1}`}>
                <div className="staff-tracker__performer-rank">{index + 1}</div>
                <div className="staff-tracker__performer-content">
                  <img src={staff.avatar} alt={staff.name} className="staff-tracker__performer-avatar" />
                  <div className="staff-tracker__performer-details">
                    <h4 className="staff-tracker__performer-name">{staff.name}</h4>
                    <p className="staff-tracker__performer-meta">
                      {getDepartmentIcon(staff.department)} {staff.department} • {staff.type}
                    </p>
                    <div className="staff-tracker__performer-performance">
                      <span className={`staff-tracker__performance-badge ${getPerformanceBadge(staff.performance).color}`}>
                        {getPerformanceBadge(staff.performance).icon} {staff.performance}
                      </span>
                    </div>
                    <div className="staff-tracker__performer-stats">
                      <div className="staff-tracker__performer-stat">
                        <Star className="staff-tracker__stat-icon staff-tracker__stat-icon--rating" />
                        <span>{staff.rating.toFixed(1)} Rating</span>
                      </div>
                      <div className="staff-tracker__performer-stat">
                        <Calendar className="staff-tracker__stat-icon staff-tracker__stat-icon--attendance" />
                        <span>{staff.attendance}% Attendance</span>
                      </div>
                      {staff.type === 'Teaching' ? (
                        <div className="staff-tracker__performer-stat">
                          <Book className="staff-tracker__stat-icon staff-tracker__stat-icon--classes" />
                          <span>{staff.classes} Classes</span>
                        </div>
                      ) : (
                        <div className="staff-tracker__performer-stat">
                          <Clipboard className="staff-tracker__stat-icon staff-tracker__stat-icon--projects" />
                          <span>{staff.projects} Projects</span>
                        </div>
                      )}
                      <div className="staff-tracker__performer-stat">
                        <User className="staff-tracker__stat-icon staff-tracker__stat-icon--years" />
                        <span>{staff.yearsOfService} Years</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Charts */}
      <div className="staff-tracker__charts">
        <div className="staff-tracker__chart-card">
          <h4 className="staff-tracker__chart-title">
            <BarChart2 className="staff-tracker__chart-icon" /> Staff by Department
          </h4>
          <div className="staff-tracker__chart-wrapper">
            <Bar 
              data={chartData.department} 
              options={{ 
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (context) => `${context.parsed.y} staff`
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                  }
                }
              }} 
            />
          </div>
        </div>  
        <div className="staff-tracker__chart-card">
          <h4 className="staff-tracker__chart-title">
            <Award className="staff-tracker__chart-icon" /> Performance Distribution
          </h4>
          <div className="staff-tracker__chart-wrapper">
            <Pie 
              data={chartData.performance} 
              options={{ 
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                  legend: { 
                    position: 'bottom',
                    labels: {
                      boxWidth: 12,
                      padding: 20,
                      font: { size: 12 }
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>
      
      {/* Staff Table */}
      <div className="staff-tracker__table-container">
        <div className="staff-tracker__table-responsive">
          <table className="staff-tracker__table">
            <thead className="staff-tracker__table-head">
              <tr>
                <th 
                  className="staff-tracker__table-header"
                  onClick={() => handleSort('rank')}
                >
                  <div className="staff-tracker__header-content">
                    Rank <SortIndicator sortKey="rank" />
                  </div>
                </th>
                <th 
                  className="staff-tracker__table-header"
                  onClick={() => handleSort('name')}
                >
                  <div className="staff-tracker__header-content">
                    Staff <SortIndicator sortKey="name" />
                  </div>
                </th>
                <th 
                  className="staff-tracker__table-header"
                  onClick={() => handleSort('department')}
                >
                  <div className="staff-tracker__header-content">
                    Department <SortIndicator sortKey="department" />
                  </div>
                </th>
                <th 
                  className="staff-tracker__table-header"
                  onClick={() => handleSort('type')}
                >
                  <div className="staff-tracker__header-content">
                    Type <SortIndicator sortKey="type" />
                  </div>
                </th>
                <th 
                  className="staff-tracker__table-header"
                  onClick={() => handleSort('attendance')}
                >
                  <div className="staff-tracker__header-content">
                    Attendance <SortIndicator sortKey="attendance" />
                  </div>
                </th>
                <th 
                  className="staff-tracker__table-header"
                  onClick={() => handleSort('rating')}
                >
                  <div className="staff-tracker__header-content">
                    Rating <SortIndicator sortKey="rating" />
                  </div>
                </th>
                <th 
                  className="staff-tracker__table-header"
                  onClick={() => handleSort('performance')}
                >
                  <div className="staff-tracker__header-content">
                    Performance <SortIndicator sortKey="performance" />
                  </div>
                </th>
                <th className="staff-tracker__table-header">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="staff-tracker__table-body">
              {filteredData.length > 0 ? (
                filteredData.map(staff => (
                  <tr 
                    key={staff.id} 
                    className={`staff-tracker__table-row staff-tracker__table-row--${staff.status}`}
                  >
                    <td className="staff-tracker__table-cell">
                      <div className="staff-tracker__rank-cell">
                        <span className="staff-tracker__rank-value">#{staff.rank}</span>
                        <span className="staff-tracker__rank-percentile">({staff.percentile}%)</span>
                      </div>
                    </td>
                    <td className="staff-tracker__table-cell">
                      <div className="staff-tracker__staff-cell">
                        <img src={staff.avatar} alt={staff.name} className="staff-tracker__staff-avatar" />
                        <div className="staff-tracker__staff-info">
                          <div className="staff-tracker__staff-name">{staff.name}</div>
                          <div className="staff-tracker__staff-role">{staff.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="staff-tracker__table-cell">
                      <div className="staff-tracker__department-cell">
                        {getDepartmentIcon(staff.department)}
                        <span className="staff-tracker__department-name">{staff.department}</span>
                      </div>
                    </td>
                    <td className="staff-tracker__table-cell">
                      <span className={`staff-tracker__type-badge staff-tracker__type-badge--${staff.type.toLowerCase().replace(' ', '-')}`}>
                        {staff.type}
                      </span>
                    </td>
                    <td className="staff-tracker__table-cell">
                      <div className="staff-tracker__attendance-cell">
                        <div className="staff-tracker__attendance-value">{staff.attendance}%</div>
                        <div className="staff-tracker__attendance-bar">
                          <div 
                            className={`staff-tracker__attendance-progress staff-tracker__attendance-progress--${
                              staff.attendance >= 90 ? 'excellent' :
                              staff.attendance >= 80 ? 'good' : 'poor'
                            }`}
                            style={{ width: `${staff.attendance}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="staff-tracker__table-cell">
                      <div className="staff-tracker__rating-cell">
                        <div className="staff-tracker__rating-stars">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`staff-tracker__rating-star ${
                                star <= Math.floor(staff.rating) ? 'staff-tracker__rating-star--filled' :
                                star === Math.ceil(staff.rating) && staff.rating % 1 >= 0.5 ? 'staff-tracker__rating-star--half' :
                                'staff-tracker__rating-star--empty'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="staff-tracker__rating-value">
                          {staff.rating.toFixed(1)}
                        </div>
                      </div>
                    </td>
                    <td className="staff-tracker__table-cell">
                      <span className={`staff-tracker__performance-badge ${getPerformanceBadge(staff.performance).color}`}>
                        {staff.performance}
                      </span>
                    </td>
                    <td className="staff-tracker__table-cell">
                      <div className="staff-tracker__actions-cell">
                        <button
                          onClick={() => handleEdit(staff)}
                          className="staff-tracker__action-btn staff-tracker__action-btn--edit"
                          title="Edit"
                        >
                          <Edit className="staff-tracker__action-icon" />
                        </button>
                        <button
                          onClick={() => handleDelete(staff.id)}
                          className="staff-tracker__action-btn staff-tracker__action-btn--delete"
                          title="Delete"
                        >
                          <Trash2 className="staff-tracker__action-icon" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="staff-tracker__table-row">
                  <td colSpan="8" className="staff-tracker__no-results">
                    No staff members match your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Edit Modal */}
      {isModalOpen && editingStaff && (
        <div className="staff-tracker__modal">
          <div className="staff-tracker__modal-content">
            <div className="staff-tracker__modal-header">
              <h2 className="staff-tracker__modal-title">Edit Staff Member</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="staff-tracker__modal-close"
              >
                <X className="staff-tracker__modal-close-icon" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="staff-tracker__modal-form">
              <div className="staff-tracker__form-grid">
                <div className="staff-tracker__form-group">
                  <label className="staff-tracker__form-label">Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    defaultValue={editingStaff.name}
                    required
                    className="staff-tracker__form-input"
                  />
                </div>
                
                <div className="staff-tracker__form-group">
                  <label className="staff-tracker__form-label">Department</label>
                  <select 
                    name="department" 
                    defaultValue={editingStaff.department}
                    required
                    className="staff-tracker__form-select"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                
                <div className="staff-tracker__form-group">
                  <label className="staff-tracker__form-label">Staff Type</label>
                  <select 
                    name="type" 
                    defaultValue={editingStaff.type}
                    required
                    className="staff-tracker__form-select"
                  >
                    <option value="Teaching">Teaching</option>
                    <option value="Non-Teaching">Non-Teaching</option>
                    <option value="Other Staff">Other Staff</option>
                  </select>
                </div>
                
                <div className="staff-tracker__form-group">
                  <label className="staff-tracker__form-label">Role/Position</label>
                  <input 
                    type="text" 
                    name="role" 
                    defaultValue={editingStaff.role}
                    required
                    className="staff-tracker__form-input"
                  />
                </div>
                
                <div className="staff-tracker__form-group">
                  <label className="staff-tracker__form-label">Attendance (%)</label>
                  <input 
                    type="number" 
                    name="attendance" 
                    min="0" 
                    max="100" 
                    defaultValue={editingStaff.attendance}
                    required
                    className="staff-tracker__form-input"
                  />
                </div>
                
                <div className="staff-tracker__form-group">
                  <label className="staff-tracker__form-label">Performance Rating (0-5)</label>
                  <input 
                    type="number" 
                    name="rating" 
                    min="0" 
                    max="5" 
                    step="0.1"
                    defaultValue={editingStaff.rating}
                    required
                    className="staff-tracker__form-input"
                  />
                </div>
                
                {editingStaff.type === 'Teaching' ? (
                  <div className="staff-tracker__form-group">
                    <label className="staff-tracker__form-label">Classes/Subjects</label>
                    <input 
                      type="number" 
                      name="classes" 
                      min="0" 
                      defaultValue={editingStaff.classes}
                      required
                      className="staff-tracker__form-input"
                    />
                  </div>
                ) : (
                  <div className="staff-tracker__form-group">
                    <label className="staff-tracker__form-label">Projects/Responsibilities</label>
                    <input 
                      type="number" 
                      name="projects" 
                      min="0" 
                      defaultValue={editingStaff.projects}
                      required
                      className="staff-tracker__form-input"
                    />
                  </div>
                )}
                
                <div className="staff-tracker__form-group">
                  <label className="staff-tracker__form-label">Years of Service</label>
                  <input 
                    type="number" 
                    name="yearsOfService" 
                    min="0" 
                    defaultValue={editingStaff.yearsOfService}
                    required
                    className="staff-tracker__form-input"
                  />
                </div>
                
                <div className="staff-tracker__form-group">
                  <label className="staff-tracker__form-label">Warnings</label>
                  <input 
                    type="number" 
                    name="warnings" 
                    min="0" 
                    defaultValue={editingStaff.warnings}
                    className="staff-tracker__form-input"
                  />
                </div>
                
                <div className="staff-tracker__form-group">
                  <label className="staff-tracker__form-label">Last Evaluation Date</label>
                  <input 
                    type="date" 
                    name="lastEvaluation" 
                    defaultValue={editingStaff.lastEvaluation}
                    required
                    className="staff-tracker__form-input"
                  />
                </div>
              </div>
              
              <div className="staff-tracker__form-actions">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="staff-tracker__form-cancel"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="staff-tracker__form-submit"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default StaffTracker;
