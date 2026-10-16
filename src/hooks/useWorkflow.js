import { useMemo, useState, useEffect } from "react";
import { useLocalState } from "../data/store";
import { getCurrentUser, isAdmin } from "../data/auth";
import * as mock from "../data/mockData";

const sectionKeyForAssignment = (assignment, courses) => {
  const course = courses.find((item) => item.id === assignment.course_id);
  return `${assignment.semester_id}:${assignment.class_name}:${assignment.shift}:${course?.program_id ?? ""}`;
};

export function useWorkflow({ courseData, sectionData } = {}) {
  const [user] = useState(getCurrentUser);
  const [semesters] = useLocalState("obe_semesters", mock.semesters);
  const [storedSections] = useLocalState("obe_sections", mock.sections);
  const [storedCourses] = useLocalState("obe_courses", mock.courses);
  const [students] = useLocalState("obe_students", mock.students);
  const sections = sectionData ?? storedSections;
  const courses = courseData ?? storedCourses;

  const activeSemester = semesters.find((s) => s.is_active) || semesters[0];
  const [semesterId, setSemesterId] = useState(activeSemester?.id ?? semesters[0]?.id);

  const canChangeSemester = isAdmin(user);

  const assignedSections = useMemo(
    () =>
      sections.filter(
        (s) =>
          s.semester_id === semesterId &&
          (courses.find((course) => course.id === s.course_id)?.session_id == null ||
            courses.find((course) => course.id === s.course_id)?.session_id === semesterId) &&
          (isAdmin(user) || s.instructor_id === user.id)
      ),
    [sections, courses, semesterId, user]
  );

  const assignedCourses = useMemo(() => {
    const unique = [];
    for (const s of assignedSections) {
      if (!unique.some((c) => c.id === s.course_id)) {
        const c = courses.find((co) => co.id === s.course_id);
        if (c) unique.push(c);
      }
    }
    return unique;
  }, [assignedSections, courses]);

  const [courseId, setCourseId] = useState(null);
  const [sectionId, setSectionId] = useState(null);

  useEffect(() => {
    setSectionId(null);
    if (assignedCourses.length === 1) {
      setCourseId(assignedCourses[0].id);
    } else {
      setCourseId(null);
    }
  }, [assignedCourses, semesterId]);

  const sectionsForCourse = useMemo(
    () => assignedSections.filter((s) => s.course_id === courseId),
    [assignedSections, courseId]
  );

  useEffect(() => {
    if (sectionsForCourse.length === 1) {
      setSectionId(sectionsForCourse[0].id);
    } else if (!sectionsForCourse.some((s) => s.id === sectionId)) {
      setSectionId(null);
    }
  }, [sectionsForCourse, sectionId]);

  const semester = semesters.find((s) => s.id === semesterId) || null;
  const course = courses.find((c) => c.id === courseId) || null;
  const section = sections.find((s) => s.id === sectionId) || null;
  const sectionStudents = section
    ? students.filter((s) => s.section_id === section.id)
    : [];

  // Section-first selection (used only by the instructor Courses page):
  // Session -> Section, then every course assigned to that section is shown.
  const availableSections = useMemo(() => {
    const grouped = new Map();
    for (const assignment of assignedSections) {
      const key = sectionKeyForAssignment(assignment, courses);
      if (!grouped.has(key)) grouped.set(key, { key, assignments: [], ...assignment });
      grouped.get(key).assignments.push(assignment);
    }
    return [...grouped.values()];
  }, [assignedSections, courses]);

  const [sectionKey, setSectionKey] = useState("");

  useEffect(() => {
    if (!availableSections.some((s) => s.key === sectionKey)) {
      setSectionKey(availableSections.length === 1 ? availableSections[0].key : "");
    }
  }, [availableSections, sectionKey]);

  const selectedSectionGroup = availableSections.find((s) => s.key === sectionKey) || null;
  const coursesForSection = useMemo(
    () =>
      selectedSectionGroup
        ? courses.filter((c) =>
            selectedSectionGroup.assignments.some((a) => a.course_id === c.id)
          )
        : [],
    [courses, selectedSectionGroup]
  );

  return {
    user,
    canChangeSemester,
    semesters,
    semesterId,
    setSemesterId,
    semester,
    assignedCourses,
    courseId,
    setCourseId,
    course,
    sectionsForCourse,
    sectionId,
    setSectionId,
    section,
    sectionStudents,
    availableSections,
    sectionKey,
    setSectionKey,
    selectedSectionGroup,
    coursesForSection,
  };
}