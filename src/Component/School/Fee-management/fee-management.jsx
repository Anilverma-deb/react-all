import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiRefreshCw, 
  FiUsers, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiDollarSign,
  FiFilter,
  FiDownload,
  FiEye,
  FiWifi,
  FiWifiOff,
  FiEdit2,
  FiTrash2,
  FiPlus
} from 'react-icons/fi';
import '../../../assets/css/fee-management.css';

const FeeManagementDashboard = () => {
  // State for students data
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState([]);

  // Add to your existing state declarations
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentData, setNewStudentData] = useState({
    name: '',
    class: '',
    section: '',
    rollNo: '',
    parent: '',
    phone: ''
  });

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    class: 'All',
    section: 'All',
    status: 'All',
    feeType: 'All',
    paymentMethod: 'All',
    dateRange: 'All'
  });
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showFeeRecordModal, setShowFeeRecordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteStudentModal, setShowDeleteStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedFeeRecord, setSelectedFeeRecord] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingStudent, setIsEditingStudent] = useState(false);
  
  // Form states
  const [paymentData, setPaymentData] = useState({
    amount: '',
    method: 'Online',
    transactionId: '',
    receiptNo: ''
  });
  
  const [feeRecordData, setFeeRecordData] = useState({
    feeType: 'Tuition',
    amount: '',
    dueDate: '',
    description: ''
  });

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockStudents = [
          { 
            id: 1, 
            name: 'Aarav Sharma', 
            class: '10', 
            section: 'A', 
            rollNo: '001', 
            parent: 'Rajesh Sharma', 
            phone: '9876543210',
            feeRecords: [
              { 
                id: 'FEE001',
                feeType: 'Tuition', 
                amount: 15000, 
                dueDate: '2023-07-15', 
                status: 'Paid', 
                paymentDate: '2023-06-10', 
                paymentMethod: 'Online',
                description: 'Annual tuition fee',
                transactions: [
                  { id: 'TXN001', amount: 15000, method: 'Online', date: '2023-06-10', status: 'Success' }
                ]
              },
              {
                id: 'FEE002',
                feeType: 'Transport',
                amount: 5000,
                dueDate: '2023-08-01',
                status: 'Pending',
                paymentDate: null,
                paymentMethod: null,
                description: 'Quarterly transport fee'
              }
            ]
          },
          { 
            id: 2, 
            name: 'Priya Patel', 
            class: '9', 
            section: 'B', 
            rollNo: '032', 
            parent: 'Amit Patel', 
            phone: '9876543211',
            feeRecords: [
              { 
                id: 'FEE003',
                feeType: 'Tuition', 
                amount: 12000, 
                dueDate: '2023-07-15', 
                status: 'Pending', 
                paymentDate: null, 
                paymentMethod: null,
                description: 'Annual tuition fee'
              }
            ]
          },
          { 
            id: 3, 
            name: 'Amisha Patel', 
            class: '9', 
            section: 'B', 
            rollNo: '033', 
            parent: 'Neha Patel', 
            phone: '9876543212',
            feeRecords: []
          },
          { 
            id: 4, 
            name: 'Raj Verma', 
            class: '9', 
            section: 'B', 
            rollNo: '034', 
            parent: 'Sanjay Verma', 
            phone: '7704087669',
            feeRecords: []
          }
        ];

        const mockMethods = ['Online', 'Cash', 'Cheque', 'Bank Transfer'];
        
        setStudents(mockStudents);
        setPaymentMethods(mockMethods);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter students based on criteria
  const filteredStudents = students.filter(student => {
    // Check if any fee record matches the filters
    const hasMatchingFeeRecord = student.feeRecords.some(record => {
      return (
        (filters.feeType === 'All' || record.feeType === filters.feeType) &&
        (filters.status === 'All' || record.status === filters.status) &&
        (filters.paymentMethod === 'All' || record.paymentMethod === filters.paymentMethod)
      );
    });
    
    return (
      (searchTerm === '' || 
       student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       student.rollNo.includes(searchTerm) ||
       student.parent.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filters.class === 'All' || student.class === filters.class) &&
      (filters.section === 'All' || student.section === filters.section) &&
      (student.feeRecords.length === 0 || hasMatchingFeeRecord)
    );
  });

  // Calculate dashboard stats
  const stats = {
    totalStudents: students.length,
    paidStudents: students.reduce((count, student) => 
      count + student.feeRecords.filter(r => r.status === 'Paid').length, 0),
    pendingStudents: students.reduce((count, student) => 
      count + student.feeRecords.filter(r => r.status === 'Pending').length, 0),
    totalRevenue: students.reduce((sum, student) => 
      sum + student.feeRecords
        .filter(r => r.status === 'Paid')
        .reduce((feeSum, fee) => feeSum + fee.amount, 0), 0),
    onlinePayments: students.reduce((count, student) => 
      count + student.feeRecords.filter(r => r.paymentMethod === 'Online').length, 0),
    offlinePayments: students.reduce((count, student) => 
      count + student.feeRecords.filter(r => r.paymentMethod && r.paymentMethod !== 'Online').length, 0)
  };

  // Handle payment submission
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    
    // Update student's fee record payment status
    const updatedStudents = students.map(student => {
      if (student.id === selectedStudent.id) {
        const updatedFeeRecords = student.feeRecords.map(record => {
          if (record.id === selectedFeeRecord.id) {
            return {
              ...record,
              status: 'Paid',
              paymentMethod: paymentData.method,
              paymentDate: new Date().toISOString().split('T')[0],
              transactions: [
                ...(record.transactions || []),
                {
                  id: `TXN${Math.floor(Math.random() * 10000)}`,
                  amount: paymentData.amount,
                  method: paymentData.method,
                  date: new Date().toISOString().split('T')[0],
                  status: 'Success'
                }
              ]
            };
          }
          return record;
        });
        
        return {
          ...student,
          feeRecords: updatedFeeRecords
        };
      }
      return student;
    });

    setStudents(updatedStudents);
    setShowPaymentModal(false);
    setSelectedStudent(null);
    setSelectedFeeRecord(null);
    setPaymentData({
      amount: '',
      method: 'Online',
      transactionId: '',
      receiptNo: ''
    });
  };

  // Handle fee record submission (add/edit)
  const handleFeeRecordSubmit = (e) => {
    e.preventDefault();
    
    const updatedStudents = students.map(student => {
      if (student.id === selectedStudent.id) {
        if (isEditing) {
          // Update existing fee record
          const updatedRecords = student.feeRecords.map(record => {
            if (record.id === selectedFeeRecord.id) {
              return {
                ...record,
                ...feeRecordData,
                amount: Number(feeRecordData.amount)
              };
            }
            return record;
          });
          
          return {
            ...student,
            feeRecords: updatedRecords
          };
        } else {
          // Add new fee record
          const newRecord = {
            id: `FEE${Math.floor(Math.random() * 10000)}`,
            ...feeRecordData,
            amount: Number(feeRecordData.amount),
            status: 'Pending',
            paymentDate: null,
            paymentMethod: null,
            transactions: []
          };
          
          return {
            ...student,
            feeRecords: [...student.feeRecords, newRecord]
          };
        }
      }
      return student;
    });

    setStudents(updatedStudents);
    setShowFeeRecordModal(false);
    setSelectedStudent(null);
    setSelectedFeeRecord(null);
    setIsEditing(false);
    setFeeRecordData({
      feeType: 'Tuition',
      amount: '',
      dueDate: '',
      description: ''
    });
  };

  // Handle fee record deletion
  const handleDeleteFeeRecord = () => {
    const updatedStudents = students.map(student => {
      if (student.id === selectedStudent.id) {
        return {
          ...student,
          feeRecords: student.feeRecords.filter(record => record.id !== selectedFeeRecord.id)
        };
      }
      return student;
    });

    setStudents(updatedStudents);
    setShowDeleteModal(false);
    setSelectedStudent(null);
    setSelectedFeeRecord(null);
  };

  // Handle student deletion
  const handleDeleteStudent = () => {
    const updatedStudents = students.filter(student => student.id !== selectedStudent.id);
    setStudents(updatedStudents);
    setShowDeleteStudentModal(false);
    setSelectedStudent(null);
  };

  // Handle student submission (add/edit)
  const handleStudentSubmit = (e) => {
    e.preventDefault();
    
    if (isEditingStudent) {
      // Update existing student
      const updatedStudents = students.map(student => {
        if (student.id === selectedStudent.id) {
          return {
            ...student,
            ...newStudentData
          };
        }
        return student;
      });
      setStudents(updatedStudents);
    } else {
      // Add new student
      const newStudent = {
        id: Math.max(...students.map(s => s.id), 0) + 1,
        ...newStudentData,
        feeRecords: []
      };
      setStudents([...students, newStudent]);
    }
    
    setShowAddStudentModal(false);
    setNewStudentData({
      name: '',
      class: '',
      section: '',
      rollNo: '',
      parent: '',
      phone: ''
    });
    setIsEditingStudent(false);
  };

  // Generate and download fee receipt
