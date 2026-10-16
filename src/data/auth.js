import { users } from "./mockData";

const KEY = "obe_current_user";
const ALLOWED_ROLES = ["admin", "instructor"];

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.id && ALLOWED_ROLES.includes(parsed.role)) return parsed;
    }
  } catch {
    // ignore
  }
  const teacher = users.find((u) => u.role === "instructor");
  return teacher || users[0];
}

export function setCurrentUser(user) {
  if (ALLOWED_ROLES.includes(user?.role)) {
    localStorage.setItem(KEY, JSON.stringify(user));
  }
}

export const isAdmin = (user) => user?.role === "admin";