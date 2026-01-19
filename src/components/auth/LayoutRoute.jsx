import { Navigate, Outlet } from "react-router-dom";
import { can } from "../../utils/permissions";
import AdminLayout from "../layout/AdminLayout";
import WaiterLayout from "../layout/WaiterLayout";

const LayoutRoute = () => {
  if (can("view_dashboard_admin")) {
    return (
      <AdminLayout>
        <Outlet />
      </AdminLayout>  
    );
  }

  if (can("view_dashboard_waiter")) {
    return (
      <WaiterLayout>
        <Outlet />
      </WaiterLayout>
    );
  }

  return <Navigate to="/" replace />;
};

export default LayoutRoute;
