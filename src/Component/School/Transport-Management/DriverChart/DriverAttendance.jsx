import React, { useRef, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  BarElement, 
  LineElement, 
  PointElement, 
  BarController, 
  LineController, 
  CategoryScale, 
  LinearScale, 
  Tooltip, 
  Legend,
  Filler,
  ArcElement,
  DoughnutController
} from 'chart.js';
import { Calendar, Clock, UserCheck, UserX, AlertTriangle } from 'lucide-react';
import './DriverAttendance.css';

ChartJS.register(
  BarElement, 
  LineElement, 
  PointElement, 
  BarController, 
  LineController, 
  CategoryScale, 
  LinearScale, 
  Tooltip, 
  Legend,
  Filler,
  ArcElement,
  DoughnutController
);

const DriverAttendance = () => {
  // Chart refs
  const weeklyChartRef = useRef(null);
  const monthlyTrendChartRef = useRef(null);

  // Chart instances
  let weeklyChart, monthlyTrendChart, statusChart, timeChart;

  // Data
  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    present: [18, 17, 19, 20, 18, 15, 12],
    absent: [2, 3, 1, 0, 2, 5, 8]
  };

  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    attendance: [92, 94, 95, 93, 96, 91, 89, 93, 95, 96, 94, 93]
  };

 

  // Initialize charts
  useEffect(() => {
    // Weekly Attendance Bar Chart
    if (weeklyChartRef.current) {
      const ctx = weeklyChartRef.current.getContext('2d');
      weeklyChart = new ChartJS(ctx, {
        type: 'bar',
        data: {
          labels: weeklyData.labels,
          datasets: [
            {
              label: 'Present',
              data: weeklyData.present,
              backgroundColor: 'rgba(74, 222, 128, 0.8)',
              borderRadius: 6,
              borderWidth: 0
            },
            {
              label: 'Absent',
              data: weeklyData.absent,
              backgroundColor: 'rgba(248, 113, 113, 0.8)',
              borderRadius: 6,
              borderWidth: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                stepSize: 5
              }
            }
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: '#6b7280',
                font: {
                  size: 12
                },
                usePointStyle: true,
                padding: 20
              }
            },
            tooltip: {
              backgroundColor: '#1f2937',
              titleColor: '#f9fafb',
              bodyColor: '#f9fafb',
              borderColor: '#4b5563',
              borderWidth: 1,
              padding: 12,
              usePointStyle: true,
              callbacks: {
                label: function(context) {
                  return `${context.dataset.label}: ${context.raw} drivers`;
                }
              }
            }
          },
          interaction: {
            intersect: false,
            mode: 'index'
          }
        }
      });
    }

    // Monthly Trend Line Chart
    if (monthlyTrendChartRef.current) {
      const ctx = monthlyTrendChartRef.current.getContext('2d');
      monthlyTrendChart = new ChartJS(ctx, {
        type: 'line',
        data: {
          labels: monthlyData.labels,
          datasets: [{
            label: 'Attendance Rate %',
            data: monthlyData.attendance,
            borderColor: 'rgba(99, 102, 241, 1)',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            borderWidth: 3,
            pointBackgroundColor: 'rgba(99, 102, 241, 1)',
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.3,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              min: 80,
              max: 100,
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                callback: function(value) {
                  return value + '%';
                }
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: '#1f2937',
              titleColor: '#f9fafb',
              bodyColor: '#f9fafb',
              borderColor: '#4b5563',
              borderWidth: 1,
              padding: 12,
              callbacks: {
                label: function(context) {
                  return `Attendance: ${context.raw}%`;
                }
              }
            }
          }
        }
      });
    }

   

    // Cleanup function
    return () => {
      if (weeklyChart) weeklyChart.destroy();
      if (monthlyTrendChart) monthlyTrendChart.destroy();
      if (statusChart) statusChart.destroy();
      if (timeChart) timeChart.destroy();
    };
  }, []);

  // Stats cards data
  const stats = [
    {
      title: "Total Drivers",
      value: "25",
      icon: <UserCheck size={24} />,
      color: "bg-indigo-100 text-indigo-600"
    },
    {
      title: "Present Today",
      value: "20",
      icon: <UserCheck size={24} />,
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Absent Today",
      value: "3",
      icon: <UserX size={24} />,
      color: "bg-red-100 text-red-600"
    },
    {
      title: "Late Arrivals",
      value: "2",
      icon: <AlertTriangle size={24} />,
      color: "bg-amber-100 text-amber-600"
    }
  ];

  return (
    <div className="attendance-dashboard">
      <h1 className="dashboard-header">
        Driver Attendance 
      </h1>
      
      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.color}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <h3 className="stat-title">{stat.title}</h3>
              <p className="stat-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="charts-grid">
        {/* Weekly Attendance */}
        <div className="chart-container">
          <h2 className="chart-title">Weekly Attendance</h2>
          <div className="chart-wrapper">
            <canvas ref={weeklyChartRef}></canvas>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="chart-container">
          <h2 className="chart-title">Monthly Trend</h2>
          <div className="chart-wrapper">
            <canvas ref={monthlyTrendChartRef}></canvas>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DriverAttendance;