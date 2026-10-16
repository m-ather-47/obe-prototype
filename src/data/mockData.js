export const currentUser = {
  id: 1,
  name: "Dr. Ahmad Khan",
  email: "ahmad.khan@uiit.edu.pk",
  role: "admin",
};

export const departments = [
  { id: 1, name: "University Institute of Information Technology", code: "UIIT", hod_name: "Dr. Yasir Hafeez", contact: "051-9281234" },
];

export const programs = [
  { id: 1, department_id: 1, name: "BS Computer Science", code: "BSCS", credit_hours: 136 },
  { id: 2, department_id: 1, name: "MS Computer Science", code: "MSCS", credit_hours: 36 },
  { id: 3, department_id: 1, name: "BS Software Engineering", code: "BSSE", credit_hours: 140 },
  { id: 4, department_id: 1, name: "BS Information Technology", code: "BSIT", credit_hours: 130 },
];

export const semesters = [
  { id: 1, name: "Spring 2026", start_date: "2026-02-01", end_date: "2026-06-15", is_active: true },
  { id: 2, name: "Fall 2025", start_date: "2025-09-01", end_date: "2026-01-15", is_active: false },
  { id: 3, name: "Spring 2025", start_date: "2025-02-01", end_date: "2025-06-15", is_active: false },
];

export const courses = [
  { id: 1, program_id: 1, session_id: 1, code: "CS-401", title: "Machine Learning", credit_hours: 3 },
  { id: 2, program_id: 1, session_id: 1, code: "CS-301", title: "Data Structures", credit_hours: 3 },
  { id: 3, program_id: 1, session_id: 1, code: "CS-302", title: "Database Systems", credit_hours: 3 },
  { id: 4, program_id: 1, session_id: 1, code: "CS-201", title: "Object Oriented Programming", credit_hours: 3 },
  { id: 5, program_id: 1, session_id: 1, code: "CS-402", title: "Artificial Intelligence", credit_hours: 3 },
  { id: 6, program_id: 3, session_id: 1, code: "SE-401", title: "Software Architecture", credit_hours: 3 },
];

export const sections = [
  { id: 1, course_id: 1, semester_id: 1, instructor_id: 2, class_name: "BSCS-4A", shift: "Morning", status: "active" },
  { id: 2, course_id: 1, semester_id: 1, instructor_id: 3, class_name: "BSCS-4B", shift: "Evening", status: "active" },
  { id: 3, course_id: 2, semester_id: 1, instructor_id: 2, class_name: "BSCS-3A", shift: "Morning", status: "active" },
  { id: 4, course_id: 3, semester_id: 1, instructor_id: 3, class_name: "BSCS-3A", shift: "Morning", status: "active" },
];

export const users = [
  { id: 1, name: "Dr. Ahmad Khan", email: "ahmad.khan@uiit.edu.pk", role: "admin", password: "demo123" },
  { id: 2, name: "Dr. Sara Malik", email: "sara.malik@uiit.edu.pk", role: "instructor", password: "demo123" },
  { id: 3, name: "Prof. Hamza Tariq", email: "hamza.tariq@uiit.edu.pk", role: "instructor", password: "demo123" },
];

export const students = [
  { id: 1, section_id: 1, roll_no: "BSCS-2022-001", name: "Bilal Ahmed", is_active: true },
  { id: 2, section_id: 1, roll_no: "BSCS-2022-002", name: "Ayesha Khan", is_active: true },
  { id: 3, section_id: 1, roll_no: "BSCS-2022-003", name: "Hamna Raza", is_active: true },
  { id: 4, section_id: 1, roll_no: "BSCS-2022-004", name: "Usman Ali", is_active: true },
  { id: 5, section_id: 1, roll_no: "BSCS-2022-005", name: "Zainab Fatima", is_active: true },
  { id: 6, section_id: 2, roll_no: "BSCS-2022-006", name: "Omar Farooq", is_active: true },
  { id: 7, section_id: 2, roll_no: "BSCS-2022-007", name: "Hira Malik", is_active: true },
  { id: 8, section_id: 3, roll_no: "BSCS-2023-001", name: "Ali Hassan", is_active: true },
  { id: 9, section_id: 3, roll_no: "BSCS-2023-002", name: "Mahnoor Akram", is_active: true },
  { id: 10, section_id: 3, roll_no: "BSCS-2023-003", name: "Taimoor Shah", is_active: true },
];

