import React, { useState } from 'react';
import { 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  Check,
  X,
  Bus,
  User,
  MapPin,
  Users,
  Wrench,
  Clock
} from 'lucide-react';
import './BusManagement.css';

const DManagement = () => {
  const [activeTab, setActiveTab] = useState('routes');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const [routes, setRoutes] = useState([
    { id: 1, routeName: 'Downtown Loop', busNo: 'B-101', driver: 'John Smith', passengers: 32, stops: 12, status: 'active' },
    { id: 2, routeName: 'University Express', busNo: 'B-205', driver: 'Sarah Johnson', passengers: 45, stops: 8, status: 'active' },
    { id: 3, routeName: 'Suburban Connector', busNo: 'B-312', driver: 'Michael Brown', passengers: 28, stops: 15, status: 'maintenance' },
    { id: 4, routeName: 'Airport Shuttle', busNo: 'B-104', driver: 'Emily Davis', passengers: 18, stops: 5, status: 'active' },
  ]);

  const [drivers, setDrivers] = useState([
    { id: 1, name: 'John Smith', license: 'DL-45678', contact: '555-1234', assignedRoute: 'Downtown Loop', status: 'active' },
    { id: 2, name: 'Sarah Johnson', license: 'DL-98765', contact: '555-5678', assignedRoute: 'University Express', status: 'active' },
    { id: 3, name: 'Michael Brown', license: 'DL-34512', contact: '555-9012', assignedRoute: 'Suburban Connector', status: 'on leave' },
    { id: 4, name: 'Emily Davis', license: 'DL-78901', contact: '555-3456', assignedRoute: 'Airport Shuttle', status: 'active' },
    { id: 5, name: 'David Wilson', license: 'DL-23456', contact: '555-7890', assignedRoute: '', status: 'available' },
  ]);

  const [vehicles, setVehicles] = useState([
    { id: 1, busNo: 'B-101', type: 'Standard', capacity: 40, status: 'in service', lastMaintenance: '2023-05-15' },
    { id: 2, busNo: 'B-205', type: 'Articulated', capacity: 60, status: 'in service', lastMaintenance: '2023-06-20' },
    { id: 3, busNo: 'B-312', type: 'Standard', capacity: 40, status: 'maintenance', lastMaintenance: '2023-07-10' },
    { id: 4, busNo: 'B-104', type: 'Mini', capacity: 20, status: 'in service', lastMaintenance: '2023-06-01' },
    { id: 5, busNo: 'B-501', type: 'Standard', capacity: 40, status: 'available', lastMaintenance: '2023-07-05' },
  ]);

  const [passengers, setPassengers] = useState([
    { id: 1, name: 'Alex Johnson', route: 'Downtown Loop', busNo: 'B-101', stop: 'Main Square', contact: '555-1111' },
    { id: 2, name: 'Maria Garcia', route: 'University Express', busNo: 'B-205', stop: 'Campus North', contact: '555-2222' },
    { id: 3, name: 'James Wilson', route: 'Suburban Connector', busNo: 'B-312', stop: 'Greenfield', contact: '555-3333' },
    { id: 4, name: 'Sarah Lee', route: 'Airport Shuttle', busNo: 'B-104', stop: 'Terminal A', contact: '555-4444' },
  ]);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [currentItem, setCurrentItem] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    routeName: '',
    busNo: '',
    driver: '',
    passengers: '',
    stops: '',
    status: 'active'
  });

  // Sort function
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get sorted items
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

  // Improved filter function
  const getFilteredItems = (items) => {
    if (!searchTerm) return items;
    
    const searchTermLower = searchTerm.toLowerCase();
    
    return items.filter(item => 
      Object.entries(item).some(([key, value]) => {
        // Skip id field from search
        if (key === 'id') return false;
        
        // Convert numbers to string for comparison
        const stringValue = value?.toString().toLowerCase() || '';
        return stringValue.includes(searchTermLower);
      })
    );
  };

  // Open modal for add/edit
  const openModal = (type, item = null) => {
    setModalType(type);
    setCurrentItem(item);
    
    if (type === 'edit' && item) {
      setFormData({
        routeName: item.routeName || '',
        busNo: item.busNo || '',
        driver: item.driver || '',
        passengers: item.passengers || '',
        stops: item.stops || '',
        status: item.status || 'active'
      });
    } else {
      setFormData({
        routeName: '',
        busNo: '',
        driver: '',
        passengers: '',
        stops: '',
        status: 'active'
      });
    }
    
    setShowModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (modalType === 'add') {
      const newItem = {
        id: Math.max(...routes.map(r => r.id)) + 1,
        ...formData,
        passengers: parseInt(formData.passengers),
        stops: parseInt(formData.stops)
      };
      setRoutes([...routes, newItem]);
    } else if (modalType === 'edit' && currentItem) {
      setRoutes(routes.map(item => 
        item.id === currentItem.id ? { 
          ...item, 
          ...formData,
          passengers: parseInt(formData.passengers),
          stops: parseInt(formData.stops)
        } : item
      ));
    }
    
    setShowModal(false);
  };

  // Delete item
  const deleteItem = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      if (activeTab === 'routes') {
        setRoutes(routes.filter(item => item.id !== id));
      } else if (activeTab === 'drivers') {
        setDrivers(drivers.filter(item => item.id !== id));
      } else if (activeTab === 'vehicles') {
        setVehicles(vehicles.filter(item => item.id !== id));
      } else if (activeTab === 'passengers') {
        setPassengers(passengers.filter(item => item.id !== id));
      }
    }
  };

  // Get current data based on active tab
  const getCurrentData = () => {
    let data = [];
    switch (activeTab) {
      case 'routes':
        data = routes;
        break;
      case 'drivers':
        data = drivers;
        break;
      case 'vehicles':
        data = vehicles;
        break;
      case 'passengers':
        data = passengers;
        break;
      default:
        data = [];
    }
    return getFilteredItems(getSortedItems(data));
  };

  // Get table headers based on active tab
  const getTableHeaders = () => {
    switch (activeTab) {
      case 'routes':
        return [
          { key: 'routeName', label: 'Route Name' },
          { key: 'busNo', label: 'Bus No.' },
          { key: 'driver', label: 'Driver' },
          { key: 'passengers', label: 'Passengers', numeric: true },
          { key: 'stops', label: 'Stops', numeric: true },
          { key: 'status', label: 'Status' },
          { key: 'actions', label: 'Actions' }
        ];
      case 'drivers':
        return [
          { key: 'name', label: 'Driver Name' },
          { key: 'license', label: 'License' },
          { key: 'contact', label: 'Contact' },
          { key: 'assignedRoute', label: 'Assigned Route' },
          { key: 'status', label: 'Status' },
          { key: 'actions', label: 'Actions' }
        ];
      case 'vehicles':
        return [
          { key: 'busNo', label: 'Bus No.' },
          { key: 'type', label: 'Type' },
          { key: 'capacity', label: 'Capacity', numeric: true },
          { key: 'status', label: 'Status' },
          { key: 'lastMaintenance', label: 'Last Maintenance' },
          { key: 'actions', label: 'Actions' }
        ];
      case 'passengers':
        return [
          { key: 'name', label: 'Passenger Name' },
          { key: 'route', label: 'Route' },
          { key: 'busNo', label: 'Bus No.' },
          { key: 'stop', label: 'Stop' },
          { key: 'contact', label: 'Contact' },
          { key: 'actions', label: 'Actions' }
        ];
      default:
        return [];
    }
  };

  // Improved status badge rendering
  const renderStatusBadge = (status) => {
    const statusMap = {
      active: { bg: 'bg-green-100', text: 'text-green-800', icon: <Check size={14} className="mr-1" /> },
      'in service': { bg: 'bg-green-100', text: 'text-green-800', icon: <Check size={14} className="mr-1" /> },
      maintenance: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <Wrench size={14} className="mr-1" /> },
      'on leave': { bg: 'bg-blue-100', text: 'text-blue-800', icon: <Clock size={14} className="mr-1" /> },
      available: { bg: 'bg-blue-100', text: 'text-blue-800', icon: <Check size={14} className="mr-1" /> },
      default: { bg: 'bg-gray-100', text: 'text-gray-800', icon: null }
    };

    const statusConfig = statusMap[status.toLowerCase()] || statusMap.default;
    
    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
        {statusConfig.icon}
        {status}
      </div>
    );
  };

  // Get modal title based on active tab
  const getModalTitle = () => {
    const titles = {
      routes: 'Route',
      drivers: 'Driver',
      vehicles: 'Vehicle',
      passengers: 'Passenger'
    };
    return `${modalType === 'add' ? 'Add New' : 'Edit'} ${titles[activeTab] || 'Item'}`;
  };

  return (
    <div className="bus-management-container">
      {/* Header */}
      <div className="header">
        <h1 className="title">
          <Bus size={28} className="mr-2" />
          Bus Management 
        </h1>
        <div className="controls">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'routes' ? 'active' : ''}`}
          onClick={() => setActiveTab('routes')}
        >
          <MapPin size={18} className="mr-1" />
          Routes
        </button>
        <button
          className={`tab ${activeTab === 'drivers' ? 'active' : ''}`}
          onClick={() => setActiveTab('drivers')}
        >
          <User size={18} className="mr-1" />
          Drivers
        </button>
        <button
          className={`tab ${activeTab === 'vehicles' ? 'active' : ''}`}
          onClick={() => setActiveTab('vehicles')}
        >
          <Bus size={18} className="mr-1" />
          Vehicles
        </button>
        <button
          className={`tab ${activeTab === 'passengers' ? 'active' : ''}`}
          onClick={() => setActiveTab('passengers')}
        >
          <Users size={18} className="mr-1" />
          Passengers
        </button>
      </div>

      {/* Table */}
      <div className="table-container">
        <div className="table-header">
          <h2 className="table-title">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
          </h2>
          <button 
            className="add-btn"
            onClick={() => openModal('add')}
          >
            <Plus size={18} className="mr-1" />
            Add {activeTab.slice(0, -1)}
          </button>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                {getTableHeaders().map(header => (
                  <th 
                    key={header.key} 
                    className={`table-header-cell ${header.numeric ? 'text-right' : 'text-left'}`}
                    onClick={() => header.key !== 'actions' && requestSort(header.key)}
                  >
                    <div className="header-content">
                      {header.label}
                      {header.key !== 'actions' && (
                        <span className="sort-icon">
                          {sortConfig.key === header.key ? (
                            sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                          ) : (
                            <ChevronDown size={16} className="inactive" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {getCurrentData().length > 0 ? (
                getCurrentData().map(item => (
                  <tr key={item.id} className="table-row">
                    {getTableHeaders().map(header => {
                      if (header.key === 'actions') {
                        return (
                          <td key={header.key} className="table-cell actions-cell">
                            <button 
                              className="action-btn edit"
                              onClick={() => openModal('edit', item)}
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              className="action-btn delete"
                              onClick={() => deleteItem(item.id)}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        );
                      } else if (header.key === 'status') {
                        return (
                          <td key={header.key} className="table-cell">
                            {renderStatusBadge(item[header.key])}
                          </td>
                        );
                      } else {
                        return (
                          <td key={header.key} className={`table-cell ${header.numeric ? 'text-right' : 'text-left'}`}>
                            {item[header.key] || '-'}
                          </td>
                        );
                      }
                    })}
                  </tr>
                ))
              ) : (
                <tr className="no-data-row">
                  <td colSpan={getTableHeaders().length} className="no-data-cell">
                    No {activeTab} found matching your search
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">
                {getModalTitle()}
              </h3>
              <button 
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="routeName">Route Name</label>
                <input
                  type="text"
                  id="routeName"
                  name="routeName"
                  value={formData.routeName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="busNo">Bus Number</label>
                <input
                  type="text"
                  id="busNo"
                  name="busNo"
                  value={formData.busNo}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="driver">Driver</label>
                <select
                  id="driver"
                  name="driver"
                  value={formData.driver}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Driver</option>
                  {drivers.filter(d => d.status === 'available' || d.name === formData.driver).map(driver => (
                    <option key={driver.id} value={driver.name}>
                      {driver.name} ({driver.license})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="passengers">Passengers</label>
                <input
                  type="number"
                  id="passengers"
                  name="passengers"
                  value={formData.passengers}
                  onChange={handleInputChange}
                  required
                  min="1"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="stops">Number of Stops</label>
                <input
                  type="number"
                  id="stops"
                  name="stops"
                  value={formData.stops}
                  onChange={handleInputChange}
                  required
                  min="1"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                >
                  {modalType === 'add' ? 'Add' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DManagement;