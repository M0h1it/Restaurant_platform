import { load } from "./storage";
import { ROLE_PERMISSIONS_KEY } from "../constants/storageKeys";
import { DEFAULT_ROLE_PERMISSIONS } from "../pages/admin/roles/permissions.config";

export const hasPermission = (role, permissionKey) => {
  if (!role) return false;

  // 1️⃣ Try dynamic permissions
  const storedPermissions = load(ROLE_PERMISSIONS_KEY, null);
  const permissions =
    storedPermissions?.[role] ||
    DEFAULT_ROLE_PERMISSIONS[role] ||
    [];

  return permissions.includes(permissionKey);
};
