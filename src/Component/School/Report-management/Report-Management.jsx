import React, { useState, useEffect, useRef } from 'react';
import './Report-Management.css';

const ReportDashboard = () => {
  // State management
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newReport, setNewReport] = useState({
    title: '',
    type: 'academic',
    description: ''
  });
  const [selectedReport, setSelectedReport] = useState(null);
  const [notification, setNotification] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const modalRef = useRef(null);

  // Check for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
        setNewReport({ title: '', type: 'academic', description: '' });
        setSelectedReport(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mock data fetch - replace with actual API calls
  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call
      setTimeout(() => {
        setReports([
          { 
            id: 'rep-001', 
            title: 'Annual Academic Report', 
            type: 'academic', 
            date: '2023-06-15', 
            status: 'published', 
            author: 'Principal',
            views: 124,
            downloads: 87
          },
          { 
            id: 'rep-002', 
            title: 'Monthly Attendance', 
            type: 'attendance', 
            date: '2023-07-01', 
            status: 'pending', 
            author: 'Admin',
            views: 42,
            downloads: 15
          },
          { 
            id: 'rep-003', 
            title: 'Sports Day Report', 
            type: 'event', 
            date: '2023-05-20', 
            status: 'published', 
            author: 'Sports Teacher',
            views: 89,
            downloads: 56
          },
          { 
            id: 'rep-004', 
            title: 'Financial Quarter Report', 
            type: 'financial', 
            date: '2023-04-10', 
            status: 'archived', 
            author: 'Accountant',
            views: 67,
            downloads: 34
          },
          { 
            id: 'rep-005', 
            title: 'PTM Feedback Summary', 
            type: 'feedback', 
            date: '2023-06-28', 
            status: 'published', 
            author: 'Coordinator',
            views: 102,
            downloads: 78
          },
        ]);
        setLoading(false);
      }, 1500);
    };
    
    fetchData();
  }, []);

  // Sort reports
  const sortedReports = [...reports].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Filter reports based on active tab and search term
  const filteredReports = sortedReports.filter(report => {
    const matchesTab = activeTab === 'all' || report.type === activeTab;
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         report.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Report status counts for summary cards
  const statusCounts = reports.reduce((acc, report) => {
    acc[report.status] = (acc[report.status] || 0) + 1;
    return acc;
  }, {});

  // Handle create/update report
  const handleSubmitReport = () => {
    if (!newReport.title.trim()) {
      showNotification('Please enter a report title', 'error');
      return;
    }
    
    if (selectedReport) {
      // Update existing report
      setReports(reports.map(report => 
        report.id === selectedReport.id ? { ...report, ...newReport } : report
      ));
      showNotification('Report updated successfully!', 'success');
    } else {
      // Create new report
      const newId = `rep-${(reports.length + 1).toString().padStart(3, '0')}`;
      const today = new Date().toISOString().split('T')[0];
      
      const reportToAdd = {
        id: newId,
        title: newReport.title,
        type: newReport.type,
        date: today,
        status: 'pending',
        author: 'Current User',
        description: newReport.description,
        views: 0,
        downloads: 0
      };
      
      setReports([reportToAdd, ...reports]);
      showNotification('Report created successfully!', 'success');
    }
    
    setShowModal(false);
    setNewReport({ title: '', type: 'academic', description: '' });
    setSelectedReport(null);
  };

  // Handle action buttons
  const handleAction = (action, reportId) => {
    const report = reports.find(r => r.id === reportId);
    
    switch(action) {
      case 'view':
        setSelectedReport(report);
        break;
      case 'edit':
        setNewReport({
          title: report.title,
          type: report.type,
          description: report.description || ''
        });
        setSelectedReport(report);
        setShowModal(true);
        break;
      case 'download':
        // Simulate download
        setReports(reports.map(r => 
          r.id === reportId ? { ...r, downloads: r.downloads + 1 } : r
        ));
        showNotification(`Downloading report: ${report.title}`, 'info');
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete "${report.title}"?`)) {
          setReports(reports.filter(r => r.id !== reportId));
          showNotification('Report deleted successfully!', 'success');
        }
        break;
      case 'publish':
        setReports(reports.map(r => 
          r.id === reportId ? { ...r, status: 'published' } : r
        ));
        showNotification('Report published successfully!', 'success');
        break;
      default:
        break;
    }
  };

  // Handle sort
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Simplified action buttons for mobile
  const renderMobileActions = (reportId) => {
    return (
      <div className="mobile-actions">
        <select 
          onChange={(e) => handleAction(e.target.value, reportId)}
          className="mobile-action-select"
        >
          <option value="">Actions</option>
          <option value="view">View</option>
          <option value="edit">Edit</option>
          <option value="download">Download</option>
          <option value="delete">Delete</option>
        </select>
      </div>
    );
  };

  return (
    <div className="report-dashboard-container">
      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
          <button className="notification-close" onClick={() => setNotification(null)}>
            &times;
          </button>
        </div>
      )}

      {/* Header Section */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">
            <i className="fas fa-file-alt"></i> {isMobile ? 'Reports' : 'Report Management System'}
          </h1>
          {!isMobile && (
            <p className="dashboard-subtitle">Track and manage all school reports in one place</p>
          )}
        </div>
        <div className="header-actions">
          <button 
            className="btn-primary" 
            onClick={() => {
              setShowModal(true);
              setSelectedReport(null);
            }}
          >
            <i className="fas fa-plus"></i> {isMobile ? 'New' : 'Generate New Report'}
          </button>
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder={isMobile ? "Search..." : "Search reports..."} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="summary-cards-container">
        {[
          { id: 'total', title: isMobile ? 'Total' : 'Total Reports', count: reports.length, icon: 'file-alt', color: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
          { id: 'published', title: isMobile ? 'Published' : 'Published', count: statusCounts.published || 0, icon: 'check-circle', color: 'linear-gradient(135deg, #5efce8, #736efb)' },
          { id: 'pending', title: isMobile ? 'Pending' : 'Pending', count: statusCounts.pending || 0, icon: 'clock', color: 'linear-gradient(135deg, #fbc1cc, #fa709a)' },
          { id: 'archived', title: isMobile ? 'Archived' : 'Archived', count: statusCounts.archived || 0, icon: 'archive', color: 'linear-gradient(135deg, #a18cd1, #fbc2eb)' },
          { id: 'views', title: isMobile ? 'Views' : 'Total Views', count: reports.reduce((sum, report) => sum + report.views, 0), icon: 'eye', color: 'linear-gradient(135deg, #a6c1ee, #fbc2eb)' },
          { id: 'downloads', title: isMobile ? 'Downloads' : 'Total Downloads', count: reports.reduce((sum, report) => sum + report.downloads, 0), icon: 'download', color: 'linear-gradient(135deg, #ff9a9e, #fad0c4)' },
        ].map(card => (
          <div key={card.id} className="summary-card">
            <div className="card-icon" style={{ background: card.color }}>
              <i className={`fas fa-${card.icon}`}></i>
            </div>
            <div className="card-content">
              <h3>{card.title}</h3>
              <p className="count">{card.count}</p>
              <div className="card-progress"></div>
            </div>
            <div className="card-wave"></div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="main-content-area">
        {/* Filter Tabs */}
        <div className="filter-tabs">
          {['all', 'academic', 'attendance', 'financial', 'event', 'feedback'].map(type => (
            <button
              key={type}
              className={`tab-btn ${activeTab === type ? 'active' : ''}`}
              onClick={() => setActiveTab(type)}
            >
              {type === 'all' ? (isMobile ? 'All' : 'All Reports') : isMobile ? type.slice(0, 3) : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Reports Table */}
        {loading ? (
          <div className="loading-animation">
            <div className="spinner"></div>
            <p>Loading reports...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <i className="fas fa-file-excel"></i>
            </div>
            <h3>No reports found</h3>
            <p className="empty-state-text">
              {searchTerm ? 'Try a different search term' : 'Create your first report'}
            </p>
            <button 
              className="btn-primary"
              onClick={() => setShowModal(true)}
            >
              <i className="fas fa-plus"></i> Create Report
            </button>
          </div>
        ) : (
          <div className="reports-table-container">
            {isMobile ? (
              <div className="mobile-reports-list">
                {filteredReports.map((report) => (
                  <div key={report.id} className="mobile-report-card">
                    <div className="mobile-report-header">
                      <h3>{report.title}</h3>
                      <span className={`status-badge ${report.status}`}>
                        {report.status}
                      </span>
                    </div>
                    <div className="mobile-report-details">
                      <div>
                        <small>Type</small>
                        <span className={`type-badge ${report.type}`}>
                          {report.type}
                        </span>
                      </div>
                      <div>
                        <small>Date</small>
                        <span>{formatDate(report.date)}</span>
                      </div>
                      <div>
                        <small>Author</small>
                        <span>{report.author}</span>
                      </div>
                    </div>
                    <div className="mobile-report-stats">
                      <div>
                        <small>Views</small>
                        <span>{report.views}</span>
                      </div>
                      <div>
                        <small>Downloads</small>
                        <span>{report.downloads}</span>
                      </div>
                    </div>
                    {renderMobileActions(report.id)}
                  </div>
                ))}
              </div>
            ) : (
              <table className="reports-table">
                <thead>
                  <tr>
                    {[
                      { key: 'id', label: 'Report ID' },
                      { key: 'title', label: 'Title' },
                      { key: 'type', label: 'Type' },
                      { key: 'date', label: 'Date' },
                      { key: 'author', label: 'Author' },
                      { key: 'status', label: 'Status' },
                      { key: 'views', label: 'Views' },
                      { key: 'downloads', label: 'Downloads' },
                      { key: 'actions', label: 'Actions' },
                    ].map(column => (
                      <th 
                        key={column.key}
                        onClick={() => column.key !== 'actions' && requestSort(column.key)}
                        className={sortConfig.key === column.key ? `sort-${sortConfig.direction}` : ''}
                      >
                        {column.label}
                        {column.key !== 'actions' && (
                          <i className={`fas fa-sort${sortConfig.key === column.key ? `-${sortConfig.direction === 'asc' ? 'up' : 'down'}` : ''}`}></i>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="report-row">
                      <td className="report-id">{report.id}</td>
                      <td className="report-title">{report.title}</td>
                      <td className="report-type">
                        <span className={`type-badge ${report.type}`}>
                          {report.type}
                        </span>
                      </td>
                      <td className="report-date">{formatDate(report.date)}</td>
                      <td className="report-author">{report.author}</td>
                      <td className="report-status">
                        <span className={`status-badge ${report.status}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="report-views">{report.views}</td>
                      <td className="report-downloads">{report.downloads}</td>
                      <td className="report-actions">
                        <div className="action-buttons">
                          <button 
                            className="action-btn view-btn"
                            onClick={() => handleAction('view', report.id)}
                            data-tooltip="View Report"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button 
                            className="action-btn edit-btn"
                            onClick={() => handleAction('edit', report.id)}
                            data-tooltip="Edit Report"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          {report.status !== 'published' && (
                            <button 
                              className="action-btn publish-btn"
                              onClick={() => handleAction('publish', report.id)}
                              data-tooltip="Publish Report"
                            >
                              <i className="fas fa-upload"></i>
                            </button>
                          )}
                          <button 
                            className="action-btn download-btn"
                            onClick={() => handleAction('download', report.id)}
                            data-tooltip="Download Report"
                          >
                            <i className="fas fa-download"></i>
                          </button>
                          <button 
                            className="action-btn delete-btn"
                            onClick={() => handleAction('delete', report.id)}
                            data-tooltip="Delete Report"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Recent Activity Sidebar - Hidden on mobile */}
      {!isMobile && (
        <div className="activity-sidebar">
          <h2 className="sidebar-title">
            <i className="fas fa-history"></i> Recent Activity
          </h2>
          <ul className="activity-list">
            {[
              { icon: 'file-upload', text: 'New attendance report uploaded', time: '2 hours ago' },
              { icon: 'user-edit', text: 'Principal edited annual report', time: '1 day ago' },
              { icon: 'check-circle', text: 'PTM feedback report published', time: '2 days ago' },
              { icon: 'download', text: 'Financial report downloaded 15 times', time: '3 days ago' },
              { icon: 'trash', text: 'Old sports report archived', time: '1 week ago' },
            ].map((activity, index) => (
              <li key={index} className="activity-item">
                <div className="activity-icon">
                  <i className={`fas fa-${activity.icon}`}></i>
                </div>
                <div className="activity-content">
                  <p>{activity.text}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="modal-overlay">
          <div className={`modal-container ${isMobile ? 'mobile-modal' : 'detail-modal'}`} ref={modalRef}>
            <div className="modal-header">
              <h2>
                <i className={`fas fa-file-${selectedReport.status === 'published' ? 'pdf' : 'alt'}`}></i>
                {isMobile ? selectedReport.title.length > 20 
                  ? `${selectedReport.title.substring(0, 20)}...` 
                  : selectedReport.title
                : selectedReport.title}
              </h2>
              <button 
                className="modal-close-btn"
                onClick={() => setSelectedReport(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className={`report-detail-grid ${isMobile ? 'mobile-detail-grid' : ''}`}>
                <div className="detail-item">
                  <label>Report ID</label>
                  <p>{selectedReport.id}</p>
                </div>
                <div className="detail-item">
                  <label>Type</label>
                  <p><span className={`type-badge ${selectedReport.type}`}>{selectedReport.type}</span></p>
                </div>
                <div className="detail-item">
                  <label>Date</label>
                  <p>{formatDate(selectedReport.date)}</p>
                </div>
                <div className="detail-item">
                  <label>Author</label>
                  <p>{selectedReport.author}</p>
                </div>
                <div className="detail-item">
                  <label>Status</label>
                  <p><span className={`status-badge ${selectedReport.status}`}>{selectedReport.status}</span></p>
                </div>
                <div className="detail-item">
                  <label>Views</label>
                  <p>{selectedReport.views}</p>
                </div>
                <div className="detail-item">
                  <label>Downloads</label>
                  <p>{selectedReport.downloads}</p>
                </div>
              </div>
              <div className="detail-item full-width">
                <label>Description</label>
                <div className="report-description">
                  {selectedReport.description || 'No description provided'}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => {
                  setSelectedReport(null);
                  setNewReport({ title: '', type: 'academic', description: '' });
                }}
              >
                Close
              </button>
              <div className="action-buttons">
                <button 
                  className="btn-primary"
                  onClick={() => handleAction('download', selectedReport.id)}
                >
                  <i className="fas fa-download"></i> {!isMobile && 'Download'}
                </button>
                <button 
                  className="btn-primary"
                  onClick={() => handleAction('edit', selectedReport.id)}
                >
                  <i className="fas fa-edit"></i> {!isMobile && 'Edit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Report Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className={`modal-container ${isMobile ? 'mobile-modal' : ''}`} ref={modalRef}>
            <div className="modal-header">
              <h2>
                <i className="fas fa-file-alt"></i>
                {selectedReport ? 'Edit Report' : 'Create New Report'}
              </h2>
              <button 
                className="modal-close-btn"
                onClick={() => {
                  setShowModal(false);
                  setNewReport({ title: '', type: 'academic', description: '' });
                  setSelectedReport(null);
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Report Title</label>
                <input
                  type="text"
                  placeholder="Enter report title"
                  value={newReport.title}
                  onChange={(e) => setNewReport({...newReport, title: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Report Type</label>
                <select
                  value={newReport.type}
                  onChange={(e) => setNewReport({...newReport, type: e.target.value})}
                >
                  <option value="academic">Academic</option>
                  <option value="attendance">Attendance</option>
                  <option value="financial">Financial</option>
                  <option value="event">Event</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Enter report description"
                  rows="4"
                  value={newReport.description}
                  onChange={(e) => setNewReport({...newReport, description: e.target.value})}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => {
                  setShowModal(false);
                  setNewReport({ title: '', type: 'academic', description: '' });
                  setSelectedReport(null);
                }}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={handleSubmitReport}
              >
                {selectedReport ? 'Update' : 'Create'} Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportDashboard;