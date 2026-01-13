const STORAGE_KEY = "__ADMIN_DUMMY_DATA__";

const defaultData = {
  floors: [{ id: 1, name: "Floor 1", tables: [] }],
  staff: [],
  rolePermissions: null,
};

export const dummyAdminData = (() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
  return structuredClone(defaultData);
})();

export const persistDummyData = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dummyAdminData));
};
