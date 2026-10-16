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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Attainment Reports</h1>
          <p className="text-xs text-gray-500 font-medium mt-1">Official OBE Grading Sheet — draft first, finalized by the teacher.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isDraft ? (
            <>
              <button
                onClick={() => setStatus("draft")}
                className="flex items-center gap-1.5 border border-gray-200/90 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-full text-xs font-semibold shadow-2xs transition-all cursor-pointer"
              >
                <Save size={13} className="text-gray-500" />
                <span>Save Draft</span>
              </button>
              <button
                onClick={handleFinalize}
                className="flex items-center gap-1.5 bg-black hover:bg-neutral-800 text-white px-5 py-2 rounded-full text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>Finalize Sheet</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setStatus("draft")}
              className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/60 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer"
            >
              <AlertTriangle size={13} className="text-amber-600" />
              <span>Revert to Draft</span>
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 border border-gray-200/90 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-full text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          >
            <Printer size={13} className="text-gray-500" />
            <span>Print</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 border border-gray-200/90 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-full text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          >
            <FileText size={13} className="text-gray-500" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      <WorkflowSelector wf={wf} />

      {!wf.section ? (
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-12 text-center">
          <p className="text-xs font-semibold text-gray-500">
            Select a course and section above to view its grading sheet.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="p-6 bg-gray-50/70 border-b border-gray-150">
            <div className="text-center">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase mb-2 ${
                isDraft ? "bg-amber-50 text-amber-700 border border-amber-200/60" : "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
              }`}>
                {isDraft ? "Draft Copy (Unfinalized)" : "✓ Finalized Institutional Record"}
              </span>
              <h2 className="text-base md:text-lg font-bold text-gray-900 tracking-tight">
                Official OBE Grading Sheet
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                {wf.course?.code} — {wf.course?.title}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mt-4 pt-4 border-t border-gray-200/60">
              <div><span className="text-gray-400">Course: </span><span className="font-bold text-gray-800">{wf.course?.code}</span></div>
              <div><span className="text-gray-400">Section: </span><span className="font-bold text-gray-800">{wf.section?.class_name}</span></div>
              <div><span className="text-gray-400">Session: </span><span className="font-bold text-gray-800">{wf.semester?.name}</span></div>
              <div><span className="text-gray-400">Instructor: </span><span className="font-bold text-gray-800">{wf.user?.name}</span></div>
            </div>
          </div>

          {components.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-xs text-gray-400 font-semibold">
                No blueprint components configured for this section yet.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px]">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="text-left px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">#</th>
                      <th className="text-left px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider sticky left-10 bg-gray-50 z-10">Roll No</th>
                      <th className="text-left px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider sticky left-36 bg-gray-50 z-10">Student Name</th>
                      {components.map((bc) => (
                        <th key={bc.id} className="text-center px-3 py-3.5 text-[10px] font-bold text-gray-500 uppercase min-w-[70px] border-l border-gray-100">
                          <div>{bc.component_id}</div>
                          <div className="font-normal text-gray-400">({bc.weight_pct}%)</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {wf.sectionStudents.map((s, idx) => (
                      <tr key={s.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-4 py-3 text-xs text-gray-400 sticky left-0 bg-white z-10">{idx + 1}</td>
                        <td className="px-4 py-3 text-xs font-mono font-bold text-gray-700 sticky left-10 bg-white z-10">{s.roll_no}</td>
                        <td className="px-4 py-3 text-xs font-semibold text-gray-800 sticky left-36 bg-white z-10">{s.name}</td>
                        {components.map((bc) => (
                          <td key={bc.id} className="px-3 py-3 text-center text-xs font-semibold text-gray-700 border-l border-gray-50">
                            {getMark(s.id, bc.id)}/{bc.max_marks}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-gray-50/70 border-t border-gray-150 flex items-center justify-between text-xs">
                <div className="flex gap-6">
                  <span className="text-gray-500">Total Enrolled: <span className="font-bold text-gray-800">{wf.sectionStudents.length}</span></span>
                  <span className="text-gray-500">Status: <span className={`font-bold ${isDraft ? "text-amber-600" : "text-emerald-600"}`}>{isDraft ? "Draft" : "Finalized"}</span></span>
                </div>
                <div className="text-[11px] text-gray-400 font-medium">Generated: {new Date().toISOString().slice(0, 10)}</div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}