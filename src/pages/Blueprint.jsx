import { useState } from "react";
import { blueprintComponents, clos } from "../data/mockData";
import {
  useLocalState,
  nextId,
  logAudit,
  normalizeCourseBlueprint,
  applyDerivedWeights,
  nextComponentId,
  BLUEPRINT_MIN,
  BLUEPRINT_FIXED,
} from "../data/store";
import { usePermissions } from "../hooks/usePermissions";
import { useWorkflow } from "../hooks/useWorkflow";
import { isAdmin } from "../data/auth";
import Modal from "../components/Modal";
import { FormField, SelectField } from "../components/FormField";
import WorkflowSelector from "../components/WorkflowSelector";
import { ClipboardList, Plus, Edit, Trash2, Lock } from "lucide-react";

// Teachers can only add the categories that allow more than one component.
const ADDABLE_TYPES = ["Assignment", "Quiz", "Project"];
const CATEGORY_MAX_MARKS = { Assignment: 20, Quiz: 10, Project: 50 };

const colors = ["bg-cyan-500", "bg-emerald-500", "bg-amber-500", "bg-purple-500", "bg-rose-500"];
const round1 = (n) => Math.round(n * 10) / 10;

export default function Blueprint() {
  const { user } = usePermissions();
  const wf = useWorkflow();
  const [items, setItems] = useLocalState("obe_blueprint", blueprintComponents);
  const [cloList] = useLocalState("obe_clos", clos);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(null);

  const courseCLOs = cloList.filter((clo) => clo.course_id === wf.courseId);
  const courseCLOIds = courseCLOs.map((clo) => clo.id);
  const defaultCloId = courseCLOs[0]?.id ?? null;
  // Weights are derived so every category — and the whole blueprint — totals 100%.
  const components = applyDerivedWeights(items.filter((component) => courseCLOIds.includes(component.clo_id)));
  const canEdit = Boolean(wf.course && courseCLOs.length > 0 && (isAdmin(user) || user?.role === "instructor"));

  const getCLO = (id) => cloList.find((c) => c.id === id);
  const hasProject = components.some((bc) => bc.exam_type === "Project");
  const addableTypes = ADDABLE_TYPES.filter((type) => type !== "Project" || !hasProject);
  const countOf = (type) => components.filter((bc) => bc.exam_type === type).length;

  const grouped = components.reduce((acc, bc) => {
    if (!acc[bc.exam_type]) acc[bc.exam_type] = [];
    acc[bc.exam_type].push(bc);
    return acc;
  }, {});

  // Re-run normalization so fixed components, minimums, and derived weights stay consistent.
  const persist = (nextItems) => setItems(normalizeCourseBlueprint(nextItems, courseCLOIds, defaultCloId));

  const openAdd = () => {
    const type = addableTypes[0] ?? "Assignment";
    setForm({
      clo_id: defaultCloId ?? 1,
      exam_type: type,
      max_marks: CATEGORY_MAX_MARKS[type] ?? 20,
      is_kpi: false,
    });
    setModal({ mode: "add" });
  };
  const openEdit = (item) => {
    setForm({ ...item });
    setModal({ mode: "edit" });
  };
  const handleSave = () => {
    if (modal.mode === "add") {
      const id = nextId(items);
      const component = {
        id,
        clo_id: form.clo_id,
        exam_type: form.exam_type,
        component_id: nextComponentId(items, courseCLOIds, form.exam_type),
        max_marks: form.max_marks,
        is_kpi: form.is_kpi,
        is_fixed: false,
      };
      persist([...items, component]);
      logAudit("INSERT", "Blueprint", id);
    } else {
      persist(items.map((i) => (i.id === form.id ? { ...i, clo_id: form.clo_id, max_marks: form.max_marks, is_kpi: form.is_kpi } : i)));
      logAudit("UPDATE", "Blueprint", form.id);
    }
    setModal(null);
  };
  const handleDelete = (bc) => {
    if (bc.is_fixed || BLUEPRINT_FIXED.includes(bc.exam_type)) return;
    if (BLUEPRINT_MIN[bc.exam_type] && countOf(bc.exam_type) <= BLUEPRINT_MIN[bc.exam_type]) {
      window.alert(`At least ${BLUEPRINT_MIN[bc.exam_type]} ${bc.exam_type} components are required.`);
      return;
    }
    if (window.confirm("Delete this blueprint component?")) {
      persist(items.filter((i) => i.id !== bc.id));
      logAudit("DELETE", "Blueprint", bc.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Assessment Blueprint</h1>
          <p className="text-xs text-gray-500 font-medium mt-1">Design course-wide assessment blueprints and map components to specific CLOs.</p>
        </div>
        {canEdit ? (
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Component</span>
          </button>
        ) : (
          <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
            <Lock size={13} /> Select a course with CLOs to manage its blueprint
          </span>
        )}
      </div>

      <WorkflowSelector wf={wf} />

      {!wf.course ? (
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-12 text-center">
          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-gray-400 border border-gray-150">
            <ClipboardList size={22} />
          </div>
          <p className="text-xs font-semibold text-gray-500">Select an academic session and course above to view its blueprint.</p>
        </div>
      ) : courseCLOs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-12 text-center">
          <ClipboardList size={22} className="mx-auto mb-3 text-gray-300" />
          <p className="text-xs font-semibold text-gray-500">Create at least one course CLO first to configure its blueprint.</p>
        </div>
      ) : (
        <>
          {/* Weight Distribution Bar Card */}
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
              <div>
                <h3 className="text-xs font-bold text-gray-900 tracking-tight">Weight Distribution Matrix</h3>
                <p className="mt-0.5 text-[11px] text-gray-400">Mid &amp; Final exams are fixed · min 4 Assignments &amp; 4 Quizzes · derived automatically to 100%</p>
              </div>
              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full self-start">
                Total: {Math.round(components.reduce((s, bc) => s + bc.weight_pct, 0))}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 flex overflow-hidden p-0.5 gap-0.5">
              {Object.entries(grouped).map(([type, items], i) => {
                const total = round1(items.reduce((s, bc) => s + bc.weight_pct, 0));
                return (
                  <div
                    key={type}
                    className={`${colors[i % colors.length]} h-full rounded-full transition-all`}
                    style={{ width: `${total}%` }}
                    title={`${type}: ${total}%`}
                  />
                );
              })}
            </div>
            <div className="flex gap-4 mt-3 flex-wrap">
              {Object.entries(grouped).map(([type, items], i) => {
                const total = round1(items.reduce((s, bc) => s + bc.weight_pct, 0));
                return (
                  <div key={type} className="flex items-center gap-2 text-xs font-medium text-gray-600">
                    <div className={`w-2 h-2 rounded-full ${colors[i % colors.length]}`} />
                    <span>{type}: <strong className="text-gray-900">{total}%</strong></span>
                  </div>
                );
              })}
            </div>
          </div>

          {components.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-12 text-center">
              <p className="text-xs font-semibold text-gray-400">No blueprint components configured for this course.</p>
            </div>
          ) : (
            Object.entries(grouped).map(([type, items]) => (
              <div key={type} className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="px-6 py-4 bg-gray-50/70 border-b border-gray-150 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-white rounded-xl border border-gray-200 shadow-2xs flex items-center justify-center text-gray-600">
                      <ClipboardList size={14} />
                    </div>
                    <h3 className="text-xs font-bold text-gray-900 tracking-tight">{type}</h3>
                  </div>
                  <span className="text-[10px] font-semibold text-gray-400 bg-white border border-gray-200/80 px-2 py-0.5 rounded-full">
                    {items.length} component{items.length === 1 ? "" : "s"}
                  </span>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/30 border-b border-gray-100">
                      <th className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Component ID</th>
                      <th className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mapped CLO</th>
                      <th className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Weight %</th>
                      <th className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Max Marks</th>
                      <th className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">KPI Indicator</th>
                      {canEdit && (
                        <th className="text-right px-6 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.map((bc) => {
                      const clo = getCLO(bc.clo_id);
                      return (
                        <tr key={bc.id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="px-6 py-3 text-xs font-mono font-bold text-gray-900">{bc.component_id}</td>
                          <td className="px-6 py-3 text-xs text-gray-700 font-semibold">{clo?.number || "—"}</td>
                          <td className="px-6 py-3 text-xs font-bold text-gray-900">{round1(bc.weight_pct)}%</td>
                          <td className="px-6 py-3 text-xs text-gray-600 font-medium">{bc.max_marks}</td>
                          <td className="px-6 py-3">
                            {bc.is_kpi ? (
                              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
                                KPI
                              </span>
                            ) : (
                              <span className="text-xs text-gray-300 font-medium">—</span>
                            )}
                          </td>
                          {canEdit && (
                            <td className="px-6 py-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => openEdit(bc)}
                                  className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  onClick={() => handleDelete(bc)}
                                  disabled={bc.is_fixed || (BLUEPRINT_MIN[bc.exam_type] && countOf(bc.exam_type) <= BLUEPRINT_MIN[bc.exam_type])}
                                  title={bc.is_fixed ? "Mid and Final exams cannot be deleted" : BLUEPRINT_MIN[bc.exam_type] && countOf(bc.exam_type) <= BLUEPRINT_MIN[bc.exam_type] ? `At least ${BLUEPRINT_MIN[bc.exam_type]} ${bc.exam_type} components are required` : "Delete component"}
                                  className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))
          )}
        </>
      )}

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === "add" ? "Add Blueprint Component" : "Edit Blueprint Component"}
      >
        {form && (
          <div className="space-y-4">
            <SelectField
              label="Target Mapped CLO"
              value={form.clo_id}
              onChange={(e) => setForm({ ...form, clo_id: Number(e.target.value) })}
            >
              {courseCLOs.map((c) => (
                <option key={c.id} value={c.id}>{c.number} — {c.title}</option>
              ))}
            </SelectField>
            {modal?.mode === "add" ? (
              <SelectField
                label="Component Category"
                value={form.exam_type}
                onChange={(e) => setForm({ ...form, exam_type: e.target.value, max_marks: CATEGORY_MAX_MARKS[e.target.value] ?? form.max_marks })}
              >
                {addableTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </SelectField>
            ) : (
              <FormField label="Component Category" value={form.exam_type} disabled />
            )}
            <FormField
              label="Maximum Marks"
              type="number"
              value={form.max_marks}
              onChange={(e) => setForm({ ...form, max_marks: Number(e.target.value) })}
            />
            <p className="text-[11px] text-gray-400 font-medium">Weights are derived automatically so the overall blueprint total is always 100%.</p>
            <label className="flex items-center gap-2.5 text-xs font-semibold text-gray-700 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={form.is_kpi}
                onChange={(e) => setForm({ ...form, is_kpi: e.target.checked })}
                className="w-4 h-4 rounded-md accent-black cursor-pointer"
              />
              <span>Mark as Key Performance Indicator (KPI) Component</span>
            </label>
            <div className="flex gap-2.5 pt-3">
              <button
                onClick={handleSave}
                className="flex-1 bg-black hover:bg-neutral-800 text-white py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
              >
                Save Component
              </button>
              <button
                onClick={() => setModal(null)}
                className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}