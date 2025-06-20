// studentUtils.js
export function addStudent(students, newStudent) {
  return [...students, { ...newStudent, id: Date.now() }];
}

export function updateStudent(students, index, updatedStudent) {
  const newList = [...students];
  newList[index] = { ...updatedStudent, id: students[index].id };
  return newList;
}

export function deleteStudent(students, index) {
  return students.filter((_, i) => i !== index);
}

// Dashboard data
export const dashboardCards = [
  { title: "Students", count: 1245, trend: "↑ 5% this month", color: "#6366f1" },
  { title: "Teachers", count: 83, trend: "↑ 2 this term", color: "#0ea5e9" },
  { title: "Classes", count: 42, trend: "No change", color: "#10b981" },
  { title: "Subjects", count: 28, trend: "New: Computer Science", color: "#f59e0b" },
  { title: "Exams", count: 15, trend: "Ongoing: Midterms", color: "#ec4899" },
  { title: "Achievements", count: 56, trend: "3 new awards", color: "#8b5cf6" },
  { title: "Attendance", count: "94%", trend: "↑ 2% from last week", color: "#06b6d4" },
  { title: "Library Books", count: 5243, trend: "32 checked out", color: "#f97316" },
];

export const quickActions = [
  { title: "Take Attendance", color: "#3b82f6" },
  { title: "Schedule Exam", color: "#f59e0b" },
  { title: "Send Notice", color: "#ef4444" },
  { title: "New Lesson Plan", color: "#10b981" },
];

export const announcements = [
  { id: 1, title: "School Annual Day", date: "15 Oct 2023", iconColor: "#8b5cf6" },
  { id: 2, title: "Parent-Teacher Meeting", date: "20 Oct 2023", iconColor: "#ec4899" },
  { id: 3, title: "Midterm Exams Schedule", date: "25 Oct 2023", iconColor: "#f59e0b" },
];

export const activities = [
  {
    id: 1,
    time: "10:30 AM",
    activity: "Ms. Sharma marked Class 10 attendance",
    iconColor: "#0ea5e9",
  },
  {
    id: 2,
    time: "09:45 AM",
    activity: "New assignment posted for Mathematics",
    iconColor: "#f59e0b",
  },
  {
    id: 3,
    time: "Yesterday",
    activity: "Parent meeting scheduled for Friday",
    iconColor: "#ec4899",
  },
  {
    id: 4,
    time: "Yesterday",
    activity: "Library books due for return",
    iconColor: "#10b981",
  },
];

