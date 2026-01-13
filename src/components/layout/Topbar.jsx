import { useLocation, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";

const Topbar = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const pageTitles = {
    "/admin/tables": "Manage Tables",
    "/admin/staff": "Manage Staff",
    "/admin/waiter": "Manage Waiters",
    "/admin/menu": "Menu Items",
    "/admin/roles": "Roles & Permissions",
  };

  const currentTitle = pageTitles[location.pathname] || "Admin Panel";

  return (
    <div className="d-flex align-items-center justify-content-between border-bottom px-3 py-2 bg-white">
      {/* LEFT */}
      <div className="d-flex align-items-center gap-3">
        {/* MOBILE ONLY */}
        <button
          className="btn btn-danger d-md-none"
          onClick={onMenuClick}
        >
          <FaBars />
        </button>

        <h4 className="mb-0 text-danger">{currentTitle}</h4>
      </div>

      <button
        className="btn btn-outline-secondary btn-sm"
        onClick={() => navigate("/")}
      >
        Sign Out
      </button>
    </div>
  );
};

export default Topbar;
