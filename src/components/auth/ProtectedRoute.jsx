import { Navigate } from "react-router-dom";
import { can } from "../../utils/permissions";
import { getCurrentUser } from "../../utils/auth";

const ProtectedRoute = ({ children, permission }) => {
  const user = getCurrentUser();

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 🔐 Permission required but missing
  if (permission && !can(permission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
