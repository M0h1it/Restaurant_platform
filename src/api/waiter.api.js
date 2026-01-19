import apiMain from "./apiMain";
import { getCurrentUser } from "../utils/auth";

const getIds = () => {
  const u = getCurrentUser();
  if (!u?.id) throw new Error("Auth missing");
  return { waiterId: u.id };
};

export const WaiterAPI = {
  // tables assigned to waiter
  getMyTables: async () => {
    const { waiterId } = getIds();
    const res = await apiMain.get(`/staff/${waiterId}/tables`);
    return res.data;
  },

  // notifications for waiter
  getNotifications: async () => {
    const { waiterId } = getIds();
    const res = await apiMain.get(`/staff/${waiterId}/notifications`);
    return res.data;
  },

  // resolve notification
  resolveRequest: async (id) => {
    return apiMain.post(`/staff/resolve/${id}`);
  },
};
