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
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Sections</h1>
          <p className="text-sm text-gray-500">{canManage ? "Create section-course assignments and assign each course to a teacher." : "Your section assignments by session, course, and class"}</p>
        </div>
        {canManage ? (
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Add Section
          </button>
        ) : (
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <Lock size={12} /> View only — admin can manage
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleItems.map((s) => (
          <div key={s.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Users size={20} className="text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">{s.class_name} — {getCourseName(s.course_id)}</h3>
                  <p className="text-xs text-gray-500">{getSemesterName(s.semester_id)}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${s.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {s.status}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-gray-400">Instructor</p>
                <p className="text-gray-700 font-medium">{getInstructorName(s.instructor_id)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-gray-400">Shift</p>
                <p className="text-gray-700 font-medium">{s.shift}</p>
              </div>
            </div>
            {canManage && (
              <div className="mt-3 flex gap-2">
                <button onClick={() => openEdit(s)} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Edit size={12} /> Edit
                </button>
                <button onClick={() => handleDelete(s.id)} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            )}
          </div>
        ))}
        {visibleItems.length === 0 && (
          <div className="md:col-span-2 bg-white border border-gray-100 rounded-xl p-8 text-center text-sm text-gray-500">
            No sections are assigned to {user?.name}.
          </div>
        )}
      </div>

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === "add" ? "Add Section Course Assignment" : "Edit Section Course Assignment"}
      >
        <div className="space-y-3">
          <SelectField
            label="Course"
            value={form.course_id}
            onChange={(e) => setForm({ ...form, course_id: Number(e.target.value) })}
          >
            {coursesForSession.length === 0 && <option value="">No courses mapped to this session</option>}
            {coursesForSession.map((c) => (
              <option key={c.id} value={c.id}>{c.code} — {c.title}</option>
            ))}
          </SelectField>
          <SelectField
            label="Session"
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
            label="Instructor"
            value={form.instructor_id}
            onChange={(e) => setForm({ ...form, instructor_id: Number(e.target.value) })}
          >
            {instructors.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </SelectField>
          <FormField label="Class Name (e.g. BSCS-4A)" value={form.class_name} onChange={(e) => setForm({ ...form, class_name: e.target.value })} />
          <SelectField
            label="Shift"
            value={form.shift}
            onChange={(e) => setForm({ ...form, shift: e.target.value })}
          >
            <option>Morning</option>
            <option>Evening</option>
          </SelectField>
          <SelectField
            label="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option>active</option>
            <option>archived</option>
          </SelectField>
          <div className="flex gap-2 pt-2">
            <button disabled={!form.course_id} onClick={handleSave} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors">
              Save
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