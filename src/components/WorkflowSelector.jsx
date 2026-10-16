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
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-5 mb-6">
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-xs font-bold text-gray-900 tracking-tight">Selection Workflow</h3>
        {!canChangeSemester && (
          <span className="text-[11px] text-gray-400 flex items-center gap-1.5 font-medium">
            <Lock size={12} className="text-gray-400" />
            Active session auto-selected — only admin can change
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Session</label>
          <select
            value={semesterId ?? ""}
            disabled={!canChangeSemester}
            onChange={(e) => setSemesterId(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 border border-gray-200/90 rounded-xl text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-black/5 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed shadow-2xs"
          >
            {semesters.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} {s.is_active ? "(Active)" : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Course</label>
          <select
            value={courseId ?? ""}
            onChange={(e) => setCourseId(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 border border-gray-200/90 rounded-xl text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-black/5 shadow-2xs cursor-pointer"
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
            <p className="text-[11px] text-gray-400 mt-1 font-medium">Only one assigned course</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Section</label>
          <select
            value={sectionId ?? ""}
            onChange={(e) => setSectionId(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 border border-gray-200/90 rounded-xl text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-black/5 shadow-2xs cursor-pointer"
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