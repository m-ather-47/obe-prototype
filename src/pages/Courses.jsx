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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Courses</h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            {canManage
              ? "Create courses and map them to academic sessions & degrees."
              : "Choose your active session and a section to see assigned courses."}
          </p>
        </div>
        {canManage ? (
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Course</span>
          </button>
        ) : (
          <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
            <Lock size={13} /> View only — admin can manage
          </span>
        )}
      </div>

      {!canManage && <SessionSectionSelector wf={wf} />}

      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-100">
              <th className="text-left px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Code</th>
              <th className="text-left px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Title</th>
              <th className="text-left px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Program</th>
              <th className="text-left px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Session</th>
              <th className="text-left px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Credit Hrs</th>
              {canManage && (
                <th className="text-right px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visibleCourses.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-emerald-50 text-emerald-600 border border-emerald-200/60 rounded-xl flex items-center justify-center font-bold shadow-2xs">
                      <BookOpen size={15} />
                    </div>
                    <span className="text-xs font-mono font-bold text-gray-900">{c.code}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs font-semibold text-gray-800">{c.title}</td>
                <td className="px-6 py-4 text-xs">
                  <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-medium">
                    {getProgName(c.program_id)}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-medium text-gray-600">
                  {sessions.find((s) => s.id === c.session_id)?.name || "—"}
                </td>
                <td className="px-6 py-4 text-xs font-bold text-gray-800">{c.credit_hours} Cr.</td>
                {canManage && (
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
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
                  </td>
                )}
              </tr>
            ))}
            {visibleCourses.length === 0 && (
              <tr>
                <td colSpan={canManage ? 6 : 5} className="px-6 py-12 text-center text-xs text-gray-400">
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
        <div className="space-y-4">
          <FormField
            label="Course Code (e.g. CS-500)"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />
          <FormField
            label="Course Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
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
            label="Academic Session"
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
          <div className="flex gap-2.5 pt-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-black hover:bg-neutral-800 text-white py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
            >
              Save Course
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