export const plos = [
  { id: 1, program_id: 1, number: "PLO-1", title: "Knowledge", bloom_domain: "Cognitive", accreditation_ref: "ABET CAC-1" },
  { id: 2, program_id: 1, number: "PLO-2", title: "Problem Analysis", bloom_domain: "Cognitive", accreditation_ref: "ABET CAC-2" },
  { id: 3, program_id: 1, number: "PLO-3", title: "Design/Development of Solutions", bloom_domain: "Cognitive", accreditation_ref: "ABET CAC-3" },
  { id: 4, program_id: 1, number: "PLO-4", title: "Investigation", bloom_domain: "Cognitive", accreditation_ref: "ABET CAC-4" },
  { id: 5, program_id: 1, number: "PLO-5", title: "Modern Tool Usage", bloom_domain: "Psychomotor", accreditation_ref: "ABET CAC-5" },
  { id: 6, program_id: 1, number: "PLO-6", title: "Professional Ethics", bloom_domain: "Affective", accreditation_ref: "ABET CAC-6" },
  { id: 7, program_id: 1, number: "PLO-7", title: "Communication", bloom_domain: "Affective", accreditation_ref: "ABET CAC-7" },
  { id: 8, program_id: 1, number: "PLO-8", title: "Teamwork", bloom_domain: "Affective", accreditation_ref: "ABET CAC-8" },
];

export const clos = [
  { id: 1, plo_id: 2, course_id: 1, number: "CLO-1", title: "Analyze ML algorithms for classification tasks", bloom_level: "Analyze", passing_threshold: 50, approval_status: "approved", created_by: 2 },
  { id: 2, plo_id: 2, course_id: 1, number: "CLO-2", title: "Evaluate model performance using appropriate metrics", bloom_level: "Evaluate", passing_threshold: 50, approval_status: "approved", created_by: 2 },
  { id: 3, plo_id: 3, course_id: 1, number: "CLO-3", title: "Design ML pipelines for real-world problems", bloom_level: "Create", passing_threshold: 50, approval_status: "pending", created_by: 2 },
  { id: 4, plo_id: 1, course_id: 2, number: "CLO-1", title: "Explain core data structure operations", bloom_level: "Understand", passing_threshold: 50, approval_status: "approved", created_by: 2 },
  { id: 5, plo_id: 2, course_id: 2, number: "CLO-2", title: "Analyze time complexity of algorithms", bloom_level: "Analyze", passing_threshold: 50, approval_status: "pending", created_by: 2 },
];

