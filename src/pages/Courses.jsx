import { useState } from "react";
import { courses, programs, semesters, sections } from "../data/mockData";
import { useLocalState, nextId, logAudit } from "../data/store";
import { usePermissions } from "../hooks/usePermissions";
import { useWorkflow } from "../hooks/useWorkflow";
import SessionSectionSelector from "../components/SessionSectionSelector";
import Modal from "../components/Modal";
import { FormField, SelectField } from "../components/FormField";
import { BookOpen, Plus, Edit, Trash2, Lock } from "lucide-react";

const defaults = { code: "", title: "", program_id: 1, session_id: 1, credit_hours: 3 };

export default function Courses() {
  const { canManage } = usePermissions();
  const [items, setItems] = useLocalState("obe_courses", courses);
  const [sectionList, setSectionList] = useLocalState("obe_sections", sections);
  const [progs] = useLocalState("obe_programs", programs);
  const [sessions] = useLocalState("obe_semesters", semesters);
  const wf = useWorkflow({ courseData: items, sectionData: sectionList });
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(defaults);

  const visibleCourses = canManage
    ? items
    : wf.sectionKey
      ? wf.coursesForSection
      : [];
  const getProgName = (id) => progs.find((p) => p.id === id)?.code || "—";

  const openAdd = () => {
    setForm({ ...defaults, program_id: progs[0]?.id ?? 1, session_id: sessions[0]?.id ?? 1 });
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
      logAudit("INSERT", "Course", next[next.length - 1].id);
    } else {
      setItems(items.map((i) => (i.id === form.id ? form : i)));
      if (items.find((item) => item.id === form.id)?.session_id !== form.session_id) {
        setSectionList(sectionList.map((section) =>
          section.course_id === form.id ? { ...section, semester_id: form.session_id } : section
        ));
      }
      logAudit("UPDATE", "Course", form.id);
    }
    setModal(null);
  };
  const handleDelete = (id) => {
    if (window.confirm("Delete this course?")) {
      setItems(items.filter((i) => i.id !== id));
      logAudit("DELETE", "Course", id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Courses</h1>
          <p className="text-sm text-gray-500">{canManage ? "Create courses and map them to academic sessions." : "Choose your active session and a section to see its assigned courses."}</p>
        </div>
        {canManage ? (
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Add Course
          </button>
        ) : (
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <Lock size={12} /> View only — admin can manage
          </span>
        )}
      </div>

      {!canManage && <SessionSectionSelector wf={wf} />}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Code</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Title</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Program</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Session</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Credit Hrs</th>
              {canManage && (
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {visibleCourses.map((c) => (
              <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <BookOpen size={16} className="text-emerald-600" />
                    </div>
                    <span className="text-sm font-mono font-medium text-gray-800">{c.code}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-sm text-gray-700">{c.title}</td>
                <td className="px-5 py-3 text-sm text-gray-600">{getProgName(c.program_id)}</td>
                <td className="px-5 py-3 text-sm text-gray-600">{sessions.find((s) => s.id === c.session_id)?.name || "—"}</td>
                <td className="px-5 py-3 text-sm text-gray-600">{c.credit_hours}</td>
                {canManage && (
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(c)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Edit size={14} className="text-gray-500" /></button>
                      <button onClick={() => handleDelete(c.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={14} className="text-red-500" /></button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {visibleCourses.length === 0 && (
              <tr>
                <td colSpan={canManage ? 6 : 5} className="px-5 py-10 text-center text-sm text-gray-500">
                  {canManage ? "No courses are available yet." : "Select a section to see its assigned courses."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === "add" ? "Add Course" : "Edit Course"}
      >
        <div className="space-y-3">
          <FormField label="Code (e.g. CS-500)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          <FormField label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <SelectField
            label="Program"
            value={form.program_id}
            onChange={(e) => setForm({ ...form, program_id: Number(e.target.value) })}
          >
            {progs.map((p) => (
              <option key={p.id} value={p.id}>{p.code} — {p.name}</option>
            ))}
          </SelectField>
          <SelectField
            label="Session"
            value={form.session_id}
            onChange={(e) => setForm({ ...form, session_id: Number(e.target.value) })}
          >
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </SelectField>
          <FormField
            label="Credit Hours"
            type="number"
            value={form.credit_hours}
            onChange={(e) => setForm({ ...form, credit_hours: Number(e.target.value) })}
          />
          <div className="flex gap-2 pt-2">
            <button onClick={handleSave} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
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