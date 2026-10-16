import { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import {
  Bell,
  Search,
  Sparkles,
  RefreshCw,
  ChevronRight,
  X,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { useLocalState } from "../data/store";
import * as mock from "../data/mockData";

export default function Layout() {
  const location = useLocation();
  const [showNotif, setShowNotif] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notifications, setNotifications] = useLocalState(
    "obe_notifications",
    mock.notifications
  );

  const unread = notifications.filter((n) => !n.read).length;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  // Breadcrumb generation matching the screenshot: "Dashboard > Generate Quote > Quote Result"
  const getBreadcrumbs = () => {
    const path = location.pathname;
    switch (path) {
      case "/":
        return [
          { label: "Dashboard", to: "/" },
          { label: "Control Tower", to: "/" },
          { label: "Attainment Results" },
        ];
      case "/courses":
        return [
          { label: "Dashboard", to: "/" },
          { label: "Curriculum", to: "/courses" },
          { label: "Course Catalog" },
        ];
      case "/sections":
        return [
          { label: "Dashboard", to: "/" },
          { label: "Curriculum", to: "/courses" },
          { label: "Section Allocations" },
        ];
      case "/clos":
        return [
          { label: "Dashboard", to: "/" },
          { label: "Curriculum", to: "/courses" },
          { label: "CLO Mapping" },
        ];
      case "/plos":
        return [
          { label: "Dashboard", to: "/" },
          { label: "Curriculum", to: "/courses" },
          { label: "PLO Framework" },
        ];
      case "/blueprint":
        return [
          { label: "Dashboard", to: "/" },
          { label: "Assessment", to: "/blueprint" },
          { label: "Exam Blueprint" },
        ];
      case "/marks":
        return [
          { label: "Dashboard", to: "/" },
          { label: "Assessment", to: "/marks" },
          { label: "Marks Entry" },
        ];
      case "/reports":
        return [
          { label: "Dashboard", to: "/" },
          { label: "Assessment", to: "/reports" },
          { label: "Official Reports" },
        ];
      case "/sessions":
        return [
          { label: "Dashboard", to: "/" },
          { label: "Setup", to: "/sessions" },
          { label: "Academic Sessions" },
        ];
      case "/departments":
        return [
          { label: "Dashboard", to: "/" },
          { label: "Setup", to: "/departments" },
          { label: "Departments" },
        ];
      case "/programs":
        return [
          { label: "Dashboard", to: "/" },
          { label: "Setup", to: "/programs" },
          { label: "Degree Programs" },
        ];
      case "/teachers":
        return [
          { label: "Dashboard", to: "/" },
          { label: "Faculty", to: "/teachers" },
          { label: "Faculty Directory" },
        ];
      case "/documents":
        return [
          { label: "Dashboard", to: "/" },
          { label: "Compliance", to: "/documents" },
          { label: "Evidence Archive" },
        ];
      case "/audit":
        return [
          { label: "Dashboard", to: "/" },
          { label: "Compliance", to: "/audit" },
          { label: "Audit Log" },
        ];
      default:
        return [
          { label: "Dashboard", to: "/" },
          { label: "System", to: "/" },
          { label: "Overview" },
        ];
    }
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen bg-[#f2f4f7] flex">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Column */}
      <div className="flex-1 ml-[18rem] mr-4 my-3.5 flex flex-col min-w-0">
        {/* Top Header matching reference: Breadcrumb on left, pill Search in middle, Action buttons on right */}
        <header className="h-14 flex items-center justify-between px-1 mb-2">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium select-none min-w-0">
            {breadcrumbs.map((b, idx) => (
              <div key={idx} className="flex items-center gap-1.5 truncate">
                {idx > 0 && <ChevronRight size={13} className="text-gray-400 shrink-0" />}
                {b.to ? (
                  <Link
                    to={b.to}
                    className="hover:text-gray-900 transition-colors text-gray-500 truncate"
                  >
                    {b.label}
                  </Link>
                ) : (
                  <span className="font-bold text-gray-900 truncate">{b.label}</span>
                )}
              </div>
            ))}
          </div>

          {/* Centered Pill Search Bar */}
          <div className="hidden md:flex items-center gap-2.5 bg-white border border-gray-200/90 rounded-full px-4 py-2 w-72 lg:w-96 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all focus-within:ring-2 focus-within:ring-black/5 focus-within:border-gray-400">
            <Search size={15} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by course, student, roll no, teacher..."
              className="bg-transparent text-xs text-gray-800 placeholder:text-gray-400 outline-none w-full font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-gray-400 hover:text-gray-600 p-0.5"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Get AI Insight Pill Button */}
            <button
              type="button"
              onClick={() => setShowAiModal(true)}
              className="flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200/90 text-gray-800 rounded-full px-4 py-2 text-xs font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all cursor-pointer hover:border-gray-300"
            >
              <Sparkles size={14} className="text-purple-600 fill-purple-100" />
              <span>Get AI Insight</span>
            </button>

            {/* Circular Refresh Button */}
            <button
              type="button"
              onClick={handleRefresh}
              className="w-9 h-9 rounded-full bg-white hover:bg-gray-50 border border-gray-200/90 flex items-center justify-center text-gray-600 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw
                size={14}
                className={`transition-transform duration-500 ${
                  isRefreshing ? "rotate-180 text-black" : ""
                }`}
              />
            </button>

            {/* Circular Notification Bell Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotif(!showNotif)}
                className="w-9 h-9 rounded-full bg-white hover:bg-gray-50 border border-gray-200/90 flex items-center justify-center text-gray-600 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all cursor-pointer relative"
                title="Notifications"
              >
                <Bell size={15} />
                {unread > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotif && (
                <div className="absolute right-0 top-11 w-80 bg-white border border-gray-200/90 rounded-3xl shadow-xl z-50 p-4 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-gray-900">Notifications</span>
                      {unread > 0 && (
                        <span className="bg-red-50 text-red-600 border border-red-200/60 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                          {unread} new
                        </span>
                      )}
                    </div>
                    {unread > 0 && (
                      <button
                        type="button"
                        onClick={markAllRead}
                        className="text-[10px] text-gray-400 hover:text-gray-700 font-semibold transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-50 mt-1">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-2xl text-xs transition-colors my-1 ${
                          !n.read ? "bg-purple-50/50" : "hover:bg-gray-50"
                        }`}
                      >
                        <p className="text-gray-800 font-medium leading-relaxed">
                          {n.message}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">{n.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 pb-8">
          <Outlet />
        </main>
      </div>

      {/* AI Insight Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl p-6 w-full max-w-lg animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 border border-purple-200/60 flex items-center justify-center font-bold">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    OBE System AI Intelligence
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Real-time cohort insights & accreditation status
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/60 flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-950">
                    High Attainment in Machine Learning (CS-401)
                  </h4>
                  <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                    CLO-1 and CLO-2 achieved an 88% overall passing rate, exceeding the
                    50% HEC requirement by 38%.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200/60 flex items-start gap-3">
                <TrendingUp size={18} className="text-pink-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-pink-950">
                    Remediation Opportunity in Data Structures (CS-301)
                  </h4>
                  <p className="text-[11px] text-pink-800 mt-0.5 leading-relaxed">
                    Midterm exam scores for CLO-2 indicate 4 students scored below 40%.
                    A targeted tutorial session is recommended.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 flex items-start gap-3">
                <AlertCircle size={18} className="text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-blue-950">
                    Accreditation Readiness: 94%
                  </h4>
                  <p className="text-[11px] text-blue-800 mt-0.5 leading-relaxed">
                    All 8 PLOs have direct course mappings. Evidence documents for
                    Spring 2026 are 82% populated.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="w-full bg-black text-white hover:bg-neutral-800 py-2.5 rounded-full text-xs font-semibold transition-all"
              >
                Close Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}