// Weights are derived at runtime (see normalizeCourseBlueprint / applyDerivedWeights)
// so that every category and the overall blueprint always total 100%.
// Rules: exactly one Mid Exam + one Final Exam (fixed), optional single Project
// per course, and a minimum of 4 Assignments and 4 Quizzes.
export const blueprintComponents = [
  // Course 1 — Machine Learning (has a project)
  { id: 1, clo_id: 1, exam_type: "Assignment", component_id: "A1", max_marks: 20, is_kpi: false },
  { id: 2, clo_id: 1, exam_type: "Assignment", component_id: "A2", max_marks: 20, is_kpi: false },
  { id: 3, clo_id: 2, exam_type: "Assignment", component_id: "A3", max_marks: 20, is_kpi: false },
  { id: 4, clo_id: 2, exam_type: "Assignment", component_id: "A4", max_marks: 20, is_kpi: false },
  { id: 5, clo_id: 1, exam_type: "Quiz", component_id: "Q1", max_marks: 10, is_kpi: true },
  { id: 6, clo_id: 1, exam_type: "Quiz", component_id: "Q2", max_marks: 10, is_kpi: true },
  { id: 7, clo_id: 2, exam_type: "Quiz", component_id: "Q3", max_marks: 10, is_kpi: false },
  { id: 8, clo_id: 3, exam_type: "Quiz", component_id: "Q4", max_marks: 10, is_kpi: false },
  { id: 9, clo_id: 2, exam_type: "Mid Exam", component_id: "M1", max_marks: 30, is_kpi: true, is_fixed: true },
  { id: 10, clo_id: 3, exam_type: "Final Exam", component_id: "F1", max_marks: 50, is_kpi: true, is_fixed: true },
  { id: 11, clo_id: 3, exam_type: "Project", component_id: "P1", max_marks: 50, is_kpi: false },
  // Course 2 — Data Structures (no project)
  { id: 12, clo_id: 4, exam_type: "Assignment", component_id: "A1", max_marks: 20, is_kpi: false },
  { id: 13, clo_id: 4, exam_type: "Assignment", component_id: "A2", max_marks: 20, is_kpi: false },
  { id: 14, clo_id: 5, exam_type: "Assignment", component_id: "A3", max_marks: 20, is_kpi: false },
  { id: 15, clo_id: 5, exam_type: "Assignment", component_id: "A4", max_marks: 20, is_kpi: false },
  { id: 16, clo_id: 4, exam_type: "Quiz", component_id: "Q1", max_marks: 10, is_kpi: true },
  { id: 17, clo_id: 4, exam_type: "Quiz", component_id: "Q2", max_marks: 10, is_kpi: true },
  { id: 18, clo_id: 5, exam_type: "Quiz", component_id: "Q3", max_marks: 10, is_kpi: false },
  { id: 19, clo_id: 5, exam_type: "Quiz", component_id: "Q4", max_marks: 10, is_kpi: false },
  { id: 20, clo_id: 5, exam_type: "Mid Exam", component_id: "M1", max_marks: 30, is_kpi: true, is_fixed: true },
  { id: 21, clo_id: 5, exam_type: "Final Exam", component_id: "F1", max_marks: 50, is_kpi: true, is_fixed: true },
];

