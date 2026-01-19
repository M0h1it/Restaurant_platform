import apiMain from "../api/apiMain";
import { AUTH_USER_KEY } from "../constants/authKeys";

const decodeJWT = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

const STAFF_DEFAULT_PERMISSIONS = [
  "view_dashboard_waiter",
  "manage_tables", // only if waiter can see tables
  "table_queries",
];

export const login = async (email, password) => {
  // 1️⃣ LOGIN
  const res = await apiMain.post("/auth/login", { email, password });
  const { token, user } = res.data;

  if (!token) throw new Error("Invalid login response");

  const decoded = decodeJWT(token);
  if (!decoded?.role_id) throw new Error("Invalid token");

  // 2️⃣ SAVE TOKEN (needed for interceptor)
  localStorage.setItem(
    AUTH_USER_KEY,
    JSON.stringify({ token })
  );

  let permissions = [];

  // 3️⃣ ROLE BASED PERMISSION LOADING
  const isStaffRole = ["waiter", "staff"].includes(
    user.role.toLowerCase()
  );

  if (isStaffRole) {
    // 🔒 Staff NEVER reads role-permissions
    permissions = STAFF_DEFAULT_PERMISSIONS;
  } else {
    // 🛡 Admin / manager / owner → read from backend
    try {
      const permsRes = await apiMain.get(
        `/role-permissions/${decoded.role_id}`
      );

      permissions = permsRes.data.map((p) =>
        p.permission_name.trim().toLowerCase().replace(/\s+/g, "_")
      );
    } catch {
      throw new Error("Permission load failed");
    }
  }

  // 4️⃣ SAVE FULL AUTH USER
  const authUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    role_id: decoded.role_id,
    store_id: user.store_id,
    token,
    permissions,
  };

  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
  return authUser;
};

export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem(AUTH_USER_KEY));
  } catch {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem(AUTH_USER_KEY);
};
