export const MenuModeStorage = {
  get: () => localStorage.getItem("MENU_MODE") || "items",
  set: (mode) => localStorage.setItem("MENU_MODE", mode),
};