export const studentMarks = [
  { id: 1, student_id: 1, component_id: 1, marks: 16, entered_by: 2 },
  { id: 2, student_id: 1, component_id: 2, marks: 14, entered_by: 2 },
  { id: 3, student_id: 1, component_id: 3, marks: 8, entered_by: 2 },
  { id: 4, student_id: 1, component_id: 4, marks: 7, entered_by: 2 },
  { id: 5, student_id: 1, component_id: 5, marks: 24, entered_by: 2 },
  { id: 6, student_id: 1, component_id: 6, marks: 22, entered_by: 2 },
  { id: 7, student_id: 1, component_id: 7, marks: 32, entered_by: 2 },
  { id: 8, student_id: 1, component_id: 8, marks: 15, entered_by: 2 },
  { id: 9, student_id: 1, component_id: 9, marks: 18, entered_by: 2 },
  { id: 10, student_id: 2, component_id: 1, marks: 18, entered_by: 2 },
  { id: 11, student_id: 2, component_id: 2, marks: 16, entered_by: 2 },
  { id: 12, student_id: 2, component_id: 3, marks: 9, entered_by: 2 },
  { id: 13, student_id: 2, component_id: 4, marks: 8, entered_by: 2 },
  { id: 14, student_id: 2, component_id: 5, marks: 27, entered_by: 2 },
  { id: 15, student_id: 2, component_id: 6, marks: 25, entered_by: 2 },
  { id: 16, student_id: 2, component_id: 7, marks: 35, entered_by: 2 },
  { id: 17, student_id: 2, component_id: 8, marks: 17, entered_by: 2 },
  { id: 18, student_id: 2, component_id: 9, marks: 19, entered_by: 2 },
  { id: 19, student_id: 3, component_id: 1, marks: 12, entered_by: 2 },
  { id: 20, student_id: 3, component_id: 2, marks: 10, entered_by: 2 },
  { id: 21, student_id: 3, component_id: 3, marks: 6, entered_by: 2 },
  { id: 22, student_id: 3, component_id: 4, marks: 5, entered_by: 2 },
  { id: 23, student_id: 3, component_id: 5, marks: 18, entered_by: 2 },
  { id: 24, student_id: 3, component_id: 6, marks: 16, entered_by: 2 },
  { id: 25, student_id: 3, component_id: 7, marks: 24, entered_by: 2 },
  { id: 26, student_id: 3, component_id: 8, marks: 12, entered_by: 2 },
  { id: 27, student_id: 3, component_id: 9, marks: 14, entered_by: 2 },
  { id: 28, student_id: 4, component_id: 1, marks: 15, entered_by: 2 },
  { id: 29, student_id: 4, component_id: 2, marks: 13, entered_by: 2 },
  { id: 30, student_id: 4, component_id: 3, marks: 7, entered_by: 2 },
  { id: 31, student_id: 4, component_id: 4, marks: 7, entered_by: 2 },
  { id: 32, student_id: 4, component_id: 5, marks: 22, entered_by: 2 },
  { id: 33, student_id: 4, component_id: 6, marks: 20, entered_by: 2 },
  { id: 34, student_id: 4, component_id: 7, marks: 30, entered_by: 2 },
  { id: 35, student_id: 4, component_id: 8, marks: 14, entered_by: 2 },
  { id: 36, student_id: 4, component_id: 9, marks: 16, entered_by: 2 },
  { id: 37, student_id: 5, component_id: 1, marks: 19, entered_by: 2 },
  { id: 38, student_id: 5, component_id: 2, marks: 17, entered_by: 2 },
  { id: 39, student_id: 5, component_id: 3, marks: 9, entered_by: 2 },
  { id: 40, student_id: 5, component_id: 4, marks: 9, entered_by: 2 },
  { id: 41, student_id: 5, component_id: 5, marks: 28, entered_by: 2 },
  { id: 42, student_id: 5, component_id: 6, marks: 26, entered_by: 2 },
  { id: 43, student_id: 5, component_id: 7, marks: 36, entered_by: 2 },
  { id: 44, student_id: 5, component_id: 8, marks: 18, entered_by: 2 },
  { id: 45, student_id: 5, component_id: 9, marks: 20, entered_by: 2 },
];

export const auditLogs = [
  { id: 1, entity_type: "Marks", entity_id: 1, action: "INSERT", actor_id: 2, ip: "192.168.1.10", timestamp: "2026-05-20T09:15:00" },
  { id: 2, entity_type: "Marks", entity_id: 2, action: "INSERT", actor_id: 2, ip: "192.168.1.10", timestamp: "2026-05-20T09:16:00" },
  { id: 3, entity_type: "CLO", entity_id: 3, action: "APPROVE", actor_id: 1, ip: "192.168.1.5", timestamp: "2026-06-01T10:00:00" },
  { id: 4, entity_type: "Blueprint", entity_id: 1, action: "UPDATE", actor_id: 1, ip: "192.168.1.5", timestamp: "2026-02-15T14:30:00" },
  { id: 5, entity_type: "Section", entity_id: 1, action: "INSERT", actor_id: 1, ip: "192.168.1.5", timestamp: "2026-02-01T08:00:00" },
  { id: 6, entity_type: "Student", entity_id: 4, action: "INSERT", actor_id: 1, ip: "192.168.1.5", timestamp: "2026-02-05T11:00:00" },
  { id: 7, entity_type: "Marks", entity_id: 10, action: "UPDATE", actor_id: 2, ip: "192.168.1.10", timestamp: "2026-05-21T10:30:00" },
  { id: 8, entity_type: "CLO", entity_id: 5, action: "SUBMIT", actor_id: 2, ip: "192.168.1.10", timestamp: "2026-06-01T12:00:00" },
];

export const notifications = [
  { id: 1, message: "CLO-3 submitted for admin approval", read: false, date: "2026-06-01" },
  { id: 2, message: "New marks entry deadline: June 10, 2026", read: false, date: "2026-06-02" },
  { id: 3, message: "PLO-2 mapping updated for BSCS program", read: true, date: "2026-05-28" },
];
