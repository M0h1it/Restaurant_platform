import React, { useState } from "react";
import Swal from "sweetalert2";
import { useWaiters } from "./hooks/useWaiters";
import WaiterCard from "./components/WaiterCard";
import AssignTablesModal from "./components/AssignTablesModal";

const ManageWaiters = () => {
  const {
    staff,
    setStaff,
    floors,
    activeTab,
    setActiveTab,
    filteredWaiters,
    toggleDuty,
  } = useWaiters();

  const [selectedWaiter, setSelectedWaiter] = useState(null);

  const handleEditClick = (waiter) => {
    if (!waiter.onDuty) {
      Swal.fire({
        icon: "warning",
        title: "Waiter is Off Duty",
        text: "Please set the waiter On Duty before assigning tables.",
        confirmButtonColor: "#dc3545",
      });
      return;
    }
    setSelectedWaiter(waiter);
  };

  return (
    <div className="container-fluid py-3">
      <h5 className="fw-bold text-dark mb-4">Manage Waiters</h5>

      {/* FILTER TABS */}
      <ul className="nav nav-tabs mb-4 border-bottom-0">
        {["all", "on", "off"].map((t) => (
          <li className="nav-item" key={t}>
            <button
              className={`nav-link border-0 fw-bold ${
                activeTab === t
                  ? "active text-danger border-bottom border-danger"
                  : "text-muted"
              }`}
              onClick={() => setActiveTab(t)}
            >
              {t === "all" ? "All Staff" : t === "on" ? "On Duty" : "Off Duty"}
            </button>
          </li>
        ))}
      </ul>

      {/* WAITER CARDS */}
      <div className="row g-4">
        {filteredWaiters.length > 0 ? (
          filteredWaiters.map((w) => (
            <WaiterCard
              key={w.id}
              waiter={w}
              onToggleDuty={toggleDuty}
              onEditAssignment={handleEditClick}
            />
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <p className="text-muted">No waiters found in this category.</p>
          </div>
        )}
      </div>

      {/* ASSIGN MODAL */}
      {selectedWaiter && (
        <AssignTablesModal
          waiter={selectedWaiter}
          floors={floors}
          staff={staff}
          setStaff={setStaff}
          onClose={() => setSelectedWaiter(null)}
        />
      )}
    </div>
  );
};

export default ManageWaiters;
