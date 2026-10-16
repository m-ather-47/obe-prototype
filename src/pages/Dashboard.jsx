import {
  Users,
  BookOpen,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useLocalState } from "../data/store";
import { getCurrentUser } from "../data/auth";
import * as mock from "../data/mockData";

const gradeDist = [
  { name: "A", value: 12, color: "#22c55e" },
  { name: "B", value: 18, color: "#3b82f6" },
  { name: "C", value: 8, color: "#eab308" },
  { name: "D", value: 3, color: "#f97316" },
  { name: "F", value: 2, color: "#ef4444" },
];

export default function Dashboard() {
  const user = getCurrentUser();
  const [departments] = useLocalState("obe_departments", mock.departments);
  const [programs] = useLocalState("obe_programs", mock.programs);
  const [courses] = useLocalState("obe_courses", mock.courses);
  const [sections] = useLocalState("obe_sections", mock.sections);

  const statCards = [
    { label: "Departments", value: departments.length, icon: Users, color: "bg-blue-500" },
    { label: "Programs", value: programs.length, icon: BookOpen, color: "bg-emerald-500" },
    { label: "Active Courses", value: courses.length, icon: Target, color: "bg-purple-500" },
    { label: "Active Sections", value: sections.length, icon: TrendingUp, color: "bg-amber-500" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome back, {user?.name}</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`${card.color} p-2.5 rounded-lg`}>
                <card.icon size={20} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                <p className="text-xs text-gray-500">{card.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Grade Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={gradeDist}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
              >
                {gradeDist.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {gradeDist.map((g) => (
              <div key={g.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: g.color }} />
                <span className="text-xs text-gray-600">{g.name}: {g.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { icon: CheckCircle, color: "text-green-500", text: "CLO-2 mapping approved for CS-401", time: "2 hours ago" },
              { icon: AlertTriangle, color: "text-amber-500", text: "Marks deadline approaching: June 10", time: "5 hours ago" },
              { icon: CheckCircle, color: "text-green-500", text: "PLO-2 mapping updated", time: "1 day ago" },
              { icon: Users, color: "text-blue-500", text: "3 new students enrolled in BSCS-4A", time: "2 days ago" },
              { icon: BookOpen, color: "text-purple-500", text: "New session Spring 2026 created", time: "3 days ago" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <item.icon size={16} className={`${item.color} mt-0.5`} />
                <div>
                  <p className="text-sm text-gray-700">{item.text}</p>
                  <p className="text-xs text-gray-400">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
