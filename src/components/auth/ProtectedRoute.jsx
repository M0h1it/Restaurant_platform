import { Navigate } from "react-router-dom";
import { hasPermission } from "../../utils/permissions";
import { getCurrentRole } from "../../utils/auth";
import { ROLE_CONFIG } from "../../config/roles.config";

const ProtectedRoute = ({ children, permission }) => {
  const role = getCurrentRole();

  if (!role) return <Navigate to="/" replace />;

  if (permission && !hasPermission(role, permission)) {
  const config = ROLE_CONFIG[role];
  return <Navigate to={config?.defaultRoute || "/"} replace />;
  }

  return children;
};

export default ProtectedRoute;
