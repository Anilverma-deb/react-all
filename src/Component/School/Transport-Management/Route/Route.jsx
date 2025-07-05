import React, { useState, useEffect } from 'react';
import { 
  MapPin, Bus, User, Users, Plus, Trash2, Edit, Search, 
  ChevronDown, ChevronUp, ArrowRight, Clock, Wrench, Check, X,
  HardHat, AlertCircle, Activity, Route, List, Map, ChevronRight, MoreVertical,
  ArrowUpRight, Users as Passengers, Gauge, Circle, Map as MapIcon
} from 'lucide-react';
import './Route.css';

const BusRoutes = () => {
  const [routes, setRoutes] = useState([
    {
      id: 1,
      routeName: 'Downtown Loop',
      startPoint: 'Central Station',
      endPoint: 'City Mall',
      stops: ['Main Square', 'Riverfront', 'Business District', 'Park Avenue', 'Central Park', 'Museum District', 'Convention Center', 'Financial Plaza'],
      assignedBus: 'B-101',
      driver: 'John Smith',
      helper: 'Sarah Johnson',
      status: 'active',
      duration: '45 min',
      frequency: 'Every 15 min',
      lastUpdated: '2 hours ago',
      startTime: '06:00 AM',
      endTime: '10:00 PM',
      passengers: 24,
      capacity: 40,
      coordinates: [
        { lat: 40.7128, lng: -74.0060 }, // Central Station
        { lat: 40.7135, lng: -74.0065 }, // Main Square
        { lat: 40.7140, lng: -74.0070 }, // Riverfront
        { lat: 40.7145, lng: -74.0075 }, // Business District
        { lat: 40.7150, lng: -74.0080 }, // Park Avenue
        { lat: 40.7155, lng: -74.0085 }, // Central Park
        { lat: 40.7160, lng: -74.0090 }, // Museum District
        { lat: 40.7165, lng: -74.0095 }, // Convention Center
        { lat: 40.7170, lng: -74.0100 }  // City Mall
      ]
    },
    {
      id: 2,
      routeName: 'University Express',
      startPoint: 'Central Station',
      endPoint: 'Campus North',
      stops: ['Tech Park', 'Library', 'Sports Complex', 'Student Union', 'Research Center', 'Dormitory Area'],
      assignedBus: 'B-205',
      driver: 'Michael Brown',
      helper: 'Emily Davis',
      status: 'active',
      duration: '30 min',
      frequency: 'Every 20 min',
      lastUpdated: '1 hour ago',
      startTime: '07:00 AM',
      endTime: '09:00 PM',
      passengers: 32,
      capacity: 40,
      coordinates: [
        { lat: 40.7128, lng: -74.0060 }, // Central Station
        { lat: 40.7230, lng: -74.0065 }, // Tech Park
        { lat: 40.7330, lng: -74.0070 }, // Library
        { lat: 40.7430, lng: -74.0075 }, // Sports Complex
        { lat: 40.7530, lng: -74.0080 }, // Student Union
        { lat: 40.7630, lng: -74.0085 }, // Research Center
        { lat: 40.7730, lng: -74.0090 }  // Campus North
      ]
    },
    {
      id: 3,
      routeName: 'Suburban Connector',
      startPoint: 'City Mall',
      endPoint: 'Greenfield',
      stops: ['Oak Street', 'Pine Heights', 'Maple Grove', 'Elm Court', 'Cedar Lane', 'Birchwood'],
      assignedBus: 'B-312',
      driver: 'Robert Wilson',
      helper: 'Jessica Lee',
      status: 'maintenance',
      duration: '60 min',
      frequency: 'Every 30 min',
      lastUpdated: '5 hours ago',
      startTime: '05:30 AM',
      endTime: '11:00 PM',
      passengers: 0,
      capacity: 40,
      coordinates: [
        { lat: 40.7170, lng: -74.0100 }, // City Mall
        { lat: 40.7270, lng: -74.0200 }, // Oak Street
        { lat: 40.7370, lng: -74.0300 }, // Pine Heights
        { lat: 40.7470, lng: -74.0400 }, // Maple Grove
        { lat: 40.7570, lng: -74.0500 }, // Elm Court
        { lat: 40.7670, lng: -74.0600 }, // Cedar Lane
        { lat: 40.7770, lng: -74.0700 }  // Greenfield
      ]
    }
  ]);

  const [stats, setStats] = useState({
    totalBuses: 0,
    activeBuses: 0,
    maintenanceBuses: 0,
    inactiveBuses: 0,
    totalPassengers: 0,
    totalCapacity: 0
  });

  const [activeTab, setActiveTab] = useState('list');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [currentRoute, setCurrentRoute] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [expandedRoute, setExpandedRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapView, setMapView] = useState({
    center: { lat: 40.7128, lng: -74.0060 },
    zoom: 13,
    selectedRoute: null
  });
  const [passengerCount, setPassengerCount] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      calculateStats();
      // Initialize passenger counts
      const initialPassengerCounts = {};
      routes.forEach(route => {
        initialPassengerCounts[route.id] = route.passengers;
      });
      setPassengerCount(initialPassengerCounts);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    calculateStats();
  }, [routes, passengerCount]);

  const calculateStats = () => {
    const activeRoutes = routes.filter(r => r.status === 'active');
    const totalPassengers = activeRoutes.reduce((sum, route) => sum + (passengerCount[route.id] || 0), 0);
    const totalCapacity = activeRoutes.reduce((sum, route) => sum + route.capacity, 0);
    
    setStats({
      totalBuses: routes.length,
      activeBuses: routes.filter(r => r.status === 'active').length,
      maintenanceBuses: routes.filter(r => r.status === 'maintenance').length,
      inactiveBuses: routes.filter(r => r.status === 'inactive').length,
      totalPassengers,
      totalCapacity,
      occupancyRate: totalCapacity > 0 ? Math.round((totalPassengers / totalCapacity) * 100) : 0
    });
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedRoutes = () => {
    if (!sortConfig.key) return routes;
    
    return [...routes].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const getFilteredRoutes = () => {
    if (!searchTerm) return getSortedRoutes();
    
    const searchTermLower = searchTerm.toLowerCase();
    return getSortedRoutes().filter(route => 
      Object.entries(route).some(([key, value]) => {
        if (key === 'id' || key === 'status' || key === 'coordinates') return false;
        if (key === 'stops') return value.join(', ').toLowerCase().includes(searchTermLower);
        return value.toString().toLowerCase().includes(searchTermLower);
      })
    );
  };

  const openModal = (type, route = null) => {
    setModalType(type);
    setCurrentRoute(route);
    
    if (type === 'edit' && route) {
      setFormData({
        routeName: route.routeName,
        startPoint: route.startPoint,
        endPoint: route.endPoint,
        stops: route.stops.join(', '),
        assignedBus: route.assignedBus,
        driver: route.driver,
        helper: route.helper,
        status: route.status,
        duration: route.duration,
        frequency: route.frequency,
        startTime: route.startTime,
        endTime: route.endTime,
        capacity: route.capacity
      });
    } else {
      setFormData({
        routeName: '',
        startPoint: '',
        endPoint: '',
        stops: '',
        assignedBus: '',
        driver: '',
        helper: '',
        status: 'active',
        duration: '',
        frequency: '',
        startTime: '',
        endTime: '',
        capacity: 40
      });
    }
    
    setShowModal(true);
  };

  const [formData, setFormData] = useState({
    routeName: '',
    startPoint: '',
    endPoint: '',
    stops: '',
    assignedBus: '',
    driver: '',
    helper: '',
    status: 'active',
    duration: '',
    frequency: '',
    startTime: '',
    endTime: '',
    capacity: 40
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newRoute = {
      ...formData,
      id: modalType === 'add' ? Math.max(...routes.map(r => r.id)) + 1 : currentRoute.id,
      stops: formData.stops.split(',').map(stop => stop.trim()).filter(stop => stop),
      lastUpdated: 'Just now',
      passengers: modalType === 'add' ? 0 : currentRoute.passengers,
      capacity: parseInt(formData.capacity) || 40,
      coordinates: modalType === 'add' ? [] : currentRoute.coordinates
    };
    
    if (modalType === 'add') {
      setRoutes([...routes, newRoute]);
      setPassengerCount(prev => ({ ...prev, [newRoute.id]: 0 }));
    } else {
      setRoutes(routes.map(route => 
        route.id === currentRoute.id ? newRoute : route
      ));
    }
    
    setShowModal(false);
  };

  const deleteRoute = (id) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      setRoutes(routes.filter(route => route.id !== id));
      if (expandedRoute === id) setExpandedRoute(null);
      const newPassengerCounts = { ...passengerCount };
      delete newPassengerCounts[id];
      setPassengerCount(newPassengerCounts);
    }
  };

  const updatePassengerCount = (id, change) => {
    const route = routes.find(r => r.id === id);
    if (!route) return;
    
    const currentCount = passengerCount[id] || 0;
    const newCount = Math.max(0, Math.min(route.capacity, currentCount + change));
    
    setPassengerCount(prev => ({
      ...prev,
      [id]: newCount
    }));
  };

  const renderStatusBadge = (status) => {
    const statusMap = {
      active: { bg: 'status-active', icon: <Check size={14} /> },
      maintenance: { bg: 'status-maintenance', icon: <Wrench size={14} /> },
      inactive: { bg: 'status-inactive', icon: <Clock size={14} /> }
    };
    
    return (
      <span className={`status-badge ${statusMap[status.toLowerCase()]?.bg || 'status-inactive'}`}>
        {statusMap[status.toLowerCase()]?.icon}
        {status}
      </span>
    );
  };

  const renderPassengerMeter = (routeId) => {
    const route = routes.find(r => r.id === routeId);
    if (!route) return null;
    
    const count = passengerCount[routeId] || 0;
    const capacity = route.capacity || 40;
    const percentage = Math.round((count / capacity) * 100);
    
    return (
      <div className="passenger-meter">
        <div className="meter-header">
          <Passengers size={16} />
          <span>Passengers: {count}/{capacity}</span>
        </div>
        <div className="meter-bar">
          <div 
            className="meter-fill"
            style={{ width: `${percentage}%`, backgroundColor: percentage > 80 ? '#ef4444' : percentage > 50 ? '#f59e0b' : '#10b981' }}
          ></div>
        </div>
        <div className="meter-controls">
          <button 
            className="passenger-btn minus"
            onClick={() => updatePassengerCount(routeId, -1)}
            disabled={count <= 0}
          >
            -
          </button>
          <span className="passenger-count">{count}</span>
          <button 
            className="passenger-btn plus"
            onClick={() => updatePassengerCount(routeId, 1)}
            disabled={count >= capacity}
          >
            +
          </button>
        </div>
      </div>
    );
  };

  const renderRoutePath = (stops, startPoint, endPoint) => {
    const allStops = [startPoint, ...stops, endPoint];
    const stopsPerRow = 4;
    const rows = Math.ceil(allStops.length / stopsPerRow);
    
    return (
      <div className="route-path-container">
        {Array.from({ length: rows }).map((_, rowIndex) => {
          const startIdx = rowIndex * stopsPerRow;
          const endIdx = Math.min(startIdx + stopsPerRow, allStops.length);
          const rowStops = allStops.slice(startIdx, endIdx);
          
          return (
            <div key={rowIndex} className="route-path-row">
              {rowStops.map((stop, idx) => (
                <React.Fragment key={`${rowIndex}-${idx}`}>
                  <div className="route-stop">
                    <div className="stop-indicator">
                      {idx === 0 && rowIndex === 0 ? (
                        <div className="start-point-icon">
                          <MapPin size={16} />
                        </div>
                      ) : idx === rowStops.length - 1 && rowIndex === rows - 1 ? (
                        <div className="end-point-icon">
                          <MapPin size={16} />
                        </div>
                      ) : (
                        <div className="intermediate-point"></div>
                      )}
                    </div>
                    <div className="stop-name">{stop}</div>
                  </div>
                  {idx < rowStops.length - 1 && (
                    <div className="path-connector">
                      <div className="path-line"></div>
                      <div className="path-arrow">
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  const renderMapView = () => {
    const selectedRoute = mapView.selectedRoute ? 
      routes.find(r => r.id === mapView.selectedRoute) : null;
    
    return (
      <div className="map-view-container">
        <div className="map-search-container">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search routes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="route-selector">
            <select
              value={mapView.selectedRoute || ''}
              onChange={(e) => setMapView(prev => ({
                ...prev,
                selectedRoute: e.target.value ? parseInt(e.target.value) : null
              }))}
            >
              <option value="">Select a route to highlight</option>
              {routes.map(route => (
                <option key={route.id} value={route.id}>{route.routeName}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="map-visualization">
          <div className="map-legend">
            <div className="legend-item">
              <div className="legend-color start"></div>
              <span>Start Point</span>
            </div>
            <div className="legend-item">
              <div className="legend-color end"></div>
              <span>End Point</span>
            </div>
            <div className="legend-item">
              <div className="legend-color stop"></div>
              <span>Intermediate Stop</span>
            </div>
            <div className="legend-item">
              <div className="legend-color selected"></div>
              <span>Selected Route</span>
            </div>
          </div>
          
          <div className="map-canvas">
            {selectedRoute ? (
              <div className="animated-route">
                <div className="route-info-card">
                  <h3>{selectedRoute.routeName}</h3>
                  <div className="route-stats">
                    <div className="stat-item">
                      <Clock size={16} />
                      <span>{selectedRoute.duration}</span>
                    </div>
                    <div className="stat-item">
                      <Gauge size={16} />
                      <span>{selectedRoute.frequency}</span>
                    </div>
                    <div className="stat-item">
                      <Passengers size={16} />
                      <span>{passengerCount[selectedRoute.id] || 0}/{selectedRoute.capacity}</span>
                    </div>
                  </div>
                  {renderPassengerMeter(selectedRoute.id)}
                </div>
                
                <div className="route-path-animation">
                  {selectedRoute.coordinates.map((coord, index) => (
                    <div 
                      key={index} 
                      className={`route-point ${index === 0 ? 'start' : 
                        index === selectedRoute.coordinates.length - 1 ? 'end' : 'stop'}`}
                      style={{
                        left: `${50 + (coord.lng * 100)}px`,
                        top: `${50 + (coord.lat * 100)}px`
                      }}
                    >
                      <div className="point-label">
                        {index === 0 ? selectedRoute.startPoint : 
                         index === selectedRoute.coordinates.length - 1 ? selectedRoute.endPoint : 
                         selectedRoute.stops[index - 1]}
                      </div>
                    </div>
                  ))}
                  
                  <div className="route-line-animation">
                    {selectedRoute.coordinates.slice(0, -1).map((coord, index) => {
                      const nextCoord = selectedRoute.coordinates[index + 1];
                      return (
                        <div 
                          key={index}
                          className="line-segment"
                          style={{
                            left: `${50 + (coord.lng * 100)}px`,
                            top: `${50 + (coord.lat * 100)}px`,
                            width: `${Math.sqrt(
                              Math.pow((nextCoord.lng - coord.lng) * 100, 2) + 
                              Math.pow((nextCoord.lat - coord.lat) * 100, 2)
                            )}px`,
                            transform: `rotate(${Math.atan2(
                              (nextCoord.lat - coord.lat) * 100,
                              (nextCoord.lng - coord.lng) * 100
                            )}rad)`
                          }}
                        >
                          <div className="moving-bus"></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="all-routes-map">
                {routes.filter(route => route.status === 'active').map(route => (
                  <div key={route.id} className="route-on-map">
                    {route.coordinates.map((coord, index) => (
                      <div 
                        key={index} 
                        className={`map-point ${index === 0 ? 'start' : 
                          index === route.coordinates.length - 1 ? 'end' : 'stop'}`}
                        style={{
                          left: `${50 + (coord.lng * 100)}px`,
                          top: `${50 + (coord.lat * 100)}px`
                        }}
                        onClick={() => setMapView(prev => ({
                          ...prev,
                          selectedRoute: route.id
                        }))}
                      >
                        {index === 0 && <MapPin size={16} />}
                      </div>
                    ))}
                    
                    {route.coordinates.slice(0, -1).map((coord, index) => {
                      const nextCoord = route.coordinates[index + 1];
                      return (
                        <div 
                          key={index}
                          className="map-line"
                          style={{
                            left: `${50 + (coord.lng * 100)}px`,
                            top: `${50 + (coord.lat * 100)}px`,
                            width: `${Math.sqrt(
                              Math.pow((nextCoord.lng - coord.lng) * 100, 2) + 
                                Math.pow((nextCoord.lat - coord.lat) * 100, 2)
                            )}px`,
                            transform: `rotate(${Math.atan2(
                              (nextCoord.lat - coord.lat) * 100,
                              (nextCoord.lng - coord.lng) * 100
                            )}rad)`
                          }}
                          onClick={() => setMapView(prev => ({
                            ...prev,
                            selectedRoute: route.id
                          }))}
                        ></div>
                      );
                    })}
                  </div>
                ))}
                <div className="map-instructions">
                  <MapIcon size={24} />
                  <p>Click on any route or stop to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bus-routes-app">
      {/* Header */}
      <header className="app-headers">
        <div className="header-content">
          <div className="app-brand">
            <Bus size={28} className="app-logo" />
            <h1>RouteMaster Pro</h1>
          </div>
          <div className="view-tabs">
            <button 
              className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
              onClick={() => setActiveTab('list')}
            >
              <List size={18} />
              <span>List View</span>
            </button>
            <button 
              className={`tab-btn ${activeTab === 'map' ? 'active' : ''}`}
              onClick={() => setActiveTab('map')}
            >
              <Map size={18} />
              <span>Map View</span>
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Stats */}
      <div className="dashboard-stats">
        <div className="stat-card card-total">
          <div className="card-icon">
            <Route size={24} />
          </div>
          <div className="card-content">
            <h3>Total Routes</h3>
            <p>{stats.totalBuses}</p>
          </div>
        </div>
        
        <div className="stat-card card-active">
          <div className="card-icon">
            <Activity size={24} />
          </div>
          <div className="card-content">
            <h3>Active</h3>
            <p>{stats.activeBuses}</p>
          </div>
        </div>
        
        <div className="stat-card card-maintenance">
          <div className="card-icon">
            <HardHat size={24} />
          </div>
          <div className="card-content">
            <h3>Maintenance</h3>
            <p>{stats.maintenanceBuses}</p>
          </div>
        </div>
        
        <div className="stat-card card-passengers">
          <div className="card-icon">
            <Passengers size={24} />
          </div>
          <div className="card-content">
            <h3>Passengers</h3>
            <p>{stats.totalPassengers}/{stats.totalCapacity}</p>
            <div className="passenger-progress">
              <div 
                className="progress-fill" 
                style={{ width: `${stats.occupancyRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="app-content">
        {activeTab === 'list' ? (
          <>
            <div className="action-bar">
              <div className="search-container">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search routes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <button 
                className="primary-btn add-btn"
                onClick={() => openModal('add')}
              >
                <Plus size={18} />
                <span>Add New Route</span>
              </button>
            </div>

            {/* Routes Cards */}
            <div className="routes-cards-container">
              {isLoading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Loading routes...</p>
                </div>
              ) : getFilteredRoutes().length === 0 ? (
                <div className="empty-state">
                  <MapPin size={48} className="empty-icon" />
                  <h3>No routes found</h3>
                  <p>Try adjusting your search or add a new route</p>
                  <button 
                    className="primary-btn"
                    onClick={() => openModal('add')}
                  >
                    <Plus size={18} />
                    <span>Add Route</span>
                  </button>
                </div>
              ) : (
                <div className="routes-grid">
                  {getFilteredRoutes().map(route => (
                    <div key={route.id} className={`route-card ${route.status}`}>
                      <div className="card-header">
                        <div className="route-title">
                          <Bus size={18} className="route-icon" />
                          <h3>{route.routeName}</h3>
                        </div>
                        <div className="route-meta">
                          {renderStatusBadge(route.status)}
                          <div className="route-actions">
                            <button 
                              className="icon-btn edit-btn"
                              onClick={() => openModal('edit', route)}
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              className="icon-btn delete-btn"
                              onClick={() => deleteRoute(route.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="card-body">
                        <div className="route-info">
                          <div className="info-item">
                            <span className="info-label">Bus:</span>
                            <span className="info-value">{route.assignedBus}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Duration:</span>
                            <span className="info-value">{route.duration}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Frequency:</span>
                            <span className="info-value">{route.frequency}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Operates:</span>
                            <span className="info-value">{route.startTime} - {route.endTime}</span>
                          </div>
                        </div>
                        
                        <div className="route-team">
                          <div className="team-member">
                            <User size={16} />
                            <span>{route.driver}</span>
                          </div>
                          <div className="team-member">
                            <Users size={16} />
                            <span>{route.helper}</span>
                          </div>
                        </div>
                        
                        {renderPassengerMeter(route.id)}
                        
                        <div className="route-path-wrapper">
                          {renderRoutePath(route.stops, route.startPoint, route.endPoint)}
                        </div>
                      </div>
                      
                      <div className="card-footer">
                        <div className="last-updated">
                          Last updated: {route.lastUpdated}
                        </div>
                        <button 
                          className="expand-btn"
                          onClick={() => setExpandedRoute(expandedRoute === route.id ? null : route.id)}
                        >
                          {expandedRoute === route.id ? (
                            <>
                              <span>Show Less</span>
                              <ChevronUp size={16} />
                            </>
                          ) : (
                            <>
                              <span>Show More</span>
                              <ChevronDown size={16} />
                            </>
                          )}
                        </button>
                      </div>
                      
                      {expandedRoute === route.id && (
                        <div className="card-expanded">
                          <div className="expanded-section">
                            <h4>All Stops ({route.stops.length + 2})</h4>
                            <div className="all-stops-list">
                              <div className="stop-item first">
                                <div className="stop-marker start"></div>
                                <div className="stop-details">
                                  <div className="stop-name">{route.startPoint}</div>
                                  <div className="stop-type">Start Point</div>
                                </div>
                              </div>
                              {route.stops.map((stop, index) => (
                                <div key={index} className="stop-item">
                                  <div className="stop-marker intermediate"></div>
                                  <div className="stop-details">
                                    <div className="stop-name">{stop}</div>
                                    <div className="stop-type">Stop {index + 1}</div>
                                  </div>
                                </div>
                              ))}
                              <div className="stop-item last">
                                <div className="stop-marker end"></div>
                                <div className="stop-details">
                                  <div className="stop-name">{route.endPoint}</div>
                                  <div className="stop-type">End Point</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="expanded-section">
                            <h4>Route Map</h4>
                            <button 
                              className="secondary-btn view-map-btn"
                              onClick={() => {
                                setActiveTab('map');
                                setMapView(prev => ({
                                  ...prev,
                                  selectedRoute: route.id
                                }));
                              }}
                            >
                              <MapIcon size={16} />
                              <span>View on Map</span>
                              <ArrowUpRight size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          renderMapView()
        )}
      </main>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>{modalType === 'add' ? 'Add New Route' : 'Edit Route'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Route Name</label>
                  <input
                    type="text"
                    name="routeName"
                    value={formData.routeName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Start Point</label>
                  <input
                    type="text"
                    name="startPoint"
                    value={formData.startPoint}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Point</label>
                  <input
                    type="text"
                    name="endPoint"
                    value={formData.endPoint}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Stops (comma separated)</label>
                  <textarea
                    name="stops"
                    value={formData.stops}
                    onChange={handleInputChange}
                    rows="3"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Assigned Bus</label>
                  <input
                    type="text"
                    name="assignedBus"
                    value={formData.assignedBus}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Driver</label>
                  <input
                    type="text"
                    name="driver"
                    value={formData.driver}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Helper</label>
                  <input
                    type="text"
                    name="helper"
                    value={formData.helper}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="active">Active</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Frequency</label>
                  <input
                    type="text"
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Start Time</label>
                  <input
                    type="text"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    placeholder="e.g., 06:00 AM"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Time</label>
                  <input
                    type="text"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    placeholder="e.g., 10:00 PM"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Bus Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="secondary-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  {modalType === 'add' ? 'Create Route' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusRoutes; 