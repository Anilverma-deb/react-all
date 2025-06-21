import React, { useState } from 'react';
import { ChevronDown, MoreHorizontal, Download, RefreshCw, Eye, Trophy, Medal, Award } from 'lucide-react';
import './performance.css'
const Performance = () => {
  const [selectedSemester, setSelectedSemester] = useState('Fall 2024');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  const semesters = ['Fall 2024', 'Spring 2024', 'Summer 2024', 'Fall 2023'];

  const topCustomers = [
    {
      id: 1,
      name: 'Alex Brooks',
      email: 'alex.brooks@email.com',
      amount: '7th',
      score: 90,
      rank: 1,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      color: 'excellent'
    },
    {
      id: 2,
      name: 'Maya Rodriguez',
      email: 'maya.rodriguez@email.com',
      amount: '8th',
      score: 80,
      rank: 2,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      color: 'good'
    },
    {
      id: 3,
      name: 'Connor Patel',
      email: 'connor.patel@email.com',
      amount: '4th',
      score: 70,
      rank: 3,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      color: 'good'
    }
  ];

  const otherCustomers = [
    {
      id: 4,
      name: 'Monica Bellas',
      email: 'bellas@gmail.com',
      amount: '5th',
      score: 65,
      rank: 4,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      color: 'average'
    },
    {
      id: 5,
      name: 'Zoe Thompson',
      email: 'zoe.thompson@email.com',
      amount: '4th',
      score: 60,
      rank: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      color: 'warning'
    },
    {
      id: 6,
      name: 'Olivia Li',
      email: 'olivia.li@email.com',
      amount: '6th',
      score: 50,
      rank: 6,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      color: 'warning'
    },
    {
      id: 7,
      name: 'Jackson Kim',
      email: 'jackson.kim@email.com',
      amount: '1st',
      score: 45,
      rank: 7,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&corp=face',
      color: 'poor'
    }
  ];

  const getScoreColorClass = (color) => {
    const colors = {
      excellent: 'score-excellent',
      good: 'score-good',
      average: 'score-average',
      warning: 'score-warning',
      poor: 'score-poor'
    };
    return colors[color] || 'score-average';
  };

  const handleDownload = () => {
    console.log('Downloading customer data...');
    const data = [...topCustomers, ...otherCustomers];
    const csv = 'Name,Email,Amount,Score,Rank\n' + 
                data.map(c => `${c.name},${c.email},${c.amount},${c.score}%,${c.rank}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'top-customers.csv';
    a.click();
    setShowOptionsMenu(false);
  };

  const handleRefresh = () => {
    console.log('Refreshing data...');
    window.location.reload();
    setShowOptionsMenu(false);
  };

  const handleViewAll = () => {
    console.log('Viewing all customers...');
    setShowOptionsMenu(false);
  };

  return (
    <div className="top-customers-dashboard">
      <div className="dashboard-card fade-in">
        {/* Header */}
        <div className="dashboard-header">
          <h3 className="dashboard-title">Top Performers</h3>
          
          <div className="control-group">
            {/* Semester Selector */}
            <div className="semester-selector">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="semester-btn"
              >
                {selectedSemester}
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {showDropdown && (
                <div className="dropdown-menu">
                  {semesters.map((semester) => (
                    <button
                      key={semester}
                      onClick={() => {
                        setSelectedSemester(semester);
                        setShowDropdown(false);
                      }}
                      className="dropdown-item"
                    >
                      {semester}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Options Menu */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                className="options-btn"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
              
              {showOptionsMenu && (
                <div className="options-menu">
                  <button
                    onClick={handleViewAll}
                    className="options-item"
                  >
                    <Eye className="h-4 w-4" />
                    View All
                  </button>
                  <button
                    onClick={handleDownload}
                    className="options-item"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                  <button
                    onClick={handleRefresh}
                    className="options-item"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="podium-container">
          {/* Top 3 Podium */}
          <div className="podium-grid">
            {/* 2nd Place */}
            <div className="podium-card podium-second slide-up">
              <div className="podium-avatar-container">
                <img
                  src={topCustomers[1].avatar}
                  alt={topCustomers[1].name}
                  className="avatar-image"
                />
                <div className="rank-badge">2</div>
              </div>
              <div className="podium-content">
                <h4 className="podium-name">{topCustomers[1].name}</h4>
                <div className="amount-badge">
                  {topCustomers[1].amount}
                </div>
                <div className="progress-container">
                  <div className="progress-header">
                    <span className="progress-label">Score</span>
                    <span className="progress-value">{topCustomers[1].score}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${getScoreColorClass(topCustomers[1].color)}`}
                      style={{ width: `${topCustomers[1].score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 1st Place */}
            <div className="podium-card podium-first slide-up">
              <div className="podium-avatar-container">
                <Trophy className="trophy-icon" />
                <img
                  src={topCustomers[0].avatar}
                  alt={topCustomers[0].name}
                  className="avatar-image"
                />
                <div className="rank-badge">1</div>
              </div>
              <div className="podium-content">
                <h4 className="podium-name">{topCustomers[0].name}</h4>
                <div className="amount-badge">
                  {topCustomers[0].amount}
                </div>
                <div className="progress-container">
                  <div className="progress-header">
                    <span className="progress-label">Score</span>
                    <span className="progress-value">{topCustomers[0].score}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${getScoreColorClass(topCustomers[0].color)}`}
                      style={{ width: `${topCustomers[0].score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="podium-card podium-third slide-up">
              <div className="podium-avatar-container">
                <img
                  src={topCustomers[2].avatar}
                  alt={topCustomers[2].name}
                  className="avatar-image"
                />
                <div className="rank-badge">3</div>
              </div>
              <div className="podium-content">
                <h4 className="podium-name">{topCustomers[2].name}</h4>
                <div className="amount-badge">
                  {topCustomers[2].amount}
                </div>
                <div className="progress-container">
                  <div className="progress-header">
                    <span className="progress-label">Score</span>
                    <span className="progress-value">{topCustomers[2].score}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${getScoreColorClass(topCustomers[2].color)}`}
                      style={{ width: `${topCustomers[2].score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Other Customers List */}
          <div className="customer-list">
            {otherCustomers.map((customer) => (
              <div key={customer.id} className="customer-item">
                <div className="customer-info">
                  <div className="customer-avatar-container">
                    <img
                      src={customer.avatar}
                      alt={customer.name}
                      className="customer-avatar"
                    />
                    <div className="customer-rank-badge">{customer.rank}</div>
                  </div>
                  <div className="customer-details">
                    <h4>{customer.name}</h4>
                    <p>{customer.email}</p>
                  </div>
                </div>

                <div className="customer-amount">
                  <div className="customer-amount-badge">
                    {customer.amount}
                  </div>
                </div>

                <div className="customer-score">
                  <div className="progress-header">
                    <span className="progress-label">Score</span>
                    <span className="progress-value">{customer.score}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${getScoreColorClass(customer.color)}`}
                      style={{ width: `${customer.score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;