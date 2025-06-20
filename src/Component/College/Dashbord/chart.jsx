import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Chart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Jan 12');

  const revenueData = [
    { month: 'Jan', netProfit: 50, orders: 40, returns: 35 },
    { month: 'Feb', netProfit: 45, orders: 45, returns: 40 },
    { month: 'Mar', netProfit: 40, orders: 35, returns: 45 },
    { month: 'Apr', netProfit: 45, orders: 40, returns: 35 },
    { month: 'May', netProfit: 30, orders: 20, returns: 25 },
    { month: 'Jun', netProfit: 50, orders: 35, returns: 45 },
    { month: 'July', netProfit: 35, orders: 30, returns: 40 },
    { month: 'Aug', netProfit: 40, orders: 35, returns: 40 },
    { month: 'Sep', netProfit: 55, orders: 40, returns: 45 },
    { month: 'Oct', netProfit: 35, orders: 25, returns: 35 },
    { month: 'Nov', netProfit: 50, orders: 40, returns: 25 },
    { month: 'Dec', netProfit: 60, orders: 45, returns: 50 }
  ];

  // Student Attendance data for donut chart (matching your screenshot percentages)
  const attendanceData = [
    { name: 'Present', value: 31.0, color: '#8B5CF6' },
    { name: 'Late', value: 20.0, color: '#3B82F6' },
    { name: 'Absent', value: 10.0, color: '#EF4444' },
    { name: 'Excused', value: 15.2, color: '#F97316' },
    { name: 'Holiday', value: 7.8, color: '#EAB308' },
    { name: 'Sick Leave', value: 16.0, color: '#10B981' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-8 border border-gray-200 rounded-xl shadow-xl">
          <p className="font-semibold text-gray-800 mb-2">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-8 border border-gray-200 rounded-xl shadow-xl">
          <p className="font-semibold text-gray-800">{payload[0].name}</p>
          <p style={{ color: payload[0].payload.color }} className="text-sm font-medium">
            {`${payload[0].value}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto ">
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Revenue Chart - Left Side (2 columns) */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-24 shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Average Revenue</h2>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="form-select form-select-sm focus-ring focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="Jan 12">Jan 12</option>
                <option value="Feb 12">Feb 12</option>
                <option value="Mar 12">Mar 12</option>
                <option value="Apr 12">Apr 12</option>
              </select>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenueData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 200]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  <Bar dataKey="netProfit" stackId="a" fill="#8B5CF6" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="orders" stackId="a" fill="#06B6D4" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="returns" stackId="a" fill="#F97316" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue Legend */}
            <div className="flex justify-center mt-6 gap-8 space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-sm "></div>
                <span className="text-sm text-gray-600 gap-4 px-6">Net Profit</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-cyan-500 rounded-sm"></div>
                <span className="text-sm text-gray-600 px-6">Orders</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
                <span className="text-sm text-gray-600 px-6">Return</span>
              </div>
            </div>
          </div>

          {/* Attendance Donut Chart - Right Side (1 column) */}
          <div className="bg-white p-16 rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Student Attendance</h2>
            
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={110}
                    paddingAngle={1}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1000}
                  >
                    {attendanceData.map((entry, index) => (
                      <Cell  key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Attendance Legend */}
            <div className="space-y-3 mt-4">
              {attendanceData.map((entry, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 p-6">
                    <div 
                      className="w-3 h-3 rounded-full " 
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span className="text-sm text-gray-700 px-6">{entry.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {/* Revenue Stats */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between p-16">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">$24,567</p>
                <p className="text-xs text-green-600 mt-1">+12.5% from last month</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between p-16">
              <div>
                <p className="text-sm text-gray-500 mb-1">Net Profit</p>
                <p className="text-2xl font-bold text-gray-900">$8,945</p>
                <p className="text-xs text-green-600 mt-1">+8.2% from last month</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          {/* Attendance Stats */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between p-16">
              <div>
                <p className="text-sm text-gray-500 mb-1">Present Today</p>
                <p className="text-2xl font-bold text-gray-900">347</p>
                <p className="text-xs text-blue-600 mt-1">89.2% attendance rate</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between p-16">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">389</p>
                <p className="text-xs text-gray-600 mt-1">Active enrolled students</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="bg-white rounded-xl p-6  border border-gray-100 p-16">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Product Sales</span>
                <span className="font-semibold text-gray-900">$18,450</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Service Revenue</span>
                <span className="font-semibold text-gray-900">$4,320</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subscription</span>
                <span className="font-semibold text-gray-900">$1,797</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6  border border-gray-100 p-16">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Attendance</span>
                <span className="font-semibold text-gray-900">89.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Best Day</span>
                <span className="font-semibold text-gray-900">Monday (94%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Improvement</span>
                <span className="font-semibold text-green-600">+3.2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chart;