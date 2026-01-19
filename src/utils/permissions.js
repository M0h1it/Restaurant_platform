import { getCurrentUser } from "./auth";

export const can = (permission) => {
  const user = getCurrentUser();
  if (!user) return false;
  return user.permissions?.includes(permission);
};

export const canAny = (permissions = []) => {
  return permissions.some((p) => can(p));
};

export const canAll = (permissions = []) => {
  return permissions.every((p) => can(p));
};
      