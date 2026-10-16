import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  Calendar,
  Layers,
  Users,
  GraduationCap,
  PenTool,
  ScrollText,
  UploadCloud,
  LogOut,
  ChevronDown,
  ChevronsUpDown,
  Settings,
  HelpCircle,
  Sparkles,
  PanelLeftClose,
  Check,
  FileText,
} from "lucide-react";
import { getCurrentUser, setCurrentUser, isAdmin } from "../data/auth";
import { users } from "../data/mockData";
import { useLocalState } from "../data/store";

export default function Sidebar() {
  const location = useLocation();
  const [userList] = useLocalState("obe_users", users);
  const [currentUserObj, setCurrentUserState] = useState(getCurrentUser());
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [curriculumExpanded, setCurriculumExpanded] = useState(true);
  const [insightExpanded, setInsightExpanded] = useState(true);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const admin = isAdmin(currentUserObj);

  const switchAccount = (user) => {
    setCurrentUser(user);
    setCurrentUserState(user);
    setUserMenuOpen(false);
    window.location.reload();
  };

  const isCurriculumActive = [
    "/courses",
    "/sections",
    "/clos",
    "/plos",
    "/blueprint",
  ].some((path) => location.pathname === path);

  return (
    <>
      <aside className="w-64 bg-white border border-gray-200/80 rounded-3xl m-3.5 p-4 flex flex-col justify-between fixed left-0 top-0 bottom-0 shadow-[0_2px_12px_rgba(0,0,0,0.03)] z-30 select-none">
        {/* Top Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-black rounded-xl text-white flex items-center justify-center font-bold shadow-xs">
                <GraduationCap size={19} className="text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-gray-900 tracking-tight leading-none">
                  OBE System
                </h1>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                  UIIT Rawalpindi
                </p>
              </div>
            </div>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              title="Panel Toggle"
            >
              <PanelLeftClose size={16} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
            {/* Control Tower / Dashboard */}
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-gray-100 text-gray-900 shadow-2xs"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`
              }
            >
              <LayoutDashboard size={16} />
              <span>Control Tower</span>
            </NavLink>

            {/* Curriculum & OBE Group (Tree Layout similar to Generate Quote) */}
            <div className="mt-1">
              <button
                type="button"
                onClick={() => setCurriculumExpanded(!curriculumExpanded)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isCurriculumActive
                    ? "text-gray-900 font-bold"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen size={16} />
                  <span>Curriculum & OBE</span>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-gray-400 transition-transform duration-200 ${
                    curriculumExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              {curriculumExpanded && (
                <div className="relative pl-7 mt-0.5 flex flex-col gap-0.5 before:content-[''] before:absolute before:left-4 before:top-1 before:bottom-3 before:w-px before:bg-gray-200">
                  <NavLink
                    to="/courses"
                    className={({ isActive }) =>
                      `relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all before:content-[''] before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-px before:bg-gray-200 ${
                        isActive
                          ? "bg-gray-100 text-gray-900 font-semibold"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }`
                    }
                  >
                    Courses
                  </NavLink>
                  <NavLink
                    to="/sections"
                    className={({ isActive }) =>
                      `relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all before:content-[''] before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-px before:bg-gray-200 ${
                        isActive
                          ? "bg-gray-100 text-gray-900 font-semibold"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }`
                    }
                  >
                    Sections
                  </NavLink>
                  <NavLink
                    to="/clos"
                    className={({ isActive }) =>
                      `relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all before:content-[''] before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-px before:bg-gray-200 ${
                        isActive
                          ? "bg-gray-100 text-gray-900 font-semibold"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }`
                    }
                  >
                    CLO Mapping
                  </NavLink>
                  <NavLink
                    to="/plos"
                    className={({ isActive }) =>
                      `relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all before:content-[''] before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-px before:bg-gray-200 ${
                        isActive
                          ? "bg-gray-100 text-gray-900 font-semibold"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }`
                    }
                  >
                    PLO Framework
                  </NavLink>
                  <NavLink
                    to="/blueprint"
                    className={({ isActive }) =>
                      `relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all before:content-[''] before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-px before:bg-gray-200 ${
                        isActive
                          ? "bg-gray-100 text-gray-900 font-semibold"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }`
                    }
                  >
                    Assessment Blueprint
                  </NavLink>
                </div>
              )}
            </div>

            {/* Direct primary workflows */}
            <NavLink
              to="/marks"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-gray-100 text-gray-900 shadow-2xs"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`
              }
            >
              <PenTool size={16} />
              <span>Marks Entry</span>
            </NavLink>

            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-gray-100 text-gray-900 shadow-2xs"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`
              }
            >
              <FileText size={16} />
              <span>Attainment Reports</span>
            </NavLink>

            <NavLink
              to="/sessions"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-gray-100 text-gray-900 shadow-2xs"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`
              }
            >
              <Calendar size={16} />
              <span>Academic Sessions</span>
            </NavLink>

            {/* INSIGHT & CONTROL Section */}
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setInsightExpanded(!insightExpanded)}
                className="w-full flex items-center justify-between px-3 py-1 text-[10px] font-bold tracking-wider text-gray-400 uppercase hover:text-gray-600"
              >
                <span>Insight & Control</span>
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${
                    insightExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              {insightExpanded && (
                <div className="flex flex-col gap-0.5 mt-1">
                  <NavLink
                    to="/departments"
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? "bg-gray-100 text-gray-900 font-semibold"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`
                    }
                  >
                    <Building2 size={15} />
                    <span>Departments</span>
                  </NavLink>
                  <NavLink
                    to="/programs"
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? "bg-gray-100 text-gray-900 font-semibold"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`
                    }
                  >
                    <Layers size={15} />
                    <span>Programs</span>
                  </NavLink>
                  {admin && (
                    <NavLink
                      to="/teachers"
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                          isActive
                            ? "bg-gray-100 text-gray-900 font-semibold"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`
                      }
                    >
                      <Users size={15} />
                      <span>Teachers</span>
                    </NavLink>
                  )}
                  <NavLink
                    to="/documents"
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? "bg-gray-100 text-gray-900 font-semibold"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`
                    }
                  >
                    <UploadCloud size={15} />
                    <span>Documents</span>
                  </NavLink>
                  <NavLink
                    to="/audit"
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? "bg-gray-100 text-gray-900 font-semibold"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`
                    }
                  >
                    <ScrollText size={15} />
                    <span>Audit Log</span>
                  </NavLink>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setSettingsModalOpen(true)}
            className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors text-left"
          >
            <Settings size={15} />
            <span>Setting</span>
          </button>
          <button
            type="button"
            onClick={() => setHelpModalOpen(true)}
            className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors text-left"
          >
            <HelpCircle size={15} />
            <span>Get Help</span>
          </button>
          <div className="flex items-center justify-between px-3 py-1.5 text-xs text-gray-600">
            <div className="flex items-center gap-2.5">
              <Sparkles size={15} className="text-emerald-500" />
              <span>Updates</span>
            </div>
            <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/60 px-1.5 py-0.5 rounded-full">
              v2.4
            </span>
          </div>

          {/* User Profile Card */}
          <div className="relative mt-1">
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-full bg-gray-50 hover:bg-gray-100/80 border border-gray-200/60 rounded-2xl p-2.5 flex items-center justify-between transition-all text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {currentUserObj?.name?.charAt(0) || "U"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate leading-tight">
                    {currentUserObj?.name}
                  </p>
                  <p className="text-[10px] text-gray-400 capitalize truncate mt-0.5">
                    {currentUserObj?.role === "admin"
                      ? "UIIT Administrator"
                      : "Faculty Instructor"}
                  </p>
                </div>
              </div>
              <ChevronsUpDown size={14} className="text-gray-400 shrink-0 ml-1" />
            </button>

            {/* User Popover Menu */}
            {userMenuOpen && (
              <div className="absolute left-0 bottom-14 w-full bg-white border border-gray-200/90 rounded-2xl shadow-xl p-2 z-50 flex flex-col gap-1">
                <div className="px-2.5 py-1.5 border-b border-gray-100">
                  <p className="text-[10px] uppercase font-bold text-gray-400">
                    Switch Demo User
                  </p>
                </div>
                {userList.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => switchAccount(u)}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{u.name}</p>
                      <p className="text-[10px] text-gray-400 capitalize">{u.role}</p>
                    </div>
                    {currentUserObj?.id === u.id && (
                      <Check size={14} className="text-emerald-600 shrink-0" />
                    )}
                  </button>
                ))}
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <NavLink
                    to="/login"
                    className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </NavLink>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Settings Modal */}
      {settingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-base font-bold text-gray-900 mb-2">System Settings</h3>
            <p className="text-xs text-gray-500 mb-4">
              Configure OBE institutional parameters and threshold benchmarks.
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-xs font-semibold text-gray-800">CLO Passing Threshold</p>
                <p className="text-[11px] text-gray-500">Standard HEC threshold is 50% passing.</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-xs font-semibold text-gray-800">Accreditation Body</p>
                <p className="text-[11px] text-gray-500">NCEAC / Washington Accord Compliant.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSettingsModalOpen(false)}
              className="mt-5 w-full bg-black text-white hover:bg-neutral-800 py-2.5 rounded-full text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {helpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-base font-bold text-gray-900 mb-2">OBE System Guide</h3>
            <p className="text-xs text-gray-500 mb-4">
              Step-by-step workflow for academic outcome management:
            </p>
            <ol className="text-xs text-gray-600 space-y-2 list-decimal list-inside bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <li>Define Program Learning Outcomes (PLOs).</li>
              <li>Instructors specify Course Learning Outcomes (CLOs).</li>
              <li>Setup assessment blueprint with Mid, Final, Quiz & Assignment.</li>
              <li>Record student marks & generate official OBE attainment sheets.</li>
            </ol>
            <button
              type="button"
              onClick={() => setHelpModalOpen(false)}
              className="mt-5 w-full bg-black text-white hover:bg-neutral-800 py-2.5 rounded-full text-xs font-semibold transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}