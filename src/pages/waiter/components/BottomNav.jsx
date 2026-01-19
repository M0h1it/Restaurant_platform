import { FaBell, FaUtensils } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import React from "react";

export default function BottomNav({ hasNotification }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname === "/waiter/dashboard";
  const isNotifications = location.pathname === "/waiter/notifications";
  console.log("Navigating from:", location.pathname);


  return (
    <nav
      className="navbar fixed-bottom bg-white shadow-lg border-top py-1"
      style={{ height: "65px" }}
    >
      <div className="container-fluid d-flex justify-content-around align-items-center">

        {/* ---------- Dashboard Tab ---------- */}
        <button
          aria-label="Go to Dashboard"
          onClick={() => navigate("/waiter/dashboard")}
          className="btn bg-transparent border-0 text-center d-flex flex-column align-items-center p-0"
        >
          <FaUtensils
            size={24}
            className={isDashboard ? "text-danger" : "text-secondary"}
          />
          <span
            className={`small mt-1 ${
              isDashboard ? "fw-bold text-danger" : "text-secondary"
            }`}
          >
            My Tables
          </span>
        </button>

        {/* ---------- Notifications Tab ---------- */}
        <button
          aria-label="Go to Notifications"
          onClick={() => navigate("/waiter/notifications")}
          className="btn position-relative bg-transparent border-0 text-center d-flex flex-column align-items-center p-0"
        >
          <FaBell
            size={24}
            className={isNotifications ? "text-danger" : "text-secondary"}
          />
          

          {hasNotification && (
            <span
              className="position-absolute top-0 end-0 translate-middle bg-danger rounded-circle border border-white"
              style={{ width: "12px", height: "12px" }}
            />
          )}

          <span
            className={`small mt-1 ${
              isNotifications ? "fw-bold text-danger" : "text-secondary"
            }`}
          >
            Notifications
          </span>
        </button>
      </div>
    </nav>
  );
}
