import { useState } from "react";
import { departments } from "../data/mockData";
import { useLocalState, logAudit } from "../data/store";
import { usePermissions } from "../hooks/usePermissions";
import Modal from "../components/Modal";
import { FormField } from "../components/FormField";
import { Building2, Edit, Lock } from "lucide-react";

export default function Departments() {
  const { canManage } = usePermissions();
  const [items, setItems] = useLocalState("obe_departments", departments);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(departments[0]);

  const openEdit = (item) => {
    setForm(item);
    setModal({ mode: "edit" });
  };
  const handleSave = () => {
    setItems([form]);
    logAudit("UPDATE", "Department", form.id);
    setModal(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Departments</h1>
          <p className="text-sm text-gray-500">UIIT is the sole academic department in this prototype</p>
        </div>
        {!canManage && (
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <Lock size={12} /> View only — admin can manage
          </span>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">ID</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Code</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">HOD</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Contact</th>
              {canManage && (
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {items.map((d) => (
              <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 text-sm text-gray-600">{d.id}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 size={16} className="text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-800">{d.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-sm text-gray-600">{d.code}</td>
                <td className="px-5 py-3 text-sm text-gray-600">{d.hod_name}</td>
                <td className="px-5 py-3 text-sm text-gray-600">{d.contact}</td>
                {canManage && (
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(d)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit size={14} className="text-gray-500" />
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
        title="Edit UIIT Department"
      >
        <div className="space-y-3">
          <FormField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <FormField label="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          <FormField label="HOD Name" value={form.hod_name} onChange={(e) => setForm({ ...form, hod_name: e.target.value })} />
          <FormField label="Contact" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
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