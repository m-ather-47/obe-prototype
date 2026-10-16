import { Lock } from "lucide-react";

export default function SessionSectionSelector({ wf }) {
  const {
    canChangeSemester,
    semesters,
    semesterId,
    setSemesterId,
    availableSections,
    sectionKey,
    setSectionKey,
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <label className="block text-xs font-medium text-gray-600 mb-1">Section</label>
          <select
            value={sectionKey}
            onChange={(e) => setSectionKey(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">
              {availableSections.length ? "Select section…" : "No sections assigned"}
            </option>
            {availableSections.map((section) => (
              <option key={section.key} value={section.key}>
                {section.class_name} ({section.shift})
              </option>
            ))}
          </select>
          <p className="text-[11px] text-gray-400 mt-1">All courses assigned to the section are shown below.</p>
        </div>
      </div>
    </div>
  );
}
