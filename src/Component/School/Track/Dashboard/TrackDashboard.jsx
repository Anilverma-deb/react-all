
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Users, Award, Download, Filter, Search, Star } from 'lucide-react';
import './TrackDashboard.css'

// Sample data
const sampleData = [
    { id: 1, name: 'John Smith', role: 'student', department: 'Computer Science', rating: 4.8, attendance: 95, lastUpdate: '2024-07-01' },
    { id: 2, name: 'Sarah Johnson', role: 'staff', department: 'Mathematics', rating: 4.9, attendance: 98, lastUpdate: '2024-07-01' },
    { id: 3, name: 'Mike Wilson', role: 'student', department: 'Physics', rating: 3.2, attendance: 78, lastUpdate: '2024-07-01' },
    { id: 4, name: 'Emily Davis', role: 'staff', department: 'Chemistry', rating: 4.7, attendance: 92, lastUpdate: '2024-07-01' },
    { id: 5, name: 'Alex Brown', role: 'student', department: 'Biology', rating: 2.8, attendance: 65, lastUpdate: '2024-07-01' },
    { id: 6, name: 'Lisa Garcia', role: 'staff', department: 'English', rating: 4.6, attendance: 88, lastUpdate: '2024-07-01' },
    { id: 7, name: 'David Lee', role: 'student', department: 'History', rating: 4.3, attendance: 85, lastUpdate: '2024-07-01' },
    { id: 8, name: 'Maria Rodriguez', role: 'staff', department: 'Art', rating: 4.8, attendance: 94, lastUpdate: '2024-07-01' },
    { id: 9, name: 'James Taylor', role: 'student', department: 'Music', rating: 3.5, attendance: 72, lastUpdate: '2024-07-01' },
    { id: 10, name: 'Jennifer White', role: 'staff', department: 'Physical Education', rating: 4.4, attendance: 90, lastUpdate: '2024-07-01' }
];

const trendData = [
    { month: 'Jan', rating: 4.1, attendance: 85 },
    { month: 'Feb', rating: 4.2, attendance: 87 },
    { month: 'Mar', rating: 4.3, attendance: 89 },
    { month: 'Apr', rating: 4.4, attendance: 88 },
    { month: 'May', rating: 4.5, attendance: 90 },
    { month: 'Jun', rating: 4.6, attendance: 92 }
];

const TrackDashboardFilters = ({ filters, setFilters, onExport }) => {
    return (
        <div className="track-filters">
            <div className="filter-row">
                <div className="filter-group">
                    <select
                        value={filters.role}
                        onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                        className="filter-select"
                    >
                        <option value="">All Roles</option>
                        <option value="student">Students</option>
                        <option value="staff">Staff</option>
                    </select>
                </div>

                <div className="filter-group">
                    <select
                        value={filters.department}
                        onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                        className="filter-select"
                    >
                        <option value="">All Departments</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Biology">Biology</option>
                        <option value="English">English</option>
                        <option value="History">History</option>
                        <option value="Art">Art</option>
                        <option value="Music">Music</option>
                        <option value="Physical Education">Physical Education</option>
                    </select>
                </div>

                <div className="filter-group">
                    <input
                        type="date"
                        value={filters.dateFrom}
                        onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                        className="filter-date"
                    />
                    <span className="date-separator">to</span>
                    <input
                        type="date"
                        value={filters.dateTo}
                        onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                        className="filter-date"
                    />
                </div>

                <div className="filter-group search-group">
                    <Search className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className="search-input"
                    />
                </div>

                <button onClick={onExport} className="export-btn">
                    <Download size={16} />
                    Export
                </button>
            </div>
        </div>
    );
};

const SummaryCard = ({ title, value, icon: Icon, trend, color }) => {
    return (
        <div className={`summary-card ${color}`}>
            <div className="card-content">
                <div className="card-header">
                    <Icon className="card-icon" />
                    <span className="card-title">{title}</span>
                </div>
                <div className="card-value">{value}</div>
                {trend && (
                    <div className={`card-trend ${trend > 0 ? 'positive' : 'negative'}`}>
                        {trend > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        <span>{Math.abs(trend)}%</span>
                    </div>
                )}
            </div>
        </div>
    );
};

const RatingDistributionChart = ({ data }) => {
    const ratingDistribution = [
        { rating: '5.0', count: data.filter(d => d.rating >= 4.5).length },
        { rating: '4.0-4.4', count: data.filter(d => d.rating >= 4.0 && d.rating < 4.5).length },
        { rating: '3.0-3.9', count: data.filter(d => d.rating >= 3.0 && d.rating < 4.0).length },
        { rating: '2.0-2.9', count: data.filter(d => d.rating >= 2.0 && d.rating < 3.0).length },
        { rating: '1.0-1.9', count: data.filter(d => d.rating >= 1.0 && d.rating < 2.0).length }
    ];

    return (
        <div className="chart-card">
            <h3 className="chart-title">Rating Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ratingDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rating" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

const PerformanceTrendChart = () => {
    return (
        <div className="chart-card">
            <h3 className="chart-title">Performance Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="rating" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="attendance" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

const TopPerformerCard = ({ data }) => {
    const topPerformer = data.reduce((max, person) =>
        (person.rating + person.attendance / 100) > (max.rating + max.attendance / 100) ? person : max
    );

    return (
        <div className="top-performer-card">
            <div className="performer-header">
                <Award className="award-icon" />
                <h3>Top Performer</h3>
            </div>
            <div className="performer-content">
                <div className="performer-avatar">
                    {topPerformer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="performer-details">
                    <h4>{topPerformer.name}</h4>
                    <p className="performer-role">{topPerformer.role} • {topPerformer.department}</p>
                    <div className="performer-stats">
                        <div className="stat">
                            <Star className="stat-icon" />
                            <span>{topPerformer.rating}/5.0</span>
                        </div>
                        <div className="stat">
                            <TrendingUp className="stat-icon" />
                            <span>{topPerformer.attendance}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LowPerformerList = ({ data }) => {
    const lowPerformers = data
        .filter(person => person.rating < 3.5 || person.attendance < 80)
        .sort((a, b) => (a.rating + a.attendance / 100) - (b.rating + b.attendance / 100));

    return (
        <div className="low-performer-list">
            <h3 className="list-title">
                <TrendingDown className="warning-icon" />
                Needs Attention ({lowPerformers.length})
            </h3>
            <div className="performer-items">
                {lowPerformers.map(person => (
                    <div key={person.id} className="performer-item">
                        <div className="item-avatar">
                            {person.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="item-details">
                            <h4>{person.name}</h4>
                            <p>{person.role} • {person.department}</p>
                            <div className="warning-flags">
                                {person.rating < 3.5 && <span className="flag rating-flag">Low Rating</span>}
                                {person.attendance < 80 && <span className="flag attendance-flag">Poor Attendance</span>}
                            </div>
                        </div>
                        <div className="item-stats">
                            <span className="stat-value">{person.rating}/5.0</span>
                            <span className="stat-value">{person.attendance}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DataTable = ({ data }) => {
    return (
        <div className="data-table-container">
            <h3 className="table-title">All Records</h3>
            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Department</th>
                            <th>Rating</th>
                            <th>Attendance</th>
                            <th>Last Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(person => (
                            <tr key={person.id} className="table-row">
                                <td className="name-cell">
                                    <div className="name-avatar">
                                        {person.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    {person.name}
                                </td>
                                <td>
                                    <span className={`role-badge ${person.role}`}>
                                        {person.role}
                                    </span>
                                </td>
                                <td>{person.department}</td>
                                <td>
                                    <div className="rating-cell">
                                        <Star className="star-icon" />
                                        {person.rating}/5.0
                                    </div>
                                </td>
                                <td>
                                    <div className={`attendance-cell ${person.attendance < 80 ? 'low' : person.attendance > 90 ? 'high' : 'medium'}`}>
                                        {person.attendance}%
                                    </div>
                                </td>
                                <td>{person.lastUpdate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const TrackDashboard = () => {
    const [data, setData] = useState(sampleData);
    const [filteredData, setFilteredData] = useState(sampleData);
    const [filters, setFilters] = useState({
        role: '',
        department: '',
        dateFrom: '',
        dateTo: '',
        search: ''
    });

    useEffect(() => {
        let filtered = data;

        if (filters.role) {
            filtered = filtered.filter(item => item.role === filters.role);
        }

        if (filters.department) {
            filtered = filtered.filter(item => item.department === filters.department);
        }

        if (filters.search) {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        setFilteredData(filtered);
    }, [filters, data]);

    const handleExport = () => {
        const csvContent = [
            ['Name', 'Role', 'Department', 'Rating', 'Attendance', 'Last Updated'],
            ...filteredData.map(item => [
                item.name, item.role, item.department, item.rating, item.attendance, item.lastUpdate
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'track-dashboard-data.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const avgRating = filteredData.reduce((sum, item) => sum + item.rating, 0) / filteredData.length;
    const avgAttendance = filteredData.reduce((sum, item) => sum + item.attendance, 0) / filteredData.length;
    const totalTracked = filteredData.length;
    const studentsCount = filteredData.filter(item => item.role === 'student').length;

    return (
        <div className="track-dashboard">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Track Dashboard</h1>
                <p className="dashboard-subtitle">Monitor performance and attendance across your organization</p>
            </div>

            <TrackDashboardFilters
                filters={filters}
                setFilters={setFilters}
                onExport={handleExport}
            />

            <div className="summary-grid">
                <SummaryCard
                    title="Average Rating"
                    value={avgRating.toFixed(1)}
                    icon={Star}
                    trend={5.2}
                    color="blue"
                />
                <SummaryCard
                    title="Average Attendance"
                    value={`${avgAttendance.toFixed(1)}%`}
                    icon={TrendingUp}
                    trend={2.8}
                    color="green"
                />
                <SummaryCard
                    title="Total Tracked"
                    value={totalTracked}
                    icon={Users}
                    trend={12.5}
                    color="purple"
                />
                <SummaryCard
                    title="Students"
                    value={studentsCount}
                    icon={Users}
                    trend={-3.2}
                    color="orange"
                />
            </div>

            <div className="charts-grid">
                <RatingDistributionChart data={filteredData} />
                <PerformanceTrendChart />
            </div>

            <div className="performers-grid">
                <TopPerformerCard data={filteredData} />
                <LowPerformerList data={filteredData} />
            </div>

            <DataTable data={filteredData} />

        </div>
    );
};
export default TrackDashboard;
