import apiMain from "../api/apiMain";
import { MenuStorage } from "../utils/menu.storage";
import { fileToBase64 } from "../utils/fileToBase64";

const USE_API = false;

/* ================= IMAGES ================= */

export const uploadMenuImage = async (file, name) => {
  if (!USE_API) {
    const images = MenuStorage.getImages();

    const newImage = {
      id: Date.now(),
      name,
      url: await fileToBase64(file), // 🔥 important
    };

    MenuStorage.setImages([...images, newImage]);
    return { data: newImage };
  }

  const formData = new FormData();
  formData.append("image", file);
  formData.append("name", name);

  const res = await apiMain.post("/menu/images", formData);
  return { data: res.data };
};

export const getMenuImages = async () => {
  if (!USE_API) {
    return { data: MenuStorage.getImages() };
  }
  const res = await apiMain.get("/menu/images");
  return { data: res.data };
};

export const deleteMenuImage = async (id) => {
  if (!USE_API) {
    MenuStorage.setImages(
      MenuStorage.getImages().filter(i => i.id !== id)
    );
    return { success: true };
  }
  await apiMain.delete(`/menu/images/${id}`);
  return { success: true };
};

export const replaceMenuImage = async (id, file) => {
  if (!USE_API) {
    const images = MenuStorage.getImages();

    const updated = await Promise.all(images.map(async (img) =>
      img.id === id
        ? { ...img, url: await fileToBase64(file) }
        : img
    ));

    MenuStorage.setImages(updated);
    return { data: updated.find(i => i.id === id) };
  }

  const formData = new FormData();
  formData.append("image", file);
  const res = await apiMain.put(`/menu/images/${id}`, formData);
  return { data: res.data };
};

/* ================= CATEGORIES ================= */

export const getCategories = async () => {
  if (!USE_API) {
    return { data: MenuStorage.getCategories() };
  }
  const res = await apiMain.get("/menu/categories");
  return { data: res.data };
};

export const addCategory = async (name) => {
  if (!USE_API) {
    const categories = MenuStorage.getCategories();
    const newCategory = { id: Date.now(), name };
    MenuStorage.setCategories([...categories, newCategory]);
    return { data: newCategory };
  }
  const res = await apiMain.post("/menu/categories", { name });
  return { data: res.data };
};

export const deleteCategoryApi = async (id) => {
  if (!USE_API) {
    MenuStorage.setCategories(
      MenuStorage.getCategories().filter(c => c.id !== id)
    );
    return { success: true };
  }
  await apiMain.delete(`/menu/categories/${id}`);
  return { success: true };
};

/* ================= ITEMS ================= */

export const getMenuItems = async () => {
  if (!USE_API) {
    return { data: MenuStorage.getItems() };
  }
  const res = await apiMain.get("/menu/items");
  return { data: res.data };
};

export const addMenuItem = async (item) => {
  if (!USE_API) {
    const items = MenuStorage.getItems();
    const newItem = { id: Date.now(), ...item };
    MenuStorage.setItems([...items, newItem]);
    return { data: newItem };
  }
  const res = await apiMain.post("/menu/items", item);
  return { data: res.data };
};

export const updateMenuItem = async (id, data) => {
  if (!USE_API) {
    const updated = MenuStorage.getItems().map(i =>
      i.id === id ? { ...i, ...data } : i
    );
    MenuStorage.setItems(updated);
    return { data: updated.find(i => i.id === id) };
  }
  const res = await apiMain.put(`/menu/items/${id}`, data);
  return { data: res.data };
};

export const deleteMenuItem = async (id) => {
  if (!USE_API) {
    MenuStorage.setItems(
      MenuStorage.getItems().filter(i => i.id !== id)
    );
    return { success: true };
  }
  await apiMain.delete(`/menu/items/${id}`);
  return { success: true };
};
