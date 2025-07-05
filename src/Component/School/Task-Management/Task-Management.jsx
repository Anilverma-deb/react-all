import React, { useState, useEffect } from 'react';
import './Task-Management.css';

const TaskManagementDashboard = () => {
  // State for tasks
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: '',
    status: 'pending'
  });
  
  // State for filters
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for UI
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  
  // Sample staff data
  const staffMembers = [
    { id: 1, name: 'Rahul Sharma' },
    { id: 2, name: 'Priya Patel' },
    { id: 3, name: 'Amit Singh' },
    { id: 4, name: 'Neha Gupta' },
    { id: 5, name: 'Vikram Joshi' }
  ];

  // Load sample tasks on component mount
  useEffect(() => {
    const sampleTasks = [
      {
        id: 1,
        title: 'Prepare Annual Report',
        description: 'Compile all department reports for the academic year',
        assignedTo: 'Rahul Sharma',
        priority: 'high',
        dueDate: '2023-06-15',
        status: 'in-progress',
        createdAt: '2023-05-20'
      },
      {
        id: 2,
        title: 'Update Student Records',
        description: 'Verify and update all student records for new session',
        assignedTo: 'Priya Patel',
        priority: 'medium',
        dueDate: '2023-06-10',
        status: 'pending',
        createdAt: '2023-05-18'
      },
      {
        id: 3,
        title: 'Organize Parent-Teacher Meeting',
        description: 'Schedule and arrange logistics for PTM',
        assignedTo: 'Amit Singh',
        priority: 'high',
        dueDate: '2023-06-05',
        status: 'completed',
        createdAt: '2023-05-15'
      },
      {
        id: 4,
        title: 'Inventory Check',
        description: 'Audit all school equipment and supplies',
        assignedTo: 'Neha Gupta',
        priority: 'low',
        dueDate: '2023-06-20',
        status: 'pending',
        createdAt: '2023-05-22'
      }
    ];
    setTasks(sampleTasks);
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  // Add new task
  const addTask = (e) => {
    e.preventDefault();
    const task = {
      ...newTask,
      id: tasks.length + 1,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      assignedTo: '',
      priority: 'medium',
      dueDate: '',
      status: 'pending'
    });
    setIsFormOpen(false);
  };

  // Update task status
  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  // Delete task
  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // Filter tasks based on selected filter and search term
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status === filter;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate task statistics
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length
  };

  return (
    <div id="task-management-dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-title"> Task Management</h1>
        <div className="dashboard-controls">
          <button 
            className="btn btn-primary" 
            onClick={() => setIsFormOpen(true)}
            id="add-task-btn"
          >
            <i className="fas fa-plus"></i> Add Task
          </button>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search tasks..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              id="task-search"
            />
            <i className="fas fa-search search-icon"></i>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Task Statistics Cards */}
        <div className="stats-container">
          <div className="stats-card stat-total">
            <h3>Total Tasks</h3>
            <p>{taskStats.total}</p>
          </div>
          <div className="stats-card stat-completed">
            <h3>Completed</h3>
            <p>{taskStats.completed}</p>
          </div>
          <div className="stats-card stat-progress">
            <h3>In Progress</h3>
            <p>{taskStats.inProgress}</p>
          </div>
          <div className="stats-card stat-pending">
            <h3>Pending</h3>
            <p>{taskStats.pending}</p>
          </div>
          <div className="stats-card stat-overdue">
            <h3>Overdue</h3>
            <p>{taskStats.overdue}</p>
          </div>
        </div>

        {/* Task Filter Tabs */}
        <div className="filter-tabs">
          <button 
            className={`tab-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
            id="filter-all"
          >
            All Tasks
          </button>
          <button 
            className={`tab-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
            id="filter-pending"
          >
            Pending
          </button>
          <button 
            className={`tab-btn ${filter === 'in-progress' ? 'active' : ''}`}
            onClick={() => setFilter('in-progress')}
            id="filter-in-progress"
          >
            In Progress
          </button>
          <button 
            className={`tab-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
            id="filter-completed"
          >
            Completed
          </button>
        </div>

        {/* Task List */}
        <div className="task-list-container">
          {filteredTasks.length > 0 ? (
            <ul className="task-list">
              {filteredTasks.map(task => (
                <li 
                  key={task.id} 
                  className={`task-item ${task.priority} ${task.status}`}
                  onClick={() => setActiveTask(activeTask?.id === task.id ? null : task)}
                >
                  <div className="task-main-info">
                    <div className="task-status">
                      <input
                        type="checkbox"
                        checked={task.status === 'completed'}
                        onChange={(e) => updateTaskStatus(
                          task.id, 
                          e.target.checked ? 'completed' : 'pending'
                        )}
                        id={`task-checkbox-${task.id}`}
                      />
                      <span className={`status-indicator ${task.status}`}></span>
                    </div>
                    <div className="task-details">
                      <h3 className="task-title">{task.title}</h3>
                      <p className="task-assigned">Assigned to: {task.assignedTo}</p>
                      <div className="task-meta">
                        <span className={`priority-badge ${task.priority}`}>
                          {task.priority}
                        </span>
                        <span className="due-date">
                          <i className="far fa-calendar-alt"></i> {task.dueDate}
                        </span>
                      </div>
                    </div>
                    <button 
                      className="btn-delete-task"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(task.id);
                      }}
                      id={`delete-task-${task.id}`}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                  
                  {activeTask?.id === task.id && (
                    <div className="task-expanded-info">
                      <p className="task-description">{task.description}</p>
                      <div className="task-actions">
                        <select
                          value={task.status}
                          onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                          className="status-select"
                          id={`status-select-${task.id}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                        <span className="task-created">
                          Created: {task.createdAt}
                        </span>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-tasks-message">
              <i className="far fa-clipboard"></i>
              <p>No tasks found matching your criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      {isFormOpen && (
        <div className="modal-overlay">
          <div className="task-form-modal">
            <div className="modal-header">
              <h2>Add New Task</h2>
              <button 
                className="btn-close-modal"
                onClick={() => setIsFormOpen(false)}
                id="close-modal-btn"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={addTask} className="task-form">
              <div className="form-group">
                <label htmlFor="task-title">Task Title</label>
                <input
                  type="text"
                  id="task-title"
                  name="title"
                  value={newTask.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="task-description">Description</label>
                <textarea
                  id="task-description"
                  name="description"
                  value={newTask.description}
                  onChange={handleInputChange}
                  rows="3"
                ></textarea>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="task-assigned">Assign To</label>
                  <select
                    id="task-assigned"
                    name="assignedTo"
                    value={newTask.assignedTo}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Staff</option>
                    {staffMembers.map(staff => (
                      <option key={staff.id} value={staff.name}>
                        {staff.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="task-priority">Priority</label>
                  <select
                    id="task-priority"
                    name="priority"
                    value={newTask.priority}
                    onChange={handleInputChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="task-due-date">Due Date</label>
                  <input
                    type="date"
                    id="task-due-date"
                    name="dueDate"
                    value={newTask.dueDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="task-status">Status</label>
                  <select
                    id="task-status"
                    name="status"
                    value={newTask.status}
                    onChange={handleInputChange}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagementDashboard;