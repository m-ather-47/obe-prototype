import { Lock } from "lucide-react";

export default function WorkflowSelector({ wf }) {
  const {
    canChangeSemester,
    semesters,
    semesterId,
    setSemesterId,
    assignedCourses,
    courseId,
    setCourseId,
    sectionsForCourse,
    sectionId,
    setSectionId,
  } = wf;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Selection Workflow</h3>
        {!canChangeSemester && (
          <span className="text-[11px] text-gray-400 flex items-center gap-1">
            <Lock size={11} />
            Active session auto-selected — only admin can change
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Session</label>
          <select
            value={semesterId ?? ""}
            disabled={!canChangeSemester}
            onChange={(e) => setSemesterId(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            {semesters.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} {s.is_active ? "(Active)" : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Course</label>
          <select
            value={courseId ?? ""}
            onChange={(e) => setCourseId(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">
              {assignedCourses.length > 1 ? "Select course…" : "No course assigned"}
            </option>
            {assignedCourses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} — {c.title}
              </option>
            ))}
          </select>
          {assignedCourses.length === 1 && (
            <p className="text-[11px] text-gray-400 mt-1">Only one assigned course</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Section</label>
          <select
            value={sectionId ?? ""}
            onChange={(e) => setSectionId(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">
              {sectionsForCourse.length > 1 ? "Select section…" : "Select a course first"}
            </option>
            {sectionsForCourse.map((s) => (
              <option key={s.id} value={s.id}>
                {s.class_name} ({s.shift})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}