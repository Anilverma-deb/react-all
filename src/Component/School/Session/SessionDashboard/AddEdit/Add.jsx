
import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Power, Download, Calendar as CalendarIcon, Clock, CheckCircle, XCircle, Filter, ChevronRight } from 'lucide-react';
import * as XLSX from 'xlsx';

const DataMigrationModal = ({ oldSession, newSession, onClose, onMigrate }) => {
  const [selectedItems, setSelectedItems] = useState({});
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationComplete, setMigrationComplete] = useState(false);

  const migratableData = {
    'user_preferences': ['Theme settings', 'Notification preferences', 'Dashboard layout'],
    'course_progress': ['Completed lessons', 'Quiz scores', 'Assignment submissions'],
    'saved_content': ['Bookmarked pages', 'Saved notes', 'Downloaded materials'],
    'activity_history': ['Recent views', 'Search history', 'Interaction logs']
  };

  useState(() => {
    const initialSelection = {};
    Object.keys(migratableData).forEach(key => {
      initialSelection[key] = true;
    });
    setSelectedItems(initialSelection);
  }, []);

  const handleToggle = (dataType) => {
    setSelectedItems(prev => ({
      ...prev,
      [dataType]: !prev[dataType]
    }));
  };

  const toggleSelectAll = (select) => {
    const newSelection = {};
    Object.keys(migratableData).forEach(key => {
      newSelection[key] = select;
    });
    setSelectedItems(newSelection);
  };

  const handleMigrate = async () => {
    setIsMigrating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsMigrating(false);
    setMigrationComplete(true);
    onMigrate(Object.keys(selectedItems).filter(key => selectedItems[key]));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="session-management-modal-overlay">
      <div className="session-management-modal-container">
        <div className="session-management-modal-content">
          <div className="session-management-modal-header">
            <h3 className="session-management-modal-title">Migrate Session Data</h3>
            <button className="session-management-close-btn" onClick={onClose}>
              <span className="session-management-close-icon">×</span>
            </button>
          </div>
          
          <div className="session-management-modal-body">
            <div className="migration-session-info">
              <div className="migration-from-session">
                <span className="migration-session-label">From:</span>
                <strong>{oldSession.name}</strong>
                <span className="migration-session-dates">{formatDate(oldSession.startDate)} - {formatDate(oldSession.endDate)}</span>
              </div>
              
              <ChevronRight className="migration-arrow" />
              
              <div className="migration-to-session">
                <span className="migration-session-label">To:</span>
                <strong>{newSession.name}</strong>
                <span className="migration-session-dates">{formatDate(newSession.startDate)} - {formatDate(newSession.endDate)}</span>
              </div>
            </div>
            
            <div className="migration-instructions">
              <p>Select which data you want to migrate from the previous session:</p>
            </div>
            
            <div className="migration-controls">
              <button 
                onClick={() => toggleSelectAll(true)}
                className="migration-control-btn"
              >
                Select All
              </button>
              <button 
                onClick={() => toggleSelectAll(false)}
                className="migration-control-btn"
              >
                Deselect All
              </button>
            </div>
            
            <div className="migration-data-list">
              {Object.entries(migratableData).map(([dataType, items]) => (
                <div key={dataType} className="migration-data-item">
                  <label className="migration-checkbox-container">
                    <input
                      type="checkbox"
                      checked={selectedItems[dataType] || false}
                      onChange={() => handleToggle(dataType)}
                      disabled={isMigrating}
                    />
                    <span className="migration-checkmark"></span>
                    <span className="migration-data-type">
                      {dataType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      <span className="migration-data-count">{items.length} items</span>
                    </span>
                  </label>
                  
                  <div className="migration-data-details">
                    {items.map((item, index) => (
                      <span key={index} className="migration-data-detail-item">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="session-management-modal-actions">
            <button 
              type="button" 
              className="session-management-cancel-btn" 
              onClick={onClose}
              disabled={isMigrating}
            >
              Cancel
            </button>
            <button
              type="button"
              className="session-management-submit-btn"
              onClick={handleMigrate}
              disabled={isMigrating || migrationComplete || Object.values(selectedItems).every(v => !v)}
            >
              {isMigrating ? 'Migrating...' : migrationComplete ? 'Migration Complete!' : 'Start Migration'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SessionManagement = () => {
  const [sessions, setSessions] = useState([
    {
      id: 1,
      name: 'Spring 2024',
      startDate: '2024-03-01',
      endDate: '2024-06-30',
      isActive: true,
      createdAt: '2024-02-15'
    },
    {
      id: 2,
      name: 'Summer 2024',
      startDate: '2024-07-01',
      endDate: '2024-08-31',
      isActive: false,
      createdAt: '2024-06-15'
    },
    {
      id: 3,
      name: 'Fall 2024',
      startDate: '2024-09-01',
      endDate: '2024-12-31',
      isActive: false,
      createdAt: '2024-08-15'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMigrationModal, setShowMigrationModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [migrationSourceSession, setMigrationSourceSession] = useState(null);
  const [migrationTargetSession, setMigrationTargetSession] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    isActive: false
  });

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && session.isActive) ||
                         (statusFilter === 'inactive' && !session.isActive);
    return matchesSearch && matchesStatus;
  });

  const openMigrationModal = (sourceSession, targetSession) => {
    setMigrationSourceSession(sourceSession);
    setMigrationTargetSession(targetSession);
    setShowMigrationModal(true);
  };

  const handleMigrationComplete = (migratedDataTypes) => {
    console.log(`Migrating ${migratedDataTypes.length} data types from session ${migrationSourceSession.id} to ${migrationTargetSession.id}`);
    setShowMigrationModal(false);
    alert(`Successfully migrated ${migratedDataTypes.length} data types to ${migrationTargetSession.name}`);
  };

  const toggleActiveStatus = (id) => {
    const newSessions = sessions.map(s => ({
      ...s,
      isActive: s.id === id ? !s.isActive : false
    }));
    
    const activatingSession = sessions.find(s => s.id === id);
    if (activatingSession && !activatingSession.isActive) {
      const previouslyActiveSession = sessions.find(s => s.isActive);
      if (previouslyActiveSession) {
        if (confirm(`Would you like to migrate data from ${previouslyActiveSession.name} to ${activatingSession.name}?`)) {
          openMigrationModal(previouslyActiveSession, activatingSession);
        }
      }
    }
    
    setSessions(newSessions);
  };

  const renderMigrationAction = (session) => {
    const activeSession = sessions.find(s => s.isActive);
    if (!activeSession || activeSession.id === session.id) return null;
    
    return (
      <button
        className="session-management-action-btn session-management-migrate-btn"
        onClick={() => openMigrationModal(session, activeSession)}
        title="Migrate to current session"
      >
        <ChevronRight size={16} />
      </button>
    );
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.startDate || !formData.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      alert('End date must be after start date');
      return;
    }
    
    if (editingSession) {
      setSessions(prev => prev.map(s => 
        s.id === editingSession.id ? { ...s, ...formData } : s
      ));
    } else {
      const newSession = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setSessions(prev => [...prev, newSession]);
    }
    
    closeModal();
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingSession(null);
    setFormData({
      name: '',
      startDate: '',
      endDate: '',
      isActive: false
    });
  };

  const openEditModal = (session) => {
    setEditingSession(session);
    setFormData({
      name: session.name,
      startDate: session.startDate,
      endDate: session.endDate,
      isActive: session.isActive
    });
    setShowAddModal(true);
  };

  const handleDelete = () => {
    setSessions(prev => prev.filter(s => s.id !== sessionToDelete.id));
    setShowDeleteModal(false);
    setSessionToDelete(null);
  };

  const exportToExcel = () => {
    const exportData = filteredSessions.map(session => ({
      'Session Name': session.name,
      'Start Date': session.startDate,
      'End Date': session.endDate,
      'Status': session.isActive ? 'Active' : 'Inactive',
      'Created Date': session.createdAt
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sessions');
    XLSX.writeFile(wb, 'sessions.xlsx');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="session-management">
      {/* Header */}
      <div className="session-management-header">
        <div className="session-management-header-content">
          <h2 className="session-management-page-title">
            <CalendarIcon className="session-management-title-icon" />
            Session Management
          </h2>
          <p className="session-management-page-subtitle">Manage academic sessions and their status</p>
        </div>
        <button 
          className="session-management-export-btn"
          onClick={exportToExcel}
        >
          <Download size={18} />
          <span className="session-management-btn-text">Export</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="session-management-filter-bar">
        <div className="session-management-search-container">
          <Search className="session-management-search-icon" />
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="session-management-search-input"
          />
        </div>
        
        <div className="session-management-filter-container">
          <Filter className="session-management-filter-icon" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="session-management-filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <button 
          className="session-management-add-btn"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={18} />
          <span className="session-management-btn-text">Add Session</span>
        </button>
      </div>

      {/* Sessions Table */}
      <div className="session-management-table-container">
        <div className="session-management-table-wrapper">
          <table className="session-management-sessions-table">
            <thead>
              <tr>
                <th>Session Name</th>
                <th className="session-management-date-header">Start Date</th>
                <th className="session-management-date-header">End Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map(session => (
                <tr key={session.id} className="session-management-table-row">
                  <td className="session-management-session-name">
                    <div className="session-management-name-container">
                      <span className="session-management-name-text">{session.name}</span>
                      <span className="session-management-created-date">Created: {formatDate(session.createdAt)}</span>
                    </div>
                  </td>
                  <td className="session-management-date-cell">
                    <div className="session-management-date-container">
                      <Clock size={14} />
                      <span className="session-management-date-text">{formatDate(session.startDate)}</span>
                    </div>
                  </td>
                  <td className="session-management-date-cell">
                    <div className="session-management-date-container">
                      <Clock size={14} />
                      <span className="session-management-date-text">{formatDate(session.endDate)}</span>
                    </div>
                  </td>
                  <td className="session-management-status-cell">
                    <span className={`session-management-status-badge ${session.isActive ? 'session-management-active' : 'session-management-inactive'}`}>
                      {session.isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      <span className="session-management-status-text">{session.isActive ? 'Active' : 'Inactive'}</span>
                    </span>
                  </td>
                  <td className="session-management-actions-cell">
                    <div className="session-management-action-buttons">
                      {renderMigrationAction(session)}
                      <button
                        className="session-management-action-btn session-management-edit-btn"
                        onClick={() => openEditModal(session)}
                        title="Edit Session"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className={`session-management-action-btn session-management-activate-btn ${session.isActive ? 'session-management-active' : ''}`}
                        onClick={() => toggleActiveStatus(session.id)}
                        title={session.isActive ? 'Deactivate' : 'Activate'}
                      >
                        <Power size={16} />
                      </button>
                      <button
                        className="session-management-action-btn session-management-delete-btn"
                        onClick={() => {
                          setSessionToDelete(session);
                          setShowDeleteModal(true);
                        }}
                        title="Delete Session"
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
        
        {filteredSessions.length === 0 && (
          <div className="session-management-empty-state">
            <CalendarIcon size={48} />
            <h3>No sessions found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="session-management-modal-overlay">
          <div className="session-management-modal-container">
            <div className="session-management-modal-content">
              <div className="session-management-modal-header">
                <h3 className="session-management-modal-title">{editingSession ? 'Edit Session' : 'Add New Session'}</h3>
                <button className="session-management-close-btn" onClick={closeModal}>
                  <span className="session-management-close-icon">×</span>
                </button>
              </div>
              
              <div className="session-management-modal-body">
                <div className="session-management-modal-form">
                  <div className="session-management-form-group">
                    <label className="session-management-form-label">
                      Session Name <span className="session-management-required">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter session name"
                      className="session-management-form-input"
                    />
                  </div>
                  
                  <div className="session-management-form-row">
                    <div className="session-management-form-group">
                      <label className="session-management-form-label">
                        Start Date <span className="session-management-required">*</span>
                      </label>
                      <div className="session-management-date-input-wrapper">
                        <CalendarIcon className="session-management-date-icon" size={16} />
                        <input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                          className="session-management-date-input"
                        />
                      </div>
                    </div>
                    
                    <div className="session-management-form-group">
                      <label className="session-management-form-label">
                        End Date <span className="session-management-required">*</span>
                      </label>
                      <div className="session-management-date-input-wrapper">
                        <CalendarIcon className="session-management-date-icon" size={16} />
                        <input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                          className="session-management-date-input"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="session-management-form-group">
                    <label className="session-management-checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        className="session-management-checkbox-input"
                      />
                      <span className="session-management-checkbox-text">Set as Active Session</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="session-management-modal-actions">
                <button type="button" className="session-management-cancel-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="button" className="session-management-submit-btn" onClick={handleSubmit}>
                  {editingSession ? 'Update Session' : 'Add Session'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="session-management-modal-overlay">
          <div className="session-management-modal-container">
            <div className="session-management-modal-content session-management-delete-modal">
              <div className="session-management-modal-header">
                <h3 className="session-management-modal-title">Confirm Delete</h3>
                <button className="session-management-close-btn" onClick={() => setShowDeleteModal(false)}>
                  <span className="session-management-close-icon">×</span>
                </button>
              </div>
              
              <div className="session-management-modal-body">
                <div className="session-management-warning-icon">
                  <Trash2 size={48} />
                </div>
                <div className="session-management-warning-content">
                  <p className="session-management-warning-message">Are you sure you want to delete the session:</p>
                  <strong className="session-management-session-name-delete">"{sessionToDelete?.name}"</strong>
                  <p className="session-management-warning-text">This action cannot be undone.</p>
                </div>
              </div>
              
              <div className="session-management-modal-actions">
                <button 
                  className="session-management-cancel-btn"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="session-management-delete-confirm-btn"
                  onClick={handleDelete}
                >
                  Delete Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Migration Modal */}
      {showMigrationModal && (
        <DataMigrationModal
          oldSession={migrationSourceSession}
          newSession={migrationTargetSession}
          onClose={() => setShowMigrationModal(false)}
          onMigrate={handleMigrationComplete}
        />
      )}

      <style jsx>{`
        /* Base Styles */
        .session-management {
          padding: 16px;
          background: #f8fafc;
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* Header Section */
        .session-management-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          padding: 0 4px;
          gap: 16px;
        }

        .session-management-header-content {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
          min-width: 0;
        }

        .session-management-page-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .session-management-title-icon {
          color: #3b82f6;
          flex-shrink: 0;
        }

        .session-management-page-subtitle {
          color: #64748b;
          font-size: 14px;
          margin: 0;
        }

        .session-management-export-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          font-size: 14px;
        }

        .session-management-export-btn:hover {
          background: #059669;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
        }

        .session-management-btn-text {
          display: block;
        }

        /* Filter Bar */
        .session-management-filter-bar {
          display: flex;
          gap: 12px;
          align-items: center;
          background: white;
          padding: 16px;
          border-radius: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          margin-bottom: 20px;
          border: 1px solid #e2e8f0;
          flex-wrap: wrap;
        }

        .session-management-search-container {
          position: relative;
          flex: 1;
          min-width: 200px;
        }

        .session-management-search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          pointer-events: none;
          z-index: 1;
        }

        .session-management-search-input {
          width: 100%;
          padding: 10px 12px 10px 40px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          background: #f8fafc;
          transition: all 0.2s ease;
        }

        .session-management-search-input:focus {
          outline: none;
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .session-management-filter-container {
          position: relative;
          display: flex;
          align-items: center;
          min-width: 120px;
        }

        .session-management-filter-icon {
          position: absolute;
          left: 12px;
          color: #64748b;
          pointer-events: none;
          z-index: 1;
        }

        .session-management-filter-select {
          width: 100%;
          padding: 10px 12px 10px 40px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          background: #f8fafc;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .session-management-filter-select:focus {
          outline: none;
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .session-management-add-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          font-size: 14px;
        }

        .session-management-add-btn:hover {
          background: #2563eb;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }

        /* Table Styles */
        .session-management-table-container {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }

        .session-management-table-wrapper {
          overflow-x: auto;
          width: 100%;
        }

        .session-management-sessions-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px;
        }

        .session-management-sessions-table th {
          background: #f8fafc;
          padding: 16px 20px;
          text-align: left;
          font-weight: 600;
          color: #374151;
          border-bottom: 2px solid #e2e8f0;
          font-size: 14px;
          position: sticky;
          top: 0;
          z-index: 1;
        }

        .session-management-sessions-table td {
          padding: 16px 20px;
          border-bottom: 1px solid #e2e8f0;
          vertical-align: middle;
        }

        .session-management-table-row {
          transition: all 0.2s ease;
        }

        .session-management-table-row:hover {
          background: #f8fafc;
        }

        .session-management-session-name {
          min-width: 200px;
        }

        .session-management-name-container {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .session-management-name-text {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        .session-management-created-date {
          font-size: 12px;
          color: #64748b;
        }

        .session-management-date-cell {
          color: #64748b;
          font-size: 14px;
          min-width: 140px;
        }

        .session-management-date-container {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .session-management-date-text {
          white-space: nowrap;
        }

        .session-management-status-cell {
          font-size: 14px;
          min-width: 120px;
        }

        .session-management-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .session-management-status-badge.session-management-active {
          background: #dcfce7;
          color: #166534;
        }

        .session-management-status-badge.session-management-inactive {
          background: #fef2f2;
          color: #dc2626;
        }

        .session-management-status-text {
          display: block;
        }

        .session-management-actions-cell {
          width: 140px;
          min-width: 140px;
        }

        .session-management-action-buttons {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .session-management-action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #f1f5f9;
          color: #64748b;
          flex-shrink: 0;
        }

        .session-management-action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .session-management-migrate-btn {
          background: #f1f5f9;
          color: #64748b;
        }
        
        .session-management-migrate-btn:hover {
          background: #e0f2fe;
          color: #0ea5e9;
        }

        .session-management-edit-btn:hover {
          background: #dbeafe;
          color: #3b82f6;
        }

        .session-management-activate-btn:hover {
          background: #dcfce7;
          color: #16a34a;
        }

        .session-management-activate-btn.session-management-active {
          background: #dcfce7;
          color: #16a34a;
        }

        .session-management-delete-btn:hover {
          background: #fef2f2;
          color: #dc2626;
        }

        /* Empty State */
        .session-management-empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
        }

        .session-management-empty-state svg {
          color: #cbd5e1;
          margin-bottom: 16px;
        }

        .session-management-empty-state h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          color: #374151;
        }

        .session-management-empty-state p {
          margin: 0;
          font-size: 14px;
        }

        /* Modal Styles */
        .session-management-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: session-management-fadeIn 0.2s ease;
          padding: 16px;
        }

        .session-management-modal-container {
          width: 100%;
          max-width: 480px;
          max-height: 90vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .session-management-modal-content {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 25px rgba(0, 0, 0, 0.25);
          overflow: hidden;
          animation: session-management-slideIn 0.3s ease;
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .session-management-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e2e8f0;
          flex-shrink: 0;
        }

        .session-management-modal-title {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          flex: 1;
          padding-right: 16px;
        }

        .session-management-close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #64748b;
          padding: 4px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .session-management-close-btn:hover {
          background: #f1f5f9;
          color: #1e293b;
        }

        .session-management-close-icon {
          font-size: 20px;
          line-height: 1;
        }

        .session-management-modal-body {
          padding: 20px;
          flex-grow: 1;
          overflow-y: auto;
        }

        /* Migration Modal Specific Styles */
        .migration-session-info {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          padding: 16px;
          background: #f8fafc;
          border-radius: 12px;
        }
        
        .migration-from-session,
        .migration-to-session {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .migration-session-label {
          font-size: 12px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .migration-session-dates {
          font-size: 13px;
          color: #64748b;
        }
        
        .migration-arrow {
          color: #94a3b8;
          flex-shrink: 0;
        }
        
        .migration-instructions {
          margin-bottom: 16px;
          color: #64748b;
        }
        
        .migration-controls {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }
        
        .migration-control-btn {
          padding: 6px 12px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .migration-control-btn:hover {
          background: #e2e8f0;
        }
        
        .migration-data-list {
          max-height: 300px;
          overflow-y: auto;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
        }
        
        .migration-data-item {
          padding: 12px 16px;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .migration-data-item:last-child {
          border-bottom: none;
        }
        
        .migration-checkbox-container {
          display: flex;
          align-items: center;
          cursor: pointer;
          position: relative;
          padding-left: 28px;
          margin-bottom: 8px;
        }
        
        .migration-checkbox-container input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }
        
        .migration-checkmark {
          position: absolute;
          top: 0;
          left: 0;
          height: 18px;
          width: 18px;
          background-color: #fff;
          border: 2px solid #3b82f6;
          border-radius: 4px;
        }
        
        .migration-checkbox-container:hover input ~ .migration-checkmark {
          background-color: #f1f5f9;
        }
        
        .migration-checkbox-container input:checked ~ .migration-checkmark {
          background-color: #3b82f6;
        }
        
        .migration-checkmark:after {
          content: "";
          position: absolute;
          display: none;
        }
        
        .migration-checkbox-container input:checked ~ .migration-checkmark:after {
          display: block;
        }
        
        .migration-checkbox-container .migration-checkmark:after {
          left: 5px;
          top: 1px;
          width: 5px;
          height: 10px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
        
        .migration-data-type {
          font-weight: 500;
          color: #1e293b;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .migration-data-count {
          font-size: 12px;
          color: #64748b;
          font-weight: normal;
        }
        
        .migration-data-details {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 8px;
          margin-left: 28px;
        }
        
        .migration-data-detail-item {
          font-size: 12px;
          padding: 4px 8px;
          background: #f1f5f9;
          border-radius: 4px;
          color: #475569;
        }

        /* Form Styles */
        .session-management-modal-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .session-management-form-group {
          display: flex;
          flex-direction: column;
        }

        .session-management-form-label {
          margin-bottom: 8px;
          font-weight: 500;
          color: #374151;
          font-size: 14px;
        }

        .session-management-required {
          color: #dc2626;
        }

        .session-management-form-input {
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          transition: all 0.2s ease;
          background: #f8fafc;
        }

        .session-management-form-input:focus {
          outline: none;
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .session-management-date-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .session-management-date-input {
          width: 100%;
          padding: 12px 16px 12px 40px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          transition: all 0.2s ease;
          background: #f8fafc;
        }

        .session-management-date-input:focus {
          outline: none;
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .session-management-date-input::-webkit-calendar-picker-indicator {
          opacity: 0;
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          cursor: pointer;
        }

        .session-management-date-icon {
          position: absolute;
          left: 12px;
          color: #64748b;
          pointer-events: none;
          z-index: 1;
        }

        .session-management-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .session-management-checkbox-label {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          padding: 12px 0;
        }

        .session-management-checkbox-input {
          width: 18px;
          height: 18px;
          accent-color: #3b82f6;
        }

        .session-management-checkbox-text {
          font-size: 14px;
          color: #374151;
        }

        .session-management-modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          padding: 20px;
          border-top: 1px solid #e2e8f0;
          flex-shrink: 0;
        }

        .session-management-cancel-btn {
          padding: 12px 24px;
          border: 2px solid #e2e8f0;
          background: white;
          color: #64748b;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .session-management-cancel-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .session-management-submit-btn {
          padding: 12px 24px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .session-management-submit-btn:hover {
          background: #2563eb;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }

        /* Delete Modal Specific Styles */
        .session-management-delete-modal {
          text-align: center;
        }

        .session-management-warning-icon {
          color: #dc2626;
          margin-bottom: 16px;
        }

        .session-management-warning-content {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .session-management-warning-message {
          margin: 0;
          color: #374151;
        }

        .session-management-session-name-delete {
          color: #1e293b;
          font-size: 16px;
        }

        .session-management-warning-text {
          color: #dc2626;
          font-size: 14px;
          margin-top: 12px;
        }

        .session-management-delete-confirm-btn {
          padding: 12px 24px;
          background: #dc2626;
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .session-management-delete-confirm-btn:hover {
          background: #b91c1c;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(220, 38, 38, 0.3);
        }

        /* Animations */
        @keyframes session-management-fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes session-management-slideIn {
          from { 
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .session-management-header {
            flex-direction: column;
            align-items: stretch;
          }

          .session-management-export-btn {
            width: 100%;
            justify-content: center;
          }

          .session-management-filter-bar {
            flex-direction: column;
          }

          .session-management-search-container,
          .session-management-filter-container {
            width: 100%;
          }

          .session-management-form-row {
            grid-template-columns: 1fr;
          }

          .session-management-sessions-table th,
          .session-management-sessions-table td {
            padding: 12px 16px;
          }

          .session-management-actions-cell {
            width: auto;
          }

          .session-management-action-buttons {
            flex-wrap: wrap;
          }

          .migration-session-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          
          .migration-arrow {
            transform: rotate(90deg);
            margin: 8px 0;
          }
        }

        @media (max-width: 480px) {
          .session-management-page-title {
            font-size: 20px;
          }

          .session-management-action-buttons {
            gap: 4px;
          }
          
          .session-management-action-btn {
            width: 32px;
            height: 32px;
          }

          .session-management-date-input {
            padding: 12px 16px 12px 36px;
          }

          .session-management-date-icon {
            left: 12px;
          }

          .session-management-modal-actions {
            flex-direction: column;
            gap: 8px;
          }

          .session-management-cancel-btn,
          .session-management-submit-btn,
          .session-management-delete-confirm-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default SessionManagement;
