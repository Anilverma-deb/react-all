import React, { useState, useEffect, useCallback } from 'react';
import { 
  FiSearch, FiEdit, FiTrash2, FiX, FiUsers, 
  FiChevronLeft, FiChevronRight, FiPlus, FiUser 
} from 'react-icons/fi';
import Select from 'react-select';
import './StudentTransport.css';

const StudentTransportMap = () => {
  // Data definitions
  const buses = [
    { value: 'bus_1', label: '🟢 Bus A (Capacity: 40)' },
    { value: 'bus_2', label: '🔵 Bus B (Capacity: 35)' },
    { value: 'bus_3', label: '🟡 Bus C (Capacity: 45)' },
    { value: 'bus_4', label: '🔴 Bus D (Capacity: 30)' },
  ];

  const routes = [
    { value: 'route_1', label: '🛣️ Route 1 - North Sector (8 stops)' },
    { value: 'route_2', label: '🛣️ Route 2 - South Sector (6 stops)' },
    { value: 'route_3', label: '🛣️ Route 3 - East Sector (7 stops)' },
    { value: 'route_4', label: '🛣️ Route 4 - West Sector (5 stops)' },
    { value: 'route_5', label: '🛣️ Route 5 - Central Sector (9 stops)' },
  ];

  const pickupPoints = [
    { value: '📍 Sector 15 Gate', label: '📍 Sector 15 Gate' },
    { value: '📍 Sector 22 Market', label: '📍 Sector 22 Market' },
    { value: '📍 Sector 34 Chowk', label: '📍 Sector 34 Chowk' },
    { value: '📍 Sector 12 Park', label: '📍 Sector 12 Park' },
    { value: '📍 Sector 8 Bus Stand', label: '📍 Sector 8 Bus Stand' },
  ];

  const classOptions = [
    { value: '6-A', label: '6-A' },
    { value: '6-B', label: '6-B' },
    { value: '7-A', label: '7-A' },
    { value: '7-B', label: '7-B' },
    { value: '8-A', label: '8-A' },
    { value: '8-B', label: '8-B' },
    { value: '8-C', label: '8-C' },
    { value: '8-D', label: '8-D' },
    { value: '9-A', label: '9-A' },
    { value: '9-B', label: '9-B' },
    { value: '9-C', label: '9-C' },
    { value: '10-A', label: '10-A' },
    { value: '10-B', label: '10-B' },
    { value: '11-A', label: '11-A' },
    { value: '11-B', label: '11-B' },
    { value: '12-A', label: '12-A' },
    { value: '12-B', label: '12-B' }
  ];

  const areaOptions = [
    { value: 'Sector 8', label: 'Sector 8' },
    { value: 'Sector 12', label: 'Sector 12' },
    { value: 'Sector 15', label: 'Sector 15' },
    { value: 'Sector 22', label: 'Sector 22' },
    { value: 'Sector 34', label: 'Sector 34' },
    { value: 'Sector 45', label: 'Sector 45' },
    { value: 'Sector 56', label: 'Sector 56' },
    { value: 'Sector 62', label: 'Sector 62' }
  ];

  // Sample initial student data
  const initialStudents = [
    {
      id: 'student_121',
      name: 'Anjali Sharma',
      class: '10-A',
      rollNo: '101',
      area: 'Sector 15',
      routeId: 'route_5',
      busId: 'bus_3',
      pickupPoint: '📍 Sector 15 Gate',
      avatar: '👩‍🎓',
    },
    {
      id: 'student_122',
      name: 'Rahul Verma',
      class: '9-B',
      rollNo: '45',
      area: 'Sector 22',
      routeId: 'route_2',
      busId: 'bus_1',
      pickupPoint: '📍 Sector 22 Market',
      avatar: '👨‍🎓',
    },
    {
      id: 'student_123',
      name: 'Priya Patel',
      class: '11-A',
      rollNo: '32',
      area: 'Sector 34',
      routeId: 'route_3',
      busId: 'bus_2',
      pickupPoint: '📍 Sector 34 Chowk',
      avatar: '👩‍🎓',
    },
    {
      id: 'student_124',
      name: 'Amit Singh',
      class: '10-A',
      rollNo: '102',
      area: 'Sector 12',
      routeId: '',
      busId: '',
      pickupPoint: '',
      avatar: '👨‍🎓',
    },
    {
      id: 'student_125',
      name: 'Neha Gupta',
      class: '8-D',
      rollNo: '15',
      area: 'Sector 8',
      routeId: 'route_4',
      busId: 'bus_4',
      pickupPoint: '📍 Sector 8 Bus Stand',
      avatar: '👩‍🎓',
    },
  ];

  // State management
  const [students, setStudents] = useState(initialStudents);
  const [filteredStudents, setFilteredStudents] = useState(initialStudents);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState(null);
  const [areaFilter, setAreaFilter] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [bulkAssign, setBulkAssign] = useState(false);
  const [bulkClass, setBulkClass] = useState(null);
  const [bulkArea, setBulkArea] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: '',
    class: null,
    rollNo: '',
    area: null,
    avatar: '👨‍🎓'
  });

  // Filter students based on search and filters
  useEffect(() => {
    let result = students;
    
    if (searchTerm) {
      result = result.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo.includes(searchTerm)
      );
    }
    
    if (classFilter) {
      result = result.filter(student => student.class === classFilter.value);
    }
    
    if (areaFilter) {
      result = result.filter(student => student.area === areaFilter.value);
    }
    
    setFilteredStudents(result);
    setCurrentPage(1);
  }, [searchTerm, classFilter, areaFilter, students]);

  // Sort students
  const sortedStudents = useCallback(() => {
    let sortableStudents = [...filteredStudents];
    if (sortConfig.key) {
      sortableStudents.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableStudents;
  }, [filteredStudents, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get current students for pagination
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = sortedStudents().slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Open modal for assigning bus/route
  const openAssignModal = (student) => {
    setCurrentStudent(student);
    setShowModal(true);
    setBulkAssign(false);
  };

  // Open add student modal
  const openAddStudentModal = () => {
    setNewStudent({
      name: '',
      class: null,
      rollNo: '',
      area: null,
      avatar: Math.random() > 0.5 ? '👨‍🎓' : '👩‍🎓'
    });
    setShowAddModal(true);
  };

  // Open bulk assign modal
  const openBulkAssignModal = () => {
    setCurrentStudent(null);
    setShowModal(true);
    setBulkAssign(true);
  };

  // Handle assignment
  const handleAssignment = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const assignmentData = {
      routeId: formData.get('routeId'),
      busId: formData.get('busId'),
      pickupPoint: formData.get('pickupPoint')
    };
    
    if (bulkAssign) {
      // Bulk assignment logic
      const updatedStudents = students.map(student => {
        if ((!bulkClass || student.class === bulkClass.value) && 
            (!bulkArea || student.area === bulkArea.value)) {
          return {
            ...student,
            ...assignmentData
          };
        }
        return student;
      });
      setStudents(updatedStudents);
    } else {
      // Individual assignment
      const updatedStudents = students.map(student => 
        student.id === currentStudent.id 
          ? { ...student, ...assignmentData }
          : student
      );
      setStudents(updatedStudents);
    }
    
    setShowModal(false);
    setSelectedStudents([]);
  };

  // Handle add new student
  const handleAddStudent = (e) => {
    e.preventDefault();
    const newStudentData = {
      ...newStudent,
      id: `student_${Date.now()}`,
      class: newStudent.class.value,
      area: newStudent.area.value,
      routeId: '',
      busId: '',
      pickupPoint: ''
    };
    setStudents([...students, newStudentData]);
    setShowAddModal(false);
  };

  // Handle student deletion
  const handleDelete = (studentId) => {
    setStudents(students.filter(student => student.id !== studentId));
    setSelectedStudents(selectedStudents.filter(id => id !== studentId));
  };

  // Handle multiple student selection
  const toggleStudentSelection = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  // Handle multiple student deletion
  const handleMultipleDelete = () => {
    setStudents(students.filter(student => !selectedStudents.includes(student.id)));
    setSelectedStudents([]);
  };

  // Get bus and route info
  const getBusInfo = (busId) => buses.find(b => b.value === busId) || { label: 'Not Assigned' };
  const getRouteInfo = (routeId) => routes.find(r => r.value === routeId) || { label: 'Not Assigned' };

  // Calculate bus utilization
  const calculateBusUtilization = (busId) => {
    const assignedStudents = students.filter(s => s.busId === busId).length;
    const bus = buses.find(b => b.value === busId);
    const capacity = bus ? parseInt(bus.label.match(/Capacity: (\d+)/)[1]) : 0;
    return `${assignedStudents}/${capacity}`;
  };

  // Custom styles for react-select
  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: '40px',
      borderRadius: '6px',
      borderColor: '#ddd',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#aaa',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#4a6cf7' : state.isFocused ? '#f0f4ff' : 'white',
      color: state.isSelected ? 'white' : '#333',
      padding: '8px 12px',
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '6px',
      border: '1px solid #ddd',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#333',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#999',
    }),
  };

  return (
    <div className="strm-container">
      <div className="strm-header">
        <h2 className="strm-title">🚌 Student Transport Management</h2>
        <div className="strm-stats">
          <div className="strm-stat-card">
            <span>Total Students</span>
            <strong>{students.length}</strong>
          </div>
          <div className="strm-stat-card">
            <span>Assigned</span>
            <strong>{students.filter(s => s.busId).length}</strong>
          </div>
          <div className="strm-stat-card">
            <span>Unassigned</span>
            <strong>{students.filter(s => !s.busId).length}</strong>
          </div>
        </div>
      </div>
      
      {/* Controls section */}
      <div className="strm-controls">
        <div className="strm-search">
          <FiSearch className="strm-search-icon" />
          <input
            type="text"
            placeholder="Search students by name or roll no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="strm-search-input"
          />
        </div>
        
        <div className="strm-filters">
          <div className="strm-filter-select">
            <Select
              options={classOptions}
              value={classFilter}
              onChange={setClassFilter}
              placeholder="All Classes"
              styles={customSelectStyles}
              isClearable
            />
          </div>
          
          <div className="strm-filter-select">
            <Select
              options={areaOptions}
              value={areaFilter}
              onChange={setAreaFilter}
              placeholder="All Areas"
              styles={customSelectStyles}
              isClearable
            />
          </div>
          
          <button 
            className="strm-primary-btn"
            onClick={openAddStudentModal}
          >
            <FiPlus /> Add Student
          </button>
          
          <button 
            className="strm-bulk-assign-btn"
            onClick={openBulkAssignModal}
          >
            <FiUsers /> Bulk Assign
          </button>
          
          {selectedStudents.length > 0 && (
            <button 
              className="strm-delete-selected-btn"
              onClick={handleMultipleDelete}
            >
              <FiTrash2 /> Delete Selected ({selectedStudents.length})
            </button>
          )}
        </div>
      </div>
      
      {/* Students Table */}
      <div className="strm-table-wrapper">
        <table className="strm-table">
          <thead>
            <tr>
              <th className="strm-th-checkbox">
                <input 
                  type="checkbox" 
                  checked={selectedStudents.length === currentStudents.length && currentStudents.length > 0}
                  onChange={() => {
                    if (selectedStudents.length === currentStudents.length) {
                      setSelectedStudents([]);
                    } else {
                      setSelectedStudents(currentStudents.map(s => s.id));
                    }
                  }}
                />
              </th>
              <th 
                className="strm-th strm-th-sortable"
                onClick={() => requestSort('name')}
              >
                Student {sortConfig.key === 'name' && (
                  <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="strm-th strm-th-sortable"
                onClick={() => requestSort('rollNo')}
              >
                Roll No {sortConfig.key === 'rollNo' && (
                  <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="strm-th strm-th-sortable"
                onClick={() => requestSort('class')}
              >
                Class {sortConfig.key === 'class' && (
                  <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th className="strm-th">Area</th>
              <th className="strm-th">Pickup Point</th>
              <th className="strm-th">Bus</th>
              <th className="strm-th">Route</th>
              <th className="strm-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.length > 0 ? (
              currentStudents.map(student => (
                <tr 
                  key={student.id} 
                  className={`strm-tr ${selectedStudents.includes(student.id) ? 'strm-tr-selected' : ''}`}
                >
                  <td className="strm-td-checkbox">
                    <input 
                      type="checkbox" 
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => toggleStudentSelection(student.id)}
                    />
                  </td>
                  <td className="strm-td">
                    <div className="strm-student-info">
                      <span className="strm-avatar">{student.avatar}</span>
                      {student.name}
                    </div>
                  </td>
                  <td className="strm-td">{student.rollNo}</td>
                  <td className="strm-td">{student.class}</td>
                  <td className="strm-td">{student.area}</td>
                  <td className="strm-td">
                    {student.pickupPoint || (
                      <span className="strm-not-assigned">Not assigned</span>
                    )}
                  </td>
                  <td className="strm-td">
                    {student.busId ? (
                      <div className="strm-bus-info">
                        <span>{getBusInfo(student.busId).label.split('(')[0]}</span>
                        <small>Seats: {calculateBusUtilization(student.busId)}</small>
                      </div>
                    ) : (
                      <span className="strm-not-assigned">Not assigned</span>
                    )}
                  </td>
                  <td className="strm-td">
                    {student.routeId ? (
                      <div className="strm-route-info">
                        <span>{getRouteInfo(student.routeId).label.split('(')[0]}</span>
                        <small>{getRouteInfo(student.routeId).label.match(/\((.*?)\)/)[1]}</small>
                      </div>
                    ) : (
                      <span className="strm-not-assigned">Not assigned</span>
                    )}
                  </td>
                  <td className="strm-td-actions">
                    <button 
                      onClick={() => openAssignModal(student)}
                      className="strm-action-btn strm-edit-btn"
                    >
                      <FiEdit /> Assign
                    </button>
                    <button 
                      onClick={() => handleDelete(student.id)}
                      className="strm-action-btn strm-delete-btn"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="strm-tr">
                <td colSpan="9" className="strm-no-data">
                  No students found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {filteredStudents.length > studentsPerPage && (
        <div className="strm-pagination">
          <button 
            onClick={() => paginate(Math.max(1, currentPage - 1))} 
            disabled={currentPage === 1}
            className="strm-page-btn"
          >
            <FiChevronLeft /> Previous
          </button>
          
          <div className="strm-page-numbers">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => paginate(pageNum)}
                  className={`strm-page-btn ${currentPage === pageNum ? 'strm-page-active' : ''}`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="strm-page-ellipsis">...</span>
            )}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <button
                onClick={() => paginate(totalPages)}
                className={`strm-page-btn ${currentPage === totalPages ? 'strm-page-active' : ''}`}
              >
                {totalPages}
              </button>
            )}
          </div>
          
          <button 
            onClick={() => paginate(Math.min(totalPages, currentPage + 1))} 
            disabled={currentPage === totalPages}
            className="strm-page-btn"
          >
            Next <FiChevronRight />
          </button>
        </div>
      )}
      
      {/* Assignment Modal */}
      {showModal && (
        <div className="strm-modal-overlay">
          <div className="strm-modal">
            <div className="strm-modal-header">
              <h3 className="strm-modal-title">
                {bulkAssign ? '📦 Bulk Assignment' : '✏️ Assign Transport'}
              </h3>
              <button 
                onClick={() => setShowModal(false)} 
                className="strm-modal-close"
              >
                <FiX />
              </button>
            </div>
            
            <form onSubmit={handleAssignment} className="strm-form">
              {bulkAssign && (
                <>
                  <div className="strm-form-group">
                    <label className="strm-form-label">Class (leave empty for all)</label>
                    <Select
                      options={classOptions}
                      value={bulkClass}
                      onChange={setBulkClass}
                      placeholder="All Classes"
                      styles={customSelectStyles}
                      isClearable
                    />
                  </div>
                  
                  <div className="strm-form-group">
                    <label className="strm-form-label">Area (leave empty for all)</label>
                    <Select
                      options={areaOptions}
                      value={bulkArea}
                      onChange={setBulkArea}
                      placeholder="All Areas"
                      styles={customSelectStyles}
                      isClearable
                    />
                    <div className="strm-form-hint">
                      {bulkClass || bulkArea 
                        ? `This will affect ${students.filter(s => 
                            (!bulkClass || s.class === bulkClass.value) && 
                            (!bulkArea || s.area === bulkArea.value)).length} students`
                        : 'This will affect all students'}
                    </div>
                  </div>
                </>
              )}
              
              {!bulkAssign && (
                <div className="strm-student-details">
                  <div className="strm-student-avatar">{currentStudent.avatar}</div>
                  <div>
                    <h4 className="strm-student-name">{currentStudent.name}</h4>
                    <div className="strm-student-meta">
                      <span>Class: {currentStudent.class}</span>
                      <span>Roll No: {currentStudent.rollNo}</span>
                      <span>Area: {currentStudent.area}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="strm-form-group">
                <label className="strm-form-label">Select Route</label>
                <Select
                  name="routeId"
                  options={routes}
                  defaultValue={routes.find(r => r.value === currentStudent?.routeId)}
                  styles={customSelectStyles}
                  required
                />
              </div>
              
              <div className="strm-form-group">
                <label className="strm-form-label">Select Bus</label>
                <Select
                  name="busId"
                  options={buses.map(bus => ({
                    ...bus,
                    label: `${bus.label.split('(')[0]} (Assigned: ${
                      students.filter(s => s.busId === bus.value).length
                    }/${bus.label.match(/Capacity: (\d+)/)[1]})`
                  }))}
                  defaultValue={buses.find(b => b.value === currentStudent?.busId)}
                  styles={customSelectStyles}
                  required
                />
              </div>
              
              <div className="strm-form-group">
                <label className="strm-form-label">Pickup Point</label>
                <Select
                  name="pickupPoint"
                  options={pickupPoints}
                  defaultValue={pickupPoints.find(p => p.value === currentStudent?.pickupPoint)}
                  styles={customSelectStyles}
                  required
                />
              </div>
              
              <div className="strm-modal-actions">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="strm-modal-cancel"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="strm-modal-submit"
                >
                  {bulkAssign ? 'Apply to Selected Students' : 'Save Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Add Student Modal */}
      {showAddModal && (
        <div className="strm-modal-overlay">
          <div className="strm-modal">
            <div className="strm-modal-header">
              <h3 className="strm-modal-title">
                <FiUser /> Add New Student
              </h3>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="strm-modal-close"
              >
                <FiX />
              </button>
            </div>
            
            <form onSubmit={handleAddStudent} className="strm-form">
              <div className="strm-form-group">
                <label className="strm-form-label">Full Name</label>
                <input
                  type="text"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                  className="strm-form-input"
                  required
                  placeholder="Enter student's full name"
                />
              </div>
              
              <div className="strm-form-row">
                <div className="strm-form-group">
                  <label className="strm-form-label">Class</label>
                  <Select
                    options={classOptions}
                    value={newStudent.class}
                    onChange={(selected) => setNewStudent({...newStudent, class: selected})}
                    styles={customSelectStyles}
                    required
                    placeholder="Select Class"
                  />
                </div>
                
                <div className="strm-form-group">
                  <label className="strm-form-label">Roll Number</label>
                  <input
                    type="text"
                    value={newStudent.rollNo}
                    onChange={(e) => setNewStudent({...newStudent, rollNo: e.target.value})}
                    className="strm-form-input"
                    required
                    placeholder="Enter roll number"
                  />
                </div>
              </div>
              
              <div className="strm-form-group">
                <label className="strm-form-label">Area</label>
                <Select
                  options={areaOptions}
                  value={newStudent.area}
                  onChange={(selected) => setNewStudent({...newStudent, area: selected})}
                  styles={customSelectStyles}
                  required
                  placeholder="Select Area"
                />
              </div>
              
              <div className="strm-form-group">
                <label className="strm-form-label">Avatar</label>
                <div className="strm-avatar-selector">
                  <button
                    type="button"
                    className={`strm-avatar-option ${newStudent.avatar === '👨‍🎓' ? 'strm-avatar-selected' : ''}`}
                    onClick={() => setNewStudent({...newStudent, avatar: '👨‍🎓'})}
                  >
                    👨‍🎓 Male
                  </button>
                  <button
                    type="button"
                    className={`strm-avatar-option ${newStudent.avatar === '👩‍🎓' ? 'strm-avatar-selected' : ''}`}
                    onClick={() => setNewStudent({...newStudent, avatar: '👩‍🎓'})}
                  >
                    👩‍🎓 Female
                  </button>
                </div>
              </div>
              
              <div className="strm-modal-actions">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)} 
                  className="strm-modal-cancel"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="strm-modal-submit"
                >
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTransportMap;