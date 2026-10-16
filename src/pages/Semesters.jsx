import { useState } from "react";
import { semesters, courses } from "../data/mockData";
import { useLocalState, nextId, logAudit } from "../data/store";
import { usePermissions } from "../hooks/usePermissions";
import Modal from "../components/Modal";
import { FormField } from "../components/FormField";
import { Calendar, Plus, Edit, Trash2, Lock } from "lucide-react";

const defaults = { name: "", start_date: "", end_date: "", is_active: false };

export default function Semesters() {
  const { canManage } = usePermissions();
  const [items, setItems] = useLocalState("obe_semesters", semesters);
  const [courseList] = useLocalState("obe_courses", courses);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(defaults);

  const openAdd = () => {
    setForm(defaults);
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
      logAudit("INSERT", "Semester", next[next.length - 1].id);
    } else {
      setItems(items.map((i) => (i.id === form.id ? form : i)));
      logAudit("UPDATE", "Semester", form.id);
    }
    setModal(null);
  };
  const handleDelete = (id) => {
    if (courseList.some((course) => course.session_id === id)) {
      window.alert("Move the mapped courses to another session before deleting this session.");
      return;
    }
    if (window.confirm("Delete this session?")) {
      setItems(items.filter((i) => i.id !== id));
      logAudit("DELETE", "Semester", id);
    }
  };
  const toggleActive = (id) => {
    const activating = !items.find((item) => item.id === id)?.is_active;
    setItems(items.map((item) => ({
      ...item,
      is_active: item.id === id ? activating : activating ? false : item.is_active,
    })));
    logAudit("UPDATE", "Semester", id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Academic Sessions</h1>
          <p className="text-xs text-gray-500 font-medium mt-1">Manage institutional semester calendar terms and active periods.</p>
        </div>
        {canManage ? (
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Session</span>
          </button>
        ) : (
          <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
            <Lock size={13} /> View only — admin can manage
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {items.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shadow-2xs ${
                      s.is_active
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200/60"
                        : "bg-gray-50 text-gray-400 border border-gray-150"
                    }`}
                  >
                    <Calendar size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 leading-tight">{s.name}</h3>
                    {canManage ? (
                      <button
                        onClick={() => toggleActive(s.id)}
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border mt-1 transition-all cursor-pointer ${
                          s.is_active
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                            : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
                        }`}
                      >
                        {s.is_active ? "● Active Term" : "○ Inactive Term"}
                      </button>
                    ) : (
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border mt-1 inline-block ${
                          s.is_active
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                            : "bg-gray-100 text-gray-500 border-gray-200"
                        }`}
                      >
                        {s.is_active ? "● Active Term" : "○ Inactive Term"}
                      </span>
                    )}
                  </div>
                </div>
                {canManage && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(s)}
                      className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2 text-center text-[11px]">
              <div className="bg-gray-50/80 rounded-2xl py-2 px-3 border border-gray-150">
                <p className="text-gray-400 font-medium">Start Date</p>
                <p className="font-bold text-gray-800 mt-0.5 font-mono">{s.start_date}</p>
              </div>
              <div className="bg-gray-50/80 rounded-2xl py-2 px-3 border border-gray-150">
                <p className="text-gray-400 font-medium">End Date</p>
                <p className="font-bold text-gray-800 mt-0.5 font-mono">{s.end_date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === "add" ? "Add Academic Session" : "Edit Academic Session"}
      >
        <div className="space-y-4">
          <FormField label="Session Name (e.g. Spring 2027)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <FormField label="Start Date" type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
          <FormField label="End Date" type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
          <label className="flex items-center gap-2.5 text-xs font-semibold text-gray-700 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="w-4 h-4 rounded-md accent-black cursor-pointer"
            />
            <span>Set as active session (auto-selected for instructors)</span>
          </label>
          <div className="flex gap-2.5 pt-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-black hover:bg-neutral-800 text-white py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
            >
              Save Session
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