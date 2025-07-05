import React, { useState, useEffect } from 'react';
import {
    Edit3,
    Trash2,
    Plus,
    Calendar,
    Search,
    User,
    MapPin,
    Users,
    FileText,
    Shield,
    Settings,
    Eye,
    X,
    Save,
    AlertCircle,
    ChevronLeft,
    Bus
} from 'lucide-react';
import './Bus.css';

const VehicleDetails = ({ vehicleId, onBack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const getFilteredItems = (items) => {
        if (!searchTerm) return items;

        const searchTermLower = searchTerm.toLowerCase();

        return items.filter(item =>
            Object.entries(item).some(([key, value]) => {
                if (key === 'id') return false;

                const stringValue = value?.toString().toLowerCase() || '';
                return stringValue.includes(searchTermLower);
            })
        );
    };
    const [vehicles, setVehicles] = useState([
        {
            id: 'BUS001',
            number: 'HR-38-AB-1234',
            image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
            capacity: 45,
            currentRoute: 'Route A - City Center to Airport',
            lastServiceDate: '2024-01-15',
            rc: {
                number: 'RC123456789',
                issueDate: '2023-01-01',
                expiryDate: '2028-01-01',
                ownerName: 'Transport Company Ltd.',
                status: 'Active'
            },
            insurance: {
                policyNumber: 'INS789012345',
                provider: 'General Insurance Co.',
                issueDate: '2024-01-01',
                expiryDate: '2025-01-01',
                coverage: '₹10,00,000',
                status: 'Active'
            },
            driver: {
                name: 'Rajesh Kumar',
                license: 'DL1234567890',
                phone: '+91-9876543210',
                experience: '10 years'
            },
            maintenanceLogs: [
                {
                    id: 1,
                    date: '2024-01-15',
                    type: 'Regular Service',
                    description: 'Oil change, brake inspection, tire rotation',
                    cost: '₹5,500',
                    mechanic: 'Suresh Auto Works'
                },
                {
                    id: 2,
                    date: '2023-12-20',
                    type: 'Repair',
                    description: 'AC compressor replacement',
                    cost: '₹12,000',
                    mechanic: 'City Motors'
                }
            ]
        },
        {
            id: 'BUS002',
            number: 'DL-01-CD-5678',
            image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400&h=300&fit=crop',
            capacity: 52,
            currentRoute: 'Route B - Downtown to Suburbs',
            lastServiceDate: '2024-02-20',
            rc: {
                number: 'RC987654321',
                issueDate: '2022-06-15',
                expiryDate: '2027-06-15',
                ownerName: 'City Transport Services',
                status: 'Active'
            },
            insurance: {
                policyNumber: 'INS123456789',
                provider: 'National Insurance',
                issueDate: '2023-12-01',
                expiryDate: '2024-12-01',
                coverage: '₹15,00,000',
                status: 'Active'
            },
            driver: {
                name: 'Vikram Singh',
                license: 'DL0987654321',
                phone: '+91-8765432109',
                experience: '8 years'
            },
            maintenanceLogs: [
                {
                    id: 1,
                    date: '2024-02-20',
                    type: 'Regular Service',
                    description: 'Engine check, fluid levels, battery test',
                    cost: '₹6,800',
                    mechanic: 'Metro Auto Care'
                }
            ]
        }
    ]);

    const [activeVehicle, setActiveVehicle] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [editMode, setEditMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [tempData, setTempData] = useState({});
    const [newMaintenanceLog, setNewMaintenanceLog] = useState({
        date: '',
        type: '',
        description: '',
        cost: '',
        mechanic: ''
    });
    const [showVehicleList, setShowVehicleList] = useState(false);
    const [newVehicle, setNewVehicle] = useState({
        id: '',
        number: '',
        image: '',
        capacity: '',
        currentRoute: '',
        lastServiceDate: '',
        rc: {
            number: '',
            issueDate: '',
            expiryDate: '',
            ownerName: '',
            status: 'Active'
        },
        insurance: {
            policyNumber: '',
            provider: '',
            issueDate: '',
            expiryDate: '',
            coverage: '',
            status: 'Active'
        },
        driver: {
            name: '',
            license: '',
            phone: '',
            experience: ''
        },
        maintenanceLogs: []
    });

    useEffect(() => {
        if (vehicleId) {
            const vehicle = vehicles.find(v => v.id === vehicleId);
            setActiveVehicle(vehicle || vehicles[0]);
        } else {
            setActiveVehicle(vehicles[0]);
        }
    }, [vehicleId, vehicles]);

    const handleEdit = (section) => {
        setModalType(section);
        setTempData(activeVehicle[section] || {});
        setShowModal(true);
    };

    const handleSave = () => {
        if (modalType === 'vehicle') {
            if (tempData.id) {
                setVehicles(prev =>
                    prev.map(v => v.id === tempData.id ? tempData : v)
                );
                setActiveVehicle(tempData);
            } else {
                const newId = `BUS${(vehicles.length + 1).toString().padStart(3, '0')}`;
                const vehicleToAdd = {
                    ...tempData,
                    id: newId,
                    maintenanceLogs: []
                };
                setVehicles(prev => [...prev, vehicleToAdd]);
                setActiveVehicle(vehicleToAdd);
            }
        } else {
            setActiveVehicle(prev => ({
                ...prev,
                [modalType]: tempData
            }));
            setVehicles(prev =>
                prev.map(v => v.id === activeVehicle.id ? { ...v, [modalType]: tempData } : v)
            );
        }
        setShowModal(false);
        setTempData({});
        setShowVehicleList(false);
    };

    const handleDelete = (section, id) => {
        if (section === 'maintenanceLogs') {
            const updatedVehicle = {
                ...activeVehicle,
                maintenanceLogs: activeVehicle.maintenanceLogs.filter(log => log.id !== id)
            };
            setActiveVehicle(updatedVehicle);
            setVehicles(prev =>
                prev.map(v => v.id === activeVehicle.id ? updatedVehicle : v)
            );
        } else if (section === 'vehicle') {
            if (window.confirm(`Are you sure you want to delete vehicle ${activeVehicle.number}?`)) {
                const updatedVehicles = vehicles.filter(v => v.id !== activeVehicle.id);
                setVehicles(updatedVehicles);
                setActiveVehicle(updatedVehicles[0] || null);
            }
        }
    };

    const handleAddMaintenance = () => {
        if (newMaintenanceLog.date && newMaintenanceLog.type) {
            const newLog = {
                ...newMaintenanceLog,
                id: Date.now()
            };
            const updatedVehicle = {
                ...activeVehicle,
                maintenanceLogs: [newLog, ...activeVehicle.maintenanceLogs]
            };
            setActiveVehicle(updatedVehicle);
            setVehicles(prev =>
                prev.map(v => v.id === activeVehicle.id ? updatedVehicle : v)
            );
            setNewMaintenanceLog({
                date: '',
                type: '',
                description: '',
                cost: '',
                mechanic: ''
            });
        }
    };

    const getStatusColor = (status) => {
        return status === 'Active' ? '#10b981' : '#ef4444';
    };

    const isExpiringSoon = (expiryDate) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30;
    };

    const handleNewVehicleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setTempData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setTempData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const startAddNewVehicle = () => {
        setTempData({ ...newVehicle });
        setModalType('vehicle');
        setShowModal(true);
    };

    if (!activeVehicle) {
        return (
            <div className="vehicle-details">
                <div className="vehicle-details__empty">
                    <Bus size={48} />
                    <h2>No Vehicles Found</h2>
                    <button
                        className="vehicle-details__add-btn"
                        onClick={startAddNewVehicle}
                    >
                        <Plus size={16} />
                        Add New Vehicle
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="vehicle-details">
            {/* Header */}
            <div className="header mb-8">
                <h1 className="title flex items-center">
                    <Bus size={28} className="mr-2" />
                    Bus Maintenance
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
            <div className="vehicle-details__header mt-8">
                <div className="vehicle-details__hero">
                    <div className="vehicle-details__vehicle-selector">
                        <button
                            className="vehicle-details__back-btn"
                            onClick={onBack || (() => setShowVehicleList(!showVehicleList))}
                        >
                            <ChevronLeft size={20} />
                            {showVehicleList ? 'Hide List' : 'Show All Vehicles'}
                        </button>

                        {showVehicleList && (
                            <div className="vehicle-details__vehicle-list">
                                <div className="vehicle-details__list-header">
                                    <h3>All Vehicles</h3>
                                    <button
                                        className="vehicle-details__add-btn"
                                        onClick={startAddNewVehicle}
                                    >
                                        <Plus size={16} />
                                        Add Vehicle
                                    </button>
                                </div>
                                <div className="vehicle-details__list-items">
                                    {vehicles.map(vehicle => (
                                        <div
                                            key={vehicle.id}
                                            className={`vehicle-details__list-item ${vehicle.id === activeVehicle.id ? 'active' : ''}`}
                                            onClick={() => {
                                                setActiveVehicle(vehicle);
                                                setShowVehicleList(false);
                                            }}
                                        >
                                            <div className="vehicle-details__list-item-image">
                                                <img src={vehicle.image} alt={vehicle.number} />
                                            </div>
                                            <div className="vehicle-details__list-item-info">
                                                <h4>{vehicle.number}</h4>
                                                <p>{vehicle.currentRoute}</p>
                                            </div>
                                            <div className="vehicle-details__list-item-actions">
                                                <button
                                                    className="vehicle-details__action-btn edit"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setTempData(vehicle);
                                                        setModalType('vehicle');
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    <Edit3 size={14} />
                                                </button>
                                                <button
                                                    className="vehicle-details__action-btn delete"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (window.confirm(`Delete vehicle ${vehicle.number}?`)) {
                                                            const updatedVehicles = vehicles.filter(v => v.id !== vehicle.id);
                                                            setVehicles(updatedVehicles);
                                                            if (vehicle.id === activeVehicle.id) {
                                                                setActiveVehicle(updatedVehicles[0] || null);
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="vehicle-details__image-container">
                        <img
                            src={activeVehicle.image}
                            alt={`Bus ${activeVehicle.number}`}
                            className="vehicle-details__image"
                        />
                        <div className="vehicle-details__overlay">
                            <button
                                className="vehicle-details__edit-btn"
                                onClick={() => {
                                    setTempData(activeVehicle);
                                    setModalType('vehicle');
                                    setShowModal(true);
                                }}
                            >
                                <Edit3 size={16} />
                            </button>
                        </div>
                    </div>
                    <div className="vehicle-details__info">
                        <div className="vehicle-details__title-container">
                            <h1 className="vehicle-details__title">{activeVehicle.number}</h1>
                            <button
                                className="vehicle-details__delete-btn"
                                onClick={() => handleDelete('vehicle')}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                        <p className="vehicle-details__subtitle">Vehicle ID: {activeVehicle.id}</p>
                        <div className="vehicle-details__quick-stats">
                            <div className="vehicle-details__stat">
                                <Users size={18} />
                                <span>{activeVehicle.capacity} Seats</span>
                            </div>
                            <div className="vehicle-details__stat">
                                <MapPin size={18} />
                                <span>{activeVehicle.currentRoute}</span>
                            </div>
                            <div className="vehicle-details__stat">
                                <Calendar size={18} />
                                <span>Last Service: {activeVehicle.lastServiceDate}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="vehicle-details__tabs">
                <button
                    className={`vehicle-details__tab ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </button>
                <button
                    className={`vehicle-details__tab ${activeTab === 'documents' ? 'active' : ''}`}
                    onClick={() => setActiveTab('documents')}
                >
                    Documents
                </button>
                <button
                    className={`vehicle-details__tab ${activeTab === 'maintenance' ? 'active' : ''}`}
                    onClick={() => setActiveTab('maintenance')}
                >
                    Maintenance
                </button>
                <button
                    className={`vehicle-details__tab ${activeTab === 'driver' ? 'active' : ''}`}
                    onClick={() => setActiveTab('driver')}
                >
                    Driver
                </button>
            </div>

            <div className="vehicle-details__content">
                {activeTab === 'overview' && (
                    <div className="vehicle-details__overview">
                        <div className="vehicle-details__cards">
                            <div className="vehicle-details__card">
                                <div className="vehicle-details__card-header">
                                    <h3>Capacity</h3>
                                    <Users className="vehicle-details__card-icon" />
                                </div>
                                <div className="vehicle-details__card-content">
                                    <span className="vehicle-details__card-value">{activeVehicle.capacity}</span>
                                    <span className="vehicle-details__card-label">Passengers</span>
                                </div>
                            </div>

                            <div className="vehicle-details__card">
                                <div className="vehicle-details__card-header">
                                    <h3>Current Route</h3>
                                    <MapPin className="vehicle-details__card-icon" />
                                </div>
                                <div className="vehicle-details__card-content">
                                    <span className="vehicle-details__card-text">{activeVehicle.currentRoute}</span>
                                </div>
                            </div>

                            <div className="vehicle-details__card">
                                <div className="vehicle-details__card-header">
                                    <h3>Last Service</h3>
                                    <Calendar className="vehicle-details__card-icon" />
                                </div>
                                <div className="vehicle-details__card-content">
                                    <span className="vehicle-details__card-date">{activeVehicle.lastServiceDate}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'documents' && (
                    <div className="vehicle-details__documents">
                        <div className="vehicle-details__document-section">
                            <div className="vehicle-details__section-header">
                                <h3>Registration Certificate (RC)</h3>
                                <div className="vehicle-details__section-actions">
                                    <button
                                        className="vehicle-details__action-btn view"
                                        onClick={() => handleEdit('rc')}
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button
                                        className="vehicle-details__action-btn edit"
                                        onClick={() => handleEdit('rc')}
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="vehicle-details__document-card">
                                <div className="vehicle-details__document-info">
                                    <div className="vehicle-details__document-row">
                                        <span className="vehicle-details__document-label">RC Number:</span>
                                        <span className="vehicle-details__document-value">{activeVehicle.rc.number}</span>
                                    </div>
                                    <div className="vehicle-details__document-row">
                                        <span className="vehicle-details__document-label">Owner:</span>
                                        <span className="vehicle-details__document-value">{activeVehicle.rc.ownerName}</span>
                                    </div>
                                    <div className="vehicle-details__document-row">
                                        <span className="vehicle-details__document-label">Issue Date:</span>
                                        <span className="vehicle-details__document-value">{activeVehicle.rc.issueDate}</span>
                                    </div>
                                    <div className="vehicle-details__document-row">
                                        <span className="vehicle-details__document-label">Expiry Date:</span>
                                        <span className="vehicle-details__document-value">{activeVehicle.rc.expiryDate}</span>
                                    </div>
                                    <div className="vehicle-details__document-row">
                                        <span className="vehicle-details__document-label">Status:</span>
                                        <span
                                            className="vehicle-details__status-badge"
                                            style={{ backgroundColor: getStatusColor(activeVehicle.rc.status) }}
                                        >
                                            {activeVehicle.rc.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="vehicle-details__document-section">
                            <div className="vehicle-details__section-header">
                                <h3>Insurance</h3>
                                <div className="vehicle-details__section-actions">
                                    <button
                                        className="vehicle-details__action-btn view"
                                        onClick={() => handleEdit('insurance')}
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button
                                        className="vehicle-details__action-btn edit"
                                        onClick={() => handleEdit('insurance')}
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="vehicle-details__document-card">
                                {isExpiringSoon(activeVehicle.insurance.expiryDate) && (
                                    <div className="vehicle-details__warning">
                                        <AlertCircle size={16} />
                                        <span>Insurance expires in 30 days or less!</span>
                                    </div>
                                )}
                                <div className="vehicle-details__document-info">
                                    <div className="vehicle-details__document-row">
                                        <span className="vehicle-details__document-label">Policy Number:</span>
                                        <span className="vehicle-details__document-value">{activeVehicle.insurance.policyNumber}</span>
                                    </div>
                                    <div className="vehicle-details__document-row">
                                        <span className="vehicle-details__document-label">Provider:</span>
                                        <span className="vehicle-details__document-value">{activeVehicle.insurance.provider}</span>
                                    </div>
                                    <div className="vehicle-details__document-row">
                                        <span className="vehicle-details__document-label">Coverage:</span>
                                        <span className="vehicle-details__document-value">{activeVehicle.insurance.coverage}</span>
                                    </div>
                                    <div className="vehicle-details__document-row">
                                        <span className="vehicle-details__document-label">Expiry Date:</span>
                                        <span className="vehicle-details__document-value">{activeVehicle.insurance.expiryDate}</span>
                                    </div>
                                    <div className="vehicle-details__document-row">
                                        <span className="vehicle-details__document-label">Status:</span>
                                        <span
                                            className="vehicle-details__status-badge"
                                            style={{ backgroundColor: getStatusColor(activeVehicle.insurance.status) }}
                                        >
                                            {activeVehicle.insurance.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'maintenance' && (
                    <div className="vehicle-details__maintenance">
                        <div className="vehicle-details__section-header">
                            <h3>Maintenance Logs</h3>
                            <button
                                className="vehicle-details__add-btn"
                                onClick={() => {
                                    setModalType('maintenanceLog');
                                    setShowModal(true);
                                }}
                            >
                                <Plus size={16} />
                                Add Log
                            </button>
                        </div>

                        <div className="vehicle-details__add-maintenance">
                            <div className="vehicle-details__form-grid">
                                <input
                                    type="date"
                                    placeholder="Date"
                                    value={newMaintenanceLog.date}
                                    onChange={(e) => setNewMaintenanceLog(prev => ({ ...prev, date: e.target.value }))}
                                    className="vehicle-details__form-input"
                                />
                                <select
                                    value={newMaintenanceLog.type}
                                    onChange={(e) => setNewMaintenanceLog(prev => ({ ...prev, type: e.target.value }))}
                                    className="vehicle-details__form-input"
                                >
                                    <option value="">Select Type</option>
                                    <option value="Regular Service">Regular Service</option>
                                    <option value="Repair">Repair</option>
                                    <option value="Inspection">Inspection</option>
                                    <option value="Emergency">Emergency</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Description"
                                    value={newMaintenanceLog.description}
                                    onChange={(e) => setNewMaintenanceLog(prev => ({ ...prev, description: e.target.value }))}
                                    className="vehicle-details__form-input"
                                />
                                <input
                                    type="text"
                                    placeholder="Cost"
                                    value={newMaintenanceLog.cost}
                                    onChange={(e) => setNewMaintenanceLog(prev => ({ ...prev, cost: e.target.value }))}
                                    className="vehicle-details__form-input"
                                />
                                <input
                                    type="text"
                                    placeholder="Mechanic/Shop"
                                    value={newMaintenanceLog.mechanic}
                                    onChange={(e) => setNewMaintenanceLog(prev => ({ ...prev, mechanic: e.target.value }))}
                                    className="vehicle-details__form-input"
                                />
                                <button
                                    className="vehicle-details__form-submit"
                                    onClick={handleAddMaintenance}
                                >
                                    <Plus size={16} />
                                    Add
                                </button>
                            </div>
                        </div>

                        <div className="vehicle-details__maintenance-logs">
                            {activeVehicle.maintenanceLogs.map((log) => (
                                <div key={log.id} className="vehicle-details__maintenance-log">
                                    <div className="vehicle-details__log-header">
                                        <div className="vehicle-details__log-date">{log.date}</div>
                                        <div className="vehicle-details__log-type">{log.type}</div>
                                        <div className="vehicle-details__log-actions">
                                            <button
                                                className="vehicle-details__action-btn edit"
                                                onClick={() => {
                                                    setTempData(log);
                                                    setModalType('maintenanceLog');
                                                    setShowModal(true);
                                                }}
                                            >
                                                <Edit3 size={14} />
                                            </button>
                                            <button
                                                className="vehicle-details__action-btn delete"
                                                onClick={() => handleDelete('maintenanceLogs', log.id)}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="vehicle-details__log-content">
                                        <p className="vehicle-details__log-description">{log.description}</p>
                                        <div className="vehicle-details__log-details">
                                            <span className="vehicle-details__log-cost">{log.cost}</span>
                                            <span className="vehicle-details__log-mechanic">{log.mechanic}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'driver' && (
                    <div className="vehicle-details__driver">
                        <div className="vehicle-details__section-header">
                            <h3>Assigned Driver</h3>
                            <button
                                className="vehicle-details__action-btn edit"
                                onClick={() => handleEdit('driver')}
                            >
                                <Edit3 size={16} />
                            </button>
                        </div>
                        <div className="vehicle-details__driver-card">
                            <div className="vehicle-details__driver-info">
                                <div className="vehicle-details__driver-row">
                                    <span className="vehicle-details__driver-label">Name:</span>
                                    <span className="vehicle-details__driver-value">{activeVehicle.driver.name}</span>
                                </div>
                                <div className="vehicle-details__driver-row">
                                    <span className="vehicle-details__driver-label">License:</span>
                                    <span className="vehicle-details__driver-value">{activeVehicle.driver.license}</span>
                                </div>
                                <div className="vehicle-details__driver-row">
                                    <span className="vehicle-details__driver-label">Phone:</span>
                                    <span className="vehicle-details__driver-value">{activeVehicle.driver.phone}</span>
                                </div>
                                <div className="vehicle-details__driver-row">
                                    <span className="vehicle-details__driver-label">Experience:</span>
                                    <span className="vehicle-details__driver-value">{activeVehicle.driver.experience}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="vehicle-details__modal-overlay">
                    <div className="vehicle-details__modal">
                        <div className="vehicle-details__modal-header">
                            <h3>
                                {modalType === 'vehicle'
                                    ? (tempData.id ? 'Edit Vehicle' : 'Add New Vehicle')
                                    : `Edit ${modalType}`}
                            </h3>
                            <button
                                className="vehicle-details__modal-close"
                                onClick={() => setShowModal(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="vehicle-details__modal-content">
                            {modalType === 'vehicle' && (
                                <div className="vehicle-details__modal-form">
                                    <input
                                        type="text"
                                        name="number"
                                        placeholder="Vehicle Number (e.g. HR-38-AB-1234)"
                                        value={tempData.number || ''}
                                        onChange={handleNewVehicleChange}
                                        className="vehicle-details__modal-input"
                                    />
                                    <input
                                        type="text"
                                        name="image"
                                        placeholder="Image URL"
                                        value={tempData.image || ''}
                                        onChange={handleNewVehicleChange}
                                        className="vehicle-details__modal-input"
                                    />
                                    <input
                                        type="number"
                                        name="capacity"
                                        placeholder="Seating Capacity"
                                        value={tempData.capacity || ''}
                                        onChange={handleNewVehicleChange}
                                        className="vehicle-details__modal-input"
                                    />
                                    <input
                                        type="text"
                                        name="currentRoute"
                                        placeholder="Current Route"
                                        value={tempData.currentRoute || ''}
                                        onChange={handleNewVehicleChange}
                                        className="vehicle-details__modal-input"
                                    />
                                    <input
                                        type="date"
                                        name="lastServiceDate"
                                        placeholder="Last Service Date"
                                        value={tempData.lastServiceDate || ''}
                                        onChange={handleNewVehicleChange}
                                        className="vehicle-details__modal-input"
                                    />
                                    <h4>RC Details</h4>
                                    <input
                                        type="text"
                                        name="rc.number"
                                        placeholder="RC Number"
                                        value={tempData.rc?.number || ''}
                                        onChange={handleNewVehicleChange}
                                        className="vehicle-details__modal-input"
                                    />
                                    <input
                                        type="text"
                                        name="rc.ownerName"
                                        placeholder="Owner Name"
                                        value={tempData.rc?.ownerName || ''}
                                        onChange={handleNewVehicleChange}
                                        className="vehicle-details__modal-input"
                                    />
                                    <input
                                        type="date"
                                        name="rc.issueDate"
                                        placeholder="RC Issue Date"
                                        value={tempData.rc?.issueDate || ''}
                                        onChange={handleNewVehicleChange}
                                        className="vehicle-details__modal-input"
                                    />
                                    <input
                                        type="date"
                                        name="rc.expiryDate"
                                        placeholder="RC Expiry Date"
                                        value={tempData.rc?.expiryDate || ''}
                                        onChange={handleNewVehicleChange}
                                        className="vehicle-details__modal-input"
                                    />
                                    <h4>Insurance Details</h4>
                                    <input
                                        type="text"
                                        name="insurance.policyNumber"
                                        placeholder="Policy Number"
                                        value={tempData.insurance?.policyNumber || ''}
                                        onChange={handleNewVehicleChange}
                                        className="vehicle-details__modal-input"
                                    />
                                    <input
                                        type="text"
                                        name="insurance.provider"
                                        placeholder="Provider"
                                        value={tempData.insurance?.provider || ''}
                                        onChange={handleNewVehicleChange}
                                        className="vehicle-details__modal-input"
                                    />
                                    <input
                                        type="text"
                                        name="insurance.coverage"
                                        placeholder="Coverage Amount"
                                        value={tempData.insurance?.coverage || ''}
                                        onChange={handleNewVehicleChange}
                                        className="vehicle-details__modal-input"
                                    />
                                    <input
                                        type="date"
                                        name="insurance.expiryDate"
                                        placeholder="Insurance Expiry Date"
                                        value={tempData.insurance?.expiryDate || ''}
                                        onChange={handleNewVehicleChange}
                                        className="vehicle-details__modal-input"
                                    />
                                    <h4>Driver Details</h4>
                                    <input
                                        type="text"
                                        name="driver.name"
                                        placeholder="Driver Name"
                                        value={tempData.driver?.name || ''}
                                        onChange={handleNewVehicleChange}
                                        className="vehicle-details__modal-input"
                                    />
                                    <input
                                        type="text"
                                        name="driver.license"
                                        placeholder="License Number"
                                        value={tempData.driver?.license || ''}
                                        onChange={handleNewVehicleChange}
                                        className="vehicle-details__modal-input"
                                    />
                                    <input
                                        type="tel"
                                        name="driver.phone"
                                        placeholder="Phone Number"
                                        value={tempData.driver?.phone || ''}
                                        onChange={handleNewVehicleChange}
                                        className="vehicle-details__modal-input"
                                    />
                                    <input
                                        type="text"
                                        name="driver.experience"
                                        placeholder="Experience"
                                        value={tempData.driver?.experience || ''}
                                        onChange={handleNewVehicleChange}
                                        className="vehicle-details__modal-input"
                                    />
                                </div>
                            )}
                            {modalType === 'rc' && (
                                <div className="vehicle-details__modal-form">
                                    <input
                                        type="text"
                                        placeholder="RC Number"
                                        value={tempData.number || ''}
                                        onChange={(e) => setTempData(prev => ({ ...prev, number: e.target.value }))}
                                        className="vehicle-details__modal-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Owner Name"
                                        value={tempData.ownerName || ''}
                                        onChange={(e) => setTempData(prev => ({ ...prev, ownerName: e.target.value }))}
                                        className="vehicle-details__modal-input"
                                    />
                                    <input
                                        type="date"
                                        placeholder="Issue Date"
                                        value={tempData.issueDate || ''}
                                        onChange={(e) => setTempData(prev => ({ ...prev, issueDate: e.target.value }))}
                                        className="vehicle-details__modal-input"
                                    />
                                    <input
                                        type="date"
                                        placeholder="Expiry Date"
                                        value={tempData.expiryDate || ''}
                                        onChange={(e) => setTempData(prev => ({ ...prev, expiryDate: e.target.value }))}
                                        className="vehicle-details__modal-input"
                                    />
                                </div>
                            )}
                            {modalType === 'insurance' && (
                                <div className="vehicle-details__modal-form">
                                    <input
                                        type="text"
                                        placeholder="Policy Number"
                                        value={tempData.policyNumber || ''}
                                        onChange={(e) => setTempData(prev => ({ ...prev, policyNumber: e.target.value }))}
                                        className="vehicle-details__modal-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Provider"
                                        value={tempData.provider || ''}
                                        onChange={(e) => setTempData(prev => ({ ...prev, provider: e.target.value }))}
                                        className="vehicle-details__modal-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Coverage Amount"
                                        value={tempData.coverage || ''}
                                        onChange={(e) => setTempData(prev => ({ ...prev, coverage: e.target.value }))}
                                        className="vehicle-details__modal-input"
                                    />
                                    <input
                                        type="date"
                                        placeholder="Expiry Date"
                                        value={tempData.expiryDate || ''}
                                        onChange={(e) => setTempData(prev => ({ ...prev, expiryDate: e.target.value }))}
                                        className="vehicle-details__modal-input"
                                    />
                                </div>
                            )}
                            {modalType === 'driver' && (
                                <div className="vehicle-details__modal-form">
                                    <input
                                        type="text"
                                        placeholder="Driver Name"
                                        value={tempData.name || ''}
                                        onChange={(e) => setTempData(prev => ({ ...prev, name: e.target.value }))}
                                        className="vehicle-details__modal-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="License Number"
                                        value={tempData.license || ''}
                                        onChange={(e) => setTempData(prev => ({ ...prev, license: e.target.value }))}
                                        className="vehicle-details__modal-input"
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Phone Number"
                                        value={tempData.phone || ''}
                                        onChange={(e) => setTempData(prev => ({ ...prev, phone: e.target.value }))}
                                        className="vehicle-details__modal-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Experience"
                                        value={tempData.experience || ''}
                                        onChange={(e) => setTempData(prev => ({ ...prev, experience: e.target.value }))}
                                        className="vehicle-details__modal-input"
                                    />
                                </div>
                            )}
                            {modalType === 'maintenanceLog' && (
                                <div className="vehicle-details__modal-form">
                                    <input
                                        type="date"
                                        placeholder="Date"
                                        value={tempData.date || ''}
                                        onChange={(e) => setTempData(prev => ({ ...prev, date: e.target.value }))}
                                        className="vehicle-details__modal-input"
                                    />
                                    <select
                                        value={tempData.type || ''}
                                        onChange={(e) => setTempData(prev => ({ ...prev, type: e.target.value }))}
                                        className="vehicle-details__modal-input"
                                    >
                                        <option value="">Select Type</option>
                                        <option value="Regular Service">Regular Service</option>
                                        <option value="Repair">Repair</option>
                                        <option value="Inspection">Inspection</option>
                                        <option value="Emergency">Emergency</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Description"
                                        value={tempData.description || ''}
                                        onChange={(e) => setTempData(prev => ({ ...prev, description: e.target.value }))}
                                        className="vehicle-details__modal-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Cost"
                                        value={tempData.cost || ''}
                                        onChange={(e) => setTempData(prev => ({ ...prev, cost: e.target.value }))}
                                        className="vehicle-details__modal-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Mechanic/Shop"
                                        value={tempData.mechanic || ''}
                                        onChange={(e) => setTempData(prev => ({ ...prev, mechanic: e.target.value }))}
                                        className="vehicle-details__modal-input"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="vehicle-details__modal-actions">
                            <button
                                className="vehicle-details__modal-btn cancel"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="vehicle-details__modal-btn save"
                                onClick={handleSave}
                            >
                                <Save size={16} />
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehicleDetails;