// pages/admin/roles/permissions.config.js

export const ROLES = [
  { id: 1, name: "Admin" },
  { id: 2, name: "Manager" },
  { id: 3, name: "Waiter" },
];

/*
  ONE permission = ONE module / page
  No micro permissions
*/
export const PERMISSIONS = [
  { key: "manage_floors", label: "Manage Floors" },
  { key: "manage_tables", label: "Manage Tables" },
  { key: "manage_waiters", label: "Manage Waiters" },
  { key: "manage_staff", label: "Manage Staff" },
  { key: "menu_items", label: "Menu Items" },
  { key: "role_permissions", label: "Roles & Permissions" },
  { key: "table_queries", label: "Handle Table Queries" },
];

/*
  DEFAULT SYSTEM POLICY
*/
export const DEFAULT_ROLE_PERMISSIONS = {
  Admin: [
    "manage_floors",
    "manage_tables",
    "manage_waiters",
    "manage_staff",
    "menu_items",
    "role_permissions",
    "table_queries",
  ],

  Manager: [
    "manage_floors",
    "manage_tables",
    "manage_waiters",
    "manage_staff",
    "menu_items",
    "table_queries",
  ],

  Waiter: ["manage_tables", "table_queries"],
};
