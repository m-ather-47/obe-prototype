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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Degree Programs</h1>
          <p className="text-xs text-gray-500 font-medium mt-1">Manage accredited undergraduate and graduate curriculum programs.</p>
        </div>
        {canManage ? (
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Program</span>
          </button>
        ) : (
          <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
            <Lock size={13} /> View only — admin can manage
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 text-purple-600 border border-purple-200/60 rounded-2xl flex items-center justify-center font-bold shadow-2xs">
                    <Layers size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 leading-tight">{p.name}</h3>
                    <p className="text-[11px] text-gray-400 font-medium mt-0.5">{getDeptName(p.department_id)}</p>
                  </div>
                </div>
                {canManage && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(p)}
                      className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3 text-center">
              <div className="bg-gray-50/80 rounded-2xl py-2 px-3 border border-gray-150">
                <p className="text-sm font-extrabold text-gray-900">{p.code}</p>
                <p className="text-[10px] text-gray-400 uppercase font-semibold">Degree Code</p>
              </div>
              <div className="bg-gray-50/80 rounded-2xl py-2 px-3 border border-gray-150">
                <p className="text-sm font-extrabold text-gray-900">{p.credit_hours} Cr.</p>
                <p className="text-[10px] text-gray-400 uppercase font-semibold">Required Hours</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === "add" ? "Add Degree Program" : "Edit Degree Program"}
      >
        <div className="space-y-4">
          <FormField label="Program Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <FormField label="Degree Code (e.g. BSCS)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
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
            label="Total Required Credit Hours"
            type="number"
            value={form.credit_hours}
            onChange={(e) => setForm({ ...form, credit_hours: Number(e.target.value) })}
          />
          <div className="flex gap-2.5 pt-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-black hover:bg-neutral-800 text-white py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
            >
              Save Program
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