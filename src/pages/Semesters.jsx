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
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Sessions</h1>
          <p className="text-sm text-gray-500">Manage academic sessions</p>
        </div>
        {canManage ? (
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Add Session
          </button>
        ) : (
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <Lock size={12} /> View only — admin can manage
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((s) => (
          <div key={s.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.is_active ? "bg-green-100" : "bg-gray-100"}`}>
                  <Calendar size={20} className={s.is_active ? "text-green-600" : "text-gray-400"} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">{s.name}</h3>
                  {canManage ? (
                    <button
                      onClick={() => toggleActive(s.id)}
                      className={`text-xs px-2 py-0.5 rounded-full ${s.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                    >
                      {s.is_active ? "Active" : "Inactive"}
                    </button>
                  ) : (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${s.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {s.is_active ? "Active" : "Inactive"}
                    </span>
                  )}
                </div>
              </div>
              {canManage && (
                <div className="flex gap-1">
                  <button onClick={() => openEdit(s)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Edit size={14} className="text-gray-500" /></button>
                  <button onClick={() => handleDelete(s.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={14} className="text-red-500" /></button>
                </div>
              )}
            </div>
            <div className="mt-4 text-xs text-gray-500 space-y-1">
              <p>Start: {s.start_date}</p>
              <p>End: {s.end_date}</p>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === "add" ? "Add Session" : "Edit Session"}
      >
        <div className="space-y-3">
          <FormField label="Name (e.g. Spring 2027)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <FormField label="Start Date" type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
          <FormField label="End Date" type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="accent-blue-600"
            />
            Active session (auto-selected for teachers)
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
      </Modal>
    </div>
  );
}