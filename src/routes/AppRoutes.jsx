import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import ManageTables from "../pages/admin/ManageTables";
import ManageStaff from "../pages/admin/staff/index";
import ManageWaiters from "../pages/admin/waiter/ManageWaiters";
import MenuItems from "../pages/admin/menu/MenuPage";
import RolePermissions from "../pages/admin/roles/index";
import AdminLayout from "../components/layout/AdminLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import WaiterDashboard from "../pages/waiter/pages/Dashboard";
import WaiterLayout from "../components/layout/WaiterLayout";
import RoleRoute from "../components/auth/RoleRoute";



const AppRoutes = () => (
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<Login />} />

    {/* ADMIN ROUTES */}
    <Route
      element={
        <RoleRoute role="Admin">
          <AdminLayout />
        </RoleRoute>
      }
    >
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
          <ProtectedRoute permission="manage_staff">
            <ManageStaff />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/menu"
        element={
          <ProtectedRoute permission="menu_items">
            <MenuItems />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/roles"
        element={
          <ProtectedRoute permission="role_permissions">
            <RolePermissions />
          </ProtectedRoute>
        }
      />
    </Route>

    {/* WAITER ROUTES */}
    <Route
      element={
        <RoleRoute role="Waiter">
          <WaiterLayout />
        </RoleRoute>
      }
    >
      <Route path="/waiter/dashboard" element={<WaiterDashboard />} />
    </Route>
  </Routes>
</BrowserRouter>

);

export default AppRoutes;
