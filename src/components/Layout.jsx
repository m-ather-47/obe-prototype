import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Bell, Search } from "lucide-react";
import { useState } from "react";
import { useLocalState } from "../data/store";
import { getCurrentUser } from "../data/auth";
import * as mock from "../data/mockData";

export default function Layout() {
  const [showNotif, setShowNotif] = useState(false);
  const [notifications] = useLocalState("obe_notifications", mock.notifications);
  const user = getCurrentUser();
  const unread = notifications.filter((n) => !n.read).length;
  const initial = user?.name?.charAt(0) || "U";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-60">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5 w-80">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm outline-none w-full"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowNotif(!showNotif)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell size={20} className="text-gray-600" />
                {unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {unread}
                  </span>
                )}
              </button>
              {showNotif && (
                <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  <div className="p-3 border-b font-semibold text-sm">Notifications</div>
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 text-sm border-b last:border-0 ${
                        !n.read ? "bg-blue-50" : ""
                      }`}
                    >
                      <p className="text-gray-700">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{n.date}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {initial}
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                <span className="block text-[10px] text-gray-400 capitalize">{user?.role}</span>
              </div>
            </div>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}