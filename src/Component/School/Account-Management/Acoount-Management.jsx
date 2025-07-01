import React, { useState, useEffect } from 'react';
import { 
  FiDollarSign, FiCreditCard, FiUsers, FiBriefcase, 
  FiCalendar, FiClock, FiSettings, FiPlus, 
  FiEdit2, FiTrash2, FiDownload, FiUpload, 
  FiFilter, FiSearch, FiCheck, FiX 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import './Account-Management.css';

const AccountDashboard = () => {
  // Data States
  const [salaries, setSalaries] = useState(() => {
    const saved = localStorage.getItem('salaries');
    return saved ? JSON.parse(saved) : [
      { 
        id: 'sal-001', 
        empId: 'EMP-101', 
        name: 'Rahul Sharma', 
        designation: 'Math Teacher', 
        basic: 35000, 
        hra: 7000, 
        da: 3500, 
        deductions: 2500, 
        netSalary: 43000, 
        status: 'paid', 
        paymentDate: '2023-06-05' 
      },
      { 
        id: 'sal-002', 
        empId: 'EMP-102', 
        name: 'Priya Patel', 
        designation: 'Science Teacher', 
        basic: 38000, 
        hra: 7600, 
        da: 3800, 
        deductions: 2800, 
        netSalary: 46600, 
        status: 'paid', 
        paymentDate: '2023-06-05' 
      },
      { 
        id: 'sal-003', 
        empId: 'EMP-103', 
        name: 'Amit Singh', 
        designation: 'Accountant', 
        basic: 42000, 
        hra: 8400, 
        da: 4200, 
        deductions: 3200, 
        netSalary: 51400, 
        status: 'pending', 
        paymentDate: '' 
      }
    ];
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [
      { 
        id: 'exp-001', 
        category: 'Stationery', 
        amount: 12500, 
        date: '2023-06-10', 
        description: 'School supplies for new session', 
        approvedBy: 'Principal', 
        status: 'approved' 
      },
      { 
        id: 'exp-002', 
        category: 'Maintenance', 
        amount: 18500, 
        date: '2023-06-15', 
        description: 'Classroom repairs', 
        approvedBy: 'Principal', 
        status: 'approved' 
      },
      { 
        id: 'exp-003', 
        category: 'Events', 
        amount: 25000, 
        date: '2023-06-20', 
        description: 'Annual function decorations', 
        approvedBy: '', 
        status: 'pending' 
      }
    ];
  });

  // UI States
  const [activeTab, setActiveTab] = useState('salary');
  const [salaryFilter, setSalaryFilter] = useState('all');
  const [expenseFilter, setExpenseFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSalaryForm, setShowSalaryForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initFormData());
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Initialize form data
  function initFormData() {
    return {
      empId: '',
      name: '',
      designation: '',
      basic: '',
      hra: '',
      da: '',
      deductions: '',
      category: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    };
  }

  // Check for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('salaries', JSON.stringify(salaries));
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [salaries, expenses]);

  // Calculate financial summaries
  const totalSalary = salaries
    .filter(s => s.status === 'paid')
    .reduce((sum, s) => sum + s.netSalary, 0);

  const totalExpenses = expenses
    .filter(e => e.status === 'approved')
    .reduce((sum, e) => sum + e.amount, 0);

  const pendingSalaries = salaries.filter(s => s.status === 'pending');
  const pendingExpenses = expenses.filter(e => e.status === 'pending');

  // Form handling
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(initFormData());
    setEditingId(null);
  };

  // Salary actions
  const handleSalarySubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateSalary();
    } else {
      addSalary();
    }
  };

  const addSalary = () => {
    const newSalary = {
      id: `sal-${Date.now()}`,
      ...formData,
      basic: Number(formData.basic),
      hra: Number(formData.hra),
      da: Number(formData.da),
      deductions: Number(formData.deductions),
      netSalary: Number(formData.basic) + Number(formData.hra) + Number(formData.da) - Number(formData.deductions),
      status: 'pending',
      paymentDate: ''
    };
    setSalaries([newSalary, ...salaries]);
    closeModal();
  };

  const updateSalary = () => {
    setSalaries(salaries.map(s => 
      s.id === editingId ? { 
        ...s, 
        ...formData,
        basic: Number(formData.basic),
        hra: Number(formData.hra),
        da: Number(formData.da),
        deductions: Number(formData.deductions),
        netSalary: Number(formData.basic) + Number(formData.hra) + Number(formData.da) - Number(formData.deductions)
      } : s
    ));
    closeModal();
  };

  const editSalary = (salary) => {
    setFormData({
      empId: salary.empId,
      name: salary.name,
      designation: salary.designation,
      basic: salary.basic,
      hra: salary.hra,
      da: salary.da,
      deductions: salary.deductions,
      category: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
    setEditingId(salary.id);
    setShowSalaryForm(true);
  };

  const paySalary = (id) => {
    setSalaries(salaries.map(s => 
      s.id === id ? { ...s, status: 'paid', paymentDate: new Date().toISOString().split('T')[0] } : s
    ));
  };

  const deleteSalary = (id) => {
    setSalaries(salaries.filter(s => s.id !== id));
  };

  // Expense actions
  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateExpense();
    } else {
      addExpense();
    }
  };

  const addExpense = () => {
    const newExpense = {
      id: `exp-${Date.now()}`,
      category: formData.category,
      amount: Number(formData.amount),
      date: formData.date,
      description: formData.description,
      approvedBy: '',
      status: 'pending'
    };
    setExpenses([newExpense, ...expenses]);
    closeModal();
  };

  const updateExpense = () => {
    setExpenses(expenses.map(e => 
      e.id === editingId ? { 
        ...e, 
        category: formData.category,
        amount: Number(formData.amount),
        date: formData.date,
        description: formData.description
      } : e
    ));
    closeModal();
  };

  const editExpense = (expense) => {
    setFormData({
      empId: '',
      name: '',
      designation: '',
      basic: '',
      hra: '',
      da: '',
      deductions: '',
      category: expense.category,
      amount: expense.amount,
      date: expense.date,
      description: expense.description
    });
    setEditingId(expense.id);
    setShowExpenseForm(true);
  };

  const approveExpense = (id) => {
    setExpenses(expenses.map(e => 
      e.id === id ? { ...e, status: 'approved', approvedBy: 'Admin' } : e
    ));
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  // Modal handling
  const openSalaryForm = () => {
    resetForm();
    setShowSalaryForm(true);
  };

  const openExpenseForm = () => {
    resetForm();
    setShowExpenseForm(true);
  };

  const closeModal = () => {
    setShowSalaryForm(false);
    setShowExpenseForm(false);
    resetForm();
  };

  // Filter data
  const filteredSalaries = salaries
    .filter(s => salaryFilter === 'all' || s.status === salaryFilter)
    .filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.designation.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const filteredExpenses = expenses
    .filter(e => expenseFilter === 'all' || e.status === expenseFilter)
    .filter(e => 
      e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.amount.toString().includes(searchTerm)
    );

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };

  const slideUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const stagger = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="account-dashboard">
      {/* Header */}
      <motion.header 
        className="dashboard-header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="dashboard-title">School Account Management</h1>
        <div className="header-controls">
          <div className="search-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search records..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <motion.button 
            className="export-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiDownload className="export-icon" /> Export
          </motion.button>
        </div>
      </motion.header>

      {/* Summary Cards */}
      <motion.div 
        className="summary-grid"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="summary-card salary-card"
          variants={slideUp}
          whileHover={{ y: -5 }}
        >
          <div className="card-icon salary-icon">
            <FiDollarSign />
          </div>
          <div className="card-content">
            <h3>Total Salary Paid</h3>
            <p>₹{totalSalary.toLocaleString()}</p>
            <span>This Month</span>
          </div>
        </motion.div>

        <motion.div 
          className="summary-card expense-card"
          variants={slideUp}
          whileHover={{ y: -5 }}
        >
          <div className="card-icon expense-icon">
            <FiCreditCard />
          </div>
          <div className="card-content">
            <h3>Total Expenses</h3>
            <p>₹{totalExpenses.toLocaleString()}</p>
            <span>This Month</span>
          </div>
        </motion.div>

        <motion.div 
          className="summary-card pending-salary-card"
          variants={slideUp}
          whileHover={{ y: -5 }}
        >
          <div className="card-icon pending-icon">
            <FiClock />
          </div>
          <div className="card-content">
            <h3>Pending Salaries</h3>
            <p>{pendingSalaries.length}</p>
            <span>Require Action</span>
          </div>
        </motion.div>

        <motion.div 
          className="summary-card pending-expense-card"
          variants={slideUp}
          whileHover={{ y: -5 }}
        >
          <div className="card-icon pending-icon">
            <FiClock />
          </div>
          <div className="card-content">
            <h3>Pending Expenses</h3>
            <p>{pendingExpenses.length}</p>
            <span>Require Approval</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Tab Navigation */}
        <motion.div 
          className="tab-nav"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <button
            className={`tab-btn ${activeTab === 'salary' ? 'active' : ''}`}
            onClick={() => setActiveTab('salary')}
          >
            <FiUsers className="tab-icon" /> Salary Management
          </button>
          <button
            className={`tab-btn ${activeTab === 'expense' ? 'active' : ''}`}
            onClick={() => setActiveTab('expense')}
          >
            <FiCreditCard className="tab-icon" /> Expense Management
          </button>
        </motion.div>

        {/* Salary Management */}
        {activeTab === 'salary' && (
          <motion.div
            className="management-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="section-header">
              <h2>Salary Records</h2>
              <div className="section-actions">
                <div className="filter-group">
                  <FiFilter className="filter-icon" />
                  <select
                    className="filter-select"
                    value={salaryFilter}
                    onChange={(e) => setSalaryFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <motion.button
                  className="add-btn"
                  onClick={openSalaryForm}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiPlus className="add-icon" /> Add Salary
                </motion.button>
              </div>
            </div>

            <div className="table-container">
              {filteredSalaries.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Emp ID</th>
                      <th>Name</th>
                      {!isMobile && <th>Designation</th>}
                      {!isMobile && <th>Basic</th>}
                      {!isMobile && <th>HRA</th>}
                      {!isMobile && <th>DA</th>}
                      {!isMobile && <th>Deductions</th>}
                      <th>Net Salary</th>
                      <th>Status</th>
                      {!isMobile && <th>Payment Date</th>}
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSalaries.map((salary) => (
                      <motion.tr
                        key={salary.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="data-row"
                      >
                        <td>{salary.empId}</td>
                        <td>{salary.name}</td>
                        {!isMobile && <td>{salary.designation}</td>}
                        {!isMobile && <td>₹{salary.basic.toLocaleString()}</td>}
                        {!isMobile && <td>₹{salary.hra.toLocaleString()}</td>}
                        {!isMobile && <td>₹{salary.da.toLocaleString()}</td>}
                        {!isMobile && <td>₹{salary.deductions.toLocaleString()}</td>}
                        <td>₹{salary.netSalary.toLocaleString()}</td>
                        <td>
                          <span className={`status-badge ${salary.status}`}>
                            {salary.status}
                          </span>
                        </td>
                        {!isMobile && <td>{salary.paymentDate || '-'}</td>}
                        <td>
                          <div className="action-btns">
                            {salary.status === 'pending' && (
                              <motion.button
                                className="action-btn pay-btn"
                                onClick={() => paySalary(salary.id)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <FiCheck />
                              </motion.button>
                            )}
                            <motion.button
                              className="action-btn edit-btn"
                              onClick={() => editSalary(salary)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <FiEdit2 />
                            </motion.button>
                            <motion.button
                              className="action-btn delete-btn"
                              onClick={() => deleteSalary(salary.id)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <FiTrash2 />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-data">
                  <p>No salary records found</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Expense Management */}
        {activeTab === 'expense' && (
          <motion.div
            className="management-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="section-header">
              <h2>Expense Records</h2>
              <div className="section-actions">
                <div className="filter-group">
                  <FiFilter className="filter-icon" />
                  <select
                    className="filter-select"
                    value={expenseFilter}
                    onChange={(e) => setExpenseFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <motion.button
                  className="add-btn"
                  onClick={openExpenseForm}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiPlus className="add-icon" /> Add Expense
                </motion.button>
              </div>
            </div>

            <div className="table-container">
              {filteredExpenses.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Amount</th>
                      {!isMobile && <th>Date</th>}
                      {!isMobile && <th>Description</th>}
                      {!isMobile && <th>Approved By</th>}
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.map((expense) => (
                      <motion.tr
                        key={expense.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="data-row"
                      >
                        <td>{expense.category}</td>
                        <td>₹{expense.amount.toLocaleString()}</td>
                        {!isMobile && <td>{expense.date}</td>}
                        {!isMobile && <td>{expense.description}</td>}
                        {!isMobile && <td>{expense.approvedBy || '-'}</td>}
                        <td>
                          <span className={`status-badge ${expense.status}`}>
                            {expense.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-btns">
                            {expense.status === 'pending' && (
                              <motion.button
                                className="action-btn approve-btn"
                                onClick={() => approveExpense(expense.id)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <FiCheck />
                              </motion.button>
                            )}
                            <motion.button
                              className="action-btn edit-btn"
                              onClick={() => editExpense(expense)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <FiEdit2 />
                            </motion.button>
                            <motion.button
                              className="action-btn delete-btn"
                              onClick={() => deleteExpense(expense.id)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <FiTrash2 />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-data">
                  <p>No expense records found</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Salary Form Modal */}
      <AnimatePresence>
        {showSalaryForm && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div 
              className="modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>{editingId ? 'Edit Salary' : 'Add New Salary'}</h3>
                <button className="modal-close" onClick={closeModal}>
                  <FiX />
                </button>
              </div>
              <form onSubmit={handleSalarySubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Employee ID</label>
                    <input
                      type="text"
                      name="empId"
                      value={formData.empId}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Designation</label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Basic Salary</label>
                      <input
                        type="number"
                        name="basic"
                        value={formData.basic}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>HRA</label>
                      <input
                        type="number"
                        name="hra"
                        value={formData.hra}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>DA</label>
                      <input
                        type="number"
                        name="da"
                        value={formData.da}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Deductions</label>
                      <input
                        type="number"
                        name="deductions"
                        value={formData.deductions}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="cancel-btn" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    {editingId ? 'Update' : 'Save'} Salary
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expense Form Modal */}
      <AnimatePresence>
        {showExpenseForm && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div 
              className="modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>{editingId ? 'Edit Expense' : 'Add New Expense'}</h3>
                <button className="modal-close" onClick={closeModal}>
                  <FiX />
                </button>
              </div>
              <form onSubmit={handleExpenseSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Stationery">Stationery</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Events">Events</option>
                      <option value="Transport">Transport</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Amount (₹)</label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="cancel-btn" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    {editingId ? 'Update' : 'Save'} Expense
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

export default AccountDashboard;