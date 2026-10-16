import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { users } from "../data/mockData";
import { setCurrentUser } from "../data/auth";
import { useLocalState } from "../data/store";
import { GraduationCap, ArrowRight, ShieldCheck, UserCheck } from "lucide-react";

export default function Login() {
  const [userList] = useLocalState("obe_users", users);
  const [email, setEmail] = useState("sara.malik@uiit.edu.pk");
  const [password, setPassword] = useState("demo123");
  const [role, setRole] = useState("instructor");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const user = userList.find(
      (candidate) =>
        candidate.role === role &&
        candidate.email.toLowerCase() === email.trim().toLowerCase() &&
        candidate.password === password
    );
    if (!user) {
      setError("Email or password is incorrect.");
      return;
    }
    setError("");
    setCurrentUser(user);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#f2f4f7] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-gray-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.04)] w-full max-w-md p-8 animate-in zoom-in-95 duration-200">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mx-auto mb-3.5 shadow-xs text-white">
            <GraduationCap size={28} />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">UIIT-OBE System</h1>
          <p className="text-xs text-gray-500 font-medium mt-1">Outcome-Based Education Management</p>
          <p className="text-[11px] text-gray-400 mt-0.5">PMAS Arid Agriculture University, Rawalpindi</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Role Segmented Pill Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Account Role</label>
            <div className="grid grid-cols-2 gap-2 bg-gray-50/80 p-1 rounded-2xl border border-gray-200/70">
              {["instructor", "admin"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRole(r);
                    setEmail(userList.find((user) => user.role === r)?.email || "");
                    setPassword("demo123");
                    setError("");
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all capitalize cursor-pointer flex items-center justify-center gap-1.5 ${
                    role === r
                      ? "bg-white text-gray-900 shadow-2xs font-bold"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {r === "admin" ? <ShieldCheck size={13} /> : <UserCheck size={13} />}
                  <span>{r}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Official Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              placeholder="e.g. sara.malik@uiit.edu.pk"
              className="w-full px-3.5 py-2.5 bg-gray-50/50 hover:bg-white focus:bg-white border border-gray-200/90 rounded-xl text-xs font-medium text-gray-800 outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400 transition-all shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="Enter your password"
              className="w-full px-3.5 py-2.5 bg-gray-50/50 hover:bg-white focus:bg-white border border-gray-200/90 rounded-xl text-xs font-medium text-gray-800 outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400 transition-all shadow-2xs"
            />
          </div>

          {error && (
            <p role="alert" className="text-xs text-red-600 font-medium bg-red-50 p-2.5 rounded-xl border border-red-200/60">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-black hover:bg-neutral-800 text-white py-3 rounded-full text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>Sign In to System</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-[11px] text-gray-400 font-medium">
            Demo password is <strong className="text-gray-700 font-mono">demo123</strong> for all seeded accounts.
          </p>
        </div>
      </div>
    </div>
  );
}