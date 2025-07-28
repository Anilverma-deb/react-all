import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import './Hostel-Management.css';

const HostelDashboard = () => {
  // Initial data
  const initialRooms = [
    { id: 101, occupants: 2, capacity: 4, status: 'Occupied', gender: 'Male', floor: 1, type: 'AC', rent: 5000 },
    { id: 102, occupants: 1, capacity: 4, status: 'Partially Occupied', gender: 'Male', floor: 1, type: 'Non-AC', rent: 4000 },
    { id: 103, occupants: 0, capacity: 4, status: 'Vacant', gender: 'Female', floor: 2, type: 'AC', rent: 5000 },
    { id: 104, occupants: 4, capacity: 4, status: 'Full', gender: 'Female', floor: 2, type: 'Non-AC', rent: 4000 },
    { id: 105, occupants: 3, capacity: 4, status: 'Occupied', gender: 'Male', floor: 3, type: 'Deluxe', rent: 6000 },
    { id: 106, occupants: 0, capacity: 4, status: 'Vacant', gender: 'Female', floor: 3, type: 'Deluxe', rent: 6000 },
  ];

  const initialStudents = [
    { id: 1, name: 'Aman Verma', room: 101, checkIn: '2023-01-15', checkOut: '', contact: '9876543210', gender: 'Male', feesPaid: true },
    { id: 2, name: 'Neha Patel', room: 103, checkIn: '2023-02-10', checkOut: '', contact: '9876543211', gender: 'Female', feesPaid: true },
    { id: 3, name: 'Rohit Mehra', room: 102, checkIn: '2023-03-05', checkOut: '', contact: '9876543212', gender: 'Male', feesPaid: false },
    { id: 4, name: 'Priya Singh', room: 104, checkIn: '2023-01-20', checkOut: '', contact: '9876543213', gender: 'Female', feesPaid: true },
  ];

  // State management
  const [rooms, setRooms] = useState(initialRooms);
  const [students, setStudents] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentStudent, setCurrentStudent] = useState({
    id: '',
    name: '',
    gender: 'Male',
    room: '',
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: '',
    contact: '',
    feesPaid: false
  });
  const [currentRoom, setCurrentRoom] = useState({
    id: '',
    occupants: 0,
    capacity: 4,
    status: 'Vacant',
    gender: 'Male',
    floor: 1,
    type: 'AC',
    rent: 4000
  });
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    vacantRooms: 0,
    totalStudents: 0,
    maleStudents: 0,
    femaleStudents: 0
  });
  const [exportType, setExportType] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Check screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  // Calculate statistics
  useEffect(() => {
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter(room => room.occupants > 0).length;
    const vacantRooms = rooms.filter(room => room.occupants === 0).length;
    const totalStudents = students.filter(s => !s.checkOut).length;
    const maleStudents = students.filter(s => s.gender === 'Male' && !s.checkOut).length;
    const femaleStudents = students.filter(s => s.gender === 'Female' && !s.checkOut).length;
    
    setStats({
      totalRooms,
      occupiedRooms,
      vacantRooms,
      totalStudents,
      maleStudents,
      femaleStudents
    });
  }, [rooms, students]);

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         student.room.toString().includes(searchTerm);
    const matchesRoom = selectedRoom ? student.room === selectedRoom : true;
    const isActive = !student.checkOut;
    return matchesSearch && matchesRoom && isActive;
  });

  // Filter rooms
  const filteredRooms = rooms.filter(room => {
    const matchesFloor = selectedFloor === 'All' || room.floor.toString() === selectedFloor;
    const matchesGender = selectedGender === 'All' || room.gender === selectedGender;
    const matchesType = selectedType === 'All' || room.type === selectedType;
    return matchesFloor && matchesGender && matchesType;
  });

  // Open modal for adding new student
  const handleAddStudent = () => {
    setModalMode('add');
    setCurrentStudent({
      id: '',
      name: '',
      gender: 'Male',
      room: '',
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: '',
      contact: '',
      feesPaid: false
    });
    setShowStudentModal(true);
  };

  // Open modal for editing student
  const handleEditStudent = (student) => {
    setModalMode('edit');
    setCurrentStudent({ ...student });
    setShowStudentModal(true);
  };

  // Open modal for adding new room
  const handleAddRoom = () => {
    setModalMode('add');
    setCurrentRoom({
      id: '',
      occupants: 0,
      capacity: 4,
      status: 'Vacant',
      gender: 'Male',
      floor: 1,
      type: 'AC',
      rent: 4000
    });
    setShowRoomModal(true);
  };

  // Open modal for editing room
  const handleEditRoom = (room) => {
    setModalMode('edit');
    setCurrentRoom({ ...room });
    setShowRoomModal(true);
  };

  // Save student (both add and edit)
  const handleSaveStudent = () => {
    if (!currentStudent.name || !currentStudent.room) {
      showNotification('Please fill all required fields!', 'error');
      return;
    }
    
    const room = rooms.find(r => r.id === parseInt(currentStudent.room));
    if (!room) {
      showNotification('Selected room does not exist!', 'error');
      return;
    }
    
    // Check gender matching
    if (room.gender !== currentStudent.gender) {
      showNotification(`This room is for ${room.gender} students only!`, 'error');
      return;
    }
    
    if (modalMode === 'add') {
      // Check room capacity
      if (room.occupants >= room.capacity) {
        showNotification('Room is already full!', 'error');
        return;
      }
      
      const newStudent = {
        ...currentStudent,
        id: students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1,
        room: parseInt(currentStudent.room)
      };
      
      setStudents([...students, newStudent]);
      
      // Update room occupancy
      const updatedRooms = rooms.map(r => 
        r.id === parseInt(currentStudent.room) 
          ? { 
              ...r, 
              occupants: r.occupants + 1, 
              status: r.occupants + 1 === r.capacity ? 'Full' : 'Occupied' 
            } 
          : r
      );
      setRooms(updatedRooms);
      showNotification('Student added successfully!', 'success');
    } else {
      // Edit mode
      const originalStudent = students.find(s => s.id === currentStudent.id);
      
      // If room changed
      if (originalStudent.room !== parseInt(currentStudent.room)) {
        // Check new room capacity
        const newRoom = rooms.find(r => r.id === parseInt(currentStudent.room));
        if (newRoom.occupants >= newRoom.capacity) {
          showNotification('New room is already full!', 'error');
          return;
        }
        
        // Update room occupancies
        const updatedRooms = rooms.map(r => {
          if (r.id === originalStudent.room) {
            // Decrement old room
            return { 
              ...r, 
              occupants: r.occupants - 1,
              status: r.occupants - 1 === 0 ? 'Vacant' : 'Occupied'
            };
          } else if (r.id === parseInt(currentStudent.room)) {
            // Increment new room
            return { 
              ...r, 
              occupants: r.occupants + 1,
              status: r.occupants + 1 === r.capacity ? 'Full' : 'Occupied'
            };
          }
          return r;
        });
        setRooms(updatedRooms);
      }
      
      // Update student
      const updatedStudents = students.map(s => 
        s.id === currentStudent.id 
          ? { ...currentStudent, room: parseInt(currentStudent.room) } 
          : s
      );
      setStudents(updatedStudents);
      showNotification('Student updated successfully!', 'success');
    }
    
    setShowStudentModal(false);
  };

  // Save room (both add and edit)
  const handleSaveRoom = () => {
    if (!currentRoom.id || !currentRoom.capacity) {
      showNotification('Please fill all required fields!', 'error');
      return;
    }
    
    const roomId = parseInt(currentRoom.id);
    
    if (modalMode === 'add') {
      // Check if room ID already exists
      if (rooms.some(room => room.id === roomId)) {
        showNotification('Room ID already exists!', 'error');
        return;
      }
      
      const newRoom = {
        ...currentRoom,
        id: roomId,
        occupants: parseInt(currentRoom.occupants),
        capacity: parseInt(currentRoom.capacity),
        rent: parseInt(currentRoom.rent),
        status: parseInt(currentRoom.occupants) === 0 ? 'Vacant' : 
                parseInt(currentRoom.occupants) < parseInt(currentRoom.capacity) ? 'Occupied' : 'Full'
      };
      
      setRooms([...rooms, newRoom]);
      showNotification('Room added successfully!', 'success');
    } else {
      // Edit mode
      // Check if changing room ID to one that already exists
      const originalRoom = rooms.find(r => r.id === currentRoom.id);
      if (!originalRoom) return;
      
      if (parseInt(currentRoom.id) !== originalRoom.id && rooms.some(r => r.id === roomId && r.id !== originalRoom.id)) {
        showNotification('Room ID already exists!', 'error');
        return;
      }
      
      // Validate occupants vs capacity
      if (parseInt(currentRoom.occupants) > parseInt(currentRoom.capacity)) {
        showNotification('Occupants cannot exceed capacity!', 'error');
        return;
      }
      
      const updatedRoom = {
        ...currentRoom,
        id: roomId,
        occupants: parseInt(currentRoom.occupants),
        capacity: parseInt(currentRoom.capacity),
        rent: parseInt(currentRoom.rent),
        status: parseInt(currentRoom.occupants) === 0 ? 'Vacant' : 
                parseInt(currentRoom.occupants) < parseInt(currentRoom.capacity) ? 'Occupied' : 'Full'
      };
      
      const updatedRooms = rooms.map(r => 
        r.id === originalRoom.id ? updatedRoom : r
      );
      setRooms(updatedRooms);
      showNotification('Room updated successfully!', 'success');
    }
    
    setShowRoomModal(false);
  };

  // Handle student checkout
  const handleCheckout = (studentId) => {
    if (!window.confirm('Are you sure you want to checkout this student?')) return;
    
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    // Update student with checkout date
    const updatedStudents = students.map(s => 
      s.id === studentId 
        ? { ...s, checkOut: new Date().toISOString().split('T')[0] } 
        : s
    );
    setStudents(updatedStudents);
    
    // Update room occupancy
    const updatedRooms = rooms.map(r => 
      r.id === student.room 
        ? { 
            ...r, 
            occupants: r.occupants - 1, 
            status: r.occupants - 1 === 0 ? 'Vacant' : r.occupants - 1 < r.capacity ? 'Occupied' : 'Full'
          } 
        : r
    );
    setRooms(updatedRooms);
    showNotification('Student checked out successfully!', 'success');
  };

  // Handle student deletion
  const handleDeleteStudent = (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student record?')) return;
    
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    // If student hasn't checked out, update room occupancy
    if (!student.checkOut) {
      const updatedRooms = rooms.map(r => 
        r.id === student.room 
          ? { 
              ...r, 
              occupants: r.occupants - 1, 
              status: r.occupants - 1 === 0 ? 'Vacant' : r.occupants - 1 < r.capacity ? 'Occupied' : 'Full'
            } 
          : r
      );
      setRooms(updatedRooms);
    }
    
    // Remove student
    setStudents(students.filter(s => s.id !== studentId));
    showNotification('Student deleted successfully!', 'success');
  };

  // Handle room deletion
  const handleDeleteRoom = (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    
    // Check if room has occupants
    const room = rooms.find(r => r.id === roomId);
    if (room.occupants > 0) {
      showNotification('Cannot delete room with occupants!', 'error');
      return;
    }
    
    setRooms(rooms.filter(r => r.id !== roomId));
    showNotification('Room deleted successfully!', 'success');
  };

  // Export data functions
  const exportToCSV = (data, columns, filename) => {
    const header = columns.map(col => col.header).join(',');
    const rows = data.map(item => 
      columns.map(col => {
        if (col.accessor === 'feesPaid') return item[col.accessor] ? 'Paid' : 'Unpaid';
        return item[col.accessor];
      }).join(',')
    ).join('\n');
    
    const csvContent = `${header}\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Data exported to CSV successfully!', 'success');
  };

  const exportToPDF = (data, columns, filename) => {
    const doc = new jsPDF();
    const tableColumn = columns.map(col => col.header);
    const tableRows = data.map(item => 
      columns.map(col => {
        if (col.accessor === 'feesPaid') return item[col.accessor] ? 'Paid' : 'Unpaid';
        return item[col.accessor];
      })
    );
    
    doc.text(`${filename} Report`, 14, 15);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [67, 97, 238] }
    });
    
    doc.save(`${filename}.pdf`);
    showNotification('Data exported to PDF successfully!', 'success');
  };

  const printData = (data, columns, title) => {
    const printWindow = window.open('', '_blank');
    const tableHeaders = columns.map(col => `<th>${col.header}</th>`).join('');
    const tableRows = data.map(item => {
      const cells = columns.map(col => {
        let value = item[col.accessor];
        if (col.accessor === 'feesPaid') value = value ? 'Paid' : 'Unpaid';
        return `<td>${value}</td>`;
      }).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; }
            h1 { text-align: center; color: #4361ee; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #4361ee; color: white; padding: 10px; text-align: left; }
            td { padding: 8px; border-bottom: 1px solid #ddd; }
            tr:nth-child(even) { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <table>
            <thead><tr>${tableHeaders}</tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const copyToClipboard = (data, columns) => {
    const header = columns.map(col => col.header).join('\t');
    const rows = data.map(item => 
      columns.map(col => {
        if (col.accessor === 'feesPaid') return item[col.accessor] ? 'Paid' : 'Unpaid';
        return item[col.accessor];
      }).join('\t')
    ).join('\n');
    
    const text = `${header}\n${rows}`;
    navigator.clipboard.writeText(text)
      .then(() => showNotification('Data copied to clipboard!', 'success'))
      .catch(err => showNotification('Failed to copy data!', 'error'));
  };

  // Handle export action
  const handleExport = (type, dataType) => {
    let data, columns, filename;
    
    if (dataType === 'students') {
      data = filteredStudents;
      columns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Name', accessor: 'name' },
        { header: 'Gender', accessor: 'gender' },
        { header: 'Room', accessor: 'room' },
        { header: 'Check-In', accessor: 'checkIn' },
        { header: 'Check-Out', accessor: 'checkOut' },
        { header: 'Contact', accessor: 'contact' },
        { header: 'Fees', accessor: 'feesPaid' }
      ];
      filename = 'Students';
    } else {
      data = filteredRooms;
      columns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Occupants', accessor: 'occupants' },
        { header: 'Capacity', accessor: 'capacity' },
        { header: 'Status', accessor: 'status' },
        { header: 'Gender', accessor: 'gender' },
        { header: 'Floor', accessor: 'floor' },
        { header: 'Type', accessor: 'type' },
        { header: 'Rent', accessor: 'rent' }
      ];
      filename = 'Rooms';
    }
    
    switch (type) {
      case 'csv':
        exportToCSV(data, columns, filename);
        break;
      case 'pdf':
        exportToPDF(data, columns, filename);
        break;
      case 'print':
        printData(data, columns, filename);
        break;
      case 'copy':
        copyToClipboard(data, columns);
        break;
      default:
        break;
    }
    
    setExportType(null);
  };

  return (
    <div className="dashboard">
      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <header className="dashboard__header">
        <div className="header__content">
          <h1 className="header__title">
            <span className="header__icon">🏨</span>
            Hostel Management System
          </h1>
          <div className="header__search">
            <input
              type="text"
              placeholder="Search student by name or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search__input"
            />
            <button 
              className="add-student__btn"
              onClick={handleAddStudent}
            >
              {isMobile ? '+' : '+ Add Student'}
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard__main">
        {/* Statistics Cards */}
        <section className="stats__section">
          <div className="stats__grid">
            <div className="stat__card">
              <div className="stat__icon total-rooms">🏘️</div>
              <div className="stat__info">
                <h3>Total Rooms</h3>
                <p>{stats.totalRooms}</p>
              </div>
            </div>
            <div className="stat__card">
              <div className="stat__icon occupied">🛏️</div>
              <div className="stat__info">
                <h3>Occupied Rooms</h3>
                <p>{stats.occupiedRooms}</p>
              </div>
            </div>
            <div className="stat__card">
              <div className="stat__icon vacant">🚪</div>
              <div className="stat__info">
                <h3>Vacant Rooms</h3>
                <p>{stats.vacantRooms}</p>
              </div>
            </div>
            <div className="stat__card">
              <div className="stat__icon students">👨‍🎓</div>
              <div className="stat__info">
                <h3>Total Students</h3>
                <p>{stats.totalStudents}</p>
              </div>
            </div>
            <div className="stat__card">
              <div className="stat__icon gender">👥</div>
              <div className="stat__info">
                <h3>Gender Split</h3>
                <p>♂ {stats.maleStudents} | ♀ {stats.femaleStudents}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Room Overview */}
        <section className="rooms__section">
          <div className="section__header">
            <h2>Rooms Overview</h2>
            <div className="actions-container">
              <div className="filters">
                <select 
                  value={selectedFloor} 
                  onChange={(e) => setSelectedFloor(e.target.value)}
                  className="filter__select"
                >
                  <option value="All">All Floors</option>
                  <option value="1">Floor 1</option>
                  <option value="2">Floor 2</option>
                  <option value="3">Floor 3</option>
                </select>
                <select 
                  value={selectedGender} 
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="filter__select"
                >
                  <option value="All">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <select 
                  value={selectedType} 
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="filter__select"
                >
                  <option value="All">All Types</option>
                  <option value="AC">AC</option>
                  <option value="Non-AC">Non-AC</option>
                  <option value="Deluxe">Deluxe</option>
                </select>
              </div>
              <div className="action-buttons">
                <button 
                  className="action__btn add"
                  onClick={handleAddRoom}
                >
                  {isMobile ? '+' : '+ Add Room'}
                </button>
                <div className="export-dropdown">
                  <button 
                    className="export__btn"
                    onClick={() => setExportType(exportType === 'rooms' ? null : 'rooms')}
                  >
                    Export
                  </button>
                  {exportType === 'rooms' && (
                    <div className="export-options">
                      <button onClick={() => handleExport('csv', 'rooms')}>CSV</button>
                      <button onClick={() => handleExport('pdf', 'rooms')}>PDF</button>
                      <button onClick={() => handleExport('print', 'rooms')}>Print</button>
                      <button onClick={() => handleExport('copy', 'rooms')}>Copy</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="rooms__grid">
            {filteredRooms.map(room => (
              <div
                key={room.id}
                className={`room__card ${selectedRoom === room.id ? 'selected' : ''} ${room.status.replace(/\s/g, '').toLowerCase()}`}
                onClick={() => setSelectedRoom(selectedRoom === room.id ? null : room.id)}
              >
                <div className="room__header">
                  <h3>Room {room.id}</h3>
                  <span className="floor__badge">Floor {room.floor}</span>
                  <div className="room-actions">
                    <button 
                      className="edit-room"
                      onClick={(e) => { e.stopPropagation(); handleEditRoom(room); }}
                    >
                      ✏️
                    </button>
                    <button 
                      className="delete-room"
                      onClick={(e) => { e.stopPropagation(); handleDeleteRoom(room.id); }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="room__meta">
                  <span className={`gender__badge ${room.gender.toLowerCase()}`}>
                    {room.gender === 'Male' ? '♂' : '♀'} {room.gender}
                  </span>
                  <span className="type__badge">{room.type}</span>
                  <span className="rent__badge">₹{room.rent}/mo</span>
                </div>
                <div className="room__progress">
                  <div 
                    className="progress__fill"
                    style={{ width: `${(room.occupants / room.capacity) * 100}%` }}
                  ></div>
                </div>
                <p className="occupancy">{room.occupants} / {room.capacity} Occupied</p>
                <div className="room__footer">
                  <span className={`status ${room.status.replace(/\s/g, '').toLowerCase()}`}>
                    {room.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Students List */}
        <section className="students__section">
          <div className="section__header">
            <h2>Students List {selectedRoom ? `(Room ${selectedRoom})` : ''}</h2>
            <div className="actions-container">
              {selectedRoom && (
                <button 
                  className="clear__btn"
                  onClick={() => setSelectedRoom(null)}
                >
                  Clear Filter
                </button>
              )}
              <div className="export-dropdown">
                <button 
                  className="export__btn"
                  onClick={() => setExportType(exportType === 'students' ? null : 'students')}
                >
                  Export
                </button>
                {exportType === 'students' && (
                  <div className="export-options">
                    <button onClick={() => handleExport('csv', 'students')}>CSV</button>
                    <button onClick={() => handleExport('pdf', 'students')}>PDF</button>
                    <button onClick={() => handleExport('print', 'students')}>Print</button>
                    <button onClick={() => handleExport('copy', 'students')}>Copy</button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {filteredStudents.length === 0 ? (
            <div className="empty__state">
              <p>No active students found</p>
            </div>
          ) : isMobile ? (
            <div className="mobile-students-list">
              {filteredStudents.map(student => (
                <div key={student.id} className="mobile-student-card">
                  <div className="student-header">
                    <div className="avatar">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="student-name">{student.name}</div>
                  </div>
                  <div className="student-details">
                    <div className="detail-row">
                      <span className="detail-label">Gender:</span>
                      <span className={`gender__badge ${student.gender.toLowerCase()}`}>
                        {student.gender === 'Male' ? '♂' : '♀'} {student.gender}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Room:</span>
                      <span>{student.room}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Check-In:</span>
                      <span>{student.checkIn}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Contact:</span>
                      <span>{student.contact}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Fees:</span>
                      <span className={`fees__badge ${student.feesPaid ? 'paid' : 'unpaid'}`}>
                        {student.feesPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>
                  </div>
                  <div className="student-actions">
                    <button 
                      className="action__btn edit"
                      onClick={() => handleEditStudent(student)}
                    >
                      Edit
                    </button>
                    <button 
                      className="action__btn checkout"
                      onClick={() => handleCheckout(student.id)}
                    >
                      Checkout
                    </button>
                    <button 
                      className="action__btn delete"
                      onClick={() => handleDeleteStudent(student.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="students__table">
              <div className="table__header">
                <div>Name</div>
                <div>Gender</div>
                <div>Room</div>
                <div>Check-In</div>
                <div>Contact</div>
                <div>Fees</div>
                <div>Actions</div>
              </div>
              {filteredStudents.map(student => (
                <div key={student.id} className="table__row">
                  <div className="student__name">
                    <span className="avatar">
                      {student.name.charAt(0).toUpperCase()}
                    </span>
                    {student.name}
                  </div>
                  <div className="student__gender">
                    <span className={`gender__badge ${student.gender.toLowerCase()}`}>
                      {student.gender === 'Male' ? '♂' : '♀'}
                    </span>
                  </div>
                  <div className="student__room">{student.room}</div>
                  <div className="student__checkin">{student.checkIn}</div>
                  <div className="student__contact">{student.contact}</div>
                  <div className="student__fees">
                    <span className={`fees__badge ${student.feesPaid ? 'paid' : 'unpaid'}`}>
                      {student.feesPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </div>
                  <div className="student__actions">
                    <button 
                      className="action__btn edit"
                      onClick={() => handleEditStudent(student)}
                    >
                      Edit
                    </button>
                    <button 
                      className="action__btn checkout"
                      onClick={() => handleCheckout(student.id)}
                    >
                      Checkout
                    </button>
                    <button 
                      className="action__btn delete"
                      onClick={() => handleDeleteStudent(student.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Student Modal */}
      {showStudentModal && (
        <div className="modal__overlay">
          <div className="modal__content">
            <div className="modal__header">
              <h3>{modalMode === 'add' ? 'Add New Student' : 'Edit Student'}</h3>
              <button 
                className="modal__close"
                onClick={() => setShowStudentModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="modal__body">
              <div className="form__group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={currentStudent.name}
                  onChange={(e) => setCurrentStudent({...currentStudent, name: e.target.value})}
                  placeholder="Enter student name"
                />
              </div>
              
              <div className="form__group">
                <label>Gender *</label>
                <select
                  value={currentStudent.gender}
                  onChange={(e) => setCurrentStudent({...currentStudent, gender: e.target.value})}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              
              <div className="form__group">
                <label>Room Number *</label>
                <select
                  value={currentStudent.room}
                  onChange={(e) => setCurrentStudent({...currentStudent, room: e.target.value})}
                >
                  <option value="">Select Room</option>
                  {rooms
                    .filter(room => 
                      (modalMode === 'add' ? room.occupants < room.capacity : true) && 
                      room.gender === currentStudent.gender
                    )
                    .map(room => (
                      <option key={room.id} value={room.id}>
                        Room {room.id} ({room.type}) - {room.capacity - room.occupants} beds available
                      </option>
                    ))}
                </select>
              </div>
              
              <div className="form__group">
                <label>Check-In Date *</label>
                <input
                  type="date"
                  value={currentStudent.checkIn}
                  onChange={(e) => setCurrentStudent({...currentStudent, checkIn: e.target.value})}
                />
              </div>
              
              <div className="form__group">
                <label>Contact Number *</label>
                <input
                  type="tel"
                  value={currentStudent.contact}
                  onChange={(e) => setCurrentStudent({...currentStudent, contact: e.target.value})}
                  placeholder="Enter contact number"
                />
              </div>
              
              <div className="form__group checkbox__group">
                <input
                  type="checkbox"
                  id="feesPaid"
                  checked={currentStudent.feesPaid}
                  onChange={(e) => setCurrentStudent({...currentStudent, feesPaid: e.target.checked})}
                />
                <label htmlFor="feesPaid">Fees Paid</label>
              </div>
            </div>
            <div className="modal__footer">
              <button 
                className="modal__cancel"
                onClick={() => setShowStudentModal(false)}
              >
                Cancel
              </button>
              <button 
                className="modal__submit"
                onClick={handleSaveStudent}
              >
                {modalMode === 'add' ? 'Add Student' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Room Modal */}
      {showRoomModal && (
        <div className="modal__overlay">
          <div className="modal__content">
            <div className="modal__header">
              <h3>{modalMode === 'add' ? 'Add New Room' : 'Edit Room'}</h3>
              <button 
                className="modal__close"
                onClick={() => setShowRoomModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="modal__body">
              <div className="form__group">
                <label>Room ID *</label>
                <input
                  type="number"
                  value={currentRoom.id}
                  onChange={(e) => setCurrentRoom({...currentRoom, id: e.target.value})}
                  placeholder="Enter room number"
                />
              </div>
              
              <div className="form__group">
                <label>Floor *</label>
                <select
                  value={currentRoom.floor}
                  onChange={(e) => setCurrentRoom({...currentRoom, floor: parseInt(e.target.value)})}
                >
                  <option value="1">Floor 1</option>
                  <option value="2">Floor 2</option>
                  <option value="3">Floor 3</option>
                </select>
              </div>
              
              <div className="form__group">
                <label>Gender *</label>
                <select
                  value={currentRoom.gender}
                  onChange={(e) => setCurrentRoom({...currentRoom, gender: e.target.value})}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              
              <div className="form__group">
                <label>Room Type *</label>
                <select
                  value={currentRoom.type}
                  onChange={(e) => setCurrentRoom({...currentRoom, type: e.target.value})}
                >
                  <option value="AC">AC</option>
                  <option value="Non-AC">Non-AC</option>
                  <option value="Deluxe">Deluxe</option>
                </select>
              </div>
              
              <div className="form__group">
                <label>Capacity *</label>
                <input
                  type="number"
                  value={currentRoom.capacity}
                  onChange={(e) => setCurrentRoom({...currentRoom, capacity: e.target.value})}
                  min="1"
                  max="10"
                />
              </div>
              
              <div className="form__group">
                <label>Occupants</label>
                <input
                  type="number"
                  value={currentRoom.occupants}
                  onChange={(e) => setCurrentRoom({...currentRoom, occupants: e.target.value})}
                  min="0"
                  max={currentRoom.capacity}
                />
              </div>
              
              <div className="form__group">
                <label>Monthly Rent (₹) *</label>
                <input
                  type="number"
                  value={currentRoom.rent}
                  onChange={(e) => setCurrentRoom({...currentRoom, rent: e.target.value})}
                  min="0"
                />
              </div>
            </div>
            <div className="modal__footer">
              <button 
                className="modal__cancel"
                onClick={() => setShowRoomModal(false)}
              >
                Cancel
              </button>
              <button 
                className="modal__submit"
                onClick={handleSaveRoom}
              >
                {modalMode === 'add' ? 'Add Room' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostelDashboard;