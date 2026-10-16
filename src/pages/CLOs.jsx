import { useState } from "react";
import { clos, plos, sections, courses, blueprintComponents } from "../data/mockData";
import { useLocalState, nextId, logAudit, normalizeCourseBlueprint } from "../data/store";
import { usePermissions } from "../hooks/usePermissions";
import { isAdmin } from "../data/auth";
import { useWorkflow } from "../hooks/useWorkflow";
import Modal from "../components/Modal";
import { FormField, SelectField } from "../components/FormField";
import { GraduationCap, Plus, Edit, Trash2, Check, X, Clock3, ShieldCheck } from "lucide-react";

const defaults = { number: "", title: "", plo_id: 1, course_id: 1, bloom_level: "Understand", passing_threshold: 50 };
const bloomLevels = ["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"];

export default function CLOs() {
  const { user } = usePermissions();
  const wf = useWorkflow();
  const [items, setItems] = useLocalState("obe_clos", clos);
  const [ploList] = useLocalState("obe_plos", plos);
  const [sectionList] = useLocalState("obe_sections", sections);
  const [courseList] = useLocalState("obe_courses", courses);
  const [blueprint, setBlueprint] = useLocalState("obe_blueprint", blueprintComponents);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(defaults);
  const admin = isAdmin(user);
  const instructorCourses = wf.assignedCourses;
  const availableCourses = admin ? courseList : instructorCourses;
  const visibleItems = admin
    ? items
    : items.filter((item) => item.created_by === user?.id);

  const getPLO = (id) => ploList.find((p) => p.id === id);
  const getCourse = (id) => courseList.find((c) => c.id === id);

  const openAdd = () => {
    setForm({ ...defaults, plo_id: ploList[0]?.id ?? 1, course_id: availableCourses[0]?.id ?? 1 });
    setModal({ mode: "add" });
  };
  const openEdit = (item) => {
    setForm(item);
    setModal({ mode: "edit" });
  };
  const handleSave = () => {
    if (modal.mode === "add") {
      const newCLO = { ...form, id: nextId(items), created_by: user.id, approval_status: "pending" };
      const next = [...items, newCLO];
      setItems(next);
      const courseCLOIds = next.filter((clo) => clo.course_id === newCLO.course_id).map((clo) => clo.id);
      setBlueprint(normalizeCourseBlueprint(blueprint, courseCLOIds, courseCLOIds[0] ?? newCLO.id));
      logAudit("INSERT", "CLO", next[next.length - 1].id);
    } else {
      setItems(items.map((i) => (i.id === form.id ? { ...form, created_by: i.created_by, approval_status: "pending" } : i)));
      logAudit("UPDATE", "CLO", form.id);
    }
    setModal(null);
  };
  const handleDelete = (id) => {
    if (window.confirm("Delete this CLO?")) {
      setItems(items.filter((i) => i.id !== id));
      logAudit("DELETE", "CLO", id);
    }
  };
  const handleApproval = (id, approvalStatus) => {
    setItems(items.map((item) => (item.id === id ? { ...item, approval_status: approvalStatus } : item)));
    logAudit(approvalStatus === "approved" ? "APPROVE" : "REJECT", "CLO", id);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Course Learning Outcomes</h1>
          <p className="text-sm text-gray-500">CLOs are owned by their teacher and apply to every section using the course.</p>
        </div>
        {!admin && availableCourses.length > 0 && (
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Add CLO
          </button>
        )}
        {admin && (
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <ShieldCheck size={14} /> Admin approval queue
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {visibleItems.map((c) => {
          const plo = getPLO(c.plo_id);
          const course = getCourse(c.course_id);
          const courseSections = sectionList.filter((section) => section.course_id === c.course_id);

          return (
            <div key={c.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                    <GraduationCap size={20} className="text-indigo-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-gray-800">{c.number}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{c.bloom_level}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        c.approval_status === "approved"
                          ? "bg-green-100 text-green-700"
                          : c.approval_status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                      }`}>
                        {c.approval_status || "pending"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{c.title}</p>
                    <div className="flex gap-3 mt-2 text-xs text-gray-400">
                      <span>{course?.code} · {courseSections.length} section{courseSections.length === 1 ? "" : "s"} using this course</span>
                      {plo && <span>Mapped to {plo.number}</span>}
                    </div>
                  </div>
                </div>
                {!admin && (
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(c)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Edit size={14} className="text-gray-500" /></button>
                    <button onClick={() => handleDelete(c.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={14} className="text-red-500" /></button>
                  </div>
                )}
                {admin && c.approval_status !== "approved" && (
                  <div className="flex gap-1">
                    <button title="Approve CLO" onClick={() => handleApproval(c.id, "approved")} className="p-1.5 hover:bg-green-50 rounded-lg"><Check size={15} className="text-green-600" /></button>
                    <button title="Reject CLO" onClick={() => handleApproval(c.id, "rejected")} className="p-1.5 hover:bg-red-50 rounded-lg"><X size={15} className="text-red-600" /></button>
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-center gap-4">
                <div className="bg-gray-50 rounded-lg px-3 py-1.5 text-xs">
                  <span className="text-gray-400">Passing Threshold: </span>
                  <span className="font-semibold text-gray-700">{c.passing_threshold}%</span>
                </div>
                {c.approval_status === "pending" && (
                  <div className="flex items-center gap-1 text-xs text-amber-600"><Clock3 size={13} /> Awaiting admin approval</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === "add" ? "Add CLO" : "Edit CLO"}
      >
        <div className="space-y-3">
          <FormField label="Number (e.g. CLO-4)" value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} />
          <FormField label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <SelectField
            label="Course (CLO applies to all sections)"
            value={form.course_id}
            onChange={(e) => setForm({ ...form, course_id: Number(e.target.value) })}
          >
            {availableCourses.map((course) => (
              <option key={course.id} value={course.id}>{course.code} — {course.title}</option>
            ))}
          </SelectField>
          <SelectField
            label="Mapped PLO"
            value={form.plo_id}
            onChange={(e) => setForm({ ...form, plo_id: Number(e.target.value) })}
          >
            {ploList.map((p) => (
              <option key={p.id} value={p.id}>{p.number} — {p.title}</option>
            ))}
          </SelectField>
          <SelectField
            label="Bloom Level"
            value={form.bloom_level}
            onChange={(e) => setForm({ ...form, bloom_level: e.target.value })}
          >
            {bloomLevels.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </SelectField>
          <FormField
            label="Passing Threshold (%)"
            type="number"
            value={form.passing_threshold}
            onChange={(e) => setForm({ ...form, passing_threshold: Number(e.target.value) })}
          />
          <div className="flex gap-2 pt-2">
            <button onClick={handleSave} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Submit for Approval
            </button>
            <button onClick={() => setModal(null)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}