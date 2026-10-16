import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { users } from "../data/mockData";
import { setCurrentUser } from "../data/auth";
import { useLocalState } from "../data/store";

export default function Login() {
  const [userList] = useLocalState("obe_users", users);
  const [email, setEmail] = useState("sara.malik@uiit.edu.pk");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("instructor");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const user = userList.find((candidate) =>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">OBE</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">UIIT-OBE System</h1>
          <p className="text-gray-500 text-sm mt-1">Outcome-Based Education Management</p>
          <p className="text-xs text-gray-400 mt-1">PMAS Arid Agriculture University, Rawalpindi</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <div className="grid grid-cols-2 gap-2">
              {["admin", "instructor"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRole(r);
                    setEmail(userList.find((user) => user.role === r)?.email || "");
                    setPassword("");
                    setError("");
                  }}
                  className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors capitalize ${
                    role === r
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              placeholder="Enter your email"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="Enter your password"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Demo accounts use password <span className="font-semibold text-gray-500">demo123</span>. Teacher credentials are set by the administrator.
        </p>
      </div>
    </div>
  );
}