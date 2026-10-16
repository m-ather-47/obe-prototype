import { useState } from "react";
import { programs, departments } from "../data/mockData";
import { useLocalState, nextId, logAudit } from "../data/store";
import { usePermissions } from "../hooks/usePermissions";
import Modal from "../components/Modal";
import { FormField, SelectField } from "../components/FormField";
import { Layers, Plus, Edit, Trash2, Lock } from "lucide-react";

const defaults = { name: "", code: "", department_id: 1, credit_hours: 3 };

export default function Programs() {
  const { canManage } = usePermissions();
  const [items, setItems] = useLocalState("obe_programs", programs);
  const [depts] = useLocalState("obe_departments", departments);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(defaults);

  const getDeptName = (id) => depts.find((d) => d.id === id)?.name || "—";

  const openAdd = () => {
    setForm({ ...defaults, department_id: depts[0]?.id ?? 1 });
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
      logAudit("INSERT", "Program", next[next.length - 1].id);
    } else {
      setItems(items.map((i) => (i.id === form.id ? form : i)));
      logAudit("UPDATE", "Program", form.id);
    }
    setModal(null);
  };
  const handleDelete = (id) => {
    if (window.confirm("Delete this program?")) {
      setItems(items.filter((i) => i.id !== id));
      logAudit("DELETE", "Program", id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Programs</h1>
          <p className="text-sm text-gray-500">Manage academic programs</p>
        </div>
        {canManage ? (
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Add Program
          </button>
        ) : (
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <Lock size={12} /> View only — admin can manage
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Layers size={20} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">{p.name}</h3>
                  <p className="text-xs text-gray-500">{getDeptName(p.department_id)}</p>
                </div>
              </div>
              {canManage && (
                <div className="flex gap-1">
                  <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Edit size={14} className="text-gray-500" /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={14} className="text-red-500" /></button>
                </div>
              )}
            </div>
            <div className="mt-4 flex gap-4">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-800">{p.code}</p>
                <p className="text-xs text-gray-400">Code</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-800">{p.credit_hours}</p>
                <p className="text-xs text-gray-400">Credit Hrs</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === "add" ? "Add Program" : "Edit Program"}
      >
        <div className="space-y-3">
          <FormField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <FormField label="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          <SelectField
            label="Department"
            value={form.department_id}
            onChange={(e) => setForm({ ...form, department_id: Number(e.target.value) })}
          >
            {depts.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
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