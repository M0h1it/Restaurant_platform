import apiMain from "../api/apiMain";
import { getCurrentUser } from "../utils/auth";

/* ================= HELPERS ================= */

const getStoreId = () => {
  const user = getCurrentUser();
  if (!user?.store_id) {
    throw new Error("Store ID not found in auth");
  }
  return user.store_id;
};

/* ================= CATEGORIES ================= */

// GET store-wise categories
export const getCategories = async () => {
  const storeId = getStoreId();
  const res = await apiMain.get(`/category/store/${storeId}`);

  // normalize for UI
  return res.data.map((c) => ({
    id: c.id,
    store_id: c.store_id,
    name: c.category_name,        // 🔥 UI-friendly
    description: c.description,
    status: c.status,
    created_at: c.created_at,
  }));
};

// ADD category
export const addCategory = async ({ category_name, description }) => {
  const storeId = getStoreId();

  const res = await apiMain.post("/category", {
    category_name,
    description,
    store_id: storeId,
  });

  return {
    id: res.data.category_id,
    name: category_name,
    description,
  };
};


// UPDATE category
export const updateCategory = async (id, data) => {
  const payload = {
    category_name: data.category_name,
    description: data.description || null,
    status: data.status ?? 1,
  };

  await apiMain.put(`/category/${id}`, payload);
  return true;
};


// DELETE category
export const deleteCategoryApi = async (id) => {
  await apiMain.delete(`/category/${id}`);
  return true;
};

/* ================= MENU ITEMS ================= */

// GET items by store
export const getMenuItems = async () => {
  const storeId = getStoreId();
  const res = await apiMain.get(`/menu-item/store/${storeId}`);

  return res.data.map((i) => ({
    id: i.id,
    store_id: i.store_id,
    category_id: i.category_id,
    category_name: i.category_name,
    name: i.item_name,
    price: i.price,
    description: i.description,
    secondary: i.secondary_description,
    type: i.food_type,
    image: null,
    status: i.status,
    created_at: i.created_at,
  }));
};

// ADD menu item
export const addMenuItem = async (item) => {
  const storeId = getStoreId();

  const payload = {
    store_id: storeId,
    category_id: item.category_id,
    item_name: item.name,
    price: item.price,
    description: item.description,
    secondary_description: item.secondary,
    food_type: item.type,
  };

  const res = await apiMain.post("/menu-item", payload);

  return {
    id: res.data.item_id,
    ...item,
    store_id: storeId,
  };
};

// UPDATE menu item
export const updateMenuItem = async (id, item) => {
  const payload = {
    category_id: item.category_id,
    item_name: item.name,
    price: item.price,
    description: item.description,
    secondary_description: item.secondary,
    food_type: item.type,
    status: item.status,
  };

  await apiMain.put(`/menu-item/${id}`, payload);
  return true;
};

// DELETE menu item
export const deleteMenuItem = async (id) => {
  await apiMain.delete(`/menu-item/${id}`);
  return true;
};

/* ================= MENU IMAGES ================= */

/* ================= MENU IMAGES ================= */

// GET images
export const getMenuImages = async () => {
  const storeId = getStoreId();
  const res = await apiMain.get(`/menu-image/store/${storeId}`);

  return res.data.map((img) => ({
    id: img.id,
    store_id: img.store_id,
    category_id: img.category_id,
    url: `${import.meta.env.VITE_ASSETS_BASE_URL}/uploads/menu-images/${img.image}`,
    status: img.status,
    created_at: img.created_at,
  }));
};

// UPLOAD image
export const uploadMenuImage = async (file, category_id) => {
  const storeId = getStoreId();

  const formData = new FormData();
  formData.append("image", file);
  formData.append("store_id", storeId);
  formData.append("category_id", category_id);

  const res = await apiMain.post("/menu-image", formData);

  return {
    id: res.data.image_id,
    store_id: storeId,
    category_id,
    url: `${import.meta.env.VITE_ASSETS_BASE_URL}${res.data.image_url}`,
    status: 1,
  };
};

// REPLACE image
export const replaceMenuImage = async (id, file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await apiMain.put(`/menu-image/${id}`, formData);

  return {
    id,
    url: `${import.meta.env.VITE_ASSETS_BASE_URL}${res.data.image_url}`,
  };
};


// DELETE image
export const deleteMenuImage = async (id) => {
  await apiMain.delete(`/menu-image/${id}`);
  return true;
};


