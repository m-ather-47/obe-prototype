import { getCurrentUser, isAdmin } from "../data/auth";

export function usePermissions() {
  const user = getCurrentUser();
  return { user, canManage: isAdmin(user) };
}