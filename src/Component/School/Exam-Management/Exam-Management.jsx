import React, { useState, useEffect } from 'react';
import { Calendar, Users, FileText, BarChart3, Clock, Search, Plus, Edit, Trash2, Eye, Download, AlertCircle, CheckCircle, MapPin, User, Shuffle, BookOpen, X, ChevronDown, ChevronUp } from 'lucide-react';
import './Exam-Management.css';

const ExamManagementDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Load data from localStorage if available
  const [exams, setExams] = useState(() => {
    const savedExams = localStorage.getItem('exams');
    return savedExams ? JSON.parse(savedExams) : [
      { 
        id: 1, 
        title: 'Mid-Term Mathematics', 
        date: '2025-07-15', 
        time: '10:00', 
        duration: '3 hours', 
        students: 120, 
        status: 'scheduled', 
        subject: 'Mathematics', 
        class: '10th Grade',
        teacher: 'Dr. Rajesh Kumar',
        reverseTeacher: 'Prof. Sunita Sharma',
        room: 'Hall-A',
        totalSeats: 150
      },
      { 
        id: 2, 
        title: 'Physics Final Exam', 
        date: '2025-07-20', 
        time: '14:00', 
        duration: '2.5 hours', 
        students: 95, 
        status: 'active', 
        subject: 'Physics', 
        class: '12th Grade',
        teacher: 'Dr. Amit Verma',
        reverseTeacher: 'Mrs. Priya Singh',
        room: 'Hall-B',
        totalSeats: 120
      },
      { 
        id: 3, 
        title: 'English Literature Test', 
        date: '2025-07-10', 
        time: '09:00', 
        duration: '2 hours', 
        students: 85, 
        status: 'completed', 
        subject: 'English', 
        class: '11th Grade',
        teacher: 'Mrs. Kavita Joshi',
        reverseTeacher: 'Mr. Rohit Mehta',
        room: 'Hall-C',
        totalSeats: 100
      }
    ];
  });

  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem('students');
    return savedStudents ? JSON.parse(savedStudents) : [
      { id: 1, name: 'Arjun Sharma', class: '10th Grade', rollNo: '001', fatherName: 'Ramesh', seatNo: null },
      { id: 2, name: 'Priya Singh', class: '11th Grade', rollNo: '002', fatherName: 'Roahan', seatNo: null },
      { id: 3, name: 'Rohit Kumar', class: '12th Grade', rollNo: '003', fatherName: 'Arjun',  seatNo: null },
      { id: 4, name: 'Sneha Patel', class: '10th Grade', rollNo: '004', fatherName: 'Karan',  seatNo: null },
      { id: 5, name: 'Vikash Gupta', class: '10th Grade', rollNo: '005', fatherName: 'Arjun',  seatNo: null },
      { id: 6, name: 'Anita Yadav', class: '11th Grade', rollNo: '006',  fatherName: 'Ramesh', seatNo: null },
      { id: 7, name: 'Rahul Verma', class: '12th Grade', rollNo: '007', fatherName: 'Ajay',  seatNo: null },
      { id: 8, name: 'Neha Gupta', class: '10th Grade', rollNo: '008',  fatherName: 'Arjun', seatNo: null },
      { id: 9, name: 'Suresh Kumar', class: '11th Grade', rollNo: '009', fatherName: 'Roahan',  seatNo: null },
      { id: 10, name: 'Meena Sharma', class: '12th Grade', rollNo: '010', fatherName: 'Ramesh',  seatNo: null }
    ];
  });

  const [teachers, setTeachers] = useState(() => {
    const savedTeachers = localStorage.getItem('teachers');
    return savedTeachers ? JSON.parse(savedTeachers) : [
      { id: 1, name: 'Dr. Rajesh Kumar', subject: 'Mathematics', experience: '15 years', phone: '+91-9876543210' },
      { id: 2, name: 'Dr. Amit Verma', subject: 'Physics', experience: '12 years', phone: '+91-9876543211' },
      { id: 3, name: 'Mrs. Kavita Joshi', subject: 'English', experience: '10 years', phone: '+91-9876543212' },
      { id: 4, name: 'Prof. Sunita Sharma', subject: 'Chemistry', experience: '18 years', phone: '+91-9876543213' },
      { id: 5, name: 'Mrs. Priya Singh', subject: 'Biology', experience: '8 years', phone: '+91-9876543214' },
      { id: 6, name: 'Mr. Rohit Mehta', subject: 'Hindi', experience: '6 years', phone: '+91-9876543215' }
    ];
  });

  const [seatAllocation, setSeatAllocation] = useState(() => {
    const savedSeats = localStorage.getItem('seatAllocation');
    return savedSeats ? JSON.parse(savedSeats) : {};
  });

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('exams', JSON.stringify(exams));
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('teachers', JSON.stringify(teachers));
    localStorage.setItem('seatAllocation', JSON.stringify(seatAllocation));
  }, [exams, students, teachers, seatAllocation]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({
    class: '',
    scoreRange: '',
    examsTaken: ''
  });

  const [formData, setFormData] = useState({
    title: '', date: '', time: '', duration: '', students: '', subject: '', class: '', 
    teacher: '', reverseTeacher: '', room: '', totalSeats: '', name: '', experience: '', 
    phone: '', rollNo: '', fatherName: ''
  });

  const stats = {
    totalExams: exams.length,
    scheduledExams: exams.filter(e => e.status === 'scheduled').length,
    activeExams: exams.filter(e => e.status === 'active').length,
    completedExams: exams.filter(e => e.status === 'completed').length,
    totalStudents: students.length,
    totalTeachers: teachers.length
  };

  // Enhanced seat allocation with validation
  const generateSeatAllocation = (examId) => {
    const exam = exams.find(e => e.id === examId);
    if (!exam) return;

    const examStudents = students.filter(s => s.class === exam.class);
    if (examStudents.length === 0) {
      alert('No students found for this class!');
      return;
    }

    if (examStudents.length > exam.totalSeats) {
      alert(`Warning: ${examStudents.length} students need seats but only ${exam.totalSeats} available!`);
    }

    const shuffledStudents = [...examStudents].sort(() => Math.random() - 0.5);
    
    const allocation = {};
    shuffledStudents.forEach((student, index) => {
      if (index < exam.totalSeats) {
        allocation[student.id] = {
          seatNo: index + 1,
          row: Math.floor(index / 10) + 1,
          column: (index % 10) + 1,
          hall: exam.room
        };
        
        // Update student's seat number
        setStudents(prev => prev.map(s => 
          s.id === student.id ? {...s, seatNo: index + 1} : s
        ));
      }
    });

    setSeatAllocation(prev => ({
      ...prev,
      [examId]: allocation
    }));

    alert(`Seat allocation generated for ${shuffledStudents.length} students in ${exam.room}!`);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'scheduled': return 'status-scheduled';
      case 'active': return 'status-active';
      case 'completed': return 'status-completed';
      default: return 'status-default';
    }
  };

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedItems = (items) => {
    if (!sortConfig.key) return items;
    
    return [...items].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  // Handle filtering
  const applyFilters = (items, type) => {
    let filtered = [...items];
    
    if (type === 'students') {
      if (filters.class) {
        filtered = filtered.filter(s => s.class === filters.class);
      }
      if (filters.fatherName) {
        filtered = filtered.filter(s => 
          s.fatherName.toLowerCase().includes(filters.fatherName.toLowerCase())
        );
      }
    }
    
    return filtered;
  };

  const handleAddExam = () => {
    if (formData.title && formData.date && formData.time) {
      const exam = {
        id: exams.length > 0 ? Math.max(...exams.map(e => e.id)) + 1 : 1,
        ...formData,
        students: parseInt(formData.students) || 0,
        totalSeats: parseInt(formData.totalSeats) || 0,
        status: 'scheduled'
      };
      setExams([...exams, exam]);
      resetForm();
      setShowModal(false);
    }
  };

  const handleUpdateExam = () => {
    if (selectedExam && formData.title && formData.date && formData.time) {
      setExams(exams.map(exam => 
        exam.id === selectedExam.id ? { ...formData, id: selectedExam.id, status: selectedExam.status } : exam
      ));
      resetForm();
      setShowModal(false);
    }
  };

  const handleAddTeacher = () => {
    if (formData.name && formData.subject) {
      const teacher = {
        id: teachers.length > 0 ? Math.max(...teachers.map(t => t.id)) + 1 : 1,
        name: formData.name,
        subject: formData.subject,
        experience: formData.experience,
        phone: formData.phone
      };
      setTeachers([...teachers, teacher]);
      resetForm();
      setShowModal(false);
    }
  };

  const handleUpdateTeacher = () => {
    if (selectedTeacher && formData.name && formData.subject) {
      setTeachers(teachers.map(teacher => 
        teacher.id === selectedTeacher.id ? { 
          ...teacher, 
          name: formData.name,
          subject: formData.subject,
          experience: formData.experience,
          phone: formData.phone
        } : teacher
      ));
      resetForm();
      setShowModal(false);
    }
  };

  const handleAddStudent = () => {
    if (formData.name && formData.class && formData.rollNo) {
      const student = {
        id: students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1,
        name: formData.name,
        class: formData.class,
        rollNo: formData.rollNo,
        fatherName: formData.fatherName || '',
        seatNo: null
      };
      setStudents([...students, student]);
      resetForm();
      setShowModal(false);
    }
  };
  
  const handleUpdateStudent = () => {
    if (selectedStudent && formData.name && formData.class && formData.rollNo) {
      setStudents(students.map(student => 
        student.id === selectedStudent.id ? { 
          ...student, 
          name: formData.name,
          class: formData.class,
          rollNo: formData.rollNo,
          fatherName: formData.fatherName || student.fatherName
        } : student
      ));
      resetForm();
      setShowModal(false);
    }
  };
  const handleDelete = (type, id) => {
    if (confirm(`Are you sure you want to delete this ${type}?`)) {
      switch(type) {
        case 'exam':
          setExams(exams.filter(e => e.id !== id));
          // Remove seat allocation for this exam if exists
          if (seatAllocation[id]) {
            const newSeatAllocation = {...seatAllocation};
            delete newSeatAllocation[id];
            setSeatAllocation(newSeatAllocation);
          }
          break;
        case 'teacher':
          setTeachers(teachers.filter(t => t.id !== id));
          break;
        case 'student':
          setStudents(students.filter(s => s.id !== id));
          // Remove student from seat allocations if exists
          const newSeatAllocation = {...seatAllocation};
          for (const examId in newSeatAllocation) {
            if (newSeatAllocation[examId][id]) {
              delete newSeatAllocation[examId][id];
            }
          }
          setSeatAllocation(newSeatAllocation);
          break;
        default:
          break;
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '', date: '', time: '', duration: '', students: '', subject: '', class: '', 
      teacher: '', reverseTeacher: '', room: '', totalSeats: '', name: '', experience: '', 
      phone: '', rollNo:  '' , fatherName: ''

    });
    setSelectedExam(null);
    setSelectedTeacher(null);
    setSelectedStudent(null);
  };

  const prepareEditForm = (type, item) => {
    if (type === 'exam') {
      setSelectedExam(item);
      setFormData({
        title: item.title,
        date: item.date,
        time: item.time,
        duration: item.duration,
        students: item.students,
        subject: item.subject,
        class: item.class,
        teacher: item.teacher,
        reverseTeacher: item.reverseTeacher,
        room: item.room,
        totalSeats: item.totalSeats
      });
      setModalType('edit-exam');
      setShowModal(true);  // Add this line

    } else if (type === 'teacher') {
      setSelectedTeacher(item);
      setFormData({
        name: item.name,
        subject: item.subject,
        experience: item.experience,
        phone: item.phone
      });
      setModalType('edit-teacher');
      setShowModal(true);  // Add this line

    } else if (type === 'student') {
      setSelectedStudent(item);
      setFormData({
        name: item.name,
        class: item.class,
        rollNo: item.rollNo,
        fatherName: item.fatherName
      });
      setModalType('edit-student');
      setShowModal(true);  // Add this line

    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const filteredExams = exams.filter(exam => 
    exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exam.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Enhanced student filtering with sorting and advanced filters
  const filteredStudents = applyFilters(
    students.filter(student => 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    'students'
  );

  const sortedStudents = getSortedItems(filteredStudents);
  const sortedExams = getSortedItems(filteredExams);
  const sortedTeachers = getSortedItems(filteredTeachers);

  // Get unique classes for filter dropdown
  const uniqueClasses = [...new Set(students.map(student => student.class))];

  return (
    <div className="exam-dashboard">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo">
              <BookOpen />
            </div>
            <div className="title-section">
              <h1>Exam Management System</h1>
              <p>Advanced Dashboard for Educational Institutions</p>
            </div>
          </div>
          
          <nav className="nav-tabs">
            {[
              { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
              { id: 'exams', icon: FileText, label: 'Exams' },
              { id: 'teachers', icon: User, label: 'Teachers' },
              { id: 'students', icon: Users, label: 'Students' },
              { id: 'seats', icon: MapPin, label: 'Seat Allocation' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-tab ${activeTab === item.id ? 'active' : ''}`}
              >
                <item.icon />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="main-content">
        {activeTab === 'dashboard' && (
          <div>
            <div className="page-header">
              <h2 className="page-title">Dashboard Overview</h2>
              <button className="btn btn-secondary">
                <Download />
                Export Report
              </button>
            </div>

            <div className="stats-grid">
              {Object.entries(stats).map(([key, value]) => (
                <div key={key} className="stat-card">
                  <div className="stat-content">
                    <div className="stat-info">
                      <h3>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h3>
                      <p className="value">{value}</p>
                      <p className="subtitle">{
                        key === 'totalExams' ? 'All scheduled exams' :
                        key === 'scheduledExams' ? 'Upcoming exams' :
                        key === 'activeExams' ? 'Ongoing exams' :
                        key === 'completedExams' ? 'Finished exams' :
                        key === 'totalStudents' ? 'Registered students' :
                        'Teaching staff'
                      }</p>
                    </div>
                    <div className="stat-icon">
                      {key === 'totalExams' ? <FileText /> :
                       key === 'scheduledExams' ? <Clock /> :
                       key === 'activeExams' ? <AlertCircle /> :
                       key === 'completedExams' ? <CheckCircle /> :
                       key === 'totalStudents' ? <Users /> : <User />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="content-card">
              <div className="card-header">
                <h3 className="card-title">Upcoming Exams</h3>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    setModalType('exam');
                    setShowModal(true);
                  }}
                >
                  <Plus /> Add Exam
                </button>
              </div>
              
              <div className="search-box">
                <Search className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search exams..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="exam-grid">
                {filteredExams.map(exam => (
                  <div key={exam.id} className="exam-card">
                    <div className="exam-header">
                      <div>
                        <h4 className="exam-title">{exam.title}</h4>
                        <p className="exam-subtitle">{exam.subject} • {exam.class}</p>
                      </div>
                      <span className={`status-badge ${getStatusColor(exam.status)}`}>
                        {exam.status === 'scheduled' && <Clock size={14} />}
                        {exam.status === 'active' && <AlertCircle size={14} />}
                        {exam.status === 'completed' && <CheckCircle size={14} />}
                        {exam.status}
                      </span>
                    </div>
                    
                    <div className="exam-details">
                      <div className="detail-item">
                        <Calendar size={16} />
                        {exam.date}
                      </div>
                      <div className="detail-item">
                        <Clock size={16} />
                        {formatTime(exam.time)}
                      </div>
                      <div className="detail-item">
                        <Users size={16} />
                        {exam.students} students
                      </div>
                      <div className="detail-item">
                        <MapPin size={16} />
                        {exam.room} (Seats: {exam.totalSeats})
                      </div>
                    </div>
                    
                    <div className="teacher-info">
                      <h4>Invigilators</h4>
                      <p className="teacher-item">
                        <User size={12} /> {exam.teacher}
                      </p>
                      <p className="teacher-item">
                        <Shuffle size={12} /> {exam.reverseTeacher}
                      </p>
                    </div>
                    
                    <div className="exam-actions">
                      <button 
                        className="btn btn-icon view"
                        onClick={() => {
                          setSelectedExam(exam);
                          setModalType('view');
                          setShowModal(true);
                        }}
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="btn btn-icon edit"
                        onClick={() => {
                          prepareEditForm('exam', exam);
                        }}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="btn btn-icon delete"
                        onClick={() => handleDelete('exam', exam.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                      <button 
                        className="btn btn-primary btn-small"
                        onClick={() => generateSeatAllocation(exam.id)}
                        disabled={exam.status === 'completed'}
                      >
                        Allocate Seats
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'exams' && (
          <div>
            <div className="page-header">
              <h2 className="page-title">Exam Management</h2>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setModalType('exam');
                  setShowModal(true);
                }}
              >
                <Plus /> Add Exam
              </button>
            </div>
            
            <div className="search-box">
              <Search className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search exams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="content-card">
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th onClick={() => requestSort('title')}>
                        <div className="sortable-header">
                          Exam
                          {sortConfig.key === 'title' && (
                            sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                          )}
                        </div>
                      </th>
                      <th onClick={() => requestSort('subject')}>
                        <div className="sortable-header">
                          Subject
                          {sortConfig.key === 'subject' && (
                            sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                          )}
                        </div>
                      </th>
                      <th onClick={() => requestSort('class')}>
                        <div className="sortable-header">
                          Class
                          {sortConfig.key === 'class' && (
                            sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                          )}
                        </div>
                      </th>
                      <th>Date & Time</th>
                      <th onClick={() => requestSort('status')}>
                        <div className="sortable-header">
                          Status
                          {sortConfig.key === 'status' && (
                            sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                          )}
                        </div>
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedExams.map(exam => (
                      <tr key={exam.id}>
                        <td>
                          <div className="student-info">
                            <div className="student-avatar">
                              {exam.title.charAt(0)}
                            </div>
                            <div className="student-details">
                              <h4>{exam.title}</h4>
                              <p>{exam.duration}</p>
                            </div>
                          </div>
                        </td>
                        <td>{exam.subject}</td>
                        <td>{exam.class}</td>
                        <td>
                          {exam.date} at {formatTime(exam.time)}
                        </td>
                        <td>
                          <span className={`status-badge ${getStatusColor(exam.status)}`}>
                            {exam.status}
                          </span>
                        </td>
                        <td>
                          <div className="exam-actions">
                            <button 
                              className="btn btn-icon view"
                              onClick={() => {
                                setSelectedExam(exam);
                                setModalType('view');
                                setShowModal(true);
                              }}
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              className="btn btn-icon edit"
                              onClick={() => {
                                prepareEditForm('exam', exam);
                              }}
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              className="btn btn-icon delete"
                              onClick={() => handleDelete('exam', exam.id)}
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
            </div>
          </div>
        )}

        {activeTab === 'teachers' && (
          <div>
            <div className="page-header">
              <h2 className="page-title">Teacher Management</h2>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setModalType('teacher');
                  setShowModal(true);
                }}
              >
                <Plus /> Add Teacher
              </button>
            </div>
            
            <div className="search-box">
              <Search className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search teachers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="content-card">
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th onClick={() => requestSort('name')}>
                        <div className="sortable-header">
                          Teacher
                          {sortConfig.key === 'name' && (
                            sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                          )}
                        </div>
                      </th>
                      <th onClick={() => requestSort('subject')}>
                        <div className="sortable-header">
                          Subject
                          {sortConfig.key === 'subject' && (
                            sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                          )}
                        </div>
                      </th>
                      <th onClick={() => requestSort('experience')}>
                        <div className="sortable-header">
                          Experience
                          {sortConfig.key === 'experience' && (
                            sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                          )}
                        </div>
                      </th>
                      <th>Contact</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTeachers.map(teacher => (
                      <tr key={teacher.id}>
                        <td>
                          <div className="student-info">
                            <div className="student-avatar">
                              {teacher.name.charAt(0)}
                            </div>
                            <div className="student-details">
                              <h4>{teacher.name}</h4>
                            </div>
                          </div>
                        </td>
                        <td>{teacher.subject}</td>
                        <td>{teacher.experience}</td>
                        <td>{teacher.phone}</td>
                        <td>
                          <div className="exam-actions">
                            <button 
                              className="btn btn-icon edit"
                              onClick={() => {
                                prepareEditForm('teacher', teacher);
                              }}
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              className="btn btn-icon delete"
                              onClick={() => handleDelete('teacher', teacher.id)}
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
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div>
            <div className="page-header">
              <h2 className="page-title">Student Management</h2>
              <div className="header-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    setModalType('student');
                    setShowModal(true);
                  }}
                >
                  <Plus /> Add Student
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    // Reset filters
                    setFilters({
                      class: '',
                      scoreRange: '',
                      examsTaken: ''
                    });
                  }}
                >
                  Reset Filters
                </button>
              </div>
            </div>
            
            <div className="search-box">
              <Search className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="filter-bar">
              <div className="filter-group">
                <label>Class:</label>
                <select
                  value={filters.class}
                  onChange={(e) => setFilters({...filters, class: e.target.value})}
                >
                  <option value="">All Classes</option>
                  {uniqueClasses.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label>Score Range:</label>
                <select
                  value={filters.scoreRange}
                  onChange={(e) => setFilters({...filters, scoreRange: e.target.value})}
                >
                  <option value="">All Scores</option>
                  <option value="90-100">90-100% (Excellent)</option>
                  <option value="75-89">75-89% (Good)</option>
                  <option value="50-74">50-74% (Average)</option>
                  <option value="0-49">0-49% (Below Average)</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label>Father Name:</label>
                <select
                  value={filters.fatherName}
                  onChange={(e) => setFilters({...filters, fatherName: e.target.value})}
                >
                  <option value="">Any</option>
                  <option value="5">5+ Exams</option>
                  <option value="10">10+ Exams</option>
                </select>
              </div>
            </div>
            
            <div className="content-card">
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th onClick={() => requestSort('name')}>
                        <div className="sortable-header">
                          Student
                          {sortConfig.key === 'name' && (
                            sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                          )}
                        </div>
                      </th>
                      <th onClick={() => requestSort('class')}>
                        <div className="sortable-header">
                          Class
                          {sortConfig.key === 'class' && (
                            sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                          )}
                        </div>
                      </th>
                      <th onClick={() => requestSort('rollNo')}>
                        <div className="sortable-header">
                          Roll No
                          {sortConfig.key === 'rollNo' && (
                            sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                          )}
                        </div>
                      </th>
                    
                      <th onClick={() => requestSort('fatherName')}>
                        <div className="sortable-header">
                          Father Name
                          {sortConfig.key === 'fatherName' && (
                            sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                          )}
                        </div>
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedStudents.map(student => (
                      <tr key={student.id}>
                        <td>
                          <div className="student-info">
                            <div className="student-avatar">
                              {student.name.charAt(0)}
                            </div>
                            <div className="student-details">
                              <h4>{student.name}</h4>
                            </div>
                          </div>
                        </td>
                        <td>{student.class}</td>
                        <td>{student.rollNo}</td>
                        <td>{student.fatherName || '-'}</td> {/* Added fallback for empty fatherName */}
                      
                        <td>
                          <div className="exam-actions">
                            <button 
                              className="btn btn-icon edit"
                              onClick={() => {
                                prepareEditForm('student', student);
                              }}
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              className="btn btn-icon delete"
                              onClick={() => handleDelete('student', student.id)}
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
            </div>
          </div>
        )}

        {activeTab === 'seats' && (
          <div>
            <div className="page-header">
              <h2 className="page-title">Seat Allocation</h2>
            </div>
            
            <div className="content-card">
              <div className="card-header">
                <h3 className="card-title">Select Exam to View Seating</h3>
              </div>
              
              <div className="exam-grid">
                {exams.map(exam => (
                  <div key={exam.id} className="exam-card">
                    <div className="exam-header">
                      <div>
                        <h4 className="exam-title">{exam.title}</h4>
                        <p className="exam-subtitle">{exam.subject} • {exam.class}</p>
                      </div>
                      <span className={`status-badge ${getStatusColor(exam.status)}`}>
                        {exam.status}
                      </span>
                    </div>
                    
                    <div className="exam-details">
                      <div className="detail-item">
                        <MapPin size={16} />
                        {exam.room} (Capacity: {exam.totalSeats})
                      </div>
                      <div className="detail-item">
                        <Users size={16} />
                        {students.filter(s => s.class === exam.class).length} students in class
                      </div>
                    </div>
                    
                    <button 
                      className="btn btn-primary"
                      onClick={() => {
                        setSelectedExam(exam);
                        generateSeatAllocation(exam.id);
                      }}
                      disabled={exam.status === 'completed'}
                    >
                      Generate Seating
                    </button>
                    
                    {seatAllocation[exam.id] && (
                      <div className="seat-allocation-container">
                        <h4>Seat Allocation for {exam.title}</h4>
                        <p className="hall-info">Examination Hall: {exam.room}</p>
                        
                        <div className="seat-grid-header">
                          <div className="seat-grid-info">
                            <span className="seat-legend occupied"></span>
                            <span>Occupied</span>
                            <span className="seat-legend empty"></span>
                            <span>Empty</span>
                          </div>
                          <button 
                            className="btn btn-secondary btn-small"
                            onClick={() => {
                              const examStudents = students.filter(s => s.class === exam.class);
                              const allocatedStudents = Object.keys(seatAllocation[exam.id]).length;
                              alert(`Seat allocation report:\n\nTotal seats: ${exam.totalSeats}\nAllocated students: ${allocatedStudents}\nAvailable seats: ${exam.totalSeats - allocatedStudents}`);
                            }}
                          >
                            View Report
                          </button>
                        </div>
                        
                        <div className="seat-grid">
                          {Array.from({ length: exam.totalSeats }).map((_, index) => {
                            const seatNumber = index + 1;
                            const studentId = Object.keys(seatAllocation[exam.id]).find(
                              id => seatAllocation[exam.id][id].seatNo === seatNumber
                            );
                            const student = studentId ? students.find(s => s.id === parseInt(studentId)) : null;
                            
                            return (
                              <div 
                                key={index} 
                                className={`seat ${student ? 'occupied' : 'empty'}`}
                                title={student ? `${student.name} (${student.class}) - Seat ${seatNumber}` : `Empty seat ${seatNumber}`}
                              >
                                {seatNumber}
                                {student && <span className="student-initial">{student.name.charAt(0)}</span>}
                              </div>
                            );
                          })}
                        </div>
                        
                        <div className="allocated-students-list">
                          <h5>Allocated Students:</h5>
                          <div className="student-grid">
                            {Object.entries(seatAllocation[exam.id]).map(([studentId, allocation]) => {
                              const student = students.find(s => s.id === parseInt(studentId));
                              if (!student) return null;
                              return (
                                <div key={studentId} className="allocated-student">
                                  <span className="student-seat">Seat {allocation.seatNo}</span>
                                  <span className="student-name">{student.name}</span>
                                  <span className="student-class">{student.class}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {showModal && (
        <div className="" id="modal-overlay">
          <div className="" id="model">
            <button className="modal-close" onClick={() => {
              setShowModal(false);
              resetForm();
            }}>
              <X size={24} />
            </button>
            
            {modalType === 'exam' && (
              <div>
                <div className="modal-header">
                  <h2 className="modal-title">Add New Exam</h2>
                </div>
                <div className="form-grid form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Exam Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Time</label>
                    <input
                      type="time"
                      className="form-input"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Duration</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Class</label>
                    <select
                      className="form-input"
                      value={formData.class}
                      onChange={(e) => setFormData({...formData, class: e.target.value})}
                    >
                      <option value="">Select Class</option>
                      <option value="10th Grade">10th Grade</option>
                      <option value="11th Grade">11th Grade</option>
                      <option value="12th Grade">12th Grade</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Number of Students</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.students}
                      onChange={(e) => setFormData({...formData, students: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Teacher</label>
                    <select
                      className="form-input"
                      value={formData.teacher}
                      onChange={(e) => setFormData({...formData, teacher: e.target.value})}
                    >
                      <option value="">Select Teacher</option>
                      {teachers.map(teacher => (
                        <option key={teacher.id} value={teacher.name}>{teacher.name} ({teacher.subject})</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Reverse Teacher</label>
                    <select
                      className="form-input"
                      value={formData.reverseTeacher}
                      onChange={(e) => setFormData({...formData, reverseTeacher: e.target.value})}
                    >
                      <option value="">Select Teacher</option>
                      {teachers.map(teacher => (
                        <option key={teacher.id} value={teacher.name}>{teacher.name} ({teacher.subject})</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Room</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.room}
                      onChange={(e) => setFormData({...formData, room: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Total Seats</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.totalSeats}
                      onChange={(e) => setFormData({...formData, totalSeats: e.target.value})}
                    />
                  </div>
                </div>
                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleAddExam}>
                    Add Exam
                  </button>
                </div>
              </div>
            )}
            
            {modalType === 'edit-exam' && selectedExam && (
              <div>
                <div className="modal-header">
                  <h2 className="modal-title">Edit Exam</h2>
                </div>
                <div className="form-grid form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Exam Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Time</label>
                    <input
                      type="time"
                      className="form-input"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Duration</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Class</label>
                    <select
                      className="form-input"
                      value={formData.class}
                      onChange={(e) => setFormData({...formData, class: e.target.value})}
                    >
                      <option value="10th Grade">10th Grade</option>
                      <option value="11th Grade">11th Grade</option>
                      <option value="12th Grade">12th Grade</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Number of Students</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.students}
                      onChange={(e) => setFormData({...formData, students: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Teacher</label>
                    <select
                      className="form-input"
                      value={formData.teacher}
                      onChange={(e) => setFormData({...formData, teacher: e.target.value})}
                    >
                      {teachers.map(teacher => (
                        <option key={teacher.id} value={teacher.name}>{teacher.name} ({teacher.subject})</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Reverse Teacher</label>
                    <select
                      className="form-input"
                      value={formData.reverseTeacher}
                      onChange={(e) => setFormData({...formData, reverseTeacher: e.target.value})}
                    >
                      {teachers.map(teacher => (
                        <option key={teacher.id} value={teacher.name}>{teacher.name} ({teacher.subject})</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Room</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.room}
                      onChange={(e) => setFormData({...formData, room: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Total Seats</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.totalSeats}
                      onChange={(e) => setFormData({...formData, totalSeats: e.target.value})}
                    />
                  </div>
                </div>
                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleUpdateExam}>
                    Update Exam
                  </button>
                </div>
              </div>
            )}
            
            {modalType === 'view' && selectedExam && (
              <div>
                <div className="modal-header">
                  <h2 className="modal-title">Exam Details</h2>
                </div>
                <div className="view-details">
                  <div className="detail-row">
                    <span className="detail-label">Title:</span>
                    <span className="detail-value">{selectedExam.title}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Subject:</span>
                    <span className="detail-value">{selectedExam.subject}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Class:</span>
                    <span className="detail-value">{selectedExam.class}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">{selectedExam.date}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Time:</span>
                    <span className="detail-value">{formatTime(selectedExam.time)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Duration:</span>
                    <span className="detail-value">{selectedExam.duration}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Students:</span>
                    <span className="detail-value">{selectedExam.students}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Room:</span>
                    <span className="detail-value">{selectedExam.room} (Seats: {selectedExam.totalSeats})</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span className={`detail-value status-badge ${getStatusColor(selectedExam.status)}`}>
                      {selectedExam.status}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Teacher:</span>
                    <span className="detail-value">{selectedExam.teacher}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Reverse Teacher:</span>
                    <span className="detail-value">{selectedExam.reverseTeacher}</span>
                  </div>
                  
                  {seatAllocation[selectedExam.id] && (
                    <div className="seat-summary">
                      <h4>Seat Allocation Summary</h4>
                      <div className="summary-row">
                        <span>Total Seats:</span>
                        <span>{selectedExam.totalSeats}</span>
                      </div>
                      <div className="summary-row">
                        <span>Allocated Students:</span>
                        <span>{Object.keys(seatAllocation[selectedExam.id]).length}</span>
                      </div>
                      <div className="summary-row">
                        <span>Available Seats:</span>
                        <span>{selectedExam.totalSeats - Object.keys(seatAllocation[selectedExam.id]).length}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Close
                  </button>
                </div>
              </div>
            )}
            
            {modalType === 'teacher' && (
              <div>
                <div className="modal-header">
                  <h2 className="modal-title">Add New Teacher</h2>
                </div>
                <div className="form-grid form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Experience</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.experience}
                      onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleAddTeacher}>
                    Add Teacher
                  </button>
                </div>
              </div>
            )}
            
            {modalType === 'edit-teacher' && selectedTeacher && (
              <div>
                <div className="modal-header">
                  <h2 className="modal-title">Edit Teacher</h2>
                </div>
                <div className="form-grid form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Experience</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.experience}
                      onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleUpdateTeacher}>
                    Update Teacher
                  </button>
                </div>
              </div>
            )}
            
            {modalType === 'student' && (
              <div>
                <div className="modal-header">
                  <h2 className="modal-title">Add New Student</h2>
                </div>
                <div className="form-grid form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Class</label>
                    <select
                      className="form-input"
                      value={formData.class}
                      onChange={(e) => setFormData({...formData, class: e.target.value})}
                    >
                      <option value="">Select Class</option>
                      <option value="10th Grade">10th Grade</option>
                      <option value="11th Grade">11th Grade</option>
                      <option value="12th Grade">12th Grade</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Roll No</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.rollNo}
                      onChange={(e) => setFormData({...formData, rollNo: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Father Name </label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.fatherName}
                      onChange={(e) => setFormData({...formData, fatherName: e.target.value})}
                     
                    />
                  </div>
                </div>
                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleAddStudent}>
                    Add Student
                  </button>
                </div>
              </div>
            )}
            
            {modalType === 'edit-student' && selectedStudent && (
              <div>
                <div className="modal-header">
                  <h2 className="modal-title">Edit Student</h2>
                </div>
                <div className="form-grid form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Class</label>
                    <select
                      className="form-input"
                      value={formData.class}
                      onChange={(e) => setFormData({...formData, class: e.target.value})}
                    >
                      <option value="10th Grade">10th Grade</option>
                      <option value="11th Grade">11th Grade</option>
                      <option value="12th Grade">12th Grade</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Roll No</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.rollNo}
                      onChange={(e) => setFormData({...formData, rollNo: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Father Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.fatherName}
                      onChange={(e) => setFormData({...formData, fatherName: e.target.value})}
                     
                    />
                  </div>
                </div>
                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleUpdateStudent}>
                    Update Student
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamManagementDashboard;