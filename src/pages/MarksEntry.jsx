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
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Marks Entry</h1>
          <p className="text-sm text-gray-500">
            Select session → course → section, then enter marks for each student
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            onClick={() => alert("CSV import is not part of the demo prototype.")}
          >
            <Download size={16} />
            Import CSV
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <Save size={16} />
            Save Marks
          </button>
        </div>
      </div>

      <WorkflowSelector wf={wf} />

      {savedMsg && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2.5 rounded-lg mb-4 text-sm">
          <CheckCircle2 size={16} />
          Marks saved to local storage (demo) — draft grading sheet updated.
        </div>
      )}

      {!wf.section ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center">
          <PenTool size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">
            {wf.assignedCourses.length
              ? "Select a course and section to start entering marks."
              : "No courses assigned to you in the selected session."}
          </p>
        </div>
      ) : components.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center">
          <p className="text-sm text-gray-500">
            No blueprint components configured for {wf.course?.code} — {wf.section?.class_name}.
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 bg-blue-50 border-b border-blue-100 flex flex-wrap gap-x-6 gap-y-1 text-sm">
              <span className="text-gray-500">
                Course: <span className="font-semibold text-gray-800">{wf.course?.code}</span>
              </span>
              <span className="text-gray-500">
                Section: <span className="font-semibold text-gray-800">{wf.section?.class_name}</span>
              </span>
              <span className="text-gray-500">
                Session: <span className="font-semibold text-gray-800">{wf.semester?.name}</span>
              </span>
              <span className="text-gray-500">
                Instructor: <span className="font-semibold text-gray-800">{wf.user?.name}</span>
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase sticky left-0 bg-gray-50 z-10">Roll No</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase sticky left-24 bg-gray-50 z-10">Name</th>
                    {components.map((bc) => (
                      <th key={bc.id} className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase min-w-[80px]">
                        <div>{bc.component_id}</div>
                        <div className="text-[10px] text-gray-400 font-normal">/{bc.max_marks}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {wf.sectionStudents.map((s) => (
                    <tr key={s.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                      <td className="px-4 py-2.5 text-sm font-mono text-gray-600 sticky left-0 bg-white z-10">{s.roll_no}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-700 sticky left-24 bg-white z-10">{s.name}</td>
                      {components.map((bc) => (
                        <td key={bc.id} className="px-3 py-2.5 text-center">
                          <input
                            type="number"
                            value={getValue(s.id, bc.id)}
                            onChange={(e) => handleChange(s.id, bc.id, e.target.value)}
                            max={bc.max_marks}
                            min={0}
                            className="w-16 text-center text-sm border border-gray-200 rounded-lg py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="bg-white rounded-lg border border-gray-100 px-4 py-2.5">
              <p className="text-xs text-gray-400">Total Students</p>
              <p className="text-lg font-bold text-gray-800">{wf.sectionStudents.length}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-100 px-4 py-2.5">
              <p className="text-xs text-gray-400">Components</p>
              <p className="text-lg font-bold text-gray-800">{components.length}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-100 px-4 py-2.5">
              <p className="text-xs text-gray-400">KPI Components</p>
              <p className="text-lg font-bold text-amber-600">{components.filter((c) => c.is_kpi).length}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}