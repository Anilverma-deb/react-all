
import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
// import * as XLSX from 'xlsx';
// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';
import './TransportReport.css';

const TransportReport = () => {
  const [activeTab, setActiveTab] = useState('busUsage');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [filterRoute, setFilterRoute] = useState('all');
  const [filterDriver, setFilterDriver] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [reports, setReports] = useState({
    busUsage: [],
    driverAttendance: [],
    studentUsage: [],
    feeCollection: [],
    maintenanceLogs: []
  });

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    setIsLoading(true);
    // Simulate API fetch
    setTimeout(() => {
      setReports({
        busUsage: [
          { id: 1, busNumber: 'BUS-001', status: 'running', route: 'Route A', lastUpdate: '2025-06-24 08:30' },
          { id: 2, busNumber: 'BUS-002', status: 'idle', route: 'Route B', lastUpdate: '2025-06-24 09:15' },
          { id: 3, busNumber: 'BUS-003', status: 'repair', route: 'Route C', lastUpdate: '2025-06-23 14:20' },
          { id: 4, busNumber: 'BUS-004', status: 'running', route: 'Route A', lastUpdate: '2025-06-24 10:45' },
          { id: 5, busNumber: 'BUS-005', status: 'idle', route: 'Route D', lastUpdate: '2025-06-24 11:30' },
        ],
        driverAttendance: [
          { id: 1, driverName: 'John Smith', date: '2025-06-24', busAssigned: 'BUS-001', shift: 'morning', status: 'present' },
          { id: 2, driverName: 'Robert Johnson', date: '2025-06-24', busAssigned: 'BUS-002', shift: 'afternoon', status: 'absent' },
          { id: 3, driverName: 'Michael Brown', date: '2025-06-24', busAssigned: 'BUS-003', shift: 'morning', status: 'present' },
          { id: 4, driverName: 'David Wilson', date: '2025-06-23', busAssigned: 'BUS-004', shift: 'evening', status: 'present' },
          { id: 5, driverName: 'James Davis', date: '2025-06-23', busAssigned: 'BUS-005', shift: 'morning', status: 'late' },
        ],
        studentUsage: [
          { id: 1, route: 'Route A', studentsAssigned: 45, pickupPoints: 5, area: 'Downtown' },
          { id: 2, route: 'Route B', studentsAssigned: 32, pickupPoints: 4, area: 'Suburb East' },
          { id: 3, route: 'Route C', studentsAssigned: 28, pickupPoints: 3, area: 'Suburb West' },
          { id: 4, route: 'Route D', studentsAssigned: 38, pickupPoints: 6, area: 'Uptown' },
          { id: 5, route: 'Route E', studentsAssigned: 25, pickupPoints: 3, area: 'Midtown' },
        ],
        feeCollection: [
          { id: 1, month: 'June 2025', collectedAmount: 125000, students: 510, pendingAmount: 15000 },
          { id: 2, month: 'May 2025', collectedAmount: 120000, students: 505, pendingAmount: 10000 },
          { id: 3, month: 'April 2025', collectedAmount: 118000, students: 498, pendingAmount: 12000 },
          { id: 4, month: 'March 2025', collectedAmount: 115000, students: 490, pendingAmount: 18000 },
          { id: 5, month: 'February 2025', collectedAmount: 110000, students: 485, pendingAmount: 20000 },
        ],
        maintenanceLogs: [
          { id: 1, busNumber: 'BUS-003', issue: 'Engine check', dateReported: '2025-06-20', status: 'in-progress', estimatedCompletion: '2025-06-27' },
          { id: 2, busNumber: 'BUS-007', issue: 'Tire replacement', dateReported: '2025-06-18', status: 'completed', completionDate: '2025-06-19' },
          { id: 3, busNumber: 'BUS-001', issue: 'Brake inspection', dateReported: '2025-06-15', status: 'completed', completionDate: '2025-06-16' },
          { id: 4, busNumber: 'BUS-005', issue: 'AC servicing', dateReported: '2025-06-10', status: 'completed', completionDate: '2025-06-12' },
          { id: 5, busNumber: 'BUS-002', issue: 'Oil change', dateReported: '2025-06-05', status: 'completed', completionDate: '2025-06-05' },
        ]
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setIsLoading(true);
    // In a real app, this would trigger an API call with the filters
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const title = `Transport Report - ${getReportTitle(activeTab)}`;
    const dateText = `Date Range: ${dateRange.start} to ${dateRange.end}`;
    
    doc.setFontSize(18);
    doc.text(title, 14, 15);
    doc.setFontSize(12);
    doc.text(dateText, 14, 25);
    
    const headers = getHeadersForReport(activeTab);
    const data = getDataForExport(activeTab);
    
    doc.autoTable({
      head: [headers],
      body: data,
      startY: 30,
      styles: {
        fontSize: 10,
        cellPadding: 2,
        valign: 'middle'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });
    
    doc.save(`Transport_Report_${activeTab}_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const exportToExcel = () => {
    const data = getDataForExport(activeTab);
    const headers = getHeadersForReport(activeTab);
    
    const ws = XLSX.utils.json_to_sheet([headers], { skipHeader: true });
    XLSX.utils.sheet_add_json(ws, data, { skipHeader: true, origin: 'A2' });
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, getReportTitle(activeTab));
    
    XLSX.writeFile(wb, `Transport_Report_${activeTab}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const getHeadersForReport = (reportType) => {
    switch (reportType) {
      case 'busUsage':
        return ['Bus Number', 'Status', 'Route', 'Last Update'];
      case 'driverAttendance':
        return ['Driver Name', 'Date', 'Bus Assigned', 'Shift', 'Status'];
      case 'studentUsage':
        return ['Route', 'Students Assigned', 'Pickup Points', 'Area'];
      case 'feeCollection':
        return ['Month', 'Collected Amount', 'Students', 'Pending Amount'];
      case 'maintenanceLogs':
        return ['Bus Number', 'Issue', 'Date Reported', 'Status', 'Completion'];
      default:
        return [];
    }
  };

  const getDataForExport = (reportType) => {
    return reports[reportType].map(item => {
      switch (reportType) {
        case 'busUsage':
          return [item.busNumber, item.status, item.route, item.lastUpdate];
        case 'driverAttendance':
          return [item.driverName, item.date, item.busAssigned, item.shift, item.status];
        case 'studentUsage':
          return [item.route, item.studentsAssigned, item.pickupPoints, item.area];
        case 'feeCollection':
          return [item.month, `$${item.collectedAmount.toLocaleString()}`, item.students, `$${item.pendingAmount.toLocaleString()}`];
        case 'maintenanceLogs':
          return [
            item.busNumber, 
            item.issue, 
            item.dateReported, 
            item.status, 
            item.status === 'completed' ? item.completionDate : item.estimatedCompletion || 'N/A'
          ];
        default:
          return [];
      }
    });
  };

  const getReportTitle = (reportType) => {
    const titles = {
      busUsage: 'Bus Usage Report',
      driverAttendance: 'Driver Attendance Report',
      studentUsage: 'Student Transport Usage',
      feeCollection: 'Fee Collection Report',
      maintenanceLogs: 'Maintenance Logs'
    };
    return titles[reportType] || 'Report';
  };

  const renderReportTable = () => {
    if (isLoading) {
      return (
        <div className="transport-report__loading">
          <div className="transport-report__spinner"></div>
          <p>Loading report data...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'busUsage':
        return (
          <table className="transport-report__table">
            <thead>
              <tr>
                <th>Bus Number</th>
                <th>Status</th>
                <th>Route</th>
                <th>Last Update</th>
              </tr>
            </thead>
            <tbody>
              {reports.busUsage.map(bus => (
                <tr key={bus.id}>
                  <td>{bus.busNumber}</td>
                  <td>
                    <span className={`transport-report__status transport-report__status--${bus.status}`}>
                      {bus.status}
                    </span>
                  </td>
                  <td>{bus.route}</td>
                  <td>{bus.lastUpdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'driverAttendance':
        return (
          <table className="transport-report__table">
            <thead>
              <tr>
                <th>Driver Name</th>
                <th>Date</th>
                <th>Bus Assigned</th>
                <th>Shift</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.driverAttendance.map(driver => (
                <tr key={driver.id}>
                  <td>{driver.driverName}</td>
                  <td>{driver.date}</td>
                  <td>{driver.busAssigned}</td>
                  <td>{driver.shift}</td>
                  <td>
                    <span className={`transport-report__status transport-report__status--${driver.status}`}>
                      {driver.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'studentUsage':
        return (
          <table className="transport-report__table">
            <thead>
              <tr>
                <th>Route</th>
                <th>Students Assigned</th>
                <th>Pickup Points</th>
                <th>Area</th>
              </tr>
            </thead>
            <tbody>
              {reports.studentUsage.map(route => (
                <tr key={route.id}>
                  <td>{route.route}</td>
                  <td>{route.studentsAssigned}</td>
                  <td>{route.pickupPoints}</td>
                  <td>{route.area}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'feeCollection':
        return (
          <table className="transport-report__table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Collected Amount</th>
                <th>Students</th>
                <th>Pending Amount</th>
              </tr>
            </thead>
            <tbody>
              {reports.feeCollection.map(fee => (
                <tr key={fee.id}>
                  <td>{fee.month}</td>
                  <td>${fee.collectedAmount.toLocaleString()}</td>
                  <td>{fee.students}</td>
                  <td>${fee.pendingAmount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'maintenanceLogs':
        return (
          <table className="transport-report__table">
            <thead>
              <tr>
                <th>Bus Number</th>
                <th>Issue</th>
                <th>Date Reported</th>
                <th>Status</th>
                <th>Completion</th>
              </tr>
            </thead>
            <tbody>
              {reports.maintenanceLogs.map(log => (
                <tr key={log.id}>
                  <td>{log.busNumber}</td>
                  <td>{log.issue}</td>
                  <td>{log.dateReported}</td>
                  <td>
                    <span className={`transport-report__status transport-report__status--${log.status}`}>
                      {log.status}
                    </span>
                  </td>
                  <td>
                    {log.status === 'completed' ? log.completionDate : log.estimatedCompletion || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      default:
        return null;
    }
  };

  return (
    <div className="transport-report">
      <h2 className="transport-report__title">Transport Reports</h2>
      
      <div className="transport-report__filters">
        <div className="transport-report__date-range">
          <label htmlFor="startDate">From:</label>
          <input
            type="date"
            id="startDate"
            name="start"
            value={dateRange.start}
            onChange={handleDateChange}
            className="transport-report__date-input"
          />
          
          <label htmlFor="endDate">To:</label>
          <input
            type="date"
            id="endDate"
            name="end"
            value={dateRange.end}
            onChange={handleDateChange}
            className="transport-report__date-input"
          />
        </div>
        
        <div className="transport-report__additional-filters">
          <select
            value={filterRoute}
            onChange={(e) => setFilterRoute(e.target.value)}
            className="transport-report__select"
          >
            <option value="all">All Routes</option>
            <option value="Route A">Route A</option>
            <option value="Route B">Route B</option>
            <option value="Route C">Route C</option>
            <option value="Route D">Route D</option>
          </select>
          
          <select
            value={filterDriver}
            onChange={(e) => setFilterDriver(e.target.value)}
            className="transport-report__select"
          >
            <option value="all">All Drivers</option>
            <option value="John Smith">John Smith</option>
            <option value="Robert Johnson">Robert Johnson</option>
            <option value="Michael Brown">Michael Brown</option>
            <option value="David Wilson">David Wilson</option>
          </select>
          
          <button 
            onClick={applyFilters}
            className="transport-report__apply-btn"
          >
            Apply Filters
          </button>
        </div>
      </div>
      
      <div className="transport-report__tabs">
        <button
          className={`transport-report__tab ${activeTab === 'busUsage' ? 'transport-report__tab--active' : ''}`}
          onClick={() => setActiveTab('busUsage')}
        >
          Bus Usage
        </button>
        <button
          className={`transport-report__tab ${activeTab === 'driverAttendance' ? 'transport-report__tab--active' : ''}`}
          onClick={() => setActiveTab('driverAttendance')}
        >
          Driver Attendance
        </button>
        <button
          className={`transport-report__tab ${activeTab === 'studentUsage' ? 'transport-report__tab--active' : ''}`}
          onClick={() => setActiveTab('studentUsage')}
        >
          Student Usage
        </button>
        <button
          className={`transport-report__tab ${activeTab === 'feeCollection' ? 'transport-report__tab--active' : ''}`}
          onClick={() => setActiveTab('feeCollection')}
        >
          Fee Collection
        </button>
        <button
          className={`transport-report__tab ${activeTab === 'maintenanceLogs' ? 'transport-report__tab--active' : ''}`}
          onClick={() => setActiveTab('maintenanceLogs')}
        >
          Maintenance Logs
        </button>
      </div>
      
      <div className="transport-report__actions">
        <button 
          onClick={exportToPDF}
          className="transport-report__export-btn transport-report__export-btn--pdf"
        >
          Export to PDF
        </button>
        <button 
          onClick={exportToExcel}
          className="transport-report__export-btn transport-report__export-btn--excel"
        >
          Export to Excel
        </button>
      </div>
      
      <div className="transport-report__content">
        <h3 className="transport-report__subtitle">{getReportTitle(activeTab)}</h3>
        {renderReportTable()}
      </div>
    </div>
  );
};

export default TransportReport;
