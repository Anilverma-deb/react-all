import React from 'react'
import StudentAttendance from './StudentAttendance/StudentAttendance';
import AttendanceDashboard from './AttendanceDashboard/AttendanceDashboard';
import StaffAttendance from './StaffAttendance/StaffAttendance';
import TeacherAttendance from './AttendanceReport/TeacherAttendance';
function Attendance() {
  return (
    <div>
      {/* <AttendanceDashboard/> */}
      {/* <StudentAttendance/> */}
      {/* <StaffAttendance/> */}
      <TeacherAttendance/>
    </div>
  )
}

export default Attendance