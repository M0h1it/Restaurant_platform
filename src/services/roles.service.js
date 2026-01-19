import api from "../api/axios";

/* ================= ROLES ================= */

// GET ALL ROLES
export const getRoles = async () => {
  const res = await api.get("/roles");
  return res.data.data || res.data;
};

// CREATE ROLE
export const createRole = async ({ role_name, description }) => {
  const res = await api.post("/role", {
    role_name,
    description,
  });
  return res.data.data || res.data;
};

// UPDATE ROLE
export const updateRole = async (id, { role_name, description }) => {
  const res = await api.put(`/role/${id}`, {
    role_name,
    description,
  });
  return res.data.data || res.data;
};

// DELETE ROLE
export const deleteRole = async (id) => {
  await api.delete(`/role/${id}`);
};