const downloadFeeReceipt = (student, feeRecord) => {
  // Format the current date like "06-Feb-2021"
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).replace(/-/g, ' ');

  // Generate bill number in format "SRCAS/20-21/26344"
  const billNo = `SRCAS/${currentDate.getFullYear().toString().slice(2)}-${(currentDate.getFullYear()+1).toString().slice(2)}/${Math.floor(10000 + Math.random() * 90000)}`;

  // Convert amount to words (e.g., "Twenty Three Thousand Eight Hundred Only")
  const amountInWords = (amount) => {
    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    if (amount === 0) return 'Zero';
    if (amount < 10) return units[amount];
    if (amount < 20) return teens[amount - 10];
    if (amount < 100) return tens[Math.floor(amount / 10)] + (amount % 10 !== 0 ? ' ' + units[amount % 10] : '');
    if (amount < 1000) return units[Math.floor(amount / 100)] + ' Hundred' + (amount % 100 !== 0 ? ' and ' + amountInWords(amount % 100) : '');
    
    const thousand = Math.floor(amount / 1000);
    const remainder = amount % 1000;
    return amountInWords(thousand) + ' Thousand' + (remainder !== 0 ? ' ' + amountInWords(remainder) : '') + ' Only';
  };

  // Create the receipt content matching your sample image
  const receiptContent = `
    SRI RAMAKRISHNA COLLEGE OF ARTS AND SCIENCE
    (AUTONOMOUS)
    COIMBATORE-641006

    Name: ${student.name.toUpperCase()}
    Bill No: ${billNo}
    Roll No: ${student.rollNo}
    Date: ${formattedDate}
    Year: ${student.class}th Year

    PARTICULARS                  AMOUNT (Rs.)
    ---------------------------- --------------
    ${feeRecord.feeType} Fee     ${feeRecord.amount.toFixed(2)}
    Bank Account
    ---------------------------- --------------
    TOTAL                        ${feeRecord.amount.toFixed(2)}

    Rupees: ${amountInWords(feeRecord.amount)}

    Electronically generated receipt - no signature required
  `;

  // Create and download the file
  const blob = new Blob([receiptContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `FeeReceipt_${student.name.replace(/\s+/g, '_')}_${feeRecord.feeType}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  // Get unique values for filters
  const classes = [...new Set(students.map(s => s.class))];
  const sections = [...new Set(students.map(s => s.section))];
  const feeTypes = [...new Set(students.flatMap(s => s.feeRecords.map(r => r.feeType)))];
  const statuses = ['Paid', 'Pending', 'Overdue', 'Partial'];

  if (loading) {
    return (
      <div className="loading-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="loading-spinner"
        >
          <FiRefreshCw size={24} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fee-dashboard">
      {/* Header */}
      <header className="dashboard-headers">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          School Fee Management System
        </motion.h1>
        <p>Track and manage all fee payments</p>
      </header>

      {/* Stats Cards */}
      <motion.div 
        className="stats-grids"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        <motion.div 
          className="stat-cards total-students"
          whileHover={{ y: -5 }}
        >
          <div>
            <h3>Total Students</h3>
            <p>{stats.totalStudents}</p>
          </div>
          <FiUsers size={32} />
        </motion.div>

        <motion.div 
          className="stat-cards paid-students"
          whileHover={{ y: -5 }}
        >
          <div>
            <h3>Paid Fees</h3>
            <p>{stats.paidStudents}</p>
          </div>
          <FiCheckCircle size={32} />
        </motion.div>

        <motion.div 
          className="stat-cards pending-students"
          whileHover={{ y: -5 }}
        >
          <div>
            <h3>Pending Fees</h3>
            <p>{stats.pendingStudents}</p>
          </div>
          <FiAlertCircle size={32} />
        </motion.div>

        <motion.div 
          className="stat-cards total-revenue"
          whileHover={{ y: -5 }}
        >
          <div>
            <h3>Total Revenue</h3>
            <p>₹{stats.totalRevenue.toLocaleString()}</p>
          </div>
          <FiDollarSign size={32} />
        </motion.div>
      </motion.div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div 
              className="advanced-filters"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <select
                value={filters.class}
                onChange={(e) => setFilters({...filters, class: e.target.value})}
              >
                <option value="All">All Classes</option>
                {classes.map(cls => (
                  <option key={cls} value={cls}>Class {cls}</option>
                ))}
              </select>

              <select
                value={filters.section}
                onChange={(e) => setFilters({...filters, section: e.target.value})}
              >
                <option value="All">All Sections</option>
                {sections.map(sec => (
                  <option key={sec} value={sec}>Section {sec}</option>
                ))}
              </select>

              <select
                value={filters.feeType}
                onChange={(e) => setFilters({...filters, feeType: e.target.value})}
              >
                <option value="All">All Fee Types</option>
                {feeTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="All">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <select
                value={filters.paymentMethod}
                onChange={(e) => setFilters({...filters, paymentMethod: e.target.value})}
              >
                <option value="All">All Payment Methods</option>
                <option value="Online">Online</option>
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Students Table */}
      <div className="students-table-container">
        <div className="table-header">
          <h2>Student Fee Records ({filteredStudents.length})</h2>
          <div className="flex gap-4 items-center mb-4">
            <button className="export-btn flex items-center gap-2">
              <FiDownload /> Export
            </button>
            <button 
              className="add-btn flex items-center gap-2"
              onClick={() => {
                setShowAddStudentModal(true);
                setIsEditingStudent(false);
                setNewStudentData({
                  name: '',
                  class: '',
                  section: '',
                  rollNo: '',
                  parent: '',
                  phone: ''
                });
              }}
            >
              <FiPlus /> Add Student
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Fee Records</th>
                <th>Pending Amount</th>
                <th>Paid Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => {
                const pendingAmount = student.feeRecords
                  .filter(r => r.status === 'Pending')
                  .reduce((sum, fee) => sum + fee.amount, 0);
                
                const paidAmount = student.feeRecords
                  .filter(r => r.status === 'Paid')
                  .reduce((sum, fee) => sum + fee.amount, 0);
                
                return (
                  <motion.tr 
                    key={student.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ backgroundColor: 'rgba(240, 240, 240, 0.8)' }}
                  >
                    <td>
                      <div className="student-info">
                        <strong>{student.name}</strong>
                        <small>Roll: {student.rollNo}</small>
                        <small>{student.parent}</small>
                      </div>
                    </td>
                    <td>{student.class}-{student.section}</td>
                    <td>
                      {student.feeRecords.length > 0 ? (
                        <div className="fee-records-badges">
                          {student.feeRecords.map(record => (
                            <span 
                              key={record.id} 
                              className={`fee-badge ${record.status.toLowerCase()}`}
                              onClick={() => {
                                setSelectedStudent(student);
                                setSelectedFeeRecord(record);
                              }}
                            >
                              {record.feeType}: ₹{record.amount.toLocaleString()}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="no-records">No fee records</span>
                      )}
                    </td>
                    <td className={pendingAmount > 0 ? 'text-danger' : ''}>
                      {pendingAmount > 0 ? `₹${pendingAmount.toLocaleString()}` : '-'}
                    </td>
                    <td className={paidAmount > 0 ? 'text-success' : ''}>
                      {paidAmount > 0 ? `₹${paidAmount.toLocaleString()}` : '-'}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="view-btn"
                          onClick={() => setSelectedStudent(student)}
                        >
                          <FiEye />
                        </button>
                        <button 
                          className="edit-btn"
                          onClick={() => {
                            setSelectedStudent(student);
                            setIsEditingStudent(true);
                            setNewStudentData({
                              name: student.name,
                              class: student.class,
                              section: student.section,
                              rollNo: student.rollNo,
                              parent: student.parent,
                              phone: student.phone
                            });
                            setShowAddStudentModal(true);
                          }}
                        >
                          <FiEdit2 />
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowDeleteStudentModal(true);
                          }}
                        >
                          <FiTrash2 />
                        </button>
                        <button 
                          className="add-btn"
                          onClick={() => {
                            setSelectedStudent(student);
                            setSelectedFeeRecord(null);
                            setIsEditing(false);
                            setFeeRecordData({
                              feeType: 'Tuition',
                              amount: '',
                              dueDate: '',
                              description: ''
                            });
                            setShowFeeRecordModal(true);
                          }}
                        >
                          <FiPlus /> Fee
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Student Modal */}
      <AnimatePresence>
        {showAddStudentModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddStudentModal(false)}
          >
            <motion.div 
              className="student-modal"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>{isEditingStudent ? 'Edit Student' : 'Add New Student'}</h3>
                <button onClick={() => setShowAddStudentModal(false)}>×</button>
              </div>
              
              <form onSubmit={handleStudentSubmit}>
                <div className="form-group">
                  <label>Student Name</label>
                  <input 
                    type="text" 
                    value={newStudentData.name}
                    onChange={(e) => setNewStudentData({...newStudentData, name: e.target.value})}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Class</label>
                    <input 
                      type="text" 
                      value={newStudentData.class}
                      onChange={(e) => setNewStudentData({...newStudentData, class: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Section</label>
                    <input 
                      type="text" 
                      value={newStudentData.section}
                      onChange={(e) => setNewStudentData({...newStudentData, section: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Roll No</label>
                    <input 
                      type="text" 
                      value={newStudentData.rollNo}
                      onChange={(e) => setNewStudentData({...newStudentData, rollNo: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Parent Name</label>
                  <input 
                    type="text" 
                    value={newStudentData.parent}
                    onChange={(e) => setNewStudentData({...newStudentData, parent: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Contact Number</label>
                  <input 
                    type="tel" 
                    value={newStudentData.phone}
                    onChange={(e) => setNewStudentData({...newStudentData, phone: e.target.value})}
                    required
                    pattern="[0-9]{10}"
                    title="Please enter a 10-digit phone number"
                  />
                </div>

                <div className="form-actions">
                  <button type="button" onClick={() => setShowAddStudentModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    {isEditingStudent ? 'Update' : 'Add'} Student
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Student Details Modal */}
      <AnimatePresence>
        {selectedStudent && !showPaymentModal && !showFeeRecordModal && !showDeleteModal && !showDeleteStudentModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedStudent(null)}
          >
            <motion.div 
              className="student-modal"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>{selectedStudent.name}'s Fee Details</h3>
                <button onClick={() => setSelectedStudent(null)}>×</button>
              </div>
              
              <div className="modal-body">
                <div className="student-details">
                  <div>
                    <span>Class:</span>
                    <span>{selectedStudent.class}-{selectedStudent.section}</span>
                  </div>
                  <div>
                    <span>Roll No:</span>
                    <span>{selectedStudent.rollNo}</span>
                  </div>
                  <div>
                    <span>Parent:</span>
                    <span>{selectedStudent.parent}</span>
                  </div>
                  <div>
                    <span>Contact:</span>
                    <span>{selectedStudent.phone}</span>
                  </div>
                </div>

                <div className="fee-records-section">
                  <div className="section-header">
                    <h4>Fee Records</h4>
                    <button 
                      className="add-btn"
                      onClick={() => {
                        setSelectedFeeRecord(null);
                        setIsEditing(false);
                        setFeeRecordData({
                          feeType: 'Tuition',
                          amount: '',
                          dueDate: '',
                          description: ''
                        });
                        setShowFeeRecordModal(true);
                      }}
                    >
                      <FiPlus /> Add Fee Record
                    </button>
                  </div>

                  {selectedStudent.feeRecords.length > 0 ? (
                    <div className="fee-records-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Fee Type</th>
                            <th>Amount</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedStudent.feeRecords.map(record => (
                            <tr key={record.id}>
                              <td>{record.feeType}</td>
                              <td>₹{record.amount.toLocaleString()}</td>
                              <td>{record.dueDate}</td>
                              <td>
                                <span className={`status-badge ${record.status.toLowerCase()}`}>
                                  {record.status}
                                </span>
                              </td>
                              <td>
                                <div className="record-actions">
                                  {record.status === 'Pending' && (
                                    <button 
                                      className="pay-btn"
                                      onClick={() => {
                                        setSelectedFeeRecord(record);
                                        setPaymentData({
                                          amount: record.amount,
                                          method: 'Online',
                                          transactionId: '',
                                          receiptNo: `REC-${Math.floor(Math.random() * 10000)}`
                                        });
                                        setShowPaymentModal(true);
                                      }}
                                    >
                                      Record Payment
                                    </button>
                                  )}
                                  {record.status === 'Paid' && (
                                    <button 
                                      className="download-btn"
                                      onClick={() => downloadFeeReceipt(selectedStudent, record)}
                                    >
                                      <FiDownload /> Receipt
                                    </button>
                                  )}
                                  <button 
                                    className="edit-btn"
                                    onClick={() => {
                                      setSelectedFeeRecord(record);
                                      setIsEditing(true);
                                      setFeeRecordData({
                                        feeType: record.feeType,
                                        amount: record.amount,
                                        dueDate: record.dueDate,
                                        description: record.description || ''
                                      });
                                      setShowFeeRecordModal(true);
                                    }}
                                  >
                                    <FiEdit2 />
                                  </button>
                                  <button 
                                    className="delete-btn"
                                    onClick={() => {
                                      setSelectedFeeRecord(record);
                                      setShowDeleteModal(true);
                                    }}
                                  >
                                    <FiTrash2 />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="no-records">
                      No fee records found for this student.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && selectedStudent && selectedFeeRecord && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPaymentModal(false)}
          >
            <motion.div 
              className="payment-modal"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Record Payment for {selectedStudent.name}</h3>
                <button onClick={() => setShowPaymentModal(false)}>×</button>
              </div>
              
              <form onSubmit={handlePaymentSubmit}>
                <div className="form-group">
                  <label>Fee Type</label>
                  <input 
                    type="text" 
                    value={selectedFeeRecord.feeType}
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label>Amount (₹)</label>
                  <input 
                    type="number" 
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Payment Method</label>
                  <select
                    value={paymentData.method}
                    onChange={(e) => setPaymentData({...paymentData, method: e.target.value})}
                    required
                  >
                    {paymentMethods.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>

                {paymentData.method !== 'Cash' && (
                  <div className="form-group">
                    <label>
                      {paymentData.method === 'Online' ? 'Transaction ID' : 
                       paymentData.method === 'Cheque' ? 'Cheque Number' : 'Reference Number'}
                    </label>
                    <input 
                      type="text"
                      value={paymentData.transactionId}
                      onChange={(e) => setPaymentData({...paymentData, transactionId: e.target.value})}
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Receipt Number</label>
                  <input 
                    type="text"
                    value={paymentData.receiptNo}
                    onChange={(e) => setPaymentData({...paymentData, receiptNo: e.target.value})}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="button" onClick={() => setShowPaymentModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    Record Payment
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fee Record Modal (Add/Edit) */}
      <AnimatePresence>
        {showFeeRecordModal && selectedStudent && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFeeRecordModal(false)}
          >
            <motion.div 
              className="fee-record-modal"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>
                  {isEditing ? 'Edit Fee Record' : 'Add New Fee Record'} for {selectedStudent.name}
                </h3>
                <button onClick={() => setShowFeeRecordModal(false)}>×</button>
              </div>
              
              <form onSubmit={handleFeeRecordSubmit}>
                <div className="form-group">
                  <label>Fee Type</label>
                  <select
                    value={feeRecordData.feeType}
                    onChange={(e) => setFeeRecordData({...feeRecordData, feeType: e.target.value})}
                    required
                  >
                    <option value="Tuition">Tuition</option>
                    <option value="Transport">Transport</option>
                    <option value="Library">Library</option>
                    <option value="Sports">Sports</option>
                    <option value="Exam">Exam</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Amount (₹)</label>
                  <input 
                    type="number" 
                    value={feeRecordData.amount}
                    onChange={(e) => setFeeRecordData({...feeRecordData, amount: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Due Date</label>
                  <input 
                    type="date" 
                    value={feeRecordData.dueDate}
                    onChange={(e) => setFeeRecordData({...feeRecordData, dueDate: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={feeRecordData.description}
                    onChange={(e) => setFeeRecordData({...feeRecordData, description: e.target.value})}
                    rows="3"
                  />
                </div>

                <div className="form-actions">
                  <button type="button" onClick={() => setShowFeeRecordModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    {isEditing ? 'Update' : 'Add'} Fee Record
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Fee Record Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedStudent && selectedFeeRecord && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div 
              className="delete-modal"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Confirm Deletion</h3>
                <button onClick={() => setShowDeleteModal(false)}>×</button>
              </div>
              
              <div className="modal-body">
                <p>
                  Are you sure you want to delete the fee record for {selectedFeeRecord.feeType} (₹{selectedFeeRecord.amount.toLocaleString()})?
                </p>
                <p>This action cannot be undone.</p>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="delete-btn"
                  onClick={handleDeleteFeeRecord}
                >
                  Delete Fee Record
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Student Confirmation Modal */}
      <AnimatePresence>
        {showDeleteStudentModal && selectedStudent && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeleteStudentModal(false)}
          >
            <motion.div 
              className="delete-modal"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Confirm Student Deletion</h3>
                <button onClick={() => setShowDeleteStudentModal(false)}>×</button>
              </div>
              
              <div className="modal-body">
                <p>
                  Are you sure you want to delete the student record for {selectedStudent.name} (Roll No: {selectedStudent.rollNo})?
                </p>
                <p>This will also delete all associated fee records. This action cannot be undone.</p>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowDeleteStudentModal(false)}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="delete-btn"
                  onClick={handleDeleteStudent}
                >
                  Delete Student
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeeManagementDashboard;