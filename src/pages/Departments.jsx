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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Academic Departments</h1>
          <p className="text-xs text-gray-500 font-medium mt-1">UIIT is the primary academic department entity in this prototype.</p>
        </div>
        {!canManage && (
          <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
            <Lock size={13} /> View only — admin can manage
          </span>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-100">
              <th className="text-left px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Dept ID</th>
              <th className="text-left px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Department Name</th>
              <th className="text-left px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Code</th>
              <th className="text-left px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Head of Department</th>
              <th className="text-left px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Official Contact</th>
              {canManage && (
                <th className="text-right px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-6 py-4 text-xs font-mono font-bold text-gray-400">#{d.id}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-blue-50 text-blue-600 border border-blue-200/60 rounded-xl flex items-center justify-center font-bold shadow-2xs">
                      <Building2 size={15} />
                    </div>
                    <span className="text-xs font-bold text-gray-900">{d.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs font-semibold text-gray-700">{d.code}</td>
                <td className="px-6 py-4 text-xs font-semibold text-gray-800">{d.hod_name}</td>
                <td className="px-6 py-4 text-xs font-mono text-gray-500 font-medium">{d.contact}</td>
                {canManage && (
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEdit(d)}
                        className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
                        title="Edit Department"
                      >
                        <Edit size={14} />
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
        <div className="space-y-4">
          <FormField label="Department Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <FormField label="Code (e.g. UIIT)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          <FormField label="Head of Department (HOD)" value={form.hod_name} onChange={(e) => setForm({ ...form, hod_name: e.target.value })} />
          <FormField label="Official Contact Phone" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
          <div className="flex gap-2.5 pt-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-black hover:bg-neutral-800 text-white py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
            >
              Save Department
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