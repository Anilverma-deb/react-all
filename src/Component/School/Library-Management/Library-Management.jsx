import React, { useState, useEffect, useRef } from 'react';
import './Library-Management.css';

const LibraryDashboard = () => {
  // State management
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBookModal, setShowBookModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [currentMember, setCurrentMember] = useState(null);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [notification, setNotification] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });
  const [filter, setFilter] = useState('all');
  const modalRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Color themes
  const themes = {
    light: {
      '--primary': '#4361ee',
      '--primary-light': '#4895ef',
      '--secondary': '#3f37c9',
      '--success': '#4cc9f0',
      '--danger': '#f72585',
      '--warning': '#f8961e',
      '--info': '#43aa8b',
      '--dark': '#212529',
      '--gray': '#6c757d',
      '--light-gray': '#e9ecef',
      '--light': '#f8f9fa',
      '--white': '#ffffff',
      '--shadow': '0 4px 6px rgba(0, 0, 0, 0.1)',
      '--shadow-lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
      '--border-radius': '8px',
      '--border-radius-sm': '4px',
      '--transition': 'all 0.3s ease'
    },
    dark: {
      '--primary': '#4895ef',
      '--primary-light': '#4cc9f0',
      '--secondary': '#4361ee',
      '--success': '#43aa8b',
      '--danger': '#f72585',
      '--warning': '#f8961e',
      '--info': '#4cc9f0',
      '--dark': '#f8f9fa',
      '--gray': '#adb5bd',
      '--light-gray': '#495057',
      '--light': '#212529',
      '--white': '#343a40',
      '--shadow': '0 4px 6px rgba(0, 0, 0, 0.3)',
      '--shadow-lg': '0 10px 15px rgba(0, 0, 0, 0.3)',
      '--border-radius': '8px',
      '--border-radius-sm': '4px',
      '--transition': 'all 0.3s ease'
    }
  };

  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Apply theme
    const selectedTheme = themes[theme];
    Object.keys(selectedTheme).forEach(key => {
      document.documentElement.style.setProperty(key, selectedTheme[key]);
    });
  }, [theme]);

  // Mock data initialization
  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call
      setTimeout(() => {
        // Books data
        const mockBooks = [
          {
            id: 'bk-001',
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            isbn: '9780743273565',
            category: 'Fiction',
            publishedYear: 1925,
            publisher: 'Scribner',
            copies: 5,
            available: 3,
            shelf: 'FIC-1A',
            cover: 'https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg',
            description: 'A story of wealth, love, and the American Dream in the 1920s.'
          },
          {
            id: 'bk-002',
            title: 'To Kill a Mockingbird',
            author: 'Harper Lee',
            isbn: '9780061120084',
            category: 'Fiction',
            publishedYear: 1960,
            publisher: 'J. B. Lippincott & Co.',
            copies: 4,
            available: 2,
            shelf: 'FIC-2B',
            cover: 'https://m.media-amazon.com/images/I/71FxgtFKcQL._AC_UF1000,1000_QL80_.jpg',
            description: 'A powerful story of racial injustice and moral growth in the American South.'
          },
          {
            id: 'bk-003',
            title: '1984',
            author: 'George Orwell',
            isbn: '9780451524935',
            category: 'Dystopian',
            publishedYear: 1949,
            publisher: 'Secker & Warburg',
            copies: 6,
            available: 4,
            shelf: 'DYS-3C',
            cover: 'https://m.media-amazon.com/images/I/61ZewDE3beL._AC_UF1000,1000_QL80_.jpg',
            description: 'A dystopian novel about totalitarianism and government surveillance.'
          },
          {
            id: 'bk-004',
            title: 'The Hobbit',
            author: 'J.R.R. Tolkien',
            isbn: '9780547928227',
            category: 'Fantasy',
            publishedYear: 1937,
            publisher: 'Allen & Unwin',
            copies: 3,
            available: 1,
            shelf: 'FAN-4D',
            cover: 'https://m.media-amazon.com/images/I/710+HcoP38L._AC_UF1000,1000_QL80_.jpg',
            description: 'A fantasy novel about the adventures of Bilbo Baggins.'
          },
          {
            id: 'bk-005',
            title: 'Pride and Prejudice',
            author: 'Jane Austen',
            isbn: '9781503290563',
            category: 'Romance',
            publishedYear: 1813,
            publisher: 'T. Egerton, Whitehall',
            copies: 4,
            available: 4,
            shelf: 'ROM-5E',
            cover: 'https://m.media-amazon.com/images/I/71Q1tPupKjL._AC_UF1000,1000_QL80_.jpg',
            description: 'A romantic novel about the emotional development of Elizabeth Bennet.'
          }
        ];

        // Members data
        const mockMembers = [
          {
            id: 'mem-001',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '555-0101',
            membershipDate: '2022-01-15',
            membershipType: 'Premium',
            booksBorrowed: 2,
            maxBooks: 5,
            status: 'active'
          },
          {
            id: 'mem-002',
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '555-0102',
            membershipDate: '2022-03-22',
            membershipType: 'Standard',
            booksBorrowed: 1,
            maxBooks: 3,
            status: 'active'
          },
          {
            id: 'mem-003',
            name: 'Robert Johnson',
            email: 'robert@example.com',
            phone: '555-0103',
            membershipDate: '2021-11-05',
            membershipType: 'Premium',
            booksBorrowed: 0,
            maxBooks: 5,
            status: 'inactive'
          },
          {
            id: 'mem-004',
            name: 'Emily Davis',
            email: 'emily@example.com',
            phone: '555-0104',
            membershipDate: '2023-02-18',
            membershipType: 'Standard',
            booksBorrowed: 3,
            maxBooks: 3,
            status: 'active'
          },
          {
            id: 'mem-005',
            name: 'Michael Wilson',
            email: 'michael@example.com',
            phone: '555-0105',
            membershipDate: '2022-09-30',
            membershipType: 'Student',
            booksBorrowed: 1,
            maxBooks: 2,
            status: 'active'
          }
        ];

        // Transactions data
        const mockTransactions = [
          {
            id: 'trn-001',
            bookId: 'bk-001',
            bookTitle: 'The Great Gatsby',
            memberId: 'mem-001',
            memberName: 'John Doe',
            issueDate: '2023-05-10',
            dueDate: '2023-06-10',
            returnDate: '',
            status: 'issued',
            fine: 0
          },
          {
            id: 'trn-002',
            bookId: 'bk-002',
            bookTitle: 'To Kill a Mockingbird',
            memberId: 'mem-002',
            memberName: 'Jane Smith',
            issueDate: '2023-05-15',
            dueDate: '2023-06-15',
            returnDate: '2023-06-12',
            status: 'returned',
            fine: 0
          },
          {
            id: 'trn-003',
            bookId: 'bk-003',
            bookTitle: '1984',
            memberId: 'mem-004',
            memberName: 'Emily Davis',
            issueDate: '2023-04-20',
            dueDate: '2023-05-20',
            returnDate: '2023-05-25',
            status: 'returned',
            fine: 5
          },
          {
            id: 'trn-004',
            bookId: 'bk-004',
            bookTitle: 'The Hobbit',
            memberId: 'mem-001',
            memberName: 'John Doe',
            issueDate: '2023-06-01',
            dueDate: '2023-07-01',
            returnDate: '',
            status: 'issued',
            fine: 0
          },
          {
            id: 'trn-005',
            bookId: 'bk-005',
            bookTitle: 'Pride and Prejudice',
            memberId: 'mem-005',
            memberName: 'Michael Wilson',
            issueDate: '2023-06-05',
            dueDate: '2023-07-05',
            returnDate: '',
            status: 'issued',
            fine: 0
          }
        ];

        setBooks(mockBooks);
        setMembers(mockMembers);
        setTransactions(mockTransactions);
        setLoading(false);
      }, 1500);
    };
    
    fetchData();
  }, []);

  // Sort data
  const sortedBooks = [...books].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const sortedMembers = [...members].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Filter data
  const filteredBooks = sortedBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.isbn.includes(searchTerm);
    const matchesFilter = filter === 'all' || book.category.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const filteredMembers = sortedMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.phone.includes(searchTerm);
    const matchesFilter = filter === 'all' || member.status.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const filteredTransactions = sortedTransactions.filter(transaction => {
    const matchesSearch = transaction.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         transaction.memberName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || transaction.status.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  // Handle sort
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Handle form submissions
  const handleBookSubmit = (e) => {
    e.preventDefault();
    if (!currentBook.title || !currentBook.author || !currentBook.isbn) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    if (currentBook.id) {
      // Update existing book
      setBooks(books.map(book => 
        book.id === currentBook.id ? currentBook : book
      ));
      showNotification('Book updated successfully!', 'success');
    } else {
      // Add new book
      const newId = `bk-${(books.length + 1).toString().padStart(3, '0')}`;
      const newBook = {
        ...currentBook,
        id: newId,
        copies: parseInt(currentBook.copies),
        available: parseInt(currentBook.copies)
      };
      setBooks([newBook, ...books]);
      showNotification('Book added successfully!', 'success');
    }
    setShowBookModal(false);
    setCurrentBook(null);
  };

  const handleMemberSubmit = (e) => {
    e.preventDefault();
    if (!currentMember.name || !currentMember.email) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    if (currentMember.id) {
      // Update existing member
      setMembers(members.map(member => 
        member.id === currentMember.id ? currentMember : member
      ));
      showNotification('Member updated successfully!', 'success');
    } else {
      // Add new member
      const newId = `mem-${(members.length + 1).toString().padStart(3, '0')}`;
      const newMember = {
        ...currentMember,
        id: newId,
        booksBorrowed: 0,
        status: 'active'
      };
      setMembers([newMember, ...members]);
      showNotification('Member added successfully!', 'success');
    }
    setShowMemberModal(false);
    setCurrentMember(null);
  };

  const handleTransactionSubmit = (e) => {
    e.preventDefault();
    if (!currentTransaction.bookId || !currentTransaction.memberId) {
      showNotification('Please select both book and member', 'error');
      return;
    }

    // Check if book is available
    const selectedBook = books.find(b => b.id === currentTransaction.bookId);
    if (selectedBook.available <= 0) {
      showNotification('This book is not available for checkout', 'error');
      return;
    }

    // Check if member has reached borrowing limit
    const selectedMember = members.find(m => m.id === currentTransaction.memberId);
    if (selectedMember.booksBorrowed >= selectedMember.maxBooks) {
      showNotification('Member has reached maximum borrowing limit', 'error');
      return;
    }

    if (currentTransaction.id) {
      // Update existing transaction (return book)
      const updatedTransaction = {
        ...currentTransaction,
        returnDate: new Date().toISOString().split('T')[0],
        status: 'returned'
      };
      
      setTransactions(transactions.map(t => 
        t.id === currentTransaction.id ? updatedTransaction : t
      ));
      
      // Update book availability
      setBooks(books.map(b => 
        b.id === currentTransaction.bookId ? {...b, available: b.available + 1} : b
      ));
      
      // Update member's borrowed count
      setMembers(members.map(m => 
        m.id === currentTransaction.memberId ? {...m, booksBorrowed: m.booksBorrowed - 1} : m
      ));
      
      showNotification('Book returned successfully!', 'success');
    } else {
      // Add new transaction (issue book)
      const newId = `trn-${(transactions.length + 1).toString().padStart(3, '0')}`;
      const today = new Date().toISOString().split('T')[0];
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);
      
      const newTransaction = {
        id: newId,
        bookId: currentTransaction.bookId,
        bookTitle: books.find(b => b.id === currentTransaction.bookId).title,
        memberId: currentTransaction.memberId,
        memberName: members.find(m => m.id === currentTransaction.memberId).name,
        issueDate: today,
        dueDate: dueDate.toISOString().split('T')[0],
        returnDate: '',
        status: 'issued',
        fine: 0
      };
      
      setTransactions([newTransaction, ...transactions]);
      
      // Update book availability
      setBooks(books.map(b => 
        b.id === currentTransaction.bookId ? {...b, available: b.available - 1} : b
      ));
      
      // Update member's borrowed count
      setMembers(members.map(m => 
        m.id === currentTransaction.memberId ? {...m, booksBorrowed: m.booksBorrowed + 1} : m
      ));
      
      showNotification('Book issued successfully!', 'success');
    }
    setShowTransactionModal(false);
    setCurrentTransaction(null);
  };

  // Handle actions
  const handleAction = (action, item, type) => {
    switch(type) {
      case 'book':
        if (action === 'edit') {
          setCurrentBook(item);
          setShowBookModal(true);
        } else if (action === 'delete') {
          if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
            setBooks(books.filter(b => b.id !== item.id));
            showNotification('Book deleted successfully!', 'success');
          }
        }
        break;
      case 'member':
        if (action === 'edit') {
          setCurrentMember(item);
          setShowMemberModal(true);
        } else if (action === 'delete') {
          if (window.confirm(`Are you sure you want to delete member "${item.name}"?`)) {
            setMembers(members.filter(m => m.id !== item.id));
            showNotification('Member deleted successfully!', 'success');
          }
        }
        break;
      case 'transaction':
        if (action === 'return') {
          setCurrentTransaction(item);
          setShowTransactionModal(true);
        } else if (action === 'delete') {
          if (window.confirm(`Are you sure you want to delete this transaction?`)) {
            setTransactions(transactions.filter(t => t.id !== item.id));
            showNotification('Transaction deleted successfully!', 'success');
          }
        }
        break;
      default:
        break;
    }
  };

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate stats
  const stats = {
    totalBooks: books.length,
    totalMembers: members.length,
    booksAvailable: books.reduce((sum, book) => sum + book.available, 0),
    booksBorrowed: books.reduce((sum, book) => sum + (book.copies - book.available), 0),
    activeMembers: members.filter(m => m.status === 'active').length,
    overdueBooks: transactions.filter(t => 
      t.status === 'issued' && new Date(t.dueDate) < new Date()
    ).length,
    totalFines: transactions.reduce((sum, t) => sum + t.fine, 0)
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowBookModal(false);
        setShowMemberModal(false);
        setShowTransactionModal(false);
        setCurrentBook(null);
        setCurrentMember(null);
        setCurrentTransaction(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="library-app">
      {/* Notification */}
      {notification && (
        <div className={`notification notification--${notification.type}`}>
          <div className="notification__content">
            <i className={`icon icon--${notification.type === 'success' ? 'check' : 'warning'}`}></i>
            {notification.message}
          </div>
          <button 
            className="notification__close" 
            onClick={() => setNotification(null)}
          >
            &times;
          </button>
        </div>
      )}

      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <button 
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className="icon icon--menu"></i>
          </button>
          <h1 className="app-title">
            <i className="icon icon--library"></i> 
            <span>LibraryPro</span>
          </h1>
          <div className="header-actions">
            <div className="search-box">
              <i className="icon icon--search"></i>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button 
                  className="search-clear"
                  onClick={() => setSearchTerm('')}
                >
                  <i className="icon icon--close"></i>
                </button>
              )}
            </div>
            <button 
              className="theme-toggle"
              onClick={toggleTheme}
              data-tooltip={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              <i className={`icon icon--${theme === 'light' ? 'moon' : 'sun'}`}></i>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="app-tabs">
          <div className="tabs-container">
            <button 
              className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <i className="icon icon--dashboard"></i>
              <span>Dashboard</span>
            </button>
            <button 
              className={`tab ${activeTab === 'books' ? 'active' : ''}`}
              onClick={() => setActiveTab('books')}
            >
              <i className="icon icon--books"></i>
              <span>Books</span>
            </button>
            <button 
              className={`tab ${activeTab === 'members' ? 'active' : ''}`}
              onClick={() => setActiveTab('members')}
            >
              <i className="icon icon--members"></i>
              <span>Members</span>
            </button>
            <button 
              className={`tab ${activeTab === 'transactions' ? 'active' : ''}`}
              onClick={() => setActiveTab('transactions')}
            >
              <i className="icon icon--transactions"></i>
              <span>Transactions</span>
            </button>
            <button 
              className={`tab ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              <i className="icon icon--reports"></i>
              <span>Reports</span>
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="app-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading library data...</p>
          </div>
        ) : (
          <>
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="dashboard-content">
                <div className="stats-grid">
                  {[
                    { icon: 'books', label: 'Total Books', value: stats.totalBooks, color: 'primary' },
                    { icon: 'available', label: 'Available', value: stats.booksAvailable, color: 'success' },
                    { icon: 'borrowed', label: 'Borrowed', value: stats.booksBorrowed, color: 'warning' },
                    { icon: 'members', label: 'Total Members', value: stats.totalMembers, color: 'secondary' },
                    { icon: 'active', label: 'Active Members', value: stats.activeMembers, color: 'info' },
                    { icon: 'overdue', label: 'Overdue Books', value: stats.overdueBooks, color: 'danger' }
                  ].map((stat, index) => (
                    <div key={index} className={`stat-card stat-card--${stat.color}`}>
                      <div className="stat-icon">
                        <i className={`icon icon--${stat.icon}`}></i>
                      </div>
                      <div className="stat-info">
                        <h3>{stat.label}</h3>
                        <p>{stat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="content-row">
                  <div className="chart-card">
                    <div className="card-header">
                      <h3>Books by Category</h3>
                      <button className="btn btn--icon">
                        <i className="icon icon--download"></i>
                      </button>
                    </div>
                    <div className="chart-placeholder">
                      <p>Visualization of books by category</p>
                    </div>
                  </div>
                  <div className="chart-card">
                    <div className="card-header">
                      <h3>Recent Activity</h3>
                    </div>
                    <div className="activity-list">
                      {transactions.slice(0, 5).map(transaction => (
                        <div key={transaction.id} className="activity-item">
                          <div className={`activity-icon ${transaction.status}`}>
                            <i className={`icon icon--${transaction.status === 'issued' ? 'issue' : 'return'}`}></i>
                          </div>
                          <div className="activity-details">
                            <p>
                              {transaction.status === 'issued' ? 
                                `${transaction.memberName} borrowed "${transaction.bookTitle}"` : 
                                `${transaction.memberName} returned "${transaction.bookTitle}"`}
                            </p>
                            <span className="activity-date">
                              {formatDate(transaction.status === 'issued' ? transaction.issueDate : transaction.returnDate)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Books Tab */}
            {activeTab === 'books' && (
              <div className="books-content">
                <div className="content-header">
                  <h2>Books Management</h2>
                  <div className="header-actions">
                    <div className="filter-dropdown">
                      <select 
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="filter-select"
                      >
                        <option value="all">All Categories</option>
                        <option value="fiction">Fiction</option>
                        <option value="dystopian">Dystopian</option>
                        <option value="fantasy">Fantasy</option>
                        <option value="romance">Romance</option>
                        <option value="science">Science</option>
                      </select>
                    </div>
                    <button 
                      className="btn btn--primary btn--add"
                      onClick={() => {
                        setCurrentBook({
                          id: '',
                          title: '',
                          author: '',
                          isbn: '',
                          category: 'fiction',
                          publishedYear: new Date().getFullYear(),
                          publisher: '',
                          copies: 1,
                          available: 1,
                          shelf: '',
                          cover: '',
                          description: ''
                        });
                        setShowBookModal(true);
                      }}
                    >
                      <i className="icon icon--add"></i> Add Book
                    </button>
                  </div>
                </div>

                {filteredBooks.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <i className="icon icon--empty"></i>
                    </div>
                    <h3>No books found</h3>
                    <p className="empty-text">
                      {searchTerm ? 'Try a different search term' : 'Add your first book'}
                    </p>
                  </div>
                ) : (
                  <div className="data-table">
                    <div className="table-header">
                      <div 
                        className={`table-cell ${sortConfig.key === 'title' ? `sorted-${sortConfig.direction}` : ''}`}
                        onClick={() => requestSort('title')}
                      >
                        Title
                        <i className={`icon icon--sort${sortConfig.key === 'title' ? `-${sortConfig.direction}` : ''}`}></i>
                      </div>
                      <div 
                        className={`table-cell ${sortConfig.key === 'author' ? `sorted-${sortConfig.direction}` : ''}`}
                        onClick={() => requestSort('author')}
                      >
                        Author
                        <i className={`icon icon--sort${sortConfig.key === 'author' ? `-${sortConfig.direction}` : ''}`}></i>
                      </div>
                      <div className="table-cell">Category</div>
                      <div 
                        className={`table-cell ${sortConfig.key === 'available' ? `sorted-${sortConfig.direction}` : ''}`}
                        onClick={() => requestSort('available')}
                      >
                        Available
                        <i className={`icon icon--sort${sortConfig.key === 'available' ? `-${sortConfig.direction}` : ''}`}></i>
                      </div>
                      <div className="table-cell">ISBN</div>
                      <div className="table-cell">Actions</div>
                    </div>
                    <div className="table-body">
                      {filteredBooks.map(book => (
                        <div key={book.id} className="table-row">
                          <div className="table-cell">
                            <div className="book-info">
                              {book.cover ? (
                                <img src={book.cover} alt={book.title} className="book-cover" />
                              ) : (
                                <div className="book-cover-placeholder">
                                  <i className="icon icon--book"></i>
                                </div>
                              )}
                              <span>{book.title}</span>
                            </div>
                          </div>
                          <div className="table-cell">{book.author}</div>
                          <div className="table-cell">
                            <span className={`badge badge--${book.category.toLowerCase()}`}>
                              {book.category}
                            </span>
                          </div>
                          <div className="table-cell">
                            <span className={`availability ${book.available === 0 ? 'unavailable' : ''}`}>
                              {book.available}/{book.copies}
                            </span>
                          </div>
                          <div className="table-cell">{book.isbn}</div>
                          <div className="table-cell actions">
                            <button 
                              className="btn btn--icon btn--edit"
                              onClick={() => handleAction('edit', book, 'book')}
                              data-tooltip="Edit Book"
                            >
                              <i className="icon icon--edit"></i>
                            </button>
                            <button 
                              className="btn btn--icon btn--delete"
                              onClick={() => handleAction('delete', book, 'book')}
                              data-tooltip="Delete Book"
                            >
                              <i className="icon icon--delete"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Members Tab */}
            {activeTab === 'members' && (
              <div className="members-content">
                <div className="content-header">
                  <h2>Members Management</h2>
                  <div className="header-actions">
                    <div className="filter-dropdown">
                      <select 
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="filter-select"
                      >
                        <option value="all">All Members</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <button 
                      className="btn btn--primary btn--add"
                      onClick={() => {
                        setCurrentMember({
                          id: '',
                          name: '',
                          email: '',
                          phone: '',
                          membershipDate: new Date().toISOString().split('T')[0],
                          membershipType: 'standard',
                          booksBorrowed: 0,
                          maxBooks: 3,
                          status: 'active'
                        });
                        setShowMemberModal(true);
                      }}
                    >
                      <i className="icon icon--add"></i> Add Member
                    </button>
                  </div>
                </div>

                {filteredMembers.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <i className="icon icon--empty"></i>
                    </div>
                    <h3>No members found</h3>
                    <p className="empty-text">
                      {searchTerm ? 'Try a different search term' : 'Add your first member'}
                    </p>
                  </div>
                ) : (
                  <div className="data-table">
                    <div className="table-header">
                      <div 
                        className={`table-cell ${sortConfig.key === 'name' ? `sorted-${sortConfig.direction}` : ''}`}
                        onClick={() => requestSort('name')}
                      >
                        Name
                        <i className={`icon icon--sort${sortConfig.key === 'name' ? `-${sortConfig.direction}` : ''}`}></i>
                      </div>
                      <div className="table-cell">Email</div>
                      <div className="table-cell">Phone</div>
                      <div 
                        className={`table-cell ${sortConfig.key === 'membershipType' ? `sorted-${sortConfig.direction}` : ''}`}
                        onClick={() => requestSort('membershipType')}
                      >
                        Membership
                        <i className={`icon icon--sort${sortConfig.key === 'membershipType' ? `-${sortConfig.direction}` : ''}`}></i>
                      </div>
                      <div 
                        className={`table-cell ${sortConfig.key === 'status' ? `sorted-${sortConfig.direction}` : ''}`}
                        onClick={() => requestSort('status')}
                      >
                        Status
                        <i className={`icon icon--sort${sortConfig.key === 'status' ? `-${sortConfig.direction}` : ''}`}></i>
                      </div>
                      <div className="table-cell">Books</div>
                      <div className="table-cell">Actions</div>
                    </div>
                    <div className="table-body">
                      {filteredMembers.map(member => (
                        <div key={member.id} className="table-row">
                          <div className="table-cell">{member.name}</div>
                          <div className="table-cell">{member.email}</div>
                          <div className="table-cell">{member.phone}</div>
                          <div className="table-cell">
                            <span className={`badge badge--${member.membershipType.toLowerCase()}`}>
                              {member.membershipType}
                            </span>
                          </div>
                          <div className="table-cell">
                            <span className={`badge badge--${member.status}`}>
                              {member.status}
                            </span>
                          </div>
                          <div className="table-cell">
                            <span className="availability">
                              {member.booksBorrowed}/{member.maxBooks}
                            </span>
                          </div>
                          <div className="table-cell actions">
                            <button 
                              className="btn btn--icon btn--edit"
                              onClick={() => handleAction('edit', member, 'member')}
                              data-tooltip="Edit Member"
                            >
                              <i className="icon icon--edit"></i>
                            </button>
                            <button 
                              className="btn btn--icon btn--delete"
                              onClick={() => handleAction('delete', member, 'member')}
                              data-tooltip="Delete Member"
                            >
                              <i className="icon icon--delete"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="transactions-content">
                <div className="content-header">
                  <h2>Transactions Management</h2>
                  <div className="header-actions">
                    <div className="filter-dropdown">
                      <select 
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="filter-select"
                      >
                        <option value="all">All Transactions</option>
                        <option value="issued">Issued</option>
                        <option value="returned">Returned</option>
                        <option value="overdue">Overdue</option>
                      </select>
                    </div>
                    <button 
                      className="btn btn--primary btn--add"
                      onClick={() => {
                        setCurrentTransaction({
                          id: '',
                          bookId: '',
                          memberId: '',
                          issueDate: new Date().toISOString().split('T')[0],
                          dueDate: '',
                          returnDate: '',
                          status: 'issued',
                          fine: 0
                        });
                        setShowTransactionModal(true);
                      }}
                    >
                      <i className="icon icon--add"></i> New Transaction
                    </button>
                  </div>
                </div>

                {filteredTransactions.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <i className="icon icon--empty"></i>
                    </div>
                    <h3>No transactions found</h3>
                    <p className="empty-text">
                      {searchTerm ? 'Try a different search term' : 'Create your first transaction'}
                    </p>
                  </div>
                ) : (
                  <div className="data-table">
                    <div className="table-header">
                      <div className="table-cell">Book</div>
                      <div className="table-cell">Member</div>
                      <div 
                        className={`table-cell ${sortConfig.key === 'issueDate' ? `sorted-${sortConfig.direction}` : ''}`}
                        onClick={() => requestSort('issueDate')}
                      >
                        Issue Date
                        <i className={`icon icon--sort${sortConfig.key === 'issueDate' ? `-${sortConfig.direction}` : ''}`}></i>
                      </div>
                      <div className="table-cell">Due Date</div>
                      <div className="table-cell">Return Date</div>
                      <div 
                        className={`table-cell ${sortConfig.key === 'status' ? `sorted-${sortConfig.direction}` : ''}`}
                        onClick={() => requestSort('status')}
                      >
                        Status
                        <i className={`icon icon--sort${sortConfig.key === 'status' ? `-${sortConfig.direction}` : ''}`}></i>
                      </div>
                      <div className="table-cell">Fine</div>
                      <div className="table-cell">Actions</div>
                    </div>
                    <div className="table-body">
                      {filteredTransactions.map(transaction => (
                        <div 
                          key={transaction.id} 
                          className={`table-row ${new Date(transaction.dueDate) < new Date() && transaction.status === 'issued' ? 'overdue' : ''}`}
                        >
                          <div className="table-cell">{transaction.bookTitle}</div>
                          <div className="table-cell">{transaction.memberName}</div>
                          <div className="table-cell">{formatDate(transaction.issueDate)}</div>
                          <div className="table-cell">{formatDate(transaction.dueDate)}</div>
                          <div className="table-cell">{formatDate(transaction.returnDate)}</div>
                          <div className="table-cell">
                            <span className={`badge badge--${transaction.status}`}>
                              {transaction.status}
                              {new Date(transaction.dueDate) < new Date() && transaction.status === 'issued' && ' (Overdue)'}
                            </span>
                          </div>
                          <div className="table-cell">${transaction.fine}</div>
                          <div className="table-cell actions">
                            {transaction.status === 'issued' && (
                              <button 
                                className="btn btn--icon btn--return"
                                onClick={() => handleAction('return', transaction, 'transaction')}
                                data-tooltip="Return Book"
                              >
                                <i className="icon icon--return"></i>
                              </button>
                            )}
                            <button 
                              className="btn btn--icon btn--delete"
                              onClick={() => handleAction('delete', transaction, 'transaction')}
                              data-tooltip="Delete Transaction"
                            >
                              <i className="icon icon--delete"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="reports-content">
                <div className="content-header">
                  <h2>Library Reports</h2>
                </div>

                <div className="reports-grid">
                  <div className="report-card">
                    <h3>Books Inventory</h3>
                    <div className="report-placeholder">
                      <p>Report: Books Inventory</p>
                    </div>
                    <button className="btn btn--secondary">
                      <i className="icon icon--download"></i> Download
                    </button>
                  </div>
                  <div className="report-card">
                    <h3>Member Activity</h3>
                    <div className="report-placeholder">
                      <p>Report: Member Activity</p>
                    </div>
                    <button className="btn btn--secondary">
                      <i className="icon icon--download"></i> Download
                    </button>
                  </div>
                  <div className="report-card">
                    <h3>Overdue Books</h3>
                    <div className="report-placeholder">
                      <p>Report: Overdue Books</p>
                    </div>
                    <button className="btn btn--secondary">
                      <i className="icon icon--download"></i> Download
                    </button>
                  </div>
                  <div className="report-card">
                    <h3>Fines Collected</h3>
                    <div className="report-placeholder">
                      <p>Report: Fines Collected</p>
                    </div>
                    <button className="btn btn--secondary">
                      <i className="icon icon--download"></i> Download
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Book Modal */}
      {showBookModal && (
        <div className="modal-overlay">
          <div className="modal" ref={modalRef}>
            <div className="modal-header">
              <h2>
                <i className="icon icon--books"></i>
                {currentBook.id ? 'Edit Book' : 'Add New Book'}
              </h2>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowBookModal(false);
                  setCurrentBook(null);
                }}
              >
                <i className="icon icon--close"></i>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleBookSubmit}>
                <div className="form-group">
                  <label className="form-label">Title*</label>
                  <input
                    type="text"
                    placeholder="Book title"
                    value={currentBook.title}
                    onChange={(e) => setCurrentBook({...currentBook, title: e.target.value})}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Author*</label>
                  <input
                    type="text"
                    placeholder="Author name"
                    value={currentBook.author}
                    onChange={(e) => setCurrentBook({...currentBook, author: e.target.value})}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">ISBN*</label>
                  <input
                    type="text"
                    placeholder="ISBN number"
                    value={currentBook.isbn}
                    onChange={(e) => setCurrentBook({...currentBook, isbn: e.target.value})}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      value={currentBook.category}
                      onChange={(e) => setCurrentBook({...currentBook, category: e.target.value})}
                      className="form-control"
                    >
                      <option value="fiction">Fiction</option>
                      <option value="dystopian">Dystopian</option>
                      <option value="fantasy">Fantasy</option>
                      <option value="romance">Romance</option>
                      <option value="science">Science</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Published Year</label>
                    <input
                      type="number"
                      placeholder="Year"
                      value={currentBook.publishedYear}
                      onChange={(e) => setCurrentBook({...currentBook, publishedYear: e.target.value})}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Publisher</label>
                    <input
                      type="text"
                      placeholder="Publisher name"
                      value={currentBook.publisher}
                      onChange={(e) => setCurrentBook({...currentBook, publisher: e.target.value})}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Shelf Location</label>
                    <input
                      type="text"
                      placeholder="Shelf location"
                      value={currentBook.shelf}
                      onChange={(e) => setCurrentBook({...currentBook, shelf: e.target.value})}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Total Copies</label>
                    <input
                      type="number"
                      min="1"
                      value={currentBook.copies}
                      onChange={(e) => setCurrentBook({...currentBook, copies: e.target.value})}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cover Image URL</label>
                    <input
                      type="text"
                      placeholder="Cover image URL"
                      value={currentBook.cover}
                      onChange={(e) => setCurrentBook({...currentBook, cover: e.target.value})}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    placeholder="Book description"
                    value={currentBook.description}
                    onChange={(e) => setCurrentBook({...currentBook, description: e.target.value})}
                    className="form-control"
                    rows="3"
                  />
                </div>
                <div className="modal-footer">
                  <button 
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => {
                      setShowBookModal(false);
                      setCurrentBook(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="btn btn--primary"
                  >
                    {currentBook.id ? 'Update Book' : 'Add Book'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Member Modal */}
      {showMemberModal && (
        <div className="modal-overlay">
          <div className="modal" ref={modalRef}>
            <div className="modal-header">
              <h2>
                <i className="icon icon--members"></i>
                {currentMember.id ? 'Edit Member' : 'Add New Member'}
              </h2>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowMemberModal(false);
                  setCurrentMember(null);
                }}
              >
                <i className="icon icon--close"></i>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleMemberSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name*</label>
                  <input
                    type="text"
                    placeholder="Member name"
                    value={currentMember.name}
                    onChange={(e) => setCurrentMember({...currentMember, name: e.target.value})}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email*</label>
                  <input
                    type="email"
                    placeholder="Email address"
                    value={currentMember.email}
                    onChange={(e) => setCurrentMember({...currentMember, email: e.target.value})}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={currentMember.phone}
                    onChange={(e) => setCurrentMember({...currentMember, phone: e.target.value})}
                    className="form-control"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Membership Type</label>
                    <select
                      value={currentMember.membershipType}
                      onChange={(e) => setCurrentMember({...currentMember, membershipType: e.target.value})}
                      className="form-control"
                    >
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                      <option value="student">Student</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Max Books</label>
                    <input
                      type="number"
                      min="1"
                      value={currentMember.maxBooks}
                      onChange={(e) => setCurrentMember({...currentMember, maxBooks: e.target.value})}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Membership Date</label>
                    <input
                      type="date"
                      value={currentMember.membershipDate}
                      onChange={(e) => setCurrentMember({...currentMember, membershipDate: e.target.value})}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      value={currentMember.status}
                      onChange={(e) => setCurrentMember({...currentMember, status: e.target.value})}
                      className="form-control"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => {
                      setShowMemberModal(false);
                      setCurrentMember(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="btn btn--primary"
                  >
                    {currentMember.id ? 'Update Member' : 'Add Member'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      {showTransactionModal && (
        <div className="modal-overlay">
          <div className="modal" ref={modalRef}>
            <div className="modal-header">
              <h2>
                <i className="icon icon--transactions"></i>
                {currentTransaction.id ? 'Return Book' : 'Issue New Book'}
              </h2>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowTransactionModal(false);
                  setCurrentTransaction(null);
                }}
              >
                <i className="icon icon--close"></i>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleTransactionSubmit}>
                {currentTransaction.id ? (
                  <>
                    <div className="form-group">
                      <label className="form-label">Book</label>
                      <p className="form-static">{currentTransaction.bookTitle}</p>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Member</label>
                      <p className="form-static">{currentTransaction.memberName}</p>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Issue Date</label>
                        <p className="form-static">{formatDate(currentTransaction.issueDate)}</p>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Due Date</label>
                        <p className="form-static">{formatDate(currentTransaction.dueDate)}</p>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Fine (if any)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={currentTransaction.fine}
                        onChange={(e) => setCurrentTransaction({...currentTransaction, fine: parseFloat(e.target.value) || 0})}
                        className="form-control"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <label className="form-label">Select Book*</label>
                      <select
                        value={currentTransaction.bookId}
                        onChange={(e) => setCurrentTransaction({...currentTransaction, bookId: e.target.value})}
                        className="form-control"
                        required
                      >
                        <option value="">-- Select Book --</option>
                        {books.filter(b => b.available > 0).map(book => (
                          <option key={book.id} value={book.id}>
                            {book.title} by {book.author} (Available: {book.available})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Select Member*</label>
                      <select
                        value={currentTransaction.memberId}
                        onChange={(e) => setCurrentTransaction({...currentTransaction, memberId: e.target.value})}
                        className="form-control"
                        required
                      >
                        <option value="">-- Select Member --</option>
                        {members.filter(m => m.status === 'active' && m.booksBorrowed < m.maxBooks).map(member => (
                          <option key={member.id} value={member.id}>
                            {member.name} ({member.membershipType}, Borrowed: {member.booksBorrowed}/{member.maxBooks})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Issue Date</label>
                        <input
                          type="date"
                          value={currentTransaction.issueDate}
                          onChange={(e) => setCurrentTransaction({...currentTransaction, issueDate: e.target.value})}
                          className="form-control"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Due Date</label>
                        <input
                          type="date"
                          value={currentTransaction.dueDate || new Date(new Date(currentTransaction.issueDate).setDate(new Date(currentTransaction.issueDate).getDate() + 30))}
                          onChange={(e) => setCurrentTransaction({...currentTransaction, dueDate: e.target.value})}
                          className="form-control"
                        />
                      </div>
                    </div>
                  </>
                )}
                <div className="modal-footer">
                  <button 
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => {
                      setShowTransactionModal(false);
                      setCurrentTransaction(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="btn btn--primary"
                  >
                    {currentTransaction.id ? 'Return Book' : 'Issue Book'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryDashboard;