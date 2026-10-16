import { PenTool, Save, Download, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useLocalState, nextId, logAudit } from "../data/store";
import { useWorkflow } from "../hooks/useWorkflow";
import WorkflowSelector from "../components/WorkflowSelector";
import * as mock from "../data/mockData";

export default function MarksEntry() {
  const wf = useWorkflow();
  const [blueprint] = useLocalState("obe_blueprint", mock.blueprintComponents);
  const [clos] = useLocalState("obe_clos", mock.clos);
  const [marks, setMarks] = useLocalState("obe_marks", mock.studentMarks);
  const [edits, setEdits] = useState({});
  const [savedMsg, setSavedMsg] = useState(false);

  const sectionCLOIds = clos.filter((c) => c.course_id === wf.courseId).map((c) => c.id);
  const components = blueprint.filter((bc) => sectionCLOIds.includes(bc.clo_id));

  const getValue = (studentId, componentId) => {
    const key = `${studentId}-${componentId}`;
    if (key in edits) return edits[key];
    const m = marks.find((x) => x.student_id === studentId && x.component_id === componentId);
    return m ? String(m.marks) : "";
  };

  const handleChange = (studentId, componentId, value) => {
    setEdits((prev) => ({ ...prev, [`${studentId}-${componentId}`]: value }));
  };

  const handleSave = () => {
    const next = [...marks];
    Object.entries(edits).forEach(([key, val]) => {
      const [sid, cid] = key.split("-").map(Number);
      const value = Number(val);
      if (Number.isNaN(value) || value < 0) return;
      const idx = next.findIndex((x) => x.student_id === sid && x.component_id === cid);
      if (idx >= 0) {
        next[idx] = { ...next[idx], marks: value, entered_by: wf.user.id };
      } else {
        next.push({
          id: nextId(next),
          student_id: sid,
          component_id: cid,
          marks: value,
          entered_by: wf.user.id,
        });
      }
    });
    setMarks(next);
    setEdits({});
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
    logAudit("UPDATE", "Marks", wf.sectionId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Marks Entry</h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Select session → course → section, then enter marks for each student.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            className="flex items-center gap-2 border border-gray-200/90 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-full text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            onClick={() => alert("CSV import is not part of the demo prototype.")}
          >
            <Download size={14} className="text-gray-500" />
            <span>Import CSV</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-5 py-2 rounded-full text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Save size={14} />
            <span>Save Marks</span>
          </button>
        </div>
      </div>

      <WorkflowSelector wf={wf} />

      {savedMsg && (
        <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-semibold animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>Marks successfully saved — grading sheet updated.</span>
        </div>
      )}

      {!wf.section ? (
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-12 text-center">
          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-gray-400 border border-gray-150">
            <PenTool size={22} />
          </div>
          <p className="text-xs font-semibold text-gray-600">
            {wf.assignedCourses.length
              ? "Select a course and section above to start entering marks."
              : "No courses assigned to you in the selected session."}
          </p>
        </div>
      ) : components.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-12 text-center">
          <p className="text-xs font-semibold text-gray-500">
            No blueprint components configured for {wf.course?.code} — {wf.section?.class_name}.
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="p-4 bg-gray-50/70 border-b border-gray-150 flex flex-wrap gap-x-6 gap-y-2 text-xs">
              <span className="text-gray-500">
                Course: <span className="font-bold text-gray-900">{wf.course?.code}</span>
              </span>
              <span className="text-gray-500">
                Section: <span className="font-bold text-gray-900">{wf.section?.class_name}</span>
              </span>
              <span className="text-gray-500">
                Session: <span className="font-bold text-gray-900">{wf.semester?.name}</span>
              </span>
              <span className="text-gray-500">
                Instructor: <span className="font-bold text-gray-900">{wf.user?.name}</span>
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="text-left px-5 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                      Roll No
                    </th>
                    <th className="text-left px-5 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider sticky left-28 bg-gray-50 z-10">
                      Student Name
                    </th>
                    {components.map((bc) => (
                      <th key={bc.id} className="text-center px-3 py-3.5 text-[10px] font-bold text-gray-500 uppercase min-w-[84px]">
                        <div>{bc.component_id}</div>
                        <div className="text-[10px] text-gray-400 font-normal">/{bc.max_marks}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {wf.sectionStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-3 text-xs font-mono font-bold text-gray-700 sticky left-0 bg-white z-10">
                        {s.roll_no}
                      </td>
                      <td className="px-5 py-3 text-xs font-semibold text-gray-800 sticky left-28 bg-white z-10">
                        {s.name}
                      </td>
                      {components.map((bc) => (
                        <td key={bc.id} className="px-3 py-3 text-center">
                          <input
                            type="number"
                            value={getValue(s.id, bc.id)}
                            onChange={(e) => handleChange(s.id, bc.id, e.target.value)}
                            max={bc.max_marks}
                            min={0}
                            className="w-16 text-center text-xs font-bold border border-gray-200 rounded-xl py-1.5 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400 transition-all"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="bg-white rounded-3xl border border-gray-200/80 p-4 shadow-2xs">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Enrolled</p>
              <p className="text-xl font-extrabold text-gray-900 mt-1">{wf.sectionStudents.length}</p>
            </div>
            <div className="bg-white rounded-3xl border border-gray-200/80 p-4 shadow-2xs">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Assessment Components</p>
              <p className="text-xl font-extrabold text-gray-900 mt-1">{components.length}</p>
            </div>
            <div className="bg-white rounded-3xl border border-gray-200/80 p-4 shadow-2xs">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">KPI Key Components</p>
              <p className="text-xl font-extrabold text-amber-600 mt-1">{components.filter((c) => c.is_kpi).length}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}