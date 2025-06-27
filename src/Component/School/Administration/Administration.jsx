import React, { useState, useEffect } from 'react';
import { 
  Users, User, BookOpen, Search, Plus, Edit, Trash2, Eye, 
  Home, Book, Clipboard, Settings, Bell, Mail, X, ChevronDown,
  Calendar, Clock, CheckCircle, FileText, BarChart2, Loader,
  Send, Inbox, AlertCircle, MessageSquare, MailOpen, CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../../assets/css/administration.css';

const SchoolERP = () => {
  // Active tab state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  
  // Notification and messaging states
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      type: 'admission',
      title: 'New admission request', 
      message: 'Arjun Sharma has submitted admission form', 
      time: '2 mins ago', 
      read: false,
      icon: <User size={16} />
    },
    { 
      id: 2, 
      type: 'payment',
      title: 'Fee payment received', 
      message: '₹15,000 received from Priya Patel', 
      time: '1 hour ago', 
      read: false,
      icon: <CreditCard size={16} />
    },
    { 
      id: 3, 
      type: 'meeting',
      title: 'Staff meeting', 
      message: 'Scheduled for today at 3 PM in conference room', 
      time: '3 hours ago', 
      read: true,
      icon: <Calendar size={16} />
    }
  ]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Dr. Rajesh Kumar',
      senderRole: 'Mathematics Teacher',
      subject: 'About tomorrow\'s class',
      content: 'Can we reschedule tomorrow\'s class to 11 AM instead of 9 AM?',
      time: '10:30 AM',
      date: 'Today',
      read: false,
      starred: false
    },
    {
      id: 2,
      sender: 'School Administration',
      senderRole: 'Administration',
      subject: 'Important: School closure notice',
      content: 'School will remain closed on 25th December for Christmas holiday',
      time: 'Yesterday',
      date: 'Dec 20',
      read: true,
      starred: true
    }
  ]);

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [newMessage, setNewMessage] = useState({
    recipient: '',
    subject: '',
    content: ''
  });
  const [activeMessage, setActiveMessage] = useState(null);
  const [unreadCount, setUnreadCount] = useState({
    notifications: notifications.filter(n => !n.read).length,
    messages: messages.filter(m => !m.read).length
  });

  // Data states
  const [teachers, setTeachers] = useState(() => {
    const saved = localStorage.getItem('teachers');
    return saved ? JSON.parse(saved) : [
      { 
        id: 1, 
        name: 'Dr. Rajesh Kumar', 
        email: 'rajesh@school.edu',
        phone: '+91 9876543210',
        subject: 'Mathematics',
        qualification: 'PhD in Mathematics',
        joiningDate: '2020-05-15',
        salary: '75000',
        address: '123 Teacher Colony, City',
        status: 'active'
      },
      { 
        id: 2, 
        name: 'Priya Sharma', 
        email: 'priya@school.edu',
        phone: '+91 9876543211',
        subject: 'Physics',
        qualification: 'M.Sc, B.Ed',
        joiningDate: '2021-03-10',
        salary: '65000',
        address: '456 Faculty Road, City',
        status: 'active'
      }
    ];
  });

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('students');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        name: 'Arjun Sharma',
        rollNo: '2023001',
        class: '10th Grade',
        section: 'A',
        fatherName: 'Ramesh Sharma',
        motherName: 'Sunita Sharma',
        phone: '+91 9876543211',
        address: '456 Student Nagar, City',
        admissionDate: '2023-04-01',
        transport: 'Bus Route 1',
        status: 'active'
      },
      {
        id: 2,
        name: 'Priya Patel',
        rollNo: '2023002',
        class: '11th Grade',
        section: 'B',
        fatherName: 'Amit Patel',
        motherName: 'Neha Patel',
        phone: '+91 9876543212',
        address: '789 Student Colony, City',
        admissionDate: '2023-04-15',
        transport: 'Bus Route 2',
        status: 'active'
      }
    ];
  });

  const [staff, setStaff] = useState(() => {
    const saved = localStorage.getItem('staff');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        name: 'Mohan Lal',
        role: 'Accountant',
        email: 'mohan@school.edu',
        phone: '+91 9876543212',
        joiningDate: '2019-07-10',
        salary: '45000',
        address: '789 Staff Colony, City',
        status: 'active'
      },
      {
        id: 2,
        name: 'Sunita Devi',
        role: 'Librarian',
        email: 'sunita@school.edu',
        phone: '+91 9876543213',
        joiningDate: '2020-01-15',
        salary: '40000',
        address: '321 Staff Quarters, City',
        status: 'active'
      }
    ];
  });

  // Modal and form states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    class: '',
    subject: '',
    role: '',
    status: 'active'
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    subject: '',
    qualification: '',
    salary: '',
    rollNo: '',
    class: '',
    section: '',
    fatherName: '',
    motherName: '',
    role: '',
    status: 'active'
  });

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('teachers', JSON.stringify(teachers));
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('staff', JSON.stringify(staff));
  }, [teachers, students, staff]);

  // Update unread counts when notifications or messages change
  useEffect(() => {
    updateUnreadCounts();
  }, [notifications, messages]);

  // Simulate loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Dashboard statistics
  const stats = {
    totalStudents: students.filter(s => s.status === 'active').length,
    totalTeachers: teachers.filter(t => t.status === 'active').length,
    totalStaff: staff.filter(s => s.status === 'active').length,
    activeClasses: [...new Set(students.filter(s => s.status === 'active').map(s => s.class))].length,
    newAdmissions: students.filter(s => 
      s.status === 'active' && 
      new Date(s.admissionDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length,
    recentHires: teachers.filter(t => 
      t.status === 'active' && 
      new Date(t.joiningDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length
  };

  // Mark notifications as read
  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // Mark message as read
  const markMessageAsRead = (id) => {
    setMessages(messages.map(m => 
      m.id === id ? { ...m, read: true } : m
    ));
  };

  // Update unread counts
  const updateUnreadCounts = () => {
    setUnreadCount({
      notifications: notifications.filter(n => !n.read).length,
      messages: messages.filter(m => !m.read).length
    });
  };

  // Send new message
  const sendMessage = () => {
    const newMsg = {
      id: messages.length + 1,
      sender: 'You',
      senderRole: 'Admin',
      subject: newMessage.subject,
      content: newMessage.content,
      time: 'Just now',
      date: 'Today',
      read: true,
      starred: false
    };
    
    setMessages([newMsg, ...messages]);
    setNewMessage({ recipient: '', subject: '', content: '' });
    setShowMessageModal(false);
  };

  // Modal handlers
  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    
    if (item) {
      setFormData({
        ...formData,
        ...item
      });
    } else {
      resetForm();
    }
    
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      subject: '',
      qualification: '',
      salary: '',
      rollNo: '',
      class: '',
      section: '',
      fatherName: '',
      motherName: '',
      role: '',
      status: 'active'
    });
    setSelectedItem(null);
  };

  // CRUD operations with status handling
  const handleAdd = () => {
    setLoading(true);
    
    setTimeout(() => {
      if (modalType === 'teacher') {
        const newTeacher = {
          id: teachers.length > 0 ? Math.max(...teachers.map(t => t.id)) + 1 : 1,
          ...formData,
          joiningDate: new Date().toISOString().split('T')[0]
        };
        setTeachers([...teachers, newTeacher]);
      } 
      else if (modalType === 'student') {
        const newStudent = {
          id: students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1,
          ...formData,
          admissionDate: new Date().toISOString().split('T')[0]
        };
        setStudents([...students, newStudent]);
      }
      else if (modalType === 'staff') {
        const newStaff = {
          id: staff.length > 0 ? Math.max(...staff.map(s => s.id)) + 1 : 1,
          ...formData,
          joiningDate: new Date().toISOString().split('T')[0]
        };
        setStaff([...staff, newStaff]);
      }
      
      setLoading(false);
      closeModal();
    }, 800);
  };

  const handleUpdate = () => {
    if (!selectedItem) return;
    
    setLoading(true);
    
    setTimeout(() => {
      if (modalType === 'teacher') {
        setTeachers(teachers.map(t => 
          t.id === selectedItem.id ? { ...t, ...formData } : t
        ));
      } 
      else if (modalType === 'student') {
        setStudents(students.map(s => 
          s.id === selectedItem.id ? { ...s, ...formData } : s
        ));
      }
      else if (modalType === 'staff') {
        setStaff(staff.map(s => 
          s.id === selectedItem.id ? { ...s, ...formData } : s
        ));
      }
      
      setLoading(false);
      closeModal();
    }, 800);
  };

  const handleStatusChange = (type, id, newStatus) => {
    if (type === 'teacher') {
      setTeachers(teachers.map(t => 
        t.id === id ? { ...t, status: newStatus } : t
      ));
    } 
    else if (type === 'student') {
      setStudents(students.map(s => 
        s.id === id ? { ...s, status: newStatus } : s
      ));
    }
    else if (type === 'staff') {
      setStaff(staff.map(s => 
        s.id === id ? { ...s, status: newStatus } : s
      ));
    }
  };

  const handleDelete = (type, id) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      setLoading(true);
      
      setTimeout(() => {
        if (type === 'teacher') {
          setTeachers(teachers.filter(t => t.id !== id));
        } 
        else if (type === 'student') {
          setStudents(students.filter(s => s.id !== id));
        }
        else if (type === 'staff') {
          setStaff(staff.filter(s => s.id !== id));
        }
        
        setLoading(false);
      }, 800);
    }
  };

  // Filter and search functions
  const filteredTeachers = teachers.filter(teacher => 
    (teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filters.subject ? teacher.subject === filters.subject : true) &&
    (filters.status ? teacher.status === filters.status : true)
  );

  const filteredStudents = students.filter(student => 
    (student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filters.class ? student.class === filters.class : true) &&
    (filters.status ? student.status === filters.status : true)
  );

  const filteredStaff = staff.filter(staffMember => 
    (staffMember.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staffMember.role.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filters.role ? staffMember.role === filters.role : true) &&
    (filters.status ? staffMember.status === filters.status : true)
  );

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
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
    <div className="school-erp">
      {/* Top Navigation */}
      <motion.header 
        className="top-navs"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="left-section">
          <h1 className="page-title">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h1>
        </div>
        
        <div className="right-section">
          {/* Messages dropdown */}
          <div className="message-dropdown">
            <button 
              className="icon-button"
              onClick={() => setShowNotifications(false)}
            >
              <Mail />
              {unreadCount.messages > 0 && (
                <span className="badge">{unreadCount.messages}</span>
              )}
            </button>
            <div className="dropdown-content messages">
              <div className="dropdown-header">
                <h3>Messages</h3>
                <button 
                  className="btn btn-small"
                  onClick={() => setShowMessageModal(true)}
                >
                  <Plus size={16} /> New
                </button>
              </div>
              <div className="message-list">
                {messages.slice(0, 3).map(message => (
                  <div 
                    key={message.id} 
                    className={`message-item ${!message.read ? 'unread' : ''}`}
                    onClick={() => {
                      setActiveMessage(message);
                      markMessageAsRead(message.id);
                    }}
                  >
                    <div className="message-sender">
                      {message.sender}
                      {message.starred && <span className="starred">★</span>}
                    </div>
                    <div className="message-subject">{message.subject}</div>
                    <div className="message-preview">{message.content.substring(0, 50)}...</div>
                    <div className="message-time">{message.time}</div>
                  </div>
                ))}
                {messages.length > 3 && (
                  <div className="view-all">
                    <button className="btn btn-link">View all messages</button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Notifications dropdown */}
          <div className="notification-dropdown">
            <button 
              className="icon-button"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell />
              {unreadCount.notifications > 0 && (
                <span className="badge">{unreadCount.notifications}</span>
              )}
            </button>
            {showNotifications && (
              <div className="dropdown-content notifications">
                <div className="dropdown-header">
                  <h3>Notifications</h3>
                  <button 
                    className="btn btn-link"
                    onClick={markAllNotificationsAsRead}
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="notification-list">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${!notification.read ? 'unread' : ''}`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div className="notification-icon">
                        {notification.icon}
                      </div>
                      <div className="notification-content">
                        <div className="notification-title">{notification.title}</div>
                        <div className="notification-message">{notification.message}</div>
                        <div className="notification-time">{notification.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="user-profile">
            <div className="avatar">AD</div>
            <span>Admin</span>
            <ChevronDown size={16} />
          </div>
        </div>
      </motion.header>

      {/* Horizontal Navigation Tabs */}
      <motion.div 
        className="horizontal-nav"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <button 
          className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <Home /> <span>Dashboard</span>
        </button>
        
        <button 
          className={`nav-tab ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          <Users /> <span>Students</span>
        </button>
        
        <button 
          className={`nav-tab ${activeTab === 'teachers' ? 'active' : ''}`}
          onClick={() => setActiveTab('teachers')}
        >
          <User /> <span>Teachers</span>
        </button>
        
        <button 
          className={`nav-tab ${activeTab === 'staff' ? 'active' : ''}`}
          onClick={() => setActiveTab('staff')}
        >
          <Clipboard /> <span>Staff</span>
        </button>
        
        <button 
          className={`nav-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings /> <span>Settings</span>
        </button>
      </motion.div>

      {/* Main Content */}
      <div className="content-area">
        {loading ? (
          <div className="loading-overlay">
            <Loader className="spinner" size={48} />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                className="dashboard"
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="stats-grid"
                  variants={stagger}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div 
                    className="stat-card"
                    variants={slideUp}
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="stat-icon students">
                      <Users />
                    </div>
                    <div className="stat-info">
                      <h3>Total Students</h3>
                      <p>{stats.totalStudents}</p>
                      <span className="stat-trend">+{stats.newAdmissions} new</span>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="stat-card"
                    variants={slideUp}
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="stat-icon teachers">
                      <User />
                    </div>
                    <div className="stat-info">
                      <h3>Total Teachers</h3>
                      <p>{stats.totalTeachers}</p>
                      <span className="stat-trend">+{stats.recentHires} new</span>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="stat-card"
                    variants={slideUp}
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="stat-icon staff">
                      <Clipboard />
                    </div>
                    <div className="stat-info">
                      <h3>Total Staff</h3>
                      <p>{stats.totalStaff}</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="stat-card"
                    variants={slideUp}
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="stat-icon classes">
                      <Book />
                    </div>
                    <div className="stat-info">
                      <h3>Active Classes</h3>
                      <p>{stats.activeClasses}</p>
                    </div>
                  </motion.div>
                </motion.div>
                
                <motion.div 
                  className="recent-activities"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2>Recent Activities</h2>
                  <div className="activity-list">
                    {notifications.map(notification => (
                      <motion.div 
                        key={notification.id} 
                        className={`activity-item ${notification.read ? 'read' : ''}`}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="activity-message">
                          {notification.message}
                        </div>
                        <div className="activity-time">
                          {notification.time}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'students' && (
              <motion.div
                className="management-section"
                key="students"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="section-header">
                  <h2>Student Management</h2>
                  <button 
                    className="btn btn-primary"
                    onClick={() => openModal('student')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus /> Add Student
                  </button>
                </div>
                
                <div className="search-filter-bar">
                  <div className="search-box">
                    <Search />
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="filters">
                    <select
                      value={filters.class}
                      onChange={(e) => setFilters({...filters, class: e.target.value})}
                    >
                      <option value="">All Classes</option>
                      <option value="10th Grade">10th Grade</option>
                      <option value="11th Grade">11th Grade</option>
                      <option value="12th Grade">12th Grade</option>
                    </select>
                    
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({...filters, status: e.target.value})}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="">All Status</option>
                    </select>
                  </div>
                </div>
                
                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Roll No</th>
                        <th>Student Name</th>
                        <th>Class</th>
                        <th>Father Name</th>
                        <th>Contact</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map(student => (
                        <motion.tr 
                          key={student.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <td>{student.rollNo}</td>
                          <td>
                            <div className="user-info">
                              <div className="avatar">
                                {student.name.charAt(0)}
                              </div>
                              <div>
                                <div className="name">{student.name}</div>
                                <div className="email">{student.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>{student.class} - {student.section}</td>
                          <td>{student.fatherName}</td>
                          <td>{student.phone}</td>
                          <td>
                            <div className={`status-badge ${student.status}`}>
                              {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                            </div>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="btn-icon view"
                                onClick={() => openModal('student-view', student)}
                              >
                                <Eye />
                              </button>
                              <button 
                                className="btn-icon edit"
                                onClick={() => openModal('student', student)}
                              >
                                <Edit />
                              </button>
                              <button 
                                className="btn-icon delete"
                                onClick={() => handleDelete('student', student.id)}
                              >
                                <Trash2 />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'teachers' && (
              <motion.div
                className="management-section"
                key="teachers"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="section-header">
                  <h2>Teacher Management</h2>
                  <button 
                    className="btn btn-primary"
                    onClick={() => openModal('teacher')}
                  >
                    <Plus /> Add Teacher
                  </button>
                </div>
                
                <div className="search-filter-bar">
                  <div className="search-box">
                    <Search />
                    <input
                      type="text"
                      placeholder="Search teachers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="filters">
                    <select
                      value={filters.subject}
                      onChange={(e) => setFilters({...filters, subject: e.target.value})}
                    >
                      <option value="">All Subjects</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                      <option value="English">English</option>
                    </select>
                    
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({...filters, status: e.target.value})}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="">All Status</option>
                    </select>
                  </div>
                </div>
                
                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Teacher Name</th>
                        <th>Subject</th>
                        <th>Qualification</th>
                        <th>Contact</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTeachers.map(teacher => (
                        <motion.tr 
                          key={teacher.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <td>
                            <div className="user-info">
                              <div className="avatar">
                                {teacher.name.charAt(0)}
                              </div>
                              <div>
                                <div className="name">{teacher.name}</div>
                                <div className="email">{teacher.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>{teacher.subject}</td>
                          <td>{teacher.qualification}</td>
                          <td>{teacher.phone}</td>
                          <td>
                            <div className={`status-badge ${teacher.status}`}>
                              {teacher.status.charAt(0).toUpperCase() + teacher.status.slice(1)}
                            </div>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="btn-icon view"
                                onClick={() => openModal('teacher-view', teacher)}
                              >
                                <Eye />
                              </button>
                              <button 
                                className="btn-icon edit"
                                onClick={() => openModal('teacher', teacher)}
                              >
                                <Edit />
                              </button>
                              <button 
                                className="btn-icon delete"
                                onClick={() => handleDelete('teacher', teacher.id)}
                              >
                                <Trash2 />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'staff' && (
              <motion.div
                className="management-section"
                key="staff"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="section-header">
                  <h2>Staff Management</h2>
                  <button 
                    className="btn btn-primary"
                    onClick={() => openModal('staff')}
                  >
                    <Plus /> Add Staff
                  </button>
                </div>
                
                <div className="search-filter-bar">
                  <div className="search-box">
                    <Search />
                    <input
                      type="text"
                      placeholder="Search staff..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="filters">
                    <select
                      value={filters.role}
                      onChange={(e) => setFilters({...filters, role: e.target.value})}
                    >
                      <option value="">All Roles</option>
                      <option value="Accountant">Accountant</option>
                      <option value="Librarian">Librarian</option>
                      <option value="Receptionist">Receptionist</option>
                      <option value="Security">Security</option>
                      <option value="Cleaner">Cleaner</option>
                    </select>
                    
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({...filters, status: e.target.value})}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="">All Status</option>
                    </select>
                  </div>
                </div>
                
                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Staff Name</th>
                        <th>Role</th>
                        <th>Contact</th>
                        <th>Salary</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStaff.map(staffMember => (
                        <motion.tr 
                          key={staffMember.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <td>
                            <div className="user-info">
                              <div className="avatar">
                                {staffMember.name.charAt(0)}
                              </div>
                              <div>
                                <div className="name">{staffMember.name}</div>
                                <div className="email">{staffMember.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>{staffMember.role}</td>
                          <td>{staffMember.phone}</td>
                          <td>₹{staffMember.salary}</td>
                          <td>
                            <div className={`status-badge ${staffMember.status}`}>
                              {staffMember.status.charAt(0).toUpperCase() + staffMember.status.slice(1)}
                            </div>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="btn-icon view"
                                onClick={() => openModal('staff-view', staffMember)}
                              >
                                <Eye />
                              </button>
                              <button 
                                className="btn-icon edit"
                                onClick={() => openModal('staff', staffMember)}
                              >
                                <Edit />
                              </button>
                              <button 
                                className="btn-icon delete"
                                onClick={() => handleDelete('staff', staffMember.id)}
                              >
                                <Trash2 />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                className="management-section"
                key="settings"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2>System Settings</h2>
                <div className="settings-grid">
                  <div className="setting-card">
                    <h3>General Settings</h3>
                    <p>Configure school information, academic year, and basic preferences</p>
                  </div>
                  <div className="setting-card">
                    <h3>User Management</h3>
                    <p>Manage user roles, permissions, and access controls</p>
                  </div>
                  <div className="setting-card">
                    <h3>Academic Settings</h3>
                    <p>Set up classes, subjects, grading systems, and academic calendar</p>
                  </div>
                  <div className="setting-card">
                    <h3>Notification Settings</h3>
                    <p>Configure email and system notification preferences</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Message Modal */}
      <AnimatePresence>
        {showMessageModal && (
          <motion.div 
            className="modal-overlays"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMessageModal(false)}
          >
            <motion.div 
              className="modals"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-closes" onClick={() => setShowMessageModal(false)}>
                <X />
              </button>
              
              <div className="modal-headers">
                <h2>New Message</h2>
              </div>
              
              <div className="modal-body">
                <form className="modal-form">
                  <div className="form-group">
                    <label>Recipient</label>
                    <select
                      value={newMessage.recipient}
                      onChange={(e) => setNewMessage({...newMessage, recipient: e.target.value})}
                      required
                    >
                      <option value="">Select Recipient</option>
                      <option value="all_teachers">All Teachers</option>
                      <option value="all_students">All Students</option>
                      <option value="all_staff">All Staff</option>
                      {teachers.map(teacher => (
                        <option key={`teacher_${teacher.id}`} value={`teacher_${teacher.id}`}>
                          {teacher.name} (Teacher)
                        </option>
                      ))}
                      {students.map(student => (
                        <option key={`student_${student.id}`} value={`student_${student.id}`}>
                          {student.name} (Student)
                        </option>
                      ))}
                      {staff.map(staffMember => (
                        <option key={`staff_${staffMember.id}`} value={`staff_${staffMember.id}`}>
                          {staffMember.name} ({staffMember.role})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Subject</label>
                    <input
                      type="text"
                      value={newMessage.subject}
                      onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Message</label>
                    <textarea
                      value={newMessage.content}
                      onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                      required
                      rows={8}
                    />
                  </div>
                </form>
              </div>
              
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowMessageModal(false)}>
                  Cancel
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={sendMessage}
                  disabled={!newMessage.recipient || !newMessage.subject || !newMessage.content}
                >
                  <Send size={16} /> Send Message
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Detail Modal */}
      <AnimatePresence>
        {activeMessage && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveMessage(null)}
          >
            <motion.div 
              className="modal"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setActiveMessage(null)}>
                <X />
              </button>
              
              <div className="modal-header">
                <h2>{activeMessage.subject}</h2>
                <div className="message-meta">
                  From: {activeMessage.sender} ({activeMessage.senderRole})
                </div>
              </div>
              
              <div className="modal-body message-body">
                <div className="message-content">
                  {activeMessage.content}
                </div>
                <div className="message-time">
                  {activeMessage.date} at {activeMessage.time}
                </div>
              </div>
              
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setActiveMessage(null)}>
                  Close
                </button>
                <button className="btn btn-primary">
                  <MailOpen size={16} /> Mark as Unread
                </button>
                <button className="btn btn-primary">
                  <Send size={16} /> Reply
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data Management Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div 
              className="modal"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={closeModal}>
                <X />
              </button>
              
              <div className="modal-header">
                <h2>
                  {modalType.includes('view') ? 'View' : selectedItem ? 'Edit' : 'Add'} 
                  {modalType.includes('teacher') ? ' Teacher' : 
                  modalType.includes('student') ? ' Student' : ' Staff'}
                </h2>
              </div>
              
              <div className="modal-body">
                {modalType.includes('view') ? (
                  <div className="view-details">
                    {selectedItem && Object.entries(selectedItem).map(([key, value]) => (
                      <div className="detail-row" key={key}>
                        <span className="detail-label">
                          {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:
                        </span>
                        <span className="detail-value">{value || '-'}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <form className="modal-form">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Address</label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    
                    {/* Teacher specific fields */}
                    {modalType.includes('teacher') && (
                      <>
                        <div className="form-group">
                          <label>Subject</label>
                          <input
                            type="text"
                            value={formData.subject}
                            onChange={(e) => setFormData({...formData, subject: e.target.value})}
                            required
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Qualification</label>
                          <input
                            type="text"
                            value={formData.qualification}
                            onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                            required
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Salary</label>
                          <input
                            type="text"
                            value={formData.salary}
                            onChange={(e) => setFormData({...formData, salary: e.target.value})}
                            required
                          />
                        </div>
                      </>
                    )}
                    
                    {/* Student specific fields */}
                    {modalType.includes('student') && (
                      <>
                        <div className="form-group">
                          <label>Roll No</label>
                          <input
                            type="text"
                            value={formData.rollNo}
                            onChange={(e) => setFormData({...formData, rollNo: e.target.value})}
                            required
                          />
                        </div>
                        
                        <div className="form-row">
                          <div className="form-group">
                            <label>Class</label>
                            <select
                              value={formData.class}
                              onChange={(e) => setFormData({...formData, class: e.target.value})}
                              required
                            >
                              <option value="">Select Class</option>
                              <option value="10th Grade">10th Grade</option>
                              <option value="11th Grade">11th Grade</option>
                              <option value="12th Grade">12th Grade</option>
                            </select>
                          </div>
                          
                          <div className="form-group">
                            <label>Section</label>
                            <select
                              value={formData.section}
                              onChange={(e) => setFormData({...formData, section: e.target.value})}
                              required
                            >
                              <option value="">Select Section</option>
                              <option value="A">A</option>
                              <option value="B">B</option>
                              <option value="C">C</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="form-row">
                          <div className="form-group">
                            <label>Father's Name</label>
                            <input
                              type="text"
                              value={formData.fatherName}
                              onChange={(e) => setFormData({...formData, fatherName: e.target.value})}
                              required
                            />
                          </div>
                          
                          <div className="form-group">
                            <label>Mother's Name</label>
                            <input
                              type="text"
                              value={formData.motherName}
                              onChange={(e) => setFormData({...formData, motherName: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                      </>
                    )}
                    
                    {/* Staff specific fields */}
                    {modalType.includes('staff') && (
                      <>
                        <div className="form-group">
                          <label>Role</label>
                          <select
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                            required
                          >
                            <option value="">Select Role</option>
                            <option value="Accountant">Accountant</option>
                            <option value="Librarian">Librarian</option>
                            <option value="Receptionist">Receptionist</option>
                            <option value="Security">Security</option>
                            <option value="Cleaner">Cleaner</option>
                          </select>
                        </div>
                        
                        <div className="form-group">
                          <label>Salary</label>
                          <input
                            type="text"
                            value={formData.salary}
                            onChange={(e) => setFormData({...formData, salary: e.target.value})}
                            required
                          />
                        </div>
                      </>
                    )}
                  </form>
                )}
              </div>
              
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                
                {!modalType.includes('view') && (
                  <button 
                    className="btn btn-primary"
                    onClick={selectedItem ? handleUpdate : handleAdd}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader className="spinner" size={16} />
                        {selectedItem ? 'Updating...' : 'Adding...'}
                      </>
                    ) : (
                      selectedItem ? 'Update' : 'Add'
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SchoolERP;