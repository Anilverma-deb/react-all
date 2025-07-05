import React, { useEffect, useState } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import '../assets/css/School.css';
import Dashboard from './School/Dashbord/Dashboard';
import Reportmanagement from './School/Report-management/Report-Management';
import Administration from './School/Administration/Administration';
import TimeTable from './School/Time-table/Time-Table';
import Event from './School/Event/Event'
import LeaveManagement from './School/Leave-Management/LeaveManagement';  // Based on your folder structure
import Announcement from './School/Announcement/Announcement'
import ExamManagement from './School/Exam-Management/Exam-Management'
import EmployeeManagement from './School/Account-Management/Acoount-Management'
import Transport from './School/Transport-Management/Transport'
import TaskManagement from './School/Task-Management/Task-Management'
import Cctv from './School/Cctv-Management/Cctv-Management'
import LibraryManagement from './School/Library-Management/Library-Management'
import Attendance from './School/Attendance/Attendance';
import Result from './School/Result/Result';
import Track from './School/Track/Track';
import Session from './School/Session/Session';








// const Administration = () => <div className="page-content">Administration Component</div>;
// const Announcement = () => <div className="page-content">Announcement Component</div>;
// const Event = () => <div className="page-content">Event Component</div>;
const Communication = () => <div className="page-content">Communication Component</div>;
// const Cctv = () => <div className="page-content">Cctv Component</div>;
// const LibraryManagement = () => <div className="page-content">Library Management Component</div>;
// const Result = () => <div className="page-content">Result Component</div>;
// const Attendance = () => <div className="page-content">Attendance Component</div>;
// const Session = () => <div className="page-content">Session Component</div>;


// const ExamManagement = () => <div className="page-content">ExamManagement Component</div>;
// 
// const LeaveManagement = () => <div className="page-content">Leave Management Component</div>;

// const TimeTable = () => <div className="page-content">Time Table Component</div>;
// const StudentTracking = () => <div className="page-content">Student Tracking Component</div>;
//  const Transport = () => <div className="page-content">Transport Component</div>;
// const TaskManagement = () => <div className="page-content">Task Management Component</div>;

// const EmployeeManagement = () => <div className="page-content">Employee Management Component</div>;

