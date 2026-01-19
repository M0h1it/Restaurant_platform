import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // only if backend uses cookies (safe to keep)
});

instance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("AUTH_USER"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default instance;
