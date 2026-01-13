import React from "react";
import { FaInfoCircle, FaUser } from "react-icons/fa";
import { useLocation } from "react-router-dom";

export default function MenuHeader({ onLogOut, onToggleLegend }) {
  const location = useLocation();
  const hideActions = location.pathname === "/notifications";

  return (
    <header className="d-flex justify-content-between align-items-center px-3 py-3 shadow-sm bg-danger">
      <h4 className="m-0 text-white fw-bold">My Tables</h4>

      <div className="d-flex align-items-center gap-3">
        {!hideActions && (
          <button
            aria-label="Open status legend"
            onClick={onToggleLegend}
            className="btn p-0 border-0 bg-transparent text-white"
          >
            <FaInfoCircle size={22} className="text-white" />
          </button>
        )}

        {!hideActions && (
          <button
            aria-label="Sign Out"
            onClick={onLogOut}
            className="btn p-0 border-0 bg-transparent d-flex flex-column align-items-center text-white"
          >
            <FaUser size={22} className="text-white" />
            <small className="text-white" style={{ fontSize: 11 }}>
              Sign Out
            </small>
          </button>
        )}
      </div>
    </header>
  );
}