function School() {

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
   const [isSticky, setSticky] = useState(false);


  useEffect(() => {
    // Load external scripts
    const loadScript = (src, module = false) => {
      if (!document.querySelector(`script[src*="${src.split('/').pop().split('.')[0]}"]`)) {
        const script = document.createElement('script');
        if (module) script.type = 'module';
        script.src = src;
        document.head.appendChild(script);
      }
    };

    loadScript('https://code.iconify.design/3/3.1.1/iconify.min.js');
    loadScript('https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js', true);

    // Initialize theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Handle clicks outside dropdowns
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown')) {
        closeAllDropdowns();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const closeAllDropdowns = () => {
    setIsNotificationOpen(false);
    setIsMessageOpen(false);
    setIsLanguageOpen(false);
    setIsProfileOpen(false);
  };

  const handleSidebarToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleThemeToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
  };

  const handleDropdownToggle = (dropdown) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    closeAllDropdowns();
    
    switch (dropdown) {
      case 'notification':
        setIsNotificationOpen(true);
        break;
      case 'message':
        setIsMessageOpen(true);
        break;
      case 'language':
        setIsLanguageOpen(true);
        break;
      case 'profile':
        setIsProfileOpen(true);
        break;
    }
  };

  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang);
    setIsLanguageOpen(false);
  };

  const languages = [
    { id: 'english', name: 'English', flag: 'https://flagcdn.com/w20/us.png' },
    { id: 'japan', name: 'Japan', flag: 'https://flagcdn.com/w20/jp.png' },
    { id: 'france', name: 'France', flag: 'https://flagcdn.com/w20/fr.png' },
    { id: 'germany', name: 'Germany', flag: 'https://flagcdn.com/w20/de.png' },
    { id: 'korea', name: 'South Korea', flag: 'https://flagcdn.com/w20/kr.png' },
    { id: 'bangladesh', name: 'Bangladesh', flag: 'https://flagcdn.com/w20/bd.png' },
    { id: 'india', name: 'India', flag: 'https://flagcdn.com/w20/in.png' },
    { id: 'canada', name: 'Canada', flag: 'https://flagcdn.com/w20/ca.png' }
  ];

  const navItems = [
    { path: '/School/dashboard', icon: 'home-outline', title: 'Dashboard' },
    { path: '/School/administration', icon: 'people-outline', title: 'Administration' },
    { path: '/School/announcement', icon: 'megaphone-outline', title: 'Announcement' },
    { path: '/School/event', icon: 'calendar-outline', title: 'Events' },
    { path: '/School/leave-management', icon: 'home-outline', title: 'Leave Management' },
    { path: '/School/exam-management', icon: 'card-outline', title: 'Exam Management' },
    { path: '/School/communication', icon: 'chatbox-ellipses-outline', title: 'Communication' },
    { path: '/School/result', icon: 'chatbox-ellipses-outline', title: 'Result' },
    { path: '/School/attendance', icon: 'chatbox-ellipses-outline', title: 'Attendance' },


    { path: '/School/cctv', icon: 'people-outline', title: 'CCTV' },
    { path: '/School/library-Management', icon: 'megaphone-outline', title: 'Library Management' },


    { path: '/School/timetable', icon: 'time-outline', title: 'Timetable' },
    { path: '/School/track', icon: 'walk-outline', title: 'Track' },

    { path: '/School/transport', icon: 'bus-outline', title: 'Transport' },
    { path: '/School/task-management', icon: 'walk-outline', title: 'Task Management' },
    { path: '/School/session', icon: 'walk-outline', title: 'Session' },


    { path: '/School/Report-management', icon: 'card-outline', title: 'Report Management' },
    { path: '/School/employee', icon: 'person-outline', title: 'Employee Management' }
  ];
 useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 100); 
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <div className={`navigation ${isSidebarOpen ? 'active' : ''}`}>

        {/* Add close button for mobile */}
        <button 
          className="sidebar-close-btn mobile-only"
          onClick={() => setIsSidebarOpen(false)}
        >
          <iconify-icon icon="ion:close-outline"></iconify-icon>
        </button>


        <ul className="nav-list">
          <li className="nav-brand">
            <NavLink to="#" className="nav-link" onClick={(e) => e.preventDefault()}>
              <span className="icon"><ion-icon name="school-outline"></ion-icon></span>
              <span className="title">School Management</span>
            </NavLink>
          </li>
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className="icon"><ion-icon name={item.icon}></ion-icon></span>
                <span className="title">{item.title}</span>
              </NavLink>
            </li>
          ))}
          <li>
            <NavLink to="#" className="nav-link" onClick={(e) => e.preventDefault()}>
              <span className="icon"><ion-icon name="settings-outline"></ion-icon></span>
              <span className="title">Settings</span>
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className={`main ${isSidebarOpen ? 'sidebar-active' : ''}`}>
        {/* Header */}
      <header className={`navbar-header ${isSticky ? "sticky" : ""}`}>
          <div className="navbar-content">
            <div className="navbar-left">
              <button 
                type="button" 
                className={`sidebar-toggle ${isSidebarOpen ? 'active' : ''}`}
                onClick={handleSidebarToggle}
              >
                <iconify-icon icon="heroicons:bars-3-solid" className="icon non-active"></iconify-icon>
                <iconify-icon icon="iconoir:arrow-right" className="icon active"></iconify-icon>
              </button>
              
              <form className="navbar-search">
                <input 
                  type="text" 
                  name="search" 
                  placeholder="Search..." 
                  className="search-input" 
                />
                <iconify-icon icon="ion:search-outline" className="search-icon"></iconify-icon>
              </form>
            </div>

            <div className="navbar-right">
              {/* Theme Toggle */}
              <button 
                type="button" 
                className="theme-toggle"
                onClick={handleThemeToggle}
                data-theme-toggle
                aria-label={isDarkMode ? 'dark' : 'light'}
              ></button>

              {/* Language Dropdown */}
              <div className="dropdown">
                <button 
                  className={`dropdown-btn ${isLanguageOpen ? 'show' : ''}`}
                  type="button" 
                  onClick={handleDropdownToggle('language')}
                >
                  <img 
                    src={languages.find(l => l.id === selectedLanguage)?.flag || languages[0].flag} 
                    alt="language" 
                    className="flag-icon" 
                  />
                </button>

                {isLanguageOpen && (
                  <div className="dropdown-menu language-dropdown">
                    <div className="dropdown-header">
                      <h6>Choose Your Language</h6>
                    </div>
                    <div className="dropdown-content">
                      {languages.map((lang) => (
                        <div key={lang.id} className="language-item" onClick={() => handleLanguageSelect(lang.id)}>
                          <img src={lang.flag} alt={lang.name} className="flag-icon" />
                          <span>{lang.name}</span>
                          <input 
                            type="radio" 
                            name="language" 
                            checked={selectedLanguage === lang.id}
                            onChange={() => handleLanguageSelect(lang.id)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Messages Dropdown */}
              <div className="dropdown">
                <button 
                  className={`dropdown-btn ${isMessageOpen ? 'show' : ''}`}
                  type="button" 
                  onClick={handleDropdownToggle('message')}
                >
                  <iconify-icon icon="mage:email" className="dropdown-icon"></iconify-icon>
                </button>
                
                {isMessageOpen && (
                  <div className="dropdown-menu message-dropdown">
                    <div className="dropdown-header">
                      <h6>Messages</h6>
                      <span className="badge">5</span>
                    </div>
                    <div className="dropdown-content">
                      <div className="message-item">
                        <img src="https://via.placeholder.com/40" alt="profile" className="message-avatar" />
                        <div className="message-content">
                          <h6>John Doe</h6>
                          <p>Hey! How are you doing?</p>
                        </div>
                        <div className="message-meta">
                          <span>12:30 PM</span>
                          <span className="unread-badge">2</span>
                        </div>
                      </div>
                    </div>
                    <div className="dropdown-footer">
                      <a href="#messages">See All Messages</a>
                    </div>
                  </div>
                )}
              </div>

              {/* Notifications Dropdown */}
              <div className="dropdown">
                <button 
                  className={`dropdown-btn ${isNotificationOpen ? 'show' : ''}`}
                  type="button" 
                  onClick={handleDropdownToggle('notification')}
                >
                  <iconify-icon icon="iconoir:bell" className="dropdown-icon"></iconify-icon>
                </button>
                
                {isNotificationOpen && (
                  <div className="dropdown-menu notification-dropdown">
                    <div className="dropdown-header">
                      <h6>Notifications</h6>
                      <span className="badge">3</span>
                    </div>
                    <div className="dropdown-content">
                      <div className="notification-item">
                        <div className="notification-icon success">
                          <iconify-icon icon="bitcoin-icons:verify-outline"></iconify-icon>
                        </div>
                        <div className="notification-content">
                          <h6>Congratulations</h6>
                          <p>Your profile has been verified.</p>
                        </div>
                        <span className="notification-time">23 mins ago</span>
                      </div>
                    </div>
                    <div className="dropdown-footer">
                      <a href="#notifications">See All Notifications</a>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="dropdown">
                <button 
                  className="profile-btn" 
                  type="button" 
                  onClick={handleDropdownToggle('profile')}
                >
                  <img 
                    src="https://via.placeholder.com/40" 
                    alt="profile" 
                    className="profile-avatar" 
                  />
                </button>

                {isProfileOpen && (
                  <div className="dropdown-menu profile-dropdown">
                    <div className="dropdown-header profile-header">
                      <div>
                        <h6>John Doe</h6>
                        <span>Administrator</span>
                      </div>
                      <button onClick={() => setIsProfileOpen(false)}>
                        <iconify-icon icon="radix-icons:cross-1"></iconify-icon>
                      </button>
                    </div>
                    <ul className="profile-menu">
                      <li><a href="#profile"><iconify-icon icon="solar:user-linear"></iconify-icon> My Profile</a></li>
                      <li><a href="#inbox"><iconify-icon icon="tabler:message-check"></iconify-icon> Inbox</a></li>
                      <li><a href="#settings"><iconify-icon icon="icon-park-outline:setting-two"></iconify-icon> Settings</a></li>
                      <li><a href="#logout" className="logout"><iconify-icon icon="lucide:power"></iconify-icon> Log Out</a></li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          <Routes>
            <Route index element={<Navigate to="/School/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="administration" element={<Administration />} />
            <Route path="announcement" element={<Announcement />} />
            <Route path="event" element={<Event />} />
            <Route path="exam-management" element={<ExamManagement />} />
            <Route path="leave-management" element={<LeaveManagement />} />   
            <Route path="communication" element={<Communication />} />
            <Route path="result" element={<Result />} />
            <Route path="attendance" element={<Attendance />} />

            <Route path="cctv" element={<Cctv />} />
            <Route path="library-management" element={<LibraryManagement />} />

            <Route path="track" element={<Track />} />

            <Route path="timetable" element={<TimeTable />} />
            <Route path="session" element={<Session />} />
            <Route path="task-management" element={<TaskManagement />} />

            <Route path="transport" element={<Transport />} />
            <Route path="Report-management" element={<Reportmanagement />} />
            <Route path="employee" element={<EmployeeManagement />} />
            <Route path="*" element={<Navigate to="/School/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default School;