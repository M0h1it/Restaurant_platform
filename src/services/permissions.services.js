import api from "../api/axios";

/* ================= PERMISSIONS ================= */

// GET ALL PERMISSIONS
export const getPermissions = async () => {
  const res = await api.get("/permissions");
  return res.data.data || res.data;
};

// CREATE PERMISSION
export const createPermission = async ({ permission_name, description }) => {
  const res = await api.post("/permission", {
    permission_name,
    description,
  });
  return res.data.data || res.data;
};

// UPDATE PERMISSION
export const updatePermission = async (id, { permission_name, description }) => {
  const res = await api.put(`/permission/${id}`, {
    permission_name,
    description,
  });
  return res.data.data || res.data;
};

// DELETE PERMISSION
export const deletePermission = async (id) => {
  await api.delete(`/permission/${id}`);
};

/* ================= ROLE ↔ PERMISSION ================= */

// GET permissions assigned to a role
export const getPermissionsByRole = async (roleId) => {
  const res = await api.get(`/role-permissions/${roleId}`);
  return res.data.data || res.data;
};

// ASSIGN permission(s) to role  ✅ FIXED
export const assignPermissionsToRole = async (roleId, permissionIds) => {
  return api.post(`/role-permissions`, {
    role_id: roleId,
    permission_ids: permissionIds,
  });
};

// REMOVE permission from role
export const removePermissionFromRole = async (roleId, permissionId) => {
  return api.delete(`/role-permissions/${roleId}/${permissionId}`);
};

