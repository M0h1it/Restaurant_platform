import axios from "axios";
import { AUTH_USER_KEY } from "../constants/authKeys";

const apiMain = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api",
  timeout: 15000,
  withCredentials: true,
});

apiMain.interceptors.request.use((config) => {
  const auth = localStorage.getItem("restaurant_auth");
  if (auth) {
    const { token } = JSON.parse(auth);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default apiMain;
