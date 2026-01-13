const get = (key, fallback = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

const set = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const MenuStorage = {

  getCategories: () => get("MENU_CATEGORIES"),
  setCategories: (data) => set("MENU_CATEGORIES", data),

  getItems: () => get("MENU_ITEMS"),
  setItems: (data) => set("MENU_ITEMS", data),

  getImages: () => get("MENU_IMAGES"),
  setImages: (data) => set("MENU_IMAGES", data),
};
