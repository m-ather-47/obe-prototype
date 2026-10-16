import { useState } from "react";
import { useLocalState, nextId, logAudit } from "../data/store";
import { usePermissions } from "../hooks/usePermissions";
import { users as seedUsers } from "../data/mockData";
import Modal from "../components/Modal";
import { FormField } from "../components/FormField";
import { KeyRound, Lock, Pencil, Plus, Trash2, UserRound } from "lucide-react";

const blankTeacher = { name: "", email: "", password: "" };

export default function Teachers() {
  const { canManage } = usePermissions();
  const [users, setUsers] = useLocalState("obe_users", seedUsers);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(blankTeacher);
  const teachers = users.filter((user) => user.role === "instructor");

  const openAdd = () => {
    setForm(blankTeacher);
    setModal({ mode: "add" });
  };
  const openEdit = (teacher) => {
    setForm({ id: teacher.id, name: teacher.name, email: teacher.email, password: teacher.password || "" });
    setModal({ mode: "edit" });
  };
  const saveTeacher = (event) => {
    event.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    if (!name || !email || !form.password) return;
    if (users.some((user) => user.email.toLowerCase() === email && user.id !== form.id)) {
      window.alert("An account already uses this email address.");
      return;
    }

    if (modal.mode === "add") {
      const created = { ...form, name, email, role: "instructor", id: nextId(users) };
      setUsers([...users, created]);
      logAudit("INSERT", "Teacher", created.id);
    } else {
      setUsers(users.map((user) => user.id === form.id ? { ...user, name, email, password: form.password } : user));
      logAudit("UPDATE", "Teacher", form.id);
    }
    setModal(null);
  };
  const deleteTeacher = (teacher) => {
    if (window.confirm(`Delete ${teacher.name}'s teacher account? Existing academic records will be kept.`)) {
      setUsers(users.filter((user) => user.id !== teacher.id));
      logAudit("DELETE", "Teacher", teacher.id);
    }
  };

  if (!canManage) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-10 text-center">
        <Lock className="mx-auto mb-3 text-gray-300" size={30} />
        <h1 className="text-lg font-semibold text-gray-800">Admin access required</h1>
        <p className="mt-1 text-sm text-gray-500">Only administrators can manage teacher accounts.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">People & access</p>
          <h1 className="text-2xl font-bold text-gray-800">Teachers</h1>
          <p className="text-sm text-gray-500">Create teacher accounts and manage their sign-in credentials.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
          <Plus size={16} /> Add Teacher
        </button>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:col-span-1">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Active teacher accounts</p>
          <p className="mt-2 text-3xl font-semibold text-gray-800">{teachers.length.toString().padStart(2, "0")}</p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-4 sm:col-span-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-blue-700 shadow-sm"><KeyRound size={18} /></div>
          <div>
            <p className="text-sm font-semibold text-blue-950">Prototype credentials</p>
            <p className="mt-0.5 text-xs text-blue-800/75">Credentials are stored locally in this browser and used by the demo sign-in screen.</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto] gap-4 border-b border-gray-100 bg-gray-50 px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
          <span>Teacher</span><span>Login email</span><span className="text-right">Actions</span>
        </div>
        {teachers.map((teacher) => (
          <div key={teacher.id} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto] items-center gap-4 border-b border-gray-50 px-5 py-4 last:border-0">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700"><UserRound size={19} /></div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-800">{teacher.name}</p>
                <p className="text-xs text-gray-400">Teacher account · #{teacher.id}</p>
              </div>
            </div>
            <div className="flex min-w-0 items-center gap-2 text-sm text-gray-600"><KeyRound size={14} className="shrink-0 text-gray-400" /><span className="truncate">{teacher.email}</span></div>
            <div className="flex justify-end gap-1">
              <button aria-label={`Edit credentials for ${teacher.name}`} title="Edit credentials" onClick={() => openEdit(teacher)} className="rounded-lg p-2 hover:bg-blue-50"><Pencil size={15} className="text-blue-600" /></button>
              <button aria-label={`Delete ${teacher.name}`} title="Delete teacher" onClick={() => deleteTeacher(teacher)} className="rounded-lg p-2 hover:bg-red-50"><Trash2 size={15} className="text-red-500" /></button>
            </div>
          </div>
        ))}
        {teachers.length === 0 && <div className="p-10 text-center text-sm text-gray-500">No teachers yet. Add a teacher to create the first account.</div>}
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === "add" ? "Create teacher account" : "Edit teacher credentials"}>
        <form onSubmit={saveTeacher} className="space-y-3">
          <FormField label="Full name" autoComplete="name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <FormField label="Login email" type="email" autoComplete="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <FormField label={modal?.mode === "add" ? "Initial password" : "New password"} type="password" autoComplete="new-password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          <p className="flex items-center gap-1.5 text-[11px] text-gray-400"><Lock size={12} /> This prototype stores passwords locally; do not use real credentials.</p>
          <div className="flex gap-2 pt-2">
            <button type="submit" className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700">Save account</button>
            <button type="button" onClick={() => setModal(null)} className="flex-1 rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
