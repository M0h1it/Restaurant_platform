import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { can } from "../utils/permissions";

import Login from "../pages/auth/Login";
import ManageTables from "../pages/admin/ManageTables";
import ManageStaff from "../pages/admin/staff";
import ManageWaiters from "../pages/admin/waiter/ManageWaiters";
import MenuItems from "../pages/admin/menu/MenuPage";
import RolePermissions from "../pages/admin/roles";
import WaiterDashboard from "../pages/waiter/pages/Dashboard";
import Notifications from "../pages/waiter/pages/Notifications";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import LayoutRoute from "../components/auth/LayoutRoute";

const DashboardRouter = () => {
  if (can("view_dashboard_admin")) {
    return <Navigate to="/admin/tables" replace />;
  }

  if (can("view_dashboard_waiter")) {
    return <Navigate to="/waiter/dashboard" replace />;
  }

  return <Navigate to="/unauthorized" replace />;
};




const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardRouter />
          </ProtectedRoute>
        }
      />

      <Route element={<LayoutRoute />}>
        <Route
          path="/admin/tables"
          element={
            <ProtectedRoute permission="manage_tables">
              <ManageTables />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/waiter"
          element={
            <ProtectedRoute permission="manage_waiters">
              <ManageWaiters />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/staff"
          element={
            <ProtectedRoute permission="view_staff">
              <ManageStaff />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/menu"
          element={
            <ProtectedRoute permission="manage_menu">
              <MenuItems />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/roles"
          element={
            <ProtectedRoute permission="manage_roles">
              <RolePermissions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/waiter/dashboard"
          element={
            <ProtectedRoute permission="view_dashboard_waiter">
              <WaiterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/waiter/notifications"
  element={
    <ProtectedRoute permission="view_dashboard_waiter">
      <Notifications />
    </ProtectedRoute>
  }
/>  
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
