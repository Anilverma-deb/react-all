import React, { useState,useEffect } from "react";
import {
  Users, BookOpen, Building, GraduationCap,
  CalendarDays, Star, LineChart, ClipboardList,
  Award, Bell, MessageSquare, Settings,
  Bookmark, Clock, UserCheck, Library, ChevronRight,
  Edit, Trash2, Plus, X
} from "lucide-react";
import { addStudent, updateStudent, deleteStudent, dashboardCards,  } from "../../../assets/js/main.js";
import './Dashboard.css';
import Chart from "./chart.jsx";
import Performance from "./Performance.jsx";

const iconMap = {
  "Students": Users,
  "Teachers": GraduationCap,
  "Classes": Building,
  "Subjects": BookOpen,
  "Exams": CalendarDays,
  "Achievements": Star,
  "Attendance": UserCheck,
  "Library Books": Library,
};
  
function Dashboard() {

  const [students, setStudents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState({ name: "", email: "", date: "", course: "", index: null });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const { name, email, date, course, index } = current;

    if (index !== null) {
      setStudents(updateStudent(students, index, { name, email, date, course }));
    } else {
      setStudents(addStudent(students, { name, email, date, course }));
    }

    setModalOpen(false);
    setCurrent({ name: "", email: "", date: "", course: "", index: null });
    setLoading(false);
  };

  const handleEdit = (student, index) => {
    setCurrent({ ...student, index });
    setModalOpen(true);
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      setStudents(deleteStudent(students, index));
    }
  };

  const openModal = () => {
    setCurrent({ name: "", email: "", date: "", course: "", index: null });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrent({ name: "", email: "", date: "", course: "", index: null });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-white mb-8  ">
        <div className="max-w-7xl mx-auto px-4  sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">School ERP Dashboard</h1>
              <p className="text-gray-600 text-sm sm:text-base mt-1">Welcome back, Admin!</p>
            </div>
            <div className="flex gap-3">
              <select className="form-select form-select-sm focus-ring">
                <option>2024 - 2025</option>
                <option>2023 - 2024</option>
                <option>2022 - 2023</option>
                <option>2021 - 2022</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      {/* Modal part */}
      <div className="max-w-7xl mx-auto mt-24  px-4 sm:px-6 mb-16 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {dashboardCards.map((card, index) => {
            const IconComponent = iconMap[card.title];
            return (
              <div
                key={card.title}
                className="dashboard-card bg-white rounded-xl p-16 shadow-sm border border-gray-100 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${card.color}08, ${card.color}03)`,
                  borderColor: `${card.color}20`,
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="dashboard-card-icon p-8 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: `${card.color}15`,
                    }}
                  >
                    <IconComponent size={24} style={{ color: card.color }} />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{card.title}</h4>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl mt-8 font-bold text-gray-900 mb-8">{card.count}</p>
                  <div className="flex items-center gap-1 text-xs sm:text-sm" style={{ color: card.color }}>
                    <span className="truncate">{card.trend}</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Student Registration Section */}
        <div className="bg-white rounded-xl mt-24 shadow-sm border border-gray-200 overflow-hidden team-area">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 p-24">
            <div className="flex justify-between items-center section-main-title">
              <h2 className="">Student Registration</h2>
              <div className="registration-button">
                <button
                  onClick={openModal}
                  className="btn-primary bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus-ring flex items-center gap-2 transition-all duration-200"
                  style={{ padding: '0px 20px' }}   >
                  Add Student
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto custom-scrollbar">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student, index) => (
                  <tr key={student.id || index} className="table-row">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.course}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button
                        onClick={() => handleEdit(student, index)}
                        className="text-blue-600 hover:text-blue-900 mr-3 p-1 rounded transition-colors duration-200"
                        title="Edit student"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="text-red-600 hover:text-red-900 p-1 rounded transition-colors duration-200"
                        title="Delete student"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <Users size={48} className="text-gray-300" />
                        <p className="text-lg font-medium">No students registered yet.</p>
                        <p className="text-sm">Click "Add Student" to get started.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    
      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay fixed  inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="modal-content bg-white rounded-lg w-full max-w-md shadow-xl p-24">
            <div className="flex justify-between items-center p-6 mb-16">
              <h3 className="text-xl font-bold text-gray-900 ">
                {current.index !== null ? "Edit Student" : "Add Student"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4 field padding-bottom--24">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={current.name}
                    onChange={(e) => setCurrent({ ...current, name: e.target.value })}
                    required
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter student's full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={current.email}
                    onChange={(e) => setCurrent({ ...current, email: e.target.value })}
                    required
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={current.date}
                    onChange={(e) => setCurrent({ ...current, date: e.target.value })}
                    required
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter Date"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course
                  </label>
                  <input
                    type="text"
                    value={current.course}
                    onChange={(e) => setCurrent({ ...current, course: e.target.value })}
                    required
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter course name"
                  />
                </div>
              </div>

              <div className="flex  gap-3 mt-16 pt-4 ">
                <div className="subscribe-button">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
                <div className="subscribe-button">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition-all duration-200"
                  >
                    {loading && <div className="loading-spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full" />}
                    {loading ? "Saving..." : "Save Student"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

<div>
    {/* Graph */}
<Chart></Chart>
</div>

 {/* // Notifications */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
  <div className="lg:col-span-4 col-span-12">
   <div className="weekly-schedule">
  <h1>Weekly Schedule</h1>
  <div className="calendar">
    <div className="day-and-activity activity-one">
      <div className="day">
        <h1>13</h1>
        <p>mon</p>
      </div>
      <div className="activity">
        <h2>Swimming</h2>
        <div className="participants">
          <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/c61daa1c-5881-43f8-a50f-62be3d235daf" alt="" />
          <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/90affa88-8da0-40c8-abe7-f77ea355a9de" alt="" />
          <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/07d4fa6f-6559-4874-b912-3968fdfe4e5e" alt="" />
          <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/e082b965-bb88-4192-bce6-0eb8b0bf8e68" alt="" />
        </div>
      </div>
      <button className="btn">Join</button>
    </div>

    <div className="day-and-activity activity-two">
      <div className="day">
        <h1>15</h1>
        <p>wed</p>
      </div>
      <div className="activity">
        <h2>Yoga</h2>
        <div className="participants">
          <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/c61daa1c-5881-43f8-a50f-62be3d235daf" alt="" />
          <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/32037044-f076-433a-8a6e-9b80842f29c9" alt="" />
        </div>
      </div>
      <button className="btn">Join</button>
    </div>

    <div className="day-and-activity activity-three">
      <div className="day">
        <h1>17</h1>
        <p>fri</p>
      </div>
      <div className="activity">
        <h2>Tennis</h2>
        <div className="participants">
          <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/32037044-f076-433a-8a6e-9b80842f29c9" alt="" />
          <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/e082b965-bb88-4192-bce6-0eb8b0bf8e68" alt="" />
          <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/c61daa1c-5881-43f8-a50f-62be3d235daf" alt="" />
        </div>
      </div>
      <button className="btn">Join</button>
    </div>

    <div className="day-and-activity activity-four">
      <div className="day">
        <h1>18</h1>
        <p>sat</p>
      </div>
      <div className="activity">
        <h2>Hiking</h2>
        <div className="participants">
          <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/07d4fa6f-6559-4874-b912-3968fdfe4e5e" alt="" />
          <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/32037044-f076-433a-8a6e-9b80842f29c9" alt="" />
          <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/07d4fa6f-6559-4874-b912-3968fdfe4e5e" alt="" />
          <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/c61daa1c-5881-43f8-a50f-62be3d235daf" alt="" />
          <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/90affa88-8da0-40c8-abe7-f77ea355a9de" alt="" />
        </div>
      </div>
      <button className="btn">Join</button>
    </div>
    <div className="day-and-activity activity-two">
      <div className="day">
        <h1>15</h1>
        <p>wed</p>
      </div>
      <div className="activity">
        <h2>Yoga</h2>
        <div className="participants">
          <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/c61daa1c-5881-43f8-a50f-62be3d235daf" alt="" />
          <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/32037044-f076-433a-8a6e-9b80842f29c9" alt="" />
        </div>
      </div>
      <button className="btn">Join</button>
    </div>

    <div className="day-and-activity activity-three">
      <div className="day">
        <h1>17</h1>
        <p>fri</p>
      </div>
      <div className="activity">
        <h2>Tennis</h2>
        <div className="participants">
          <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/32037044-f076-433a-8a6e-9b80842f29c9" alt="" />
          <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/e082b965-bb88-4192-bce6-0eb8b0bf8e68" alt="" />
          <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/c61daa1c-5881-43f8-a50f-62be3d235daf" alt="" />
        </div>
      </div>
      <button className="btn">Join</button>
    </div>

    <div className="day-and-activity activity-four">
      <div className="day">
        <h1>18</h1>
        <p>sat</p>
      </div>
      <div className="activity">
        <h2>Hiking</h2>
        <div className="participants">
          <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/07d4fa6f-6559-4874-b912-3968fdfe4e5e" alt="" />
          <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/32037044-f076-433a-8a6e-9b80842f29c9" alt="" />
          <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/07d4fa6f-6559-4874-b912-3968fdfe4e5e" alt="" />
          <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/c61daa1c-5881-43f8-a50f-62be3d235daf" alt="" />
          <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/90affa88-8da0-40c8-abe7-f77ea355a9de" alt="" />
        </div>
      </div>
      <button className="btn">Join</button>
    </div>
  </div>
</div>

  </div>

  <div className="lg:col-span-8 col-span-12">
<Performance></Performance>
  </div>
</div>


    </div>
    
   
  );
}

export default Dashboard;