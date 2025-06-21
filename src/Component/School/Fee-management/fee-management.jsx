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
  FiWifiOff
} from 'react-icons/fi';
import '../../../assets/css/fee-management.css';

const FeeManagementDashboard = () => {
  // State for students data
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState([]);

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
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    method: 'Online',
    transactionId: '',
    receiptNo: ''
  });

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockStudents = [
          { id: 1, name: 'Aarav Sharma', class: '10', section: 'A', rollNo: '001', 
            feeType: 'Tuition', amount: 15000, dueDate: '2023-07-15', 
            status: 'Paid', paymentDate: '2023-06-10', paymentMethod: 'Online',
            parent: 'Rajesh Sharma', phone: '9876543210', transactions: [
              { id: 'TXN001', amount: 15000, method: 'Online', date: '2023-06-10', status: 'Success' }
            ]},
          { id: 2, name: 'Priya Patel', class: '9', section: 'B', rollNo: '032', 
            feeType: 'Tuition', amount: 12000, dueDate: '2023-07-15', 
            status: 'Pending', paymentDate: null, paymentMethod: null,
            parent: 'Amit Patel', phone: '9876543211', transactions: [] },

            { id: 3, name: 'Amisha Patel', class: '9', section: 'B', rollNo: '032', 
            feeType: 'Tuition', amount: 12000, dueDate: '2023-07-15', 
            status: 'Pending', paymentDate: null, paymentMethod: null,
            parent: 'Amit Patel', phone: '9876543211', transactions: [] },


            { id: 4, name: 'Raj Verma', class: '9', section: 'B', rollNo: '032', 
            feeType: 'Tuition', amount: 12000, dueDate: '2023-07-15', 
            status: 'Pending', paymentDate: null, paymentMethod: null,
            parent: '', phone: '7704087669', transactions: [] },
          // ... more mock data
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
    return (
      (searchTerm === '' || 
       student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       student.rollNo.includes(searchTerm) ||
       student.parent.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filters.class === 'All' || student.class === filters.class) &&
      (filters.section === 'All' || student.section === filters.section) &&
      (filters.status === 'All' || student.status === filters.status) &&
      (filters.feeType === 'All' || student.feeType === filters.feeType) &&
      (filters.paymentMethod === 'All' || student.paymentMethod === filters.paymentMethod)
    );
  });

  // Calculate dashboard stats
  const stats = {
    totalStudents: students.length,
    paidStudents: students.filter(s => s.status === 'Paid').length,
    pendingStudents: students.filter(s => s.status === 'Pending').length,
    totalRevenue: students.reduce((sum, s) => sum + (s.status === 'Paid' ? s.amount : 0), 0),
    onlinePayments: students.filter(s => s.paymentMethod === 'Online').length,
    offlinePayments: students.filter(s => s.paymentMethod && s.paymentMethod !== 'Online').length
  };

  // Handle payment submission
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    // Update student payment status
    const updatedStudents = students.map(student => {
      if (student.id === selectedStudent.id) {
        return {
          ...student,
          status: 'Paid',
          paymentMethod: paymentData.method,
          paymentDate: new Date().toISOString().split('T')[0],
          transactions: [
            ...student.transactions,
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
      return student;
    });

    setStudents(updatedStudents);
    setShowPaymentModal(false);
    setSelectedStudent(null);
    setPaymentData({
      amount: '',
      method: 'Online',
      transactionId: '',
      receiptNo: ''
    });
  };

  // Get unique values for filters
  const classes = [...new Set(students.map(s => s.class))];
  const sections = [...new Set(students.map(s => s.section))];
  const feeTypes = [...new Set(students.map(s => s.feeType))];
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
      <header className="dashboard-header" >
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
        className="stats-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        <motion.div 
          className="stat-card total-students"
          whileHover={{ y: -5 }}
        >
          <div>
            <h3>Total Students</h3>
            <p>{stats.totalStudents}</p>
          </div>
          <FiUsers size={32} />
        </motion.div>

        <motion.div 
          className="stat-card paid-students cardd"
          whileHover={{ y: -5 }}
        >
          <div>
            <h3>Paid Fees</h3>
            <p>{stats.paidStudents}</p>
          </div>
          <FiCheckCircle size={32} />
        </motion.div>

        <motion.div 
          className="stat-card pending-students cards-bg"
          whileHover={{ y: -5 }}
        >
          <div>
            <h3>Pending Fees</h3>
            <p>{stats.pendingStudents}</p>
          </div>
          <FiAlertCircle size={32} />
        </motion.div>

        <motion.div 
          className="stat-card total-revenue card-bgg"
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
          <button className="export-btn">
            <FiDownload /> Export
          </button>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Fee Type</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Payment Method</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
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
                  <td>{student.feeType}</td>
                  <td>₹{student.amount.toLocaleString()}</td>
                  <td>{student.dueDate}</td>
                  <td>
                    <span className={`status-badge ${student.status.toLowerCase()}`}>
                      {student.status}
                    </span>
                  </td>
                  <td>
                    {student.paymentMethod ? (
                      <div className="payment-method">
                        {student.paymentMethod === 'Online' ? (
                          <FiWifi className="online-icon" />
                        ) : (
                          <FiWifiOff className="offline-icon" />
                        )}
                        {student.paymentMethod}
                      </div>
                    ) : '-'}
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
                        className="pay-btn"
                        onClick={() => {
                          setSelectedStudent(student);
                          setPaymentData({
                            ...paymentData,
                            amount: student.amount
                          });
                          setShowPaymentModal(true);
                        }}
                        disabled={student.status === 'Paid'}
                      >
                        {student.status === 'Paid' ? 'Paid' : 'Record Payment'}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Details Modal */}
      <AnimatePresence>
        {selectedStudent && !showPaymentModal && (
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

                <div className="fee-details">
                  <div>
                    <span>Fee Type:</span>
                    <span>{selectedStudent.feeType}</span>
                  </div>
                  <div>
                    <span>Amount:</span>
                    <span>₹{selectedStudent.amount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span>Due Date:</span>
                    <span>{selectedStudent.dueDate}</span>
                  </div>
                  <div>
                    <span>Status:</span>
                    <span className={`status-badge ${selectedStudent.status.toLowerCase()}`}>
                      {selectedStudent.status}
                    </span>
                  </div>
                  {selectedStudent.paymentMethod && (
                    <div>
                      <span>Payment Method:</span>
                      <span>
                        {selectedStudent.paymentMethod === 'Online' ? (
                          <FiWifi className="online-icon" />
                        ) : (
                          <FiWifiOff className="offline-icon" />
                        )}
                        {selectedStudent.paymentMethod}
                      </span>
                    </div>
                  )}
                </div>

                {selectedStudent.transactions.length > 0 && (
                  <div className="transaction-history ">
                    <h4>Payment History</h4>
                    <table>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Amount</th>
                          <th>Method</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedStudent.transactions.map(txn => (
                          <tr key={txn.id}>
                            <td>{txn.date}</td>
                            <td>₹{txn.amount.toLocaleString()}</td>
                            <td>{txn.method}</td>
                            <td className="status-success">{txn.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && selectedStudent && (
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
    </div>
  );
};

export default FeeManagementDashboard;