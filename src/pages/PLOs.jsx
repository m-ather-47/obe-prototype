import { useState } from "react";
import { plos, programs } from "../data/mockData";
import { useLocalState, nextId, logAudit } from "../data/store";
import { usePermissions } from "../hooks/usePermissions";
import Modal from "../components/Modal";
import { FormField, SelectField } from "../components/FormField";
import { Target, Plus, Edit, Trash2, Lock } from "lucide-react";

const defaults = { number: "", title: "", program_id: 1, bloom_domain: "Cognitive", accreditation_ref: "" };
const bloomDomains = ["Cognitive", "Psychomotor", "Affective"];

export default function PLOs() {
  const { canManage } = usePermissions();
  const [items, setItems] = useLocalState("obe_plos", plos);
  const [progs] = useLocalState("obe_programs", programs);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(defaults);

  const getProgName = (id) => progs.find((p) => p.id === id)?.name || "—";

  const openAdd = () => {
    setForm({ ...defaults, program_id: progs[0]?.id ?? 1 });
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
      logAudit("INSERT", "PLO", next[next.length - 1].id);
    } else {
      setItems(items.map((i) => (i.id === form.id ? form : i)));
      logAudit("UPDATE", "PLO", form.id);
    }
    setModal(null);
  };
  const handleDelete = (id) => {
    if (window.confirm("Delete this PLO?")) {
      setItems(items.filter((i) => i.id !== id));
      logAudit("DELETE", "PLO", id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Program Learning Outcomes</h1>
          <p className="text-sm text-gray-500">Define PLOs mapped to accreditation standards</p>
        </div>
        {canManage ? (
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Add PLO
          </button>
        ) : (
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <Lock size={12} /> View only — admin can manage
          </span>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Number</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Title</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Program</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Bloom Domain</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Accreditation Ref</th>
              {canManage && (
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <Target size={16} className="text-red-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-800">{p.number}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-sm text-gray-700">{p.title}</td>
                <td className="px-5 py-3 text-sm text-gray-600">{getProgName(p.program_id)}</td>
                <td className="px-5 py-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{p.bloom_domain}</span>
                </td>
                <td className="px-5 py-3 text-sm text-gray-600 font-mono">{p.accreditation_ref}</td>
                {canManage && (
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Edit size={14} className="text-gray-500" /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={14} className="text-red-500" /></button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === "add" ? "Add PLO" : "Edit PLO"}
      >
        <div className="space-y-3">
          <FormField label="Number (e.g. PLO-9)" value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} />
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
            label="Bloom Domain"
            value={form.bloom_domain}
            onChange={(e) => setForm({ ...form, bloom_domain: e.target.value })}
          >
            {bloomDomains.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </SelectField>
          <FormField label="Accreditation Ref (e.g. ABET CAC-9)" value={form.accreditation_ref} onChange={(e) => setForm({ ...form, accreditation_ref: e.target.value })} />
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