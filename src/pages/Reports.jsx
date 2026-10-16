import { FileText, Printer, Save, CheckCircle2, AlertTriangle } from "lucide-react";
import { useLocalState } from "../data/store";
import { useWorkflow } from "../hooks/useWorkflow";
import WorkflowSelector from "../components/WorkflowSelector";
import * as mock from "../data/mockData";

export default function Reports() {
  const wf = useWorkflow();
  const [blueprint] = useLocalState("obe_blueprint", mock.blueprintComponents);
  const [clos] = useLocalState("obe_clos", mock.clos);
  const [marks] = useLocalState("obe_marks", mock.studentMarks);
  const [gradingStatus, setGradingStatus] = useLocalState("obe_grading_status", {});

  const status = wf.sectionId ? gradingStatus[wf.sectionId] || "draft" : "draft";
  const isDraft = status === "draft";

  const setStatus = (s) => {
    if (!wf.sectionId) return;
    setGradingStatus((prev) => ({ ...prev, [wf.sectionId]: s }));
  };

  const sectionCLOIds = clos.filter((c) => c.course_id === wf.courseId).map((c) => c.id);
  const components = blueprint.filter((bc) => sectionCLOIds.includes(bc.clo_id));

  const getMark = (studentId, componentId) => {
    const m = marks.find((x) => x.student_id === studentId && x.component_id === componentId);
    return m ? m.marks : 0;
  };

  const handleFinalize = () => {
    if (
      window.confirm(
        "Finalize this grading sheet? Once finalized it can no longer be edited by the teacher."
      )
    ) {
      setStatus("finalized");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
          <p className="text-sm text-gray-500">Official OBE Grading Sheet — draft first, finalized by the teacher</p>
        </div>
        <div className="flex gap-2">
          {isDraft ? (
            <>
              <button
                onClick={() => setStatus("draft")}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                <Save size={16} />
                Save as Draft
              </button>
              <button
                onClick={handleFinalize}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                <CheckCircle2 size={16} />
                Finalize Grading Sheet
              </button>
            </>
          ) : (
            <button
              onClick={() => setStatus("draft")}
              className="flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-200 transition-colors"
            >
              <AlertTriangle size={16} />
              Revert to Draft
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            <Printer size={16} />
            Print
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <FileText size={16} />
            Export PDF
          </button>
        </div>
      </div>

      <WorkflowSelector wf={wf} />

      {!wf.section ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center">
          <p className="text-sm text-gray-500">
            Select a course and section to view its grading sheet.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 bg-blue-50 border-b border-blue-100">
            <div className="text-center">
              <h2 className="text-lg font-bold text-gray-800">
                Official OBE Grading Sheet
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {wf.course?.code} — {wf.course?.title}
              </p>
              {isDraft ? (
                <p className="text-sm font-semibold text-amber-600 mt-1">
                  (Draft Copy Not Finaled)
                </p>
              ) : (
                <p className="text-sm font-semibold text-green-600 mt-1">
                  ✓ Finalized Copy
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4 text-sm mt-3">
              <div><span className="text-gray-500">Course: </span><span className="font-semibold">{wf.course?.code}</span></div>
              <div><span className="text-gray-500">Section: </span><span className="font-semibold">{wf.section?.class_name}</span></div>
              <div><span className="text-gray-500">Session: </span><span className="font-semibold">{wf.semester?.name}</span></div>
              <div><span className="text-gray-500">Instructor: </span><span className="font-semibold">{wf.user?.name}</span></div>
            </div>
          </div>

          {components.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm text-gray-500">
                No blueprint components configured for this section yet.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase sticky left-0 bg-gray-50 z-10">#</th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase sticky left-8 bg-gray-50 z-10">Roll No</th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase sticky left-32 bg-gray-50 z-10">Name</th>
                      {components.map((bc) => (
                        <th key={bc.id} className="text-center px-2 py-2 text-[10px] font-semibold text-gray-500 uppercase min-w-[65px] border-l border-gray-100">
                          <div>{bc.component_id}</div>
                          <div className="font-normal text-gray-400">({bc.weight_pct}%)</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {wf.sectionStudents.map((s, idx) => (
                      <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-2 text-sm text-gray-400 sticky left-0 bg-white z-10">{idx + 1}</td>
                        <td className="px-3 py-2 text-sm font-mono text-gray-600 sticky left-8 bg-white z-10">{s.roll_no}</td>
                        <td className="px-3 py-2 text-sm text-gray-700 sticky left-32 bg-white z-10">{s.name}</td>
                        {components.map((bc) => (
                          <td key={bc.id} className="px-2 py-2 text-center text-sm text-gray-700 border-l border-gray-50">
                            {getMark(s.id, bc.id)}/{bc.max_marks}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex gap-6">
                    <span className="text-gray-500">Total Students: <span className="font-semibold text-gray-700">{wf.sectionStudents.length}</span></span>
                    <span className="text-gray-500">Status: <span className={`font-semibold ${isDraft ? "text-amber-600" : "text-green-600"}`}>{isDraft ? "Draft" : "Finalized"}</span></span>
                  </div>
                  <div className="text-xs text-gray-400">Generated: {new Date().toISOString().slice(0, 10)}</div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}