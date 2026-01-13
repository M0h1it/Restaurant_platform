import { AUTH_USER_KEY } from "../constants/authKeys";

export const getCurrentUser = () => {
  const data = localStorage.getItem(AUTH_USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const getCurrentRole = () => {
  const user = localStorage.getItem(AUTH_USER_KEY);
  if (!user) return null;
  return JSON.parse(user).role;
};

export const logout = () => {
  localStorage.removeItem(AUTH_USER_KEY);
};
