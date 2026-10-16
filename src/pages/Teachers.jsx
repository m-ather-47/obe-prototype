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
      <div className="rounded-3xl border border-gray-200/80 bg-white p-12 text-center shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <Lock className="mx-auto mb-3 text-gray-300" size={26} />
        <h1 className="text-base font-bold text-gray-900">Admin access required</h1>
        <p className="mt-1 text-xs text-gray-400 font-medium">Only administrators can manage teacher accounts.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Faculty Teachers</h1>
          <p className="text-xs text-gray-500 font-medium mt-1">Manage instructor accounts and credentials for OBE evaluations.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <Plus size={15} />
          <span>Add Teacher</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-3xl border border-gray-200/80 bg-white p-5 shadow-2xs sm:col-span-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Active Faculty Members</p>
          <p className="mt-1 text-2xl font-extrabold text-gray-900">{teachers.length.toString().padStart(2, "0")}</p>
        </div>
        <div className="flex items-center gap-3.5 rounded-3xl border border-blue-200/60 bg-blue-50/70 p-5 sm:col-span-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-2xs">
            <KeyRound size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-blue-950">Local Prototype Credentials</p>
            <p className="mt-0.5 text-[11px] text-blue-800/80 leading-relaxed font-medium">
              Demo passwords and role credentials are kept in client storage for simulated login and switching.
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto] gap-4 border-b border-gray-100 bg-gray-50/70 px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">
          <span>Faculty Member</span><span>Login Email</span><span className="text-right">Actions</span>
        </div>
        <div className="divide-y divide-gray-100">
          {teachers.map((teacher) => (
            <div key={teacher.id} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto] items-center gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 border border-amber-200/60 font-bold text-xs shadow-2xs">
                  <UserRound size={17} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-gray-900">{teacher.name}</p>
                  <p className="text-[10px] text-gray-400 font-medium">Instructor · #{teacher.id}</p>
                </div>
              </div>
              <div className="flex min-w-0 items-center gap-2 text-xs font-mono font-medium text-gray-600">
                <KeyRound size={13} className="shrink-0 text-gray-400" />
                <span className="truncate">{teacher.email}</span>
              </div>
              <div className="flex justify-end gap-1.5">
                <button
                  aria-label={`Edit credentials for ${teacher.name}`}
                  title="Edit credentials"
                  onClick={() => openEdit(teacher)}
                  className="rounded-lg p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  aria-label={`Delete ${teacher.name}`}
                  title="Delete teacher"
                  onClick={() => deleteTeacher(teacher)}
                  className="rounded-lg p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {teachers.length === 0 && (
            <div className="p-12 text-center text-xs text-gray-400 font-medium">
              No teachers enrolled yet. Add a teacher to create the first account.
            </div>
          )}
        </div>
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === "add" ? "Create Teacher Account" : "Edit Teacher Credentials"}>
        <form onSubmit={saveTeacher} className="space-y-4">
          <FormField label="Full Name" autoComplete="name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <FormField label="Login Email" type="email" autoComplete="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <FormField label={modal?.mode === "add" ? "Initial Password" : "New Password"} type="password" autoComplete="new-password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          <p className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
            <Lock size={12} /> This prototype stores credentials in local cache.
          </p>
          <div className="flex gap-2.5 pt-3">
            <button
              type="submit"
              className="flex-1 bg-black hover:bg-neutral-800 text-white py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
            >
              Save Teacher
            </button>
            <button
              type="button"
              onClick={() => setModal(null)}
              className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
