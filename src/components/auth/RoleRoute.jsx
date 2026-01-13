import { Navigate } from "react-router-dom";
import { getCurrentRole } from "../../utils/auth";

const RoleRoute = ({ role, children }) => {
  const currentRole = getCurrentRole();

  if (!currentRole) return <Navigate to="/" replace />;

  if (currentRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleRoute;
