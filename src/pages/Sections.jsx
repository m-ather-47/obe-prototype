import { useState } from "react";
import { sections, courses, semesters, users } from "../data/mockData";
import { useLocalState, nextId, logAudit } from "../data/store";
import { usePermissions } from "../hooks/usePermissions";
import { isAdmin } from "../data/auth";
import Modal from "../components/Modal";
import { FormField, SelectField } from "../components/FormField";
import { Users, Plus, Edit, Trash2, Lock } from "lucide-react";

const defaults = { course_id: 1, semester_id: 1, instructor_id: 2, class_name: "", shift: "Morning", status: "active" };

export default function Sections() {
  const { user, canManage } = usePermissions();
  const [items, setItems] = useLocalState("obe_sections", sections);
  const [courseList] = useLocalState("obe_courses", courses);
  const [semesterList] = useLocalState("obe_semesters", semesters);
  const [userList] = useLocalState("obe_users", users);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(defaults);

  const coursesForSession = courseList.filter((course) => course.session_id === form.semester_id);
  const getCourseName = (id) => courseList.find((c) => c.id === id)?.code || "—";
  const getSemesterName = (id) => semesterList.find((s) => s.id === id)?.name || "—";
  const getInstructorName = (id) => userList.find((u) => u.id === id)?.name || "—";
  const instructors = userList.filter((u) => u.role === "instructor");
  const visibleItems = isAdmin(user) ? items : items.filter((section) => section.instructor_id === user?.id);

  const openAdd = () => {
    const sessionId = semesterList.find((session) => session.is_active)?.id ?? semesterList[0]?.id ?? 1;
    const course = courseList.find((item) => item.session_id === sessionId) ?? courseList[0];
    setForm({ ...defaults, course_id: course?.id ?? "", semester_id: course?.session_id ?? sessionId });
    setModal({ mode: "add" });
  };
  const openEdit = (item) => {
    setForm(item);
    setModal({ mode: "edit" });
  };
  const handleSave = () => {
    if (modal.mode === "add") {
      const next = [...items, { ...form, id: nextId(items) }];
      setItems(next);
      logAudit("INSERT", "Section", next[next.length - 1].id);
    } else {
      setItems(items.map((i) => (i.id === form.id ? form : i)));
      logAudit("UPDATE", "Section", form.id);
    }
    setModal(null);
  };
  const handleDelete = (id) => {
    if (window.confirm("Delete this section?")) {
      setItems(items.filter((i) => i.id !== id));
      logAudit("DELETE", "Section", id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Sections & Classes</h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            {canManage
              ? "Allocate sections to academic courses and assign faculty instructors."
              : "Your section allocations by session, course, and class."}
          </p>
        </div>
        {canManage ? (
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Section</span>
          </button>
        ) : (
          <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
            <Lock size={13} /> View only — admin can manage
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {visibleItems.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 text-amber-600 border border-amber-200/60 rounded-2xl flex items-center justify-center font-bold shadow-2xs">
                    <Users size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 leading-tight">
                      {s.class_name} — {getCourseName(s.course_id)}
                    </h3>
                    <p className="text-[11px] text-gray-400 font-medium mt-0.5">{getSemesterName(s.semester_id)}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  s.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200/60" : "bg-gray-100 text-gray-500 border-gray-200"
                }`}>
                  {s.status}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                <div className="bg-gray-50/80 rounded-2xl p-3 border border-gray-150">
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">Faculty Instructor</p>
                  <p className="text-gray-900 font-bold mt-0.5">{getInstructorName(s.instructor_id)}</p>
                </div>
                <div className="bg-gray-50/80 rounded-2xl p-3 border border-gray-150">
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">Class Shift</p>
                  <p className="text-gray-900 font-bold mt-0.5">{s.shift}</p>
                </div>
              </div>
            </div>

            {canManage && (
              <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                <button
                  onClick={() => openEdit(s)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-full transition-colors cursor-pointer"
                >
                  <Edit size={12} /> <span>Edit Allocation</span>
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-full transition-colors cursor-pointer"
                  title="Delete Section"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        ))}
        {visibleItems.length === 0 && (
          <div className="md:col-span-2 bg-white border border-gray-200/80 rounded-3xl p-12 text-center text-xs font-semibold text-gray-400">
            No sections are assigned to {user?.name}.
          </div>
        )}
      </div>

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === "add" ? "Add Section Allocation" : "Edit Section Allocation"}
      >
        <div className="space-y-4">
          <SelectField
            label="Academic Course"
            value={form.course_id}
            onChange={(e) => setForm({ ...form, course_id: Number(e.target.value) })}
          >
            {coursesForSession.length === 0 && <option value="">No courses mapped to this session</option>}
            {coursesForSession.map((c) => (
              <option key={c.id} value={c.id}>{c.code} — {c.title}</option>
            ))}
          </SelectField>
          <SelectField
            label="Academic Session"
            value={form.semester_id}
            onChange={(e) => {
              const semester_id = Number(e.target.value);
              const nextCourse = courseList.find((course) => course.session_id === semester_id);
              setForm({ ...form, semester_id, course_id: nextCourse?.id ?? "" });
            }}
          >
            {semesterList.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </SelectField>
          <SelectField
            label="Assigned Instructor"
            value={form.instructor_id}
            onChange={(e) => setForm({ ...form, instructor_id: Number(e.target.value) })}
          >
            {instructors.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </SelectField>
          <FormField label="Class Name (e.g. BSCS-4A)" value={form.class_name} onChange={(e) => setForm({ ...form, class_name: e.target.value })} />
          <SelectField
            label="Class Shift"
            value={form.shift}
            onChange={(e) => setForm({ ...form, shift: e.target.value })}
          >
            <option>Morning</option>
            <option>Evening</option>
          </SelectField>
          <SelectField
            label="Allocation Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option>active</option>
            <option>archived</option>
          </SelectField>
          <div className="flex gap-2.5 pt-3">
            <button
              disabled={!form.course_id}
              onClick={handleSave}
              className="flex-1 bg-black hover:bg-neutral-800 text-white py-2.5 rounded-full text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40 transition-all cursor-pointer"
            >
              Save Allocation
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