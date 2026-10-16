import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Target,
  Sparkles,
  UploadCloud,
  ChevronDown,
  MoreHorizontal,
  Bookmark,
  Share2,
  Download,
  GraduationCap,
  Waves,
  Plane,
  Truck,
  Flame,
  Compass,
  Layers,
  FileText,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Line,
} from "recharts";
import { useLocalState } from "../data/store";
import * as mock from "../data/mockData";

// Analytics chart data matching the green curve in reference screenshot
const analyticsData = [
  { name: "Sep", target: 50, attained: 64, baseline: 40 },
  { name: "Oct", target: 50, attained: 64, baseline: 42 },
  { name: "Nov", target: 50, attained: 64, baseline: 52 },
  { name: "Dec", target: 50, attained: 64, baseline: 65 },
  { name: "Jan", target: 85, attained: 64, baseline: 80 },
  { name: "Feb", target: 85, attained: 85, baseline: 85 },
];

const gradeDist = [
  { name: "A", value: 12, color: "#10b981" },
  { name: "B", value: 18, color: "#3b82f6" },
  { name: "C", value: 8, color: "#f59e0b" },
  { name: "D", value: 3, color: "#f97316" },
  { name: "F", value: 2, color: "#ef4444" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("clo"); // "clo" | "plo" | "grades"
  const [selectedYear, setSelectedYear] = useState("Spring 2026");
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const [customAnalysisModal, setCustomAnalysisModal] = useState(false);

  const [courses] = useLocalState("obe_courses", mock.courses);
  const [plos] = useLocalState("obe_plos", mock.plos);

  // Card themes for course cards
  const courseThemes = [
    {
      bgIcon: "bg-cyan-50 text-cyan-600 border border-cyan-200/60",
      icon: Compass,
      tag: "Attainment Rate",
      score: "88.5%",
      origin: "MID 82%",
      dest: "FINAL 89%",
      transit: "16 Weeks",
      baseRate: "76.5 Avg",
      fuel: "50% Target",
      valid: "2026-06-15",
    },
    {
      bgIcon: "bg-rose-50 text-rose-600 border border-rose-200/60",
      icon: Flame,
      tag: "Attainment Rate",
      score: "84.2%",
      origin: "MID 78%",
      dest: "FINAL 86%",
      transit: "16 Weeks",
      baseRate: "71.0 Avg",
      fuel: "50% Target",
      valid: "2026-06-15",
    },
    {
      bgIcon: "bg-amber-50 text-amber-600 border border-amber-200/60",
      icon: Sparkles,
      tag: "Attainment Rate",
      score: "81.0%",
      origin: "MID 75%",
      dest: "FINAL 84%",
      transit: "16 Weeks",
      baseRate: "69.8 Avg",
      fuel: "50% Target",
      valid: "2026-06-15",
    },
    {
      bgIcon: "bg-blue-50 text-blue-600 border border-blue-200/60",
      icon: Target,
      tag: "Attainment Rate",
      score: "86.8%",
      origin: "MID 80%",
      dest: "FINAL 88%",
      transit: "16 Weeks",
      baseRate: "74.2 Avg",
      fuel: "50% Target",
      valid: "2026-06-15",
    },
    {
      bgIcon: "bg-purple-50 text-purple-600 border border-purple-200/60",
      icon: Layers,
      tag: "Attainment Rate",
      score: "89.4%",
      origin: "MID 84%",
      dest: "FINAL 92%",
      transit: "16 Weeks",
      baseRate: "78.0 Avg",
      fuel: "50% Target",
      valid: "2026-06-15",
    },
    {
      bgIcon: "bg-emerald-50 text-emerald-600 border border-emerald-200/60",
      icon: GraduationCap,
      tag: "Attainment Rate",
      score: "83.6%",
      origin: "MID 76%",
      dest: "FINAL 85%",
      transit: "16 Weeks",
      baseRate: "70.5 Avg",
      fuel: "50% Target",
      valid: "2026-06-15",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title & Subtitle Area matching screenshot */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
            AI-Generated OBE Attainment Results
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Department of Computer Science • Spring 2026 | 136 Credit Hours | HEC & NCEAC Accredited
          </p>
        </div>

        {/* Top Right Action Button: Upload Doc */}
        <div className="flex items-center gap-2">
          <Link
            to="/documents"
            className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200/90 text-gray-800 rounded-full px-4 py-2 text-xs font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all cursor-pointer"
          >
            <UploadCloud size={15} className="text-gray-600" />
            <span>Upload Doc</span>
          </Link>
        </div>
      </div>

      {/* Analytics Card (Quote Generator Analytics style) */}
      <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] relative overflow-hidden">
        {/* Card Header with Title, Tabs, Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-sm font-bold text-gray-900">
            Attainment & Cohort Analytics
          </h2>

          {/* Middle Filter Tabs: Sea, Air, Road style */}
          <div className="flex items-center gap-1.5 bg-gray-50/80 p-1 rounded-full border border-gray-200/60">
            <button
              type="button"
              onClick={() => setActiveTab("clo")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                activeTab === "clo"
                  ? "bg-white text-gray-900 shadow-2xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Waves size={13} className="text-cyan-500" />
              <span>CLO Attainment</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("plo")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                activeTab === "plo"
                  ? "bg-white text-gray-900 shadow-2xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Plane size={13} className="text-purple-500" />
              <span>PLO Mapping</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("grades")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                activeTab === "grades"
                  ? "bg-white text-gray-900 shadow-2xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Truck size={13} className="text-emerald-500" />
              <span>Grade Cohort</span>
            </button>
          </div>

          {/* Dropdown Selector */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="appearance-none bg-white border border-gray-200/90 rounded-full px-3.5 py-1.5 pr-8 text-xs font-semibold text-gray-700 outline-none shadow-2xs cursor-pointer hover:border-gray-300"
              >
                <option value="Spring 2026">Spring 2026</option>
                <option value="Fall 2025">Fall 2025</option>
                <option value="Yearly">Yearly (2025-26)</option>
              </select>
              <ChevronDown
                size={13}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Content depending on active tab */}
        {activeTab === "clo" && (
          <div className="relative">
            {/* Mint Green Area/Line Chart */}
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={analyticsData}
                  margin={{ top: 10, right: 30, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="mintGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00c078" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#00c078" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
                    dy={5}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
                    domain={[0, 100]}
                    ticks={[0, 20, 40, 60, 80]}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white border border-gray-200/90 rounded-2xl shadow-xl p-3 text-xs">
                            <p className="font-bold text-gray-900 mb-1.5">{label}</p>
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                              <span className="w-2 h-2 rounded-full border border-gray-400"></span>
                              <span>Target: {payload[0]?.value}%</span>
                            </div>
                            <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                              <span>Attained: {payload[1]?.value || 85}%</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  {/* Dotted threshold line */}
                  <Line
                    type="stepAfter"
                    dataKey="baseline"
                    stroke="#cbd5e1"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    dot={false}
                  />
                  {/* Mint Green Line and Gradient Area */}
                  <Area
                    type="monotone"
                    dataKey="attained"
                    stroke="#00c078"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#mintGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Pinned Tooltip Card like the screenshot on top right of chart */}
            <div className="hidden lg:block absolute right-16 top-4 bg-white/95 backdrop-blur-xs border border-gray-200/80 rounded-2xl shadow-lg p-3 text-xs select-none">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Jan • Benchmark
              </p>
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between gap-4 text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full border border-gray-400"></span>
                    Target Benchmark
                  </span>
                  <span className="font-bold text-gray-700">85%</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-emerald-600 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Attained Score
                  </span>
                  <span className="font-bold">23 / 78%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "plo" && (
          <div className="py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {plos.map((plo) => (
                <div
                  key={plo.id}
                  className="p-3 rounded-2xl bg-gray-50/80 border border-gray-150 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">{plo.number}</span>
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      84%
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 font-medium mt-1 truncate">
                    {plo.title}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-2">{plo.bloom_domain}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "grades" && (
          <div className="py-4 flex flex-col md:flex-row items-center justify-around gap-6">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
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
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-md">
              {gradeDist.map((g) => (
                <div
                  key={g.name}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <div className="w-3 h-3 rounded-full" style={{ background: g.color }} />
                  <div>
                    <span className="text-xs font-bold text-gray-800">Grade {g.name}</span>
                    <p className="text-[10px] text-gray-500">{g.value} Students</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI Recommendation Banner matching screenshot's soft pink/purple gradient */}
      <div className="bg-gradient-to-r from-pink-50/80 via-purple-50/50 to-pink-50/80 border border-pink-200/60 rounded-3xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-2xl bg-white border border-pink-200 text-pink-600 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="text-xs md:text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <span>AI Recommendation</span>
            </h3>
            <p className="text-xs text-gray-600 mt-1 max-w-2xl leading-relaxed">
              Based on historical cohort data and current market conditions, we recommend
              reinforcing CLO-2 (Model Evaluation) in CS-401 for optimal cost-efficiency
              and student achievement. This course has a 98% on-time delivery rate.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setCustomAnalysisModal(true)}
          className="bg-black hover:bg-neutral-800 text-white rounded-full px-5 py-2.5 text-xs font-semibold shadow-xs flex items-center gap-2 shrink-0 transition-all cursor-pointer"
        >
          <Sparkles size={14} className="text-purple-300" />
          <span>Request Custom Analysis</span>
        </button>
      </div>

      {/* Card Grid (3 Columns) matching the bottom cards of the screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((course, idx) => {
          const theme = courseThemes[idx % courseThemes.length];
          const IconComp = theme.icon;
          const isMenuOpen = dropdownOpenId === course.id;

          return (
            <div
              key={course.id}
              className="bg-white rounded-3xl border border-gray-200/80 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col justify-between relative group"
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between mb-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shadow-2xs ${theme.bgIcon}`}
                    >
                      <IconComp size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 leading-tight">
                        {course.title}
                      </h3>
                      <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                        Code: {course.code} | {course.credit_hours} Cr. Hrs | Core
                      </p>
                    </div>
                  </div>

                  {/* Three Dots Menu Button */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setDropdownOpenId(isMenuOpen ? null : course.id)}
                      className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <MoreHorizontal size={16} />
                    </button>

                    {/* Popover Dropdown matching Download/Share in screenshot */}
                    {isMenuOpen && (
                      <div className="absolute right-0 top-7 w-36 bg-white border border-gray-200/90 rounded-2xl shadow-xl p-1.5 z-40 text-xs">
                        <Link
                          to="/reports"
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setDropdownOpenId(null)}
                        >
                          <Download size={13} className="text-gray-400" />
                          <span>Download</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(window.location.href);
                            setDropdownOpenId(null);
                            alert("Course link copied!");
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors text-left"
                        >
                          <Share2 size={13} className="text-gray-400" />
                          <span>Share</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Attainment Score / Total Cost row */}
                <div className="flex items-center justify-between py-2 border-t border-gray-100">
                  <span className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                    <FileText size={13} className="text-gray-400" />
                    {theme.tag}
                  </span>
                  <span className="text-base font-extrabold text-gray-900 tracking-tight">
                    {theme.score}
                  </span>
                </div>

                {/* Route / Progress Indicator (SHA -> DXB style) */}
                <div className="my-3 py-2 px-3 bg-gray-50/70 rounded-2xl border border-gray-150 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-gray-800">{theme.origin}</p>
                    <p className="text-[9px] text-gray-400">Evaluation 1</p>
                  </div>

                  {/* Dotted line with icon in middle */}
                  <div className="flex-1 mx-3 flex items-center justify-center relative">
                    <div className="w-full border-b border-dashed border-gray-300"></div>
                    <div className="absolute w-6 h-6 rounded-full bg-white border border-gray-200 shadow-2xs flex items-center justify-center text-gray-500">
                      <GraduationCap size={12} />
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-[11px] font-bold text-gray-800">{theme.dest}</p>
                    <p className="text-[9px] text-gray-400">Evaluation 2</p>
                  </div>
                </div>

                {/* 4-Column Metadata row */}
                <div className="grid grid-cols-4 gap-1 py-2 text-center border-t border-b border-gray-100 text-[10px]">
                  <div>
                    <p className="text-gray-400">Duration</p>
                    <p className="font-bold text-gray-800 mt-0.5">{theme.transit}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Cohort Score</p>
                    <p className="font-bold text-gray-800 mt-0.5">{theme.baseRate}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Benchmark</p>
                    <p className="font-bold text-gray-800 mt-0.5">{theme.fuel}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Valid Until</p>
                    <p className="font-bold text-gray-800 mt-0.5">{theme.valid}</p>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions matching screenshot: Draft + Book Shipment */}
              <div className="flex items-center gap-2 mt-4 pt-1">
                <Link
                  to="/blueprint"
                  className="flex items-center justify-center gap-1.5 border border-gray-200/90 bg-white hover:bg-gray-50 text-gray-700 rounded-full px-4 py-2 text-xs font-semibold shadow-2xs transition-all flex-1"
                >
                  <Bookmark size={13} className="text-gray-400" />
                  <span>Blueprint</span>
                </Link>

                <Link
                  to="/marks"
                  className="flex items-center justify-center gap-1.5 bg-black hover:bg-neutral-800 text-white rounded-full px-4 py-2 text-xs font-semibold shadow-2xs transition-all flex-1 text-center"
                >
                  <span>Enter Marks</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Analysis Modal */}
      {customAnalysisModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl p-6 w-full max-w-lg animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Request Custom OBE Analysis
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Select specific cohorts and rubrics to run automated multi-metric evaluation.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Analysis Scope
                </label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white outline-none focus:ring-2 focus:ring-black/5">
                  <option>All Active Spring 2026 Courses</option>
                  <option>Machine Learning (CS-401) Only</option>
                  <option>Graduating Batch (BSCS-2022)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Target Outcome Metric
                </label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white outline-none focus:ring-2 focus:ring-black/5">
                  <option>CLO Attainment Threshold (50%)</option>
                  <option>PLO Mapping Alignment</option>
                  <option>High/Average/Low Submissions Gap</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                type="button"
                onClick={() => {
                  setCustomAnalysisModal(false);
                  alert("Custom analysis requested! Report generated.");
                }}
                className="flex-1 bg-black hover:bg-neutral-800 text-white py-2.5 rounded-full text-xs font-semibold transition-colors"
              >
                Generate Analysis
              </button>
              <button
                type="button"
                onClick={() => setCustomAnalysisModal(false)}
                className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 py-2.5 rounded-full text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
