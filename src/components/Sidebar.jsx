import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  Calendar,
  Layers,
  Users,
  GraduationCap,
  Target,
  ClipboardList,
  PenTool,
  ScrollText,
  UploadCloud,
  LogOut,
} from "lucide-react";
import { getCurrentUser, isAdmin } from "../data/auth";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/departments", icon: Building2, label: "Departments" },
  { to: "/programs", icon: Layers, label: "Programs" },
  { to: "/sessions", icon: Calendar, label: "Sessions" },
  { to: "/teachers", icon: Users, label: "Teachers", adminOnly: true },
  { to: "/courses", icon: BookOpen, label: "Courses" },
  { to: "/sections", icon: Users, label: "Sections" },
  { to: "/plos", icon: Target, label: "PLOs" },
  { to: "/clos", icon: GraduationCap, label: "CLOs" },
  { to: "/blueprint", icon: ClipboardList, label: "Blueprint" },
  { to: "/marks", icon: PenTool, label: "Marks Entry" },
  { to: "/reports", icon: ScrollText, label: "Reports" },
  { to: "/documents", icon: UploadCloud, label: "Documents" },
  { to: "/audit", icon: ScrollText, label: "Audit Log" },
];

export default function Sidebar() {
  const admin = isAdmin(getCurrentUser());
  return (
    <aside className="w-60 bg-slate-900 text-white flex flex-col min-h-screen fixed left-0 top-0">
      <div className="p-4 border-b border-slate-700">
        <h1 className="text-lg font-bold tracking-tight">UIIT-OBE</h1>
        <p className="text-xs text-slate-400">Outcome-Based Education</p>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {navItems.filter((item) => !item.adminOnly || admin).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-700">
        <NavLink
          to="/login"
          className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </NavLink>
      </div>
    </aside>
  );
}