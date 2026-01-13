import apiMain from "./apiMain";
export const uploadMenuImageApi = (formData) =>
  apiMain.post("/menu/image", formData);

export const fetchMenuImagesApi = () =>
  apiMain.get("/menu/image");

export const fetchCategoriesApi = () =>
  apiMain.get("/menu/categories");

export const createCategoryApi = (data) =>
  apiMain.post("/menu/categories", data);

export const createMenuItemApi = (data) =>
  apiMain.post("/menu/items", data);

export const updateMenuItemApi = (id, data) =>
  apiMain.put(`/menu/items/${id}`, data);