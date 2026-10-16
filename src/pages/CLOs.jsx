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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Course Learning Outcomes</h1>
          <p className="text-xs text-gray-500 font-medium mt-1">CLOs are owned by course instructors and apply across assigned sections.</p>
        </div>
        {!admin && availableCourses.length > 0 && (
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>Add CLO</span>
          </button>
        )}
        {admin && (
          <span className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold bg-white border border-gray-200/90 rounded-full px-4 py-2 shadow-2xs">
            <ShieldCheck size={14} className="text-emerald-600" /> Admin approval queue
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {visibleItems.map((c) => {
          const plo = getPLO(c.plo_id);
          const course = getCourse(c.course_id);
          const courseSections = sectionList.filter((section) => section.course_id === c.course_id);

          return (
            <div
              key={c.id}
              className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-5 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 border border-indigo-200/60 rounded-2xl flex items-center justify-center font-bold shadow-2xs shrink-0">
                    <GraduationCap size={18} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xs font-bold text-gray-900">{c.number}</h3>
                      <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {c.bloom_level}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                          c.approval_status === "approved"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                            : c.approval_status === "rejected"
                              ? "bg-red-50 text-red-700 border-red-200/60"
                              : "bg-amber-50 text-amber-700 border-amber-200/60"
                        }`}
                      >
                        {c.approval_status || "pending"}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-gray-800 mt-1 leading-relaxed">{c.title}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-[11px] text-gray-400 font-medium">
                      <span>{course?.code} · {courseSections.length} section{courseSections.length === 1 ? "" : "s"}</span>
                      {plo && <span className="text-indigo-600 font-semibold">Mapped to {plo.number}</span>}
                    </div>
                  </div>
                </div>

                {!admin && (
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => openEdit(c)}
                      className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
                {admin && c.approval_status !== "approved" && (
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      title="Approve CLO"
                      onClick={() => handleApproval(c.id, "approved")}
                      className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition-colors border border-emerald-200/60"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      title="Reject CLO"
                      onClick={() => handleApproval(c.id, "rejected")}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors border border-red-200/60"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-400">Passing Threshold:</span>
                  <span className="font-bold text-gray-800">{c.passing_threshold}%</span>
                </div>
                {c.approval_status === "pending" && (
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-600 font-medium">
                    <Clock3 size={13} /> Awaiting admin review
                  </div>
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
        <div className="space-y-4">
          <FormField
            label="CLO Identifier (e.g. CLO-4)"
            value={form.number}
            onChange={(e) => setForm({ ...form, number: e.target.value })}
          />
          <FormField
            label="CLO Statement / Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <SelectField
            label="Target Course"
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
            label="Bloom's Taxonomy Level"
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
          <div className="flex gap-2.5 pt-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-black hover:bg-neutral-800 text-white py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
            >
              Submit for Approval
            </button>
            <button
              onClick={() => setModal(null)}
              className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}