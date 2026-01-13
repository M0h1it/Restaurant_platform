import { FaPhoneAlt, FaReceipt, FaUser } from "react-icons/fa";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";

export default function TableGrid() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // STATE — MUST exist to update UI dynamically
  const [tables, setTables] = useState([
    { id: 2, seats: 4, status: "active", request: "none" },
    { id: 4, seats: 4, status: "active", request: "query" },
    { id: 6, seats: 4, status: "active", request: "bill" },
    { id: 8, seats: 4, status: "active", request: "bill" },
    { id: 1, seats: 4, status: "inactive", request: "none" },
    { id: 3, seats: 4, status: "inactive", request: "none" },
    { id: 5, seats: 4, status: "inactive", request: "none" },
    { id: 7, seats: 4, status: "inactive", request: "none" },
  ]);

  const handleCloseTabClick = (id) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const confirmCloseTab = () => {
    const updated = tables.map((table) =>
      table.id === selectedId
        ? { ...table, status: "inactive", request: "none" }
        : table
    );

    setTables(updated);
    setShowConfirm(false);
  };

  const handleOpenTab = (id) => {
    const updated = tables.map((table) =>
      table.id === id ? { ...table, status: "active", request: "none" } : table
    );

    setTables(updated);
  };

  return (
  <>
    <div className="row g-3 p-1">
      {tables.map((table) => (
        <div className="col-6" key={table.id}>
          <TableCard
            table={table}
            onCloseTab={() => handleCloseTabClick(table.id)}
            onOpenTab={() => handleOpenTab(table.id)}
          />
        </div>
      ))}
    </div>

    {showConfirm && (
      <ConfirmModal 
        message="Are you sure you want to close this tab?"
        onConfirm={confirmCloseTab}
        onCancel={() => setShowConfirm(false)}
      />
    )}
  </>
);

}

function TableCard({ table, onCloseTab, onOpenTab }) {
  const isActive = table.status === "active";
  const borderStyle = isActive ? "1px solid red" : "1px dashed gray";

  return (
    <div
      className="rounded-4 p-2 shadow-sm flex-grow-1 overflow-y-auto"
      style={{
        border: borderStyle,
        background: isActive ? "#fff" : "#fafafa",
      }}
    >
      {/* Icon Row */}
      <div className="d-flex align-items-center gap-2">
        <FaUser className={isActive ? "text-danger" : "text-secondary"} />
      </div>

      {/* Seats & Table Number */}
      <div className="d-flex justify-content-between align-items-start">
        <div className="small text-secondary">{table.seats} Seats</div>
        <div className="fw-bold">{table.id.toString().padStart(2, "0")}</div>
      </div>

      {/* Request status */}
      <div
        className="mt-2 d-flex align-items-center gap-2"
        style={{ minHeight: "20px" }}
      >
        {table.request === "query" && (
          <>
            <FaPhoneAlt size={16} className="text-danger" />
            <small>Calling you</small>
          </>
        )}

        {table.request === "bill" && (
          <>
            <FaReceipt size={16} className="text-danger" />
            <small>Asking for bill</small>
          </>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-2">
        {isActive ? (
          <button
            className="btn w-100 fw-bold"
            style={{
              background: "#D7000F",
              color: "white",
              borderRadius: "10px",
              padding: "4px",
              fontSize: "13px",
            }}
            onClick={onCloseTab}
          >
            Close Tab
          </button>
        ) : (
          <button
            className="btn w-100 fw-bold"
            style={{
              background: "#999",
              color: "white",
              borderRadius: "10px",
              padding: "4px",
              fontSize: "13px",
            }}
            onClick={onOpenTab}
          >
            Open Tab
          </button>
        )}
      </div>
    </div>
  );
}
