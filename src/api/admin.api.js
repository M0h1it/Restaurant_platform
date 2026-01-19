import apiMain from "./apiMain";
import { getCurrentUser } from "../utils/auth";

const storeId = () => {
  const u = getCurrentUser();
  if (!u?.store_id) throw new Error("Store ID missing");
  return u.store_id;
};


export const AdminAPI = {
  /* ================= FLOORS ================= */

  // ✅ GET ALL FLOORS OF STORE
  getFloors: async () => {
    const res = await apiMain.get(`/floor/store/${storeId()}`);
    return res.data;
  },

  // ✅ CREATE FLOOR
  createFloor: async ({ floor_name, floor_number, description }) => {
    const res = await apiMain.post("/floor", {
      store_id: storeId(),
      floor_name,
      floor_number,
      description,
    });
    return res.data;
  },

  // ✅ UPDATE FLOOR
  updateFloor: async (floorId, { floor_name, floor_number, description, status }) => {
    const res = await apiMain.put(`/floor/${floorId}`, {
      floor_name,
      floor_number,
      description,
      status,
    });
    return res.data;
  },

  // ✅ DELETE FLOOR
  deleteFloor: async (floorId) => {
    return apiMain.delete(`/floor/${floorId}`);
  },

  /* ================= TABLES ================= */

  // ✅ GET TABLES BY FLOOR
  getTablesByFloor: async (floorId) => {
    const res = await apiMain.get(`/table/floor/${floorId}`);
    return res.data;
  },

  // ✅ GET ALL TABLES OF STORE
  getAllTables: async () => {
    const res = await apiMain.get(`/table/store/${storeId()}`);
    return res.data;
  },

  // ✅ CREATE TABLE
  createTable: async ({ floor_id, table_number, total_seats }) => {
    const res = await apiMain.post("/table", {
      store_id: storeId(),
      floor_id,
      table_number,
      total_seats,
    });
    return res.data;
  },

  // ✅ UPDATE TABLE
  updateTable: async (tableId, { floor_id, table_number, total_seats, status }) => {
    const res = await apiMain.put(`/table/${tableId}`, {
      floor_id,
      table_number,
      total_seats,
      status,
    });
    return res.data;
  },

  // ✅ DELETE TABLE
  deleteTable: async (tableId) => {
    return apiMain.delete(`/table/${tableId}`);
  },

  /* ================= STAFF ================= */

  // ✅ GET STAFF BY STORE
  getStaff: async () => {
  try {
    const res = await apiMain.get(`auth/staff/${storeId()}`);
    return res.data;
  } catch (e) {
    console.error("getStaff failed", e);
    return [];
  }
},

};