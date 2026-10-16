import { useState, useEffect } from "react";
import * as mock from "./mockData";
import { getCurrentUser } from "./auth";

const PROTOTYPE_DATA_VERSION = "blueprint-derived-weights-v3";

export function initializePrototypeData() {
  try {
    if (localStorage.getItem("obe_prototype_data_version") !== PROTOTYPE_DATA_VERSION) {
      localStorage.setItem("obe_departments", JSON.stringify(mock.departments));
      localStorage.setItem("obe_programs", JSON.stringify(mock.programs));
      localStorage.setItem("obe_courses", JSON.stringify(mock.courses));
      localStorage.setItem("obe_clos", JSON.stringify(mock.clos));
      localStorage.setItem("obe_users", JSON.stringify(mock.users));
      localStorage.setItem("obe_blueprint", JSON.stringify(mock.blueprintComponents));
      localStorage.setItem("obe_marks", JSON.stringify(mock.studentMarks));
      const currentUser = JSON.parse(localStorage.getItem("obe_current_user") || "null");
      if (currentUser && !mock.users.some((user) => user.id === currentUser.id && user.role === currentUser.role)) {
        localStorage.removeItem("obe_current_user");
      }
      localStorage.setItem("obe_prototype_data_version", PROTOTYPE_DATA_VERSION);
    }

    const sections = JSON.parse(localStorage.getItem("obe_sections") || "null") || mock.sections;
    const courses = JSON.parse(localStorage.getItem("obe_courses") || "null") || mock.courses;
    const clos = JSON.parse(localStorage.getItem("obe_clos") || "null") || mock.clos;
    const blueprint = JSON.parse(localStorage.getItem("obe_blueprint") || "null") || mock.blueprintComponents;
    const users = JSON.parse(localStorage.getItem("obe_users") || "null") || mock.users;
    const sessionId = JSON.parse(localStorage.getItem("obe_semesters") || "null")?.find((item) => item.is_active)?.id ?? 1;
    const migratedCourses = courses.map((course) => ({
      ...course,
      session_id: course.session_id ?? sections.find((section) => section.course_id === course.id)?.semester_id ?? sessionId,
    }));
    const migratedClos = clos.map((clo) => {
      const section = sections.find((item) => item.id === clo.section_id);
      const courseClo = {
        ...clo,
        course_id: clo.course_id ?? section?.course_id,
        created_by: clo.created_by ?? section?.instructor_id ?? 2,
      };
      delete courseClo.section_id;
      return courseClo;
    });
    let migratedBlueprint = blueprint.map((component) => {
      const copy = { ...component };
      delete copy.is_default; // legacy flag replaced by is_fixed
      return copy;
    });
    for (const courseId of new Set(migratedClos.map((clo) => clo.course_id).filter(Boolean))) {
      const courseClos = migratedClos.filter((clo) => clo.course_id === courseId);
      migratedBlueprint = normalizeCourseBlueprint(
        migratedBlueprint,
        courseClos.map((clo) => clo.id),
        courseClos[0].id
      );
    }
    const migratedUsers = users.map((user) => ({ ...user, password: user.password || "demo123" }));
    localStorage.setItem("obe_courses", JSON.stringify(migratedCourses));
    localStorage.setItem("obe_clos", JSON.stringify(migratedClos));
    localStorage.setItem("obe_blueprint", JSON.stringify(migratedBlueprint));
    localStorage.setItem("obe_users", JSON.stringify(migratedUsers));
  } catch {
    // use seed data when storage is unavailable
  }
}

export function useLocalState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw != null) return JSON.parse(raw);
    } catch {
      // ignore corrupted storage
    }
    return typeof initialValue === "function" ? initialValue() : initialValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore quota / private mode errors
    }
  }, [key, value]);

  return [value, setValue];
}

export const nextId = (items) =>
  items.reduce((max, i) => Math.max(max, Number(i.id) || 0), 0) + 1;

// Assessment blueprint rules (prototype):
// - Exactly one Mid Exam and one Final Exam per course (fixed, cannot be added/removed).
// - At most one Project per course (optional; depends on the course).
// - At least 4 Assignments and at least 4 Quizzes per course.
// - Category weights are fixed; each component's weight is derived so every
//   category — and therefore the whole blueprint — always totals 100%.
export const BLUEPRINT_MIN = { Assignment: 4, Quiz: 4 };
export const BLUEPRINT_SINGLETONS = ["Mid Exam", "Final Exam", "Project"];
export const BLUEPRINT_FIXED = ["Mid Exam", "Final Exam"];

// Category share of the overall 100%. Project's share is redistributed to the
// other categories when a course has no project.
const CATEGORY_WEIGHTS = {
  Assignment: 15,
  Quiz: 15,
  "Mid Exam": 25,
  Project: 15,
  "Final Exam": 30,
};
export const EXAM_PREFIX = { Assignment: "A", Quiz: "Q", "Mid Exam": "M", Project: "P", "Final Exam": "F" };
const CATEGORY_MAX_MARKS = { Assignment: 20, Quiz: 10, "Mid Exam": 30, Project: 50, "Final Exam": 50 };

const round1 = (n) => Math.round(n * 10) / 10;

// Returns the per-component weights for a course so each category totals its
// share and the grand total is exactly 100%. Project share is dropped (and
// redistributed proportionally to Assignment/Quiz/Mid/Final) when absent.
export function computeCategoryShares(hasProject) {
  const shares = { ...CATEGORY_WEIGHTS };
  if (!hasProject) {
    const projectShare = shares.Project;
    delete shares.Project;
    const spread = ["Assignment", "Quiz", "Mid Exam", "Final Exam"];
    const base = projectShare / spread.length;
    for (const key of spread) shares[key] += base;
  }
  return shares;
}

// Attaches a derived weight_pct to each component so categories always sum to
// 100%. Mutates nothing; returns a new array.
export function applyDerivedWeights(components) {
  const hasProject = components.some((c) => c.exam_type === "Project");
  const shares = computeCategoryShares(hasProject);
  const byType = components.reduce((acc, c) => {
    (acc[c.exam_type] ||= []).push(c);
    return acc;
  }, {});
  const weightById = new Map();
  for (const [type, list] of Object.entries(byType)) {
    const share = shares[type] ?? 0;
    const per = round1(share / list.length);
    list.forEach((component, index) => {
      // Give the last component the remainder so each category sums exactly.
      const weight = index === list.length - 1 ? round1(share - per * (list.length - 1)) : per;
      weightById.set(component.id, weight);
    });
  }
  return components.map((c) => ({ ...c, weight_pct: weightById.get(c.id) ?? c.weight_pct ?? 0 }));
}

export function nextComponentId(items, courseCloIds, examType) {
  const prefix = EXAM_PREFIX[examType];
  const used = new Set(
    items.filter((item) => courseCloIds.includes(item.clo_id)).map((item) => item.component_id)
  );
  let index = 1;
  while (used.has(`${prefix}${index}`)) index += 1;
  return `${prefix}${index}`;
}

// Ensures a course has its fixed Mid/Final, the minimum Assignments/Quizzes,
// and derived weights. Does not create a Project (that is course-dependent and
// added explicitly). Returns a new array.
export function normalizeCourseBlueprint(items, courseCloIds, defaultCloId) {
  if (!courseCloIds.length || defaultCloId == null) return items;
  let next = [...items];
  const courseItems = () => next.filter((item) => courseCloIds.includes(item.clo_id));
  const countOf = (type) => courseItems().filter((item) => item.exam_type === type).length;

  const addComponent = (examType, isFixed) => {
    next.push({
      id: nextId(next),
      clo_id: defaultCloId,
      exam_type: examType,
      component_id: nextComponentId(next, courseCloIds, examType),
      max_marks: CATEGORY_MAX_MARKS[examType] ?? 20,
      is_kpi: examType === "Mid Exam" || examType === "Final Exam",
      is_fixed: Boolean(isFixed),
    });
  };

  // Fixed singletons: exactly one Mid Exam and one Final Exam.
  for (const type of BLUEPRINT_FIXED) {
    while (countOf(type) > 1) {
      const extra = courseItems().filter((item) => item.exam_type === type).at(-1);
      next = next.filter((item) => item.id !== extra.id);
    }
    if (countOf(type) === 0) addComponent(type, true);
    else {
      next = next.map((item) =>
        courseCloIds.includes(item.clo_id) && item.exam_type === type ? { ...item, is_fixed: true } : item
      );
    }
  }

  // Optional singleton: collapse multiple Projects down to one if present.
  while (countOf("Project") > 1) {
    const extra = courseItems().filter((item) => item.exam_type === "Project").at(-1);
    next = next.filter((item) => item.id !== extra.id);
  }

  // Minimum counts for Assignment and Quiz.
  for (const [type, min] of Object.entries(BLUEPRINT_MIN)) {
    while (countOf(type) < min) addComponent(type, false);
  }

  // Mark fixed flags consistently and derive weights for this course's set.
  const courseIds = new Set(courseItems().map((item) => item.id));
  const derived = applyDerivedWeights(courseItems());
  const derivedById = new Map(derived.map((item) => [item.id, item]));
  return next.map((item) => (courseIds.has(item.id) ? derivedById.get(item.id) : item));
}

export function logAudit(action, entityType, entityId) {
  try {
    const raw = localStorage.getItem("obe_audit_logs");
    const logs = raw ? JSON.parse(raw) : mock.auditLogs;
    const actor = getCurrentUser();
    const entry = {
      id: nextId(logs),
      entity_type: entityType,
      entity_id: entityId,
      action,
      actor_id: actor?.id ?? 1,
      ip: "127.0.0.1",
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("obe_audit_logs", JSON.stringify([entry, ...logs]));
  } catch {
    // ignore
  }
}