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

const colors = ["bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-purple-500", "bg-red-500"];
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Assessment Blueprint</h1>
          <p className="text-sm text-gray-500">Create course-wide assessment blueprints and map their components to CLOs.</p>
        </div>
        {canEdit ? (
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Add Blueprint Component
          </button>
        ) : (
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <Lock size={12} /> Select a course with CLOs to manage its blueprint
          </span>
        )}
      </div>

      <WorkflowSelector wf={wf} />

      {!wf.course ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center">
          <ClipboardList size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Select a session and course to view its blueprint.</p>
        </div>
      ) : courseCLOs.length === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-white p-10 text-center">
          <ClipboardList size={32} className="mx-auto mb-3 text-gray-300" />
          <p className="text-sm text-gray-500">Create a course CLO first to start its blueprint.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-700">Weight Distribution</h3>
                <p className="mt-1 text-xs text-gray-400">Mid &amp; Final exams are fixed · min 4 Assignments &amp; 4 Quizzes · weights are derived automatically · saved in this browser</p>
              </div>
              <span className="text-sm font-bold text-green-600">Total: {Math.round(components.reduce((s, bc) => s + bc.weight_pct, 0))}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 flex overflow-hidden">
              {Object.entries(grouped).map(([type, items], i) => {
                const total = round1(items.reduce((s, bc) => s + bc.weight_pct, 0));
                return (
                  <div
                    key={type}
                    className={`${colors[i % colors.length]} h-full`}
                    style={{ width: `${total}%` }}
                    title={`${type}: ${total}%`}
                  />
                );
              })}
            </div>
            <div className="flex gap-4 mt-2 flex-wrap">
              {Object.entries(grouped).map(([type, items], i) => {
                const total = round1(items.reduce((s, bc) => s + bc.weight_pct, 0));
                return (
                  <div key={type} className="flex items-center gap-1.5 text-xs text-gray-600">
                    <div className={`w-2.5 h-2.5 rounded-full ${colors[i % colors.length]}`} />
                    {type}: {total}%
                  </div>
                );
              })}
            </div>
          </div>

          {components.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center">
              <p className="text-sm text-gray-500">No blueprint components configured for this course.</p>
            </div>
          ) : (
            Object.entries(grouped).map(([type, items]) => (
              <div key={type} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-4">
                <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                  <ClipboardList size={16} className="text-gray-500" />
                  <h3 className="text-sm font-semibold text-gray-700">{type}</h3>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-5 py-2 text-xs font-semibold text-gray-500 uppercase">Component</th>
                      <th className="text-left px-5 py-2 text-xs font-semibold text-gray-500 uppercase">Mapped CLO</th>
                      <th className="text-left px-5 py-2 text-xs font-semibold text-gray-500 uppercase">Weight %</th>
                      <th className="text-left px-5 py-2 text-xs font-semibold text-gray-500 uppercase">Max Marks</th>
                      <th className="text-left px-5 py-2 text-xs font-semibold text-gray-500 uppercase">KPI</th>
                      {canEdit && (
                        <th className="text-right px-5 py-2 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((bc) => {
                      const clo = getCLO(bc.clo_id);
                      return (
                        <tr key={bc.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-2.5 text-sm font-mono font-medium text-gray-800">{bc.component_id}</td>
                          <td className="px-5 py-2.5 text-sm text-gray-600">{clo?.number}</td>
                          <td className="px-5 py-2.5 text-sm font-semibold text-gray-700">{round1(bc.weight_pct)}%</td>
                          <td className="px-5 py-2.5 text-sm text-gray-600">{bc.max_marks}</td>
                          <td className="px-5 py-2.5">
                            {bc.is_kpi ? (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">KPI</span>
                            ) : (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">—</span>
                            )}
                          </td>
                          {canEdit && (
                            <td className="px-5 py-2.5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => openEdit(bc)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Edit size={14} className="text-gray-500" /></button>
                                <button
                                  onClick={() => handleDelete(bc)}
                                  disabled={bc.is_fixed || (BLUEPRINT_MIN[bc.exam_type] && countOf(bc.exam_type) <= BLUEPRINT_MIN[bc.exam_type])}
                                  title={bc.is_fixed ? "Mid and Final exams cannot be deleted" : BLUEPRINT_MIN[bc.exam_type] && countOf(bc.exam_type) <= BLUEPRINT_MIN[bc.exam_type] ? `At least ${BLUEPRINT_MIN[bc.exam_type]} ${bc.exam_type} components are required` : "Delete component"}
                                  className="p-1.5 hover:bg-red-50 rounded-lg disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                                ><Trash2 size={14} className="text-red-500" /></button>
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
        title={modal?.mode === "add" ? "Add Component" : "Edit Component"}
      >
        {form && (
        <div className="space-y-3">
          <SelectField
            label="Mapped CLO"
            value={form.clo_id}
            onChange={(e) => setForm({ ...form, clo_id: Number(e.target.value) })}
          >
            {courseCLOs.map((c) => (
              <option key={c.id} value={c.id}>{c.number} — {c.title}</option>
            ))}
          </SelectField>
          {modal?.mode === "add" ? (
            <SelectField
              label="Component Type"
              value={form.exam_type}
              onChange={(e) => setForm({ ...form, exam_type: e.target.value, max_marks: CATEGORY_MAX_MARKS[e.target.value] ?? form.max_marks })}
            >
              {addableTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </SelectField>
          ) : (
            <FormField label="Component Type" value={form.exam_type} disabled />
          )}
          <FormField label="Max Marks" type="number" value={form.max_marks} onChange={(e) => setForm({ ...form, max_marks: Number(e.target.value) })} />
          <p className="text-xs text-gray-400">Weights are assigned automatically so the blueprint always totals 100%.</p>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.is_kpi}
              onChange={(e) => setForm({ ...form, is_kpi: e.target.checked })}
              className="accent-blue-600"
            />
            KPI Component
          </label>
          <div className="flex gap-2 pt-2">
            <button onClick={handleSave} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Save
            </button>
            <button onClick={() => setModal(null)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
              Cancel
            </button>
          </div>
        </div>
        )}
      </Modal>
    </div>
  );
}