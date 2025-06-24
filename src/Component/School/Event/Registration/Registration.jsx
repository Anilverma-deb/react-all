import React, { useState, useEffect } from 'react';
import './Registration.css';
import { Search, Filter, ChevronDown, Check, Clock, X, Calendar, User, Phone, MapPin, GraduationCap } from 'lucide-react';

const Registration = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Enhanced booking data with student and parent details
  const bookingsData = [
    {
      id: 'INV1011',
      date: '2029/02/15',
      time: '10:30 AM',
      parentName: 'Jackson Moore',
      parentAddress: 'Bagal Colony, Sector 12, Faridabad',
      parentPhone: '9012345678',
      event: 'Symphony Under the Stars',
      category: 'Music Concert',
      quantity: 2,
      amount: '₹2,500',
      student: {
        name: 'Emma Moore',
        id: 'STU2024001',
        class: '8th Grade (A)',
        relation: 'Father'
      },
      status: 'confirmed'
    },
    {
      id: 'INV1012',
      date: '2029/02/16',
      time: '03:45 PM',
      parentName: 'Alicia Smithson',
      parentAddress: 'MG Road, Downtown, Sector 21',
      parentPhone: '9876543210',
      event: 'Runway Revolution 2024',
      category: 'Fashion Show',
      quantity: 1,
      amount: '₹1,800',
      student: {
        name: 'Ryan Smithson',
        id: 'STU2024002',
        class: '10th Grade (B)',
        relation: 'Mother'
      },
      status: 'pending'
    },
    {
      id: 'INV1013',
      date: '2029/02/17',
      time: '01:15 PM',
      parentName: 'Marcus Rawless',
      parentAddress: 'Gandhi Nagar, East Wing, Block C',
      parentPhone: '8765432109',
      event: 'Global Wellness Summit',
      category: 'Health & Wellness',
      quantity: 3,
      amount: '₹4,200',
      student: {
        name: 'Sophia Rawless',
        id: 'STU2024003',
        class: '7th Grade (C)',
        relation: 'Father'
      },
      status: 'confirmed'
    },
    {
      id: 'INV1014',
      date: '2029/02/18',
      time: '09:00 AM',
      parentName: 'Patrick Cooper',
      parentAddress: 'Nehru Colony, Block B, Apartment 45',
      parentPhone: '7654321098',
      event: 'Champions League Screening',
      category: 'Sports Event',
      quantity: 4,
      amount: '₹3,600',
      student: {
        name: 'Alex Cooper',
        id: 'STU2024004',
        class: '9th Grade (A)',
        relation: 'Father'
      },
      status: 'cancelled'
    },
    {
      id: 'INV1015',
      date: '2029/02/18',
      time: '05:30 PM',
      parentName: 'Gilda Ramos',
      parentAddress: 'Silver Oaks Apartments, Tower 2',
      parentPhone: '6543210987',
      event: 'Modern Art Exhibition',
      category: 'Art & Culture',
      quantity: 2,
      amount: '₹1,500',
      student: {
        name: 'Isabella Ramos',
        id: 'STU2024005',
        class: '6th Grade (B)',
        relation: 'Mother'
      },
      status: 'confirmed'
    },
    {
      id: 'INV1016',
      date: '2029/02/19',
      time: '11:00 AM',
      parentName: 'Sarah Johnson',
      parentAddress: 'Park Avenue, Central District',
      parentPhone: '5432109876',
      event: 'Tech Innovation Fair',
      category: 'Technology',
      quantity: 1,
      amount: '₹2,800',
      student: {
        name: 'Ethan Johnson',
        id: 'STU2024006',
        class: '11th Grade (A)',
        relation: 'Mother'
      },
      status: 'pending'
    },
    {
      id: 'INV1017',
      date: '2029/02/20',
      time: '02:00 PM',
      parentName: 'Michael Chen',
      parentAddress: 'Riverside Complex, Unit 45B',
      parentPhone: '4321098765',
      event: 'Culinary Workshop',
      category: 'Food & Beverage',
      quantity: 5,
      amount: '₹5,500',
      student: {
        name: 'Lily Chen',
        id: 'STU2024007',
        class: '12th Grade (C)',
        relation: 'Father'
      },
      status: 'confirmed'
    }
  ];

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  // Filter bookings
  const filteredBookings = bookingsData.filter(booking => {
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.student.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch(status) {
      case 'confirmed': return <Check className="status-icon" />;
      case 'pending': return <Clock className="status-icon" />;
      case 'cancelled': return <X className="status-icon" />;
      default: return <Calendar className="status-icon" />;
    }
  };

  const handleFilterClick = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setIsFilterOpen(false);
  };

  return (
    <div className="booking-management-container">
      <div className="header-section">
        <div className="title-section">
          <h1 className="main-heading">Recent Bookings</h1>
          <p className="subtitle">Manage and track all event bookings</p>
        </div>
        
        <div className="controls-section">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search bookings, students, events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-container">
            <button 
              className="filter-button"
              onClick={handleFilterClick}
            >
              <Filter className="filter-icon" />
              <span>Filter Status</span>
              <ChevronDown className={`chevron-icon ${isFilterOpen ? 'open' : ''}`} />
            </button>
            
            {isFilterOpen && (
              <div className="filter-dropdown">
                <button 
                  className={`filter-option ${statusFilter === 'all' ? 'active' : ''}`}
                  onClick={() => handleStatusFilterChange('all')}
                >
                  <span className="filter-dot all"></span>
                  All Bookings
                </button>
                <button 
                  className={`filter-option ${statusFilter === 'pending' ? 'active' : ''}`}
                  onClick={() => handleStatusFilterChange('pending')}
                >
                  <span className="filter-dot pending"></span>
                  Pending
                </button>
                <button 
                  className={`filter-option ${statusFilter === 'confirmed' ? 'active' : ''}`}
                  onClick={() => handleStatusFilterChange('confirmed')}
                >
                  <span className="filter-dot confirmed"></span>
                  Confirmed
                </button>
                <button 
                  className={`filter-option ${statusFilter === 'cancelled' ? 'active' : ''}`}
                  onClick={() => handleStatusFilterChange('cancelled')}
                >
                  <span className="filter-dot cancelled"></span>
                  Cancelled
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon confirmed-bg">
            <Check />
          </div>
          <div className="stat-info">
            <h3>{bookingsData.filter(b => b.status === 'confirmed').length}</h3>
            <p>Confirmed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pending-bg">
            <Clock />
          </div>
          <div className="stat-info">
            <h3>{bookingsData.filter(b => b.status === 'pending').length}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon cancelled-bg">
            <X />
          </div>
          <div className="stat-info">
            <h3>{bookingsData.filter(b => b.status === 'cancelled').length}</h3>
            <p>Cancelled</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon total-bg">
            <Calendar />
          </div>
          <div className="stat-info">
            <h3>{bookingsData.length}</h3>
            <p>Total Bookings</p>
          </div>
        </div>
      </div>

      <div className="table-container">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading bookings...</p>
          </div>
        ) : (
          <>
            {filteredBookings.length > 0 ? (
              <div className="table-wrapper">
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>Invoice ID</th>
                      <th>Date & Time</th>
                      <th>Parent Details</th>
                      <th>Contact Info</th>
                      <th>Event Details</th>
                      <th>Student Info</th>
                      <th>Qty</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking, index) => (
                      <tr key={booking.id} className="booking-row">
                        <td className="invoice-id">
                          <div className="invoice-wrapper">
                            <span className="invoice-number">{booking.id}</span>
                          </div>
                        </td>
                        
                        <td className="date-cell">
                          <div className="date-info">
                            <div className="date">{booking.date}</div>
                            <div className="time">{booking.time}</div>
                          </div>
                        </td>
                        
                        <td className="parent-cell">
                          <div className="parent-info">
                            <div className="parent-name">
                              <User className="info-icon" />
                              {booking.parentName}
                            </div>
                          </div>
                        </td>
                        
                        <td className="contact-cell">
                          <div className="contact-info">
                            <div className="address">
                              <MapPin className="info-icon" />
                              {booking.parentAddress}
                            </div>
                            <div className="phone">
                              <Phone className="info-icon" />
                              {booking.parentPhone}
                            </div>
                          </div>
                        </td>
                        
                        <td className="event-cell">
                          <div className="event-info">
                            <div className="event-name">{booking.event}</div>
                            <div className="event-category">{booking.category}</div>
                          </div>
                        </td>
                        
                        <td className="student-cell">
                          <div className="student-info">
                            <div className="student-name">
                              <GraduationCap className="info-icon" />
                              {booking.student.name}
                            </div>
                            <div className="student-details">
                              <span className="student-id">ID: {booking.student.id}</span>
                              <span className="student-class">Class: {booking.student.class}</span>
                              <span className="student-relation">Relation: {booking.student.relation}</span>
                            </div>
                          </div>
                        </td>
                        
                        <td className="quantity-cell">
                          <div className="quantity-badge">{booking.quantity}</div>
                        </td>
                        
                        <td className="amount-cell">
                          <div className="amount-value">{booking.amount}</div>
                        </td>
                        
                        <td className="status-cell">
                          <div className={`status-badge ${booking.status}`}>
                            {getStatusIcon(booking.status)}
                            <span className="status-text">{booking.status}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h3>No bookings found</h3>
                <p>Try adjusting your search or filter criteria</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Registration;