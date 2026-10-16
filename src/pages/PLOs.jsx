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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Program Learning Outcomes</h1>
          <p className="text-xs text-gray-500 font-medium mt-1">Define institutional PLOs mapped to international accreditation bodies (ABET/HEC).</p>
        </div>
        {canManage ? (
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>Add PLO</span>
          </button>
        ) : (
          <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
            <Lock size={13} /> View only — admin can manage
          </span>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-100">
              <th className="text-left px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Identifier</th>
              <th className="text-left px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Statement / Title</th>
              <th className="text-left px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Degree Program</th>
              <th className="text-left px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bloom Domain</th>
              <th className="text-left px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Accreditation Ref</th>
              {canManage && (
                <th className="text-right px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-red-50 text-red-600 border border-red-200/60 rounded-xl flex items-center justify-center font-bold shadow-2xs">
                      <Target size={15} />
                    </div>
                    <span className="text-xs font-mono font-bold text-gray-900">{p.number}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs font-semibold text-gray-800">{p.title}</td>
                <td className="px-6 py-4 text-xs text-gray-600 font-medium">{getProgName(p.program_id)}</td>
                <td className="px-6 py-4 text-xs">
                  <span className="bg-purple-50 text-purple-700 border border-purple-200/60 px-2.5 py-0.5 rounded-full font-semibold">
                    {p.bloom_domain}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-mono text-gray-500 font-medium">{p.accreditation_ref}</td>
                {canManage && (
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
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
        <div className="space-y-4">
          <FormField
            label="PLO Number (e.g. PLO-9)"
            value={form.number}
            onChange={(e) => setForm({ ...form, number: e.target.value })}
          />
          <FormField
            label="Title / Description"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <SelectField
            label="Degree Program"
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
          <FormField
            label="Accreditation Reference (e.g. ABET CAC-9)"
            value={form.accreditation_ref}
            onChange={(e) => setForm({ ...form, accreditation_ref: e.target.value })}
          />
          <div className="flex gap-2.5 pt-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-black hover:bg-neutral-800 text-white py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
            >
              Save PLO
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