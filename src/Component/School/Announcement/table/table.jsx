import React, { useState } from 'react';
import { Eye, Edit, Trash2, Plus, X, Calendar, FileText, Download, Upload, ChevronLeft, ChevronRight } from 'lucide-react';
import './table.css';

const AnnouncementManager = () => {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "Ganesh Chaturthi",
      description: "Wishing you a joyous Ganesh Chaturthi filled with love, prosperity, and happiness!",
      startDate: "2024-05-10",
      endDate: "2024-08-12",
      attachment: "ganesh_celebration.pdf",
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      title: "Diwali Celebration",
      description: "Join us for the grand Diwali celebration with lights, sweets, and joy!",
      startDate: "2024-10-20",
      endDate: "2024-11-05",
      attachment: "diwali_event.pdf",
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      title: "New Year Welcome",
      description: "Welcome the new year with enthusiasm and new opportunities!",
      startDate: "2024-12-31",
      endDate: "2025-01-02",
      attachment: "newyear_party.pdf",
      createdAt: new Date().toISOString()
    },
    {
      id: 4,
      title: "Team Building Event",
      description: "Annual team building activities to strengthen our bonds and collaboration.",
      startDate: "2024-09-15",
      endDate: "2024-09-17",
      attachment: "team_building.pdf",
      createdAt: new Date().toISOString()
    },
    {
      id: 5,
      title: "Holiday Notice",
      description: "Important notice regarding upcoming holidays and office closure dates.",
      startDate: "2024-12-20",
      endDate: "2024-12-31",
      attachment: "holiday_schedule.pdf",
      createdAt: new Date().toISOString()
    },
    {
      id: 6,
      title: "Training Workshop",
      description: "Mandatory training workshop for all employees on new company policies.",
      startDate: "2024-07-15",
      endDate: "2024-07-17",
      attachment: "training_materials.pdf",
      createdAt: new Date().toISOString()
    },
    {
      id: 7,
      title: "Company Picnic",
      description: "Annual company picnic at the beach park. Family members are welcome!",
      startDate: "2024-08-25",
      endDate: "2024-08-25",
      attachment: "picnic_details.pdf",
      createdAt: new Date().toISOString()
    },
    {
      id: 8,
      title: "Quarterly Review",
      description: "Q3 quarterly review meeting with all department heads and managers.",
      startDate: "2024-09-30",
      endDate: "2024-09-30",
      attachment: "quarterly_agenda.pdf",
      createdAt: new Date().toISOString()
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('July-2024');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    attachment: null
  });

  // Filter announcements based on search term
  const filteredAnnouncements = announcements.filter(announcement =>
    announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalItems = filteredAnnouncements.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAnnouncements.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination functions
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      attachment: file
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (modalMode === 'add') {
      const newAnnouncement = {
        id: Date.now(),
        ...formData,
        attachment: formData.attachment ? formData.attachment.name : null,
        createdAt: new Date().toISOString()
      };
      setAnnouncements(prev => [...prev, newAnnouncement]);
    } else if (modalMode === 'edit') {
      setAnnouncements(prev => prev.map(announcement =>
        announcement.id === selectedAnnouncement.id
          ? { ...announcement, ...formData, attachment: formData.attachment ? formData.attachment.name : announcement.attachment }
          : announcement
      ));
    }

    resetModal();
  };

  const resetModal = () => {
    setShowModal(false);
    setShowViewModal(false);
    setModalMode('add');
    setSelectedAnnouncement(null);
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      attachment: null
    });
  };

  const handleAdd = () => {
    setModalMode('add');
    setShowModal(true);
  };

  const handleEdit = (announcement) => {
    setModalMode('edit');
    setSelectedAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      description: announcement.description,
      startDate: announcement.startDate,
      endDate: announcement.endDate,
      attachment: null
    });
    setShowModal(true);
  };

  const handleView = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowViewModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      setAnnouncements(prev => prev.filter(announcement => announcement.id !== id));
      // Adjust current page if necessary
      const newTotalItems = announcements.length - 1;
      const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    }
  };

  const handleDownloadPDF = (filename) => {
    alert(`Downloading ${filename}...`);
    // In a real application, you would implement actual PDF download functionality
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="announcement-manager">
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1>Announcement List</h1>
          <button className="add-btn" onClick={handleAdd}>
            <Plus size={16} />
            Add Announcement
          </button>
        </div>

        {/* Controls */}
        <div className="controls">
          <div className="left-controls">
            <div className="month-selector">
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="month-select"
              >
                <option value="July-2024">July-2024</option>
                <option value="August-2024">August-2024</option>
                <option value="September-2024">September-2024</option>
                <option value="October-2024">October-2024</option>
                <option value="November-2024">November-2024</option>
                <option value="December-2024">December-2024</option>
              </select>
            </div>
            
            <div className="items-per-page">
              <label>Show:</label>
              <select 
                value={itemsPerPage} 
                onChange={handleItemsPerPageChange}
                className="items-select"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
              <span>entries</span>
            </div>
          </div>
          
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="announcements-table">
            <thead>
              <tr>
                <th>Announcement Title</th>
                <th>Description</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Attachment</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((announcement) => (
                  <tr key={announcement.id}>
                    <td className="title-cell">{announcement.title}</td>
                    <td className="description-cell">
                      <div className="description-text">{announcement.description}</div>
                    </td>
                    <td>{formatDate(announcement.startDate)}</td>
                    <td>{formatDate(announcement.endDate)}</td>
                    <td>
                      {announcement.attachment && (
                        <div className="attachment-cell">
                          <FileText size={16} className="pdf-icon" />
                          <button 
                            className="download-btn"
                            onClick={() => handleDownloadPDF(announcement.attachment)}
                            title="Download PDF"
                          >
                            <Download size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="action-btn view-btn"
                          onClick={() => handleView(announcement)}
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="action-btn edit-btn"
                          onClick={() => handleEdit(announcement)}
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(announcement.id)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
                    No announcements found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination-container">
          <div className="pagination-info">
            <span>
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} entries
            </span>
          </div>
          
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="pagination-btn" 
                onClick={handlePrevious}
                disabled={currentPage === 1}
                title="Previous"
              >
                <ChevronLeft size={16} />
                Prev
              </button>
              
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  className={`pagination-btn ${page === currentPage ? 'active' : ''} ${page === '...' ? 'dots' : ''}`}
                  onClick={() => page !== '...' && handlePageChange(page)}
                  disabled={page === '...'}
                >
                  {page}
                </button>
              ))}
              
              <button 
                className="pagination-btn" 
                onClick={handleNext}
                disabled={currentPage === totalPages}
                title="Next"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={resetModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{modalMode === 'add' ? 'Add New Announcement' : 'Edit Announcement'}</h2>
                <button className="close-btn" onClick={resetModal}>
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label htmlFor="title">Announcement Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter announcement title"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    placeholder="Enter announcement description"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="startDate">Start Date *</label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="endDate">End Date *</label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="attachment">Attachment (PDF)</label>
                  <div className="file-input-container">
                    <input
                      type="file"
                      id="attachment"
                      name="attachment"
                      onChange={handleFileChange}
                      accept=".pdf"
                      className="file-input"
                    />
                    <label htmlFor="attachment" className="file-label">
                      <Upload size={16} />
                      Choose PDF File
                    </label>
                    {formData.attachment && (
                      <span className="file-name">{formData.attachment.name}</span>
                    )}
                  </div>
                </div>
                
                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={resetModal}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    {modalMode === 'add' ? 'Add Announcement' : 'Update Announcement'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Modal */}
        {showViewModal && selectedAnnouncement && (
          <div className="modal-overlay" onClick={resetModal}>
            <div className="modal view-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>View Announcement</h2>
                <button className="close-btn" onClick={resetModal}>
                  <X size={20} />
                </button>
              </div>
              
              <div className="view-content">
                <div className="view-section">
                  <h3>Title</h3>
                  <p>{selectedAnnouncement.title}</p>
                </div>
                
                <div className="view-section">
                  <h3>Description</h3>
                  <p>{selectedAnnouncement.description}</p>
                </div>
                
                <div className="view-row">
                  <div className="view-section">
                    <h3>Start Date</h3>
                    <p>{formatDate(selectedAnnouncement.startDate)}</p>
                  </div>
                  
                  <div className="view-section">
                    <h3>End Date</h3>
                    <p>{formatDate(selectedAnnouncement.endDate)}</p>
                  </div>
                </div>
                
                {selectedAnnouncement.attachment && (
                  <div className="view-section">
                    <h3>Attachment</h3>
                    <div className="attachment-view">
                      <FileText size={20} />
                      <span>{selectedAnnouncement.attachment}</span>
                      <button 
                        className="download-btn-view"
                        onClick={() => handleDownloadPDF(selectedAnnouncement.attachment)}
                      >
                        <Download size={16} />
                        Download
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="modal-actions">
                <button className="edit-btn-modal" onClick={() => {
                  setShowViewModal(false);
                  handleEdit(selectedAnnouncement);
                }}>
                  <Edit size={16} />
                  Edit
                </button>
                <button className="close-btn-modal" onClick={resetModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementManager;