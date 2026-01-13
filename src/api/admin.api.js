import apiMain from "./apiMain";
import { dummyAdminData, persistDummyData } from "./dummy/admin.data";

const USE_DUMMY = true;

export const AdminAPI = {
  /* FLOORS & TABLES */
  getFloors: async () => {
    if (USE_DUMMY) return dummyAdminData.floors;
    const res = await apiMain.get("/admin/floors");
    return res.data;
  },

  saveFloors: async (floors) => {
    if (USE_DUMMY) {
      dummyAdminData.floors = floors;
      persistDummyData();
      return { success: true };
    }
    return apiMain.post("/admin/floors", { floors });
  },

  /* STAFF */
  getStaff: async () => {
    if (USE_DUMMY) return dummyAdminData.staff;
    const res = await apiMain.get("/admin/staff");
    return res.data;
  },

  saveStaff: async (staff) => {
    if (USE_DUMMY) {
      dummyAdminData.staff = staff;
      persistDummyData();
      return { success: true };
    }
    return apiMain.post("/admin/staff", { staff });
  },

  /* ROLE PERMISSIONS */
  getRolePermissions: async () => {
    if (USE_DUMMY) return dummyAdminData.rolePermissions;
    const res = await apiMain.get("/admin/roles/permissions");
    return res.data;
  },

  saveRolePermissions: async (data) => {
    if (USE_DUMMY) {
      dummyAdminData.rolePermissions = data;
      persistDummyData();
      return { success: true };
    }
    return apiMain.post("/admin/roles/permissions", data);
  },
};
