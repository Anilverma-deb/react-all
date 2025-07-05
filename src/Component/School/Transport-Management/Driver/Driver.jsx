import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  Search,
  Eye,
  Edit,
  Trash2,
  Bus,
  MapPin,
  Phone,
  Calendar,
  Award,
  Camera,
  Upload,
  X,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText
} from 'lucide-react';
import './Driver.css';

const DriverManagement = () => {
  const [staff, setStaff] = useState({
    drivers: [
      {
        id: 1,
        type: 'driver',
        name: 'Rajesh Kumar',
        licenseNumber: 'DL-HR-2024-001234',
        contact: '+91-9876543210',
        email: 'rajesh.kumar@transport.com',
        address: '123 Gandhi Road, Sector 15, Faridabad, Haryana 121007',
        aadhaarNumber: 'XXXX-XXXX-1234',
        assignedVehicle: 'HR-05-2024-001',
        assignedRoute: 'Route A',
        status: 'active',
        hireDate: '2022-01-15',
        completedRoutes: 245,
        rating: 4.8,
        profilePhoto: null,
        aadhaarPhoto: null,
        licensePhoto: null,
        bloodGroup: 'B+',
        emergencyContact: '+91-9876543211',
        emergencyContactName: 'Sunita Kumar',
        experience: '8 years',
        salary: '₹35,000'
      },
      {
        id: 2,
        type: 'driver',
        name: 'Amit Singh',
        licenseNumber: 'DL-HR-2024-005678',
        contact: '+91-8765432109',
        email: 'amit.singh@transport.com',
        address: '456 Nehru Avenue, Sector 21, Faridabad, Haryana 121008',
        aadhaarNumber: 'XXXX-XXXX-5678',
        assignedVehicle: null,
        assignedRoute: null,
        status: 'active',
        hireDate: '2022-03-10',
        completedRoutes: 189,
        rating: 4.6,
        profilePhoto: null,
        aadhaarPhoto: null,
        licensePhoto: null,
        bloodGroup: 'O+',
        emergencyContact: '+91-8765432110',
        emergencyContactName: 'Priya Singh',
        experience: '6 years',
        salary: '₹32,000'
      }
    ],
    helpers: [
      {
        id: 1,
        type: 'helper',
        name: 'Suresh Yadav',
        contact: '+91-7654321098',
        email: 'suresh.yadav@transport.com',
        address: '789 Patel Street, Sector 12, Faridabad, Haryana 121006',
        aadhaarNumber: 'XXXX-XXXX-9876',
        assignedVehicle: 'HR-05-2024-001',
        assignedRoute: 'Route A',
        status: 'active',
        hireDate: '2022-02-20',
        completedRoutes: 245,
        rating: 4.7,
        profilePhoto: null,
        aadhaarPhoto: null,
        bloodGroup: 'A+',
        emergencyContact: '+91-7654321099',
        emergencyContactName: 'Kamala Yadav',
        experience: '5 years',
        salary: '₹22,000'
      },
      {
        id: 2,
        type: 'helper',
        name: 'Deepak Sharma',
        contact: '+91-6543210987',
        email: 'deepak.sharma@transport.com',
        address: '321 Sharma Colony, Sector 18, Faridabad, Haryana 121009',
        aadhaarNumber: 'XXXX-XXXX-5432',
        assignedVehicle: null,
        assignedRoute: null,
        status: 'active',
        hireDate: '2022-04-05',
        completedRoutes: 156,
        rating: 4.5,
        profilePhoto: null,
        aadhaarPhoto: null,
        bloodGroup: 'AB+',
        emergencyContact: '+91-6543210988',
        emergencyContactName: 'Rekha Sharma',
        experience: '4 years',
        salary: '₹20,000'
      }
    ]
  });

  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      registration: 'HR-05-2024-001',
      type: 'Large Bus',
      capacity: 50,
      status: 'active',
      model: 'Tata LP 410',
      year: '2023',
      fuelType: 'Diesel'
    },
    {
      id: 2,
      registration: 'HR-05-2024-002',
      type: 'Medium Bus',
      capacity: 35,
      status: 'maintenance',
      model: 'Ashok Leyland',
      year: '2022',
      fuelType: 'CNG'
    },
    {
      id: 3,
      registration: 'HR-05-2024-003',
      type: 'Mini Bus',
      capacity: 20,
      status: 'active',
      model: 'Force Traveller',
      year: '2023',
      fuelType: 'Diesel'
    }
  ]);

  const [routes, setRoutes] = useState([
    {
      id: 1,
      name: 'Route A',
      startPoint: 'Faridabad City Center',
      endPoint: 'Sector 15-21',
      distance: '25 km',
      estimatedTime: '45 min',
      stops: 12
    },
    {
      id: 2,
      name: 'Route B',
      startPoint: 'Old Faridabad',
      endPoint: 'New Industrial Town',
      distance: '30 km',
      estimatedTime: '55 min',
      stops: 15
    },
    {
      id: 3,
      name: 'Route C',
      startPoint: 'Railway Station',
      endPoint: 'NHPC Chowk',
      distance: '20 km',
      estimatedTime: '35 min',
      stops: 10
    }
  ]);

  const [assignments, setAssignments] = useState([
    { id: 1, driverId: 1, helperId: 1, vehicleId: 1, routeId: 1, date: '2024-06-24', status: 'active' }
  ]);

  const [formData, setFormData] = useState({
    type: 'driver',
    name: '',
    licenseNumber: '',
    contact: '',
    email: '',
    address: '',
    aadhaarNumber: '',
    status: 'active',
    profilePhoto: null,
    aadhaarPhoto: null,
    licensePhoto: null,
    bloodGroup: '',
    emergencyContact: '',
    emergencyContactName: '',
    experience: '',
    salary: ''
  });

  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [currentViewItem, setCurrentViewItem] = useState(null);
  const [assignmentFormOpen, setAssignmentFormOpen] = useState(false);
  const [assignmentFormData, setAssignmentFormData] = useState({
    driverId: '',
    helperId: '',
    vehicleId: '',
    routeId: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [activeTab, setActiveTab] = useState('drivers');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStaff = staff[activeTab].filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (person.contact && person.contact.includes(searchTerm)) ||
    (person.type === 'driver' && person.licenseNumber && person.licenseNumber.includes(searchTerm)) ||
    (person.email && person.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [name]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setStaff(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].map(item =>
          item.id === editingId ? { ...item, ...formData } : item
        )
      }));
    } else {
      const newItem = {
        ...formData,
        id: Math.max(...staff[activeTab].map(item => item.id), 0) + 1,
        assignedVehicle: null,
        assignedRoute: null,
        completedRoutes: 0,
        rating: 0,
        hireDate: new Date().toISOString().split('T')[0]
      };
      setStaff(prev => ({
        ...prev,
        [activeTab]: [...prev[activeTab], newItem]
      }));
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      type: 'driver',
      name: '',
      licenseNumber: '',
      contact: '',
      email: '',
      address: '',
      aadhaarNumber: '',
      status: 'active',
      profilePhoto: null,
      aadhaarPhoto: null,
      licensePhoto: null,
      bloodGroup: '',
      emergencyContact: '',
      emergencyContactName: '',
      experience: '',
      salary: ''
    });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleEdit = (item) => {
    setFormData({
      type: item.type,
      name: item.name,
      licenseNumber: item.licenseNumber || '',
      contact: item.contact,
      email: item.email || '',
      address: item.address,
      aadhaarNumber: item.aadhaarNumber || '',
      status: item.status,
      profilePhoto: item.profilePhoto || null,
      aadhaarPhoto: item.aadhaarPhoto || null,
      licensePhoto: item.licensePhoto || null,
      bloodGroup: item.bloodGroup || '',
      emergencyContact: item.emergencyContact || '',
      emergencyContactName: item.emergencyContactName || '',
      experience: item.experience || '',
      salary: item.salary || ''
    });
    setEditingId(item.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    setStaff(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].filter(item => item.id !== id)
    }));
  };

  const handleView = (item) => {
    setCurrentViewItem(item);
    setViewModalOpen(true);
  };

  const handleAssignmentSubmit = (e) => {
    e.preventDefault();
    const newAssignment = {
      ...assignmentFormData,
      id: assignments.length + 1,
      status: 'active'
    };
    setAssignments([...assignments, newAssignment]);

    setStaff(prev => ({
      drivers: prev.drivers.map(driver =>
        driver.id === parseInt(assignmentFormData.driverId) ? {
          ...driver,
          assignedVehicle: vehicles.find(v => v.id === parseInt(assignmentFormData.vehicleId))?.registration,
          assignedRoute: routes.find(r => r.id === parseInt(assignmentFormData.routeId))?.name
        } : driver
      ),
      helpers: prev.helpers.map(helper =>
        helper.id === parseInt(assignmentFormData.helperId) ? {
          ...helper,
          assignedVehicle: vehicles.find(v => v.id === parseInt(assignmentFormData.vehicleId))?.registration,
          assignedRoute: routes.find(r => r.id === parseInt(assignmentFormData.routeId))?.name
        } : helper
      )
    }));

    setAssignmentFormOpen(false);
    setAssignmentFormData({
      driverId: '',
      helperId: '',
      vehicleId: '',
      routeId: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'on_leave': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-yellow-400' : 'text-gray-300'}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="header">
                 <h1 className="title flex items-center">
                   <Bus size={28} className="mr-2" />
                   Driver Management 
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
        </div>
      </div>

      <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 mt-16 mb-16 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500"
          >
            <div className="flex items-center justify-between p-8">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Drivers</p>
                <p className="text-3xl font-bold text-gray-900">{staff.drivers.length}</p>
              </div>
              <Users className="h-12 w-12 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500"
          >
            <div className="flex items-center justify-between p-8">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Helpers</p>
                <p className="text-3xl font-bold text-gray-900">{staff.helpers.length}</p>
              </div>
              <Users className="h-12 w-12 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500"
          >
            <div className="flex items-center justify-between p-8">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Vehicles</p>
                <p className="text-3xl font-bold text-gray-900">{vehicles.filter(v => v.status === 'active').length}</p>
              </div>
              <Bus className="h-12 w-12 text-purple-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500"
          >
            <div className="flex items-center justify-between p-8">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Routes</p>
                <p className="text-3xl font-bold text-gray-900">{routes.length}</p>
              </div>
              <MapPin className="h-12 w-12 text-orange-500" />
            </div>
          </motion.div>
        </div>

        {/* Tabs and Actions */}
        <div className="bg-white rounded-xl mt-16 shadow-md mb-8">
          <div className="flex flex-wrap items-center p-24 justify-between p-6 border-b border-gray-200">
            <div className="flex space-x-1 view-tabs">
              <button
                className={` tab-btn active  ${activeTab === 'drivers'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                onClick={() => setActiveTab('drivers')}
              >
                <Users className="inline-block w-5 h-5 mr-2" />
                Drivers
              </button>
              <button
                className={`tab-btn ${activeTab === 'helpers'

                  }`}
                onClick={() => setActiveTab('helpers')}
              >
                <Users className="inline-block w-5 h-5 mr-2" />
                Helpers
              </button>
            </div>

            <div className="flex space-x-3 mt-4 gap-4 sm:mt-0">
              <button
                onClick={() => setAssignmentFormOpen(true)}
                className="add-btn bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
              >
                <Settings className="inline-block w-5 h-5 mr-2" />
                Assign Vehicle
              </button>
              <button
                onClick={() => {
                  setFormData(prev => ({ ...prev, type: activeTab.slice(0, -1) }));
                  setIsFormOpen(true);
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                <UserPlus className="inline-block w-5 h-5 mr-2" />
                Add {activeTab === 'drivers' ? 'Driver' : 'Helper'}
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead className="bg-gray-50">
                <tr className='table-row'>
                  <th className="table-header-cell text-left">Profile</th>
                  <th className="table-header-cell text-left">Contact</th>
                  {activeTab === 'drivers' && (
                    <th className="table-header-cell text-left">License</th>
                  )}
                  <th className="table-header-cell text-left">Assignment</th>
                  <th className="table-header-cell text-left">Performance</th>
                  <th className="table-header-cell text-left">Status</th>
                  <th className="table-header-cell text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {filteredStaff.map((person) => (
                    <motion.tr
                      key={person.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`hover:bg-gray-50 transition-colors ${!person.assignedVehicle ? 'bg-red-50' : ''
                        }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap table-header-cell ">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {person.profilePhoto ? (
                              <img
                                src={person.profilePhoto}
                                alt={person.name}
                                className="h-12 w-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                                <span className="text-white font-medium text-lg">
                                  {person.name.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{person.name}</div>
                            <div className="text-sm text-gray-500">ID: {person.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap table-header-cell ">
                        <div className="text-sm text-gray-900">{person.contact}</div>
                        <div className="text-sm text-gray-500">{person.email}</div>
                      </td>
                      {activeTab === 'drivers' && (
                        <td className="px-6 py-4 whitespace-nowrap table-header-cell ">
                          <div className="text-sm text-gray-900">{person.licenseNumber}</div>
                          <div className="text-sm text-gray-500">{person.experience}</div>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap table-header-cell ">
                        <div className="text-sm text-gray-900">
                          {person.assignedVehicle || (
                            <span className="text-red-600 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              Not assigned
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{person.assignedRoute}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap table-header-cell ">
                        <div className="text-sm text-gray-900">{person.completedRoutes} routes</div>
                        <div className="flex items-center">
                          {getRatingStars(person.rating)}
                          <span className="ml-1 text-sm text-gray-500">({person.rating})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap  ">
                        <span className={`inline-flex px-2 py-1 p-4 text-xs font-semibold rounded-full ${getStatusColor(person.status)}`}>
                          {person.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium table-header-cell  ">
                        <div className="flex space-x-2 gap-2">
                          <button
                            onClick={() => handleView(person)}
                            className="action-btn edit text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(person)}
                            className=" action-btn edit text-orange-600 hover:text-orange-900 p-2 rounded-lg hover:bg-orange-50 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(person.id)}
                            className=" action-btn delete text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {filteredStaff.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No {activeTab} found</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding a new {activeTab.slice(0, -1)}.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed modal-overlay inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white modal-container rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky modal-header top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingId ? 'Edit' : 'Add'} {formData.type === 'driver' ? 'Driver' : 'Helper'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6 modal-form">
                {/* Photo Upload Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="block text-center text-sm font-medium text-gray-700">Profile Photo</label>
                    <div className="flex flex-col items-center">
                      {formData.profilePhoto ? (
                        <img
                          src={formData.profilePhoto}
                          alt="Profile"
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                          <Camera className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <label className="mt-2 p-8 cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        <Upload className="inline-block w-4 h-4 mr-2" />
                        Upload
                        <input
                          type="file"
                          name="profilePhoto"
                          onChange={handleFileChange}
                          className="hidden"
                          accept="image/*"
                        />
                      </label>
                    </div>
                  </div>

                  {formData.type === 'driver' && (
                    <div className="space-y-2">
                      <label className="block text-center text-sm font-medium text-gray-700">License Photo</label>
                      <div className="flex flex-col items-center">
                        {formData.licensePhoto ? (
                          <img
                            src={formData.licensePhoto}
                            alt="License"
                            className="w-24 h-24 object-cover border border-gray-300 rounded-lg"
                          />
                        ) : (
                          <div className="w-24 h-24 bg-gray-200 border border-gray-300 rounded-lg flex items-center justify-center">
                            <FileText className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <label className="mt-2 p-8 cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                          <Upload className="inline-block w-4 h-4 mr-2" />
                          Upload
                          <input
                            type="file"
                            name="licensePhoto"
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-center text-sm font-medium text-gray-700">Aadhaar Photo</label>
                    <div className="flex flex-col items-center">
                      {formData.aadhaarPhoto ? (
                        <img
                          src={formData.aadhaarPhoto}
                          alt="Aadhaar"
                          className="w-24 h-24 object-cover border border-gray-300 rounded-lg"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-200 border border-gray-300 rounded-lg flex items-center justify-center">
                          <Award className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <label className="mt-2 p-8 cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        <Upload className="inline-block w-4 h-4 mr-2" />
                        Upload
                        <input
                          type="file"
                          name="aadhaarPhoto"
                          onChange={handleFileChange}
                          className="hidden"
                          accept="image/*"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="form-grid">
                  <div className='form-group'>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                 <div className='form-group'>
                    <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      name="contact"
                      id="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                <div className='form-group'>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                 <div className='form-group'>
                    <label htmlFor="aadhaarNumber" className="block text-sm font-medium text-gray-700">
                      Aadhaar Number
                    </label>
                    <input
                      type="text"
                      name="aadhaarNumber"
                      id="aadhaarNumber"
                      value={formData.aadhaarNumber}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  {formData.type === 'driver' && (
                   <div className='form-group'>
                      <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
                        Driving License Number
                      </label>
                      <input
                        type="text"
                        name="licenseNumber"
                        id="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  )}

                <div className='form-group'>
                    <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700">
                      Blood Group
                    </label>
                    <select
                      name="bloodGroup"
                      id="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                 <div className='form-group'>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      name="status"
                      id="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="on_leave">On Leave</option>
                    </select>
                  </div>

                 <div className='form-group'>
                    <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
                      Salary
                    </label>
                    <input
                      type="text"
                      name="salary"
                      id="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Address */}
               <div className='form-group'>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    name="address"
                    id="address"
                    rows={3}
                    value={formData.address}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Emergency Contact */}
                <div className="form-grid">
                  <div className='form-group'>
                    <label htmlFor="emergencyContactName" className="block text-sm font-medium text-gray-700">
                      Emergency Contact Name
                    </label>
                    <input
                      type="text"
                      name="emergencyContactName"
                      id="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className='form-group'>
                    <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700">
                      Emergency Contact Number
                    </label>
                    <input
                      type="tel"
                      name="emergencyContact"
                      id="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Experience */}
               <div className='form-group'>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                    Experience
                  </label>
                  <input
                    type="text"
                    name="experience"
                    id="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-4 mt-4 pt-6">
                  <button
                    type="button"
                    onClick={resetForm}
                    className=" secondary-btn "
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="primary-btn"
                  >
                    {editingId ? 'Update' : 'Save'} {formData.type === 'driver' ? 'Driver' : 'Helper'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {viewModalOpen && currentViewItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className=" modal-overlay"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
               className=" modal-container"
            >
             
              <div className="bg-white  modal-header border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentViewItem.type === 'driver' ? 'Driver' : 'Helper'} Details
                </h2>
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6 modal-form">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    {currentViewItem.profilePhoto ? (
                      <img
                        src={currentViewItem.profilePhoto}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center border-4 border-blue-100">
                        <span className="text-white font-medium text-4xl">
                          {currentViewItem.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold text-gray-900">{currentViewItem.name}</h3>
                    <div className="flex items-center mt-2">
                      <span className={`inline-flex px-2 p-4 py-1 text-xs font-semibold rounded-full ${getStatusColor(currentViewItem.status)}`}>
                        {currentViewItem.status.replace('_', ' ')}
                      </span>
                      <span className="ml-2 text-sm text-gray-600">
                        ID: {currentViewItem.id}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <Phone className="w-5 h-5 text-gray-500 mr-2" />
                        <span className="text-gray-700">{currentViewItem.contact}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                        <span className="text-gray-700">
                          Joined: {new Date(currentViewItem.hireDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Award className="w-5 h-5 text-gray-500 mr-2" />
                        <span className="text-gray-700">
                          Experience: {currentViewItem.experience}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-5 h-5 text-gray-500 mr-2">₹</span>
                        <span className="text-gray-700">
                          Salary: {currentViewItem.salary}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <MapPin className="w-5 h-5 text-blue-500 mr-2" />
                      Assignment Details
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <Bus className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Vehicle</p>
                          <p className="text-sm text-gray-600">
                            {currentViewItem.assignedVehicle || 'Not assigned'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Route</p>
                          <p className="text-sm text-gray-600">
                            {currentViewItem.assignedRoute || 'Not assigned'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Completed Routes</p>
                          <p className="text-sm text-gray-600">
                            {currentViewItem.completedRoutes}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0">★</span>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Rating</p>
                          <div className="flex items-center">
                            {getRatingStars(currentViewItem.rating)}
                            <span className="ml-1 text-sm text-gray-500">({currentViewItem.rating})</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Users className="w-5 h-5 text-blue-500 mr-2" />
                      Personal Details
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <span className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0">🩸</span>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Blood Group</p>
                          <p className="text-sm text-gray-600">
                            {currentViewItem.bloodGroup || 'Not specified'}
                          </p>
                        </div>
                      </div>
                      {currentViewItem.type === 'driver' && (
                        <div className="flex items-start">
                          <FileText className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">License Number</p>
                            <p className="text-sm text-gray-600">
                              {currentViewItem.licenseNumber}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start">
                        <Award className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Aadhaar Number</p>
                          <p className="text-sm text-gray-600">
                            {currentViewItem.aadhaarNumber}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Phone className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Emergency Contact</p>
                          <p className="text-sm text-gray-600">
                            {currentViewItem.emergencyContactName} ({currentViewItem.emergencyContact})
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <MapPin className="w-5 h-5 text-blue-500 mr-2" />
                    Address
                  </h4>
                  <p className="text-sm text-gray-600 whitespace-pre-line">
                    {currentViewItem.address}
                  </p>
                </div>

                {currentViewItem.type === 'driver' && currentViewItem.licensePhoto && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <FileText className="w-5 h-5 text-blue-500 mr-2" />
                      License Photo
                    </h4>
                    <img
                      src={currentViewItem.licensePhoto}
                      alt="Driving License"
                      className="max-w-full h-auto rounded-lg border border-gray-200"
                    />
                  </div>
                )}

                {currentViewItem.aadhaarPhoto && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Award className="w-5 h-5 text-blue-500 mr-2" />
                      Aadhaar Photo
                    </h4>
                    <img
                      src={currentViewItem.aadhaarPhoto}
                      alt="Aadhaar Card"
                      className="max-w-full h-auto rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assignment Form Modal */}
      <AnimatePresence>
        {assignmentFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className=" modal-container "
            >
              <div className="modal-header
              ">
                <h2 className="text-2xl font-bold text-gray-900">Assign Vehicle & Route</h2>
                <button
                  onClick={() => setAssignmentFormOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAssignmentSubmit} className="modal-form">
                <div className="form-grid">
                  <div className='form-group'>
                    <label htmlFor="driverId" className="block text-sm font-medium text-gray-700">
                      Select Driver
                    </label>
                    <select
                      name="driverId"
                      id="driverId"
                      value={assignmentFormData.driverId}
                      onChange={(e) => setAssignmentFormData({ ...assignmentFormData, driverId: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Driver</option>
                      {staff.drivers.map(driver => (
                        <option key={driver.id} value={driver.id}>
                          {driver.name} ({driver.licenseNumber})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='form-group'>
                    <label htmlFor="helperId" className="block text-sm font-medium text-gray-700">
                      Select Helper
                    </label>
                    <select
                      name="helperId"
                      id="helperId"
                      value={assignmentFormData.helperId}
                      onChange={(e) => setAssignmentFormData({ ...assignmentFormData, helperId: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Helper</option>
                      {staff.helpers.map(helper => (
                        <option key={helper.id} value={helper.id}>
                          {helper.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='form-group'>
                    <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700">
                      Select Vehicle
                    </label>
                    <select
                      name="vehicleId"
                      id="vehicleId"
                      value={assignmentFormData.vehicleId}
                      onChange={(e) => setAssignmentFormData({ ...assignmentFormData, vehicleId: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Vehicle</option>
                      {vehicles.filter(v => v.status === 'active').map(vehicle => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.registration} ({vehicle.type})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='form-group'>
                    <label htmlFor="routeId" className="block text-sm font-medium text-gray-700">
                      Select Route
                    </label>
                    <select
                      name="routeId"
                      id="routeId"
                      value={assignmentFormData.routeId}
                      onChange={(e) => setAssignmentFormData({ ...assignmentFormData, routeId: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Route</option>
                      {routes.map(route => (
                        <option key={route.id} value={route.id}>
                          {route.name} ({route.startPoint} to {route.endPoint})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='form-group'>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                      Assignment Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      id="date"
                      value={assignmentFormData.date}
                      onChange={(e) => setAssignmentFormData({ ...assignmentFormData, date: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex form-actions justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setAssignmentFormOpen(false)}
                    className="secondary-btn"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="primary-btn
                    "
                  >
                    Assign Vehicle & Route
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

export default DriverManagement;