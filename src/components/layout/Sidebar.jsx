import { NavLink } from "react-router-dom";
import {
  FaChair,
  FaUsers,
  FaUtensils,
  FaUserShield,
} from "react-icons/fa";
import { RiUserSettingsLine } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import { hasPermission } from "../../utils/permissions";
import { getCurrentRole } from "../../utils/auth";

const Sidebar = ({ open, onClose, isDesktop }) => {
  const role = getCurrentRole();
  const can = (p) => hasPermission(role, p);

  const linkStyle = ({ isActive }) => ({
    backgroundColor: isActive ? "#e5e5e5" : "transparent",
    color: isActive ? "#000" : "#fff",
    padding: "10px 12px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
  });

  return (
    <>
      {/* MOBILE OVERLAY */}
      {!isDesktop && open && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          style={{ zIndex: 1040 }}
          onClick={onClose}
        />
      )}

      {/* SIDEBAR */}
      <div
        className="bg-danger text-white p-3 d-flex flex-column position-fixed position-md-static"
        style={{
          width: 240,
          minHeight: "100vh",
          zIndex: 1050,
          transform:
            isDesktop || open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
        }}
      >
        <NavLink to="/admin/tables" className="nav-link mb-4" onClick={onClose}>
          <h5 className="text-white">Admin Panel</h5>
        </NavLink>

        <ul className="nav flex-column gap-2">
          {can("manage_tables") && (
            <NavLink to="/admin/tables" className="nav-link" style={linkStyle} onClick={onClose}>
              <FaChair className="me-2" /> Manage Tables
            </NavLink>
          )}

          {can("manage_waiters") && (
            <NavLink to="/admin/waiter" className="nav-link" style={linkStyle} onClick={onClose}>
              <FaUsers className="me-2" /> Manage Waiters
            </NavLink>
          )}

          {can("menu_items") && (
            <NavLink to="/admin/menu" className="nav-link" style={linkStyle} onClick={onClose}>
              <FaUtensils className="me-2" /> Menu Items
            </NavLink>
          )}
        </ul>

        <ul className="nav flex-column gap-2 mt-auto">
          {can("manage_staff") && (
            <NavLink to="/admin/staff" className="nav-link" style={linkStyle} onClick={onClose}>
              <RiUserSettingsLine className="me-2" /> Staff
            </NavLink>
          )}

          {can("role_permissions") && (
            <NavLink to="/admin/roles" className="nav-link" style={linkStyle} onClick={onClose}>
              <IoSettingsOutline  className="me-2" /> Roles & Permissions
            </NavLink>
          )}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
