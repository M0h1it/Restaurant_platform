import { useEffect, useRef, useState } from "react";
import { FaPlus, FaTrash, FaClock, FaUser } from "react-icons/fa";
import Swal from "sweetalert2";
import { AdminAPI } from "../../api/admin.api";
import { hasPermission } from "../../utils/permissions";
import { getCurrentUser } from "../../utils/auth";

const ManageTables = () => {
  const CURRENT_USER = getCurrentUser();
  const canManageTables = hasPermission(CURRENT_USER?.role, "manage_tables");

  const [floors, setFloors] = useState([]);
  const [activeFloorId, setActiveFloorId] = useState("");
  const [staff, setStaff] = useState([]);

  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showAddFloorModal, setShowAddFloorModal] = useState(false);
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [newFloorName, setNewFloorName] = useState("");
  const [form, setForm] = useState({ tableNumber: "", seats: "" });

  const timerRef = useRef({});

  /* ---------- INITIAL LOAD ---------- */
  useEffect(() => {
    AdminAPI.getFloors().then((data) => {
      if (!data || data.length === 0) {
        const defaultFloor = [
          { id: crypto.randomUUID(), name: "Floor 1", tables: [] },
        ];
        setFloors(defaultFloor);
        AdminAPI.saveFloors(defaultFloor);
        return;
      }

      // 🔥 NORMALIZE IDS
      const normalized = data.map((floor) => ({
        ...floor,
        id: String(floor.id), // ✅ force string
        tables: (floor.tables || []).map((t) => ({
          ...t,
          id: String(t.id), // ✅ force string
        })),
      }));

      setFloors(normalized);
      AdminAPI.saveFloors(normalized);
    });

    AdminAPI.getStaff().then(setStaff);
  }, []);

  /* ---------- SET DEFAULT FLOOR ---------- */
  useEffect(() => {
    if (!activeFloorId && floors.length > 0) {
      setActiveFloorId(floors[0].id);
    }
  }, [floors, activeFloorId]);

  /* ---------- CLEAN TIMERS ---------- */
  useEffect(() => {
    return () => {
      Object.values(timerRef.current).forEach(clearInterval);
      timerRef.current = {};
    };
  }, []);

  const activeFloor = floors.find((f) => f.id === activeFloorId);

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const getAssignedWaiter = (floorId, tableId) => {
    const waiter = staff.find(
      (w) =>
        w.role === "Waiter" &&
        w.onDuty &&
        (w.tables || []).some(
          (t) => t.tableId === tableId && t.floorId === floorId
        )
    );
    return waiter ? waiter.name : "Not Assigned";
  };

  /* ---------- ADD FLOOR ---------- */

  /* ---------- ADD TABLE ---------- */
  const addTable = () => {
    if (!form.tableNumber || !form.seats) return;

    const updated = floors.map((f) =>
      f.id === activeFloorId
        ? {
            ...f,
            tables: [
              ...f.tables,
              {
                id: crypto.randomUUID(),
                number: form.tableNumber,
                seats: form.seats,
                is_active: true,
                timer: 0,
                query: "",
              },
            ],
          }
        : f
    );

    setFloors(updated);
    AdminAPI.saveFloors(updated);
    setForm({ tableNumber: "", seats: "" });
  };

  /* ---------- DELETE TABLE ---------- */
  const confirmDeleteTable = (tableId) => {
    Swal.fire({
      title: "Delete Table?",
      text: "This table will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete",
    }).then((result) => {
      if (!result.isConfirmed) return;

      const updated = floors.map((f) =>
        f.id === activeFloorId
          ? { ...f, tables: f.tables.filter((t) => t.id !== tableId) }
          : f
      );

      setFloors(updated);
      AdminAPI.saveFloors(updated);
    });
  };

  /* ---------- TOGGLE TABLE ---------- */
  const toggleTableStatus = (tableId) => {
    const updated = floors.map((f) =>
      f.id === activeFloorId
        ? {
            ...f,
            tables: f.tables.map((t) =>
              t.id === tableId
                ? { ...t, is_active: !t.is_active, timer: 0, query: "" }
                : t
            ),
          }
        : f
    );

    setFloors(updated);
    AdminAPI.saveFloors(updated);
  };

  /* ---------- DELETE FLOOR ---------- */
  const confirmDeleteFloor = (floorId) => {
    Swal.fire({
      title: "Delete Section?",
      text: "All tables inside this section will be removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete",
    }).then((result) => {
      if (!result.isConfirmed) return;

      const updated = floors.filter((f) => f.id !== floorId);
      setFloors(updated);
      AdminAPI.saveFloors(updated);

      if (floorId === activeFloorId && updated.length > 0) {
        setActiveFloorId(updated[0].id);
      }
    });
  };
  return (
    <>
      <div className="d-flex flex-column flex-sm-row gap-2 justify-content-between align-items-start align-items-sm-center mb-3">
        <h4 className="text-danger fw-bold">{activeFloor?.name}</h4>
        <select
          className="form-select shadow-sm"
          style={{ width: 180 }}
          value={activeFloorId}
          onChange={(e) => setActiveFloorId(e.target.value)}
        >
          {floors.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      <div className="row g-3">
        {activeFloor?.tables.map((t) => (
          <div className="col-12 col-sm-6 col-lg-4" key={t.id}>
            <div
              className={`card shadow-sm ${
                t.is_active ? "border-danger" : "border-secondary"
              }`}
              style={!t.is_active ? { borderStyle: "dashed" } : {}}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0 fw-bold">
                    {t.number} – {getAssignedWaiter(activeFloor.id, t.id)}
                  </h6>
                  <span className="badge bg-danger-subtle text-danger">
                    <FaUser /> {t.seats} Seats
                  </span>
                </div>

                <div className="d-flex justify-content-between mt-4 text-muted small">
                  <span>{t.query || "No active request"}</span>
                  <span>
                    <FaClock className="me-1" /> {formatTime(t.timer)}
                  </span>
                </div>
              </div>
            </div>
            <button
              className={`btn w-100 mt-2 shadow-sm ${
                t.is_active ? "btn-outline-danger" : "btn-outline-success"
              }`}
              onClick={() => toggleTableStatus(t.id)}
            >
              {t.is_active ? "Close Tab" : "Reopen Tab"}
            </button>
          </div>
        ))}
      </div>

      {canManageTables && (
        <div
          className="position-fixed"
          style={{ bottom: 30, right: 30, zIndex: 1050 }}
        >
          <button
            className="btn btn-danger rounded-circle shadow-lg"
            style={{ width: 60, height: 60 }}
            onClick={() => setShowActionMenu((p) => !p)}
          >
            <FaPlus />
          </button>

          {showActionMenu && (
            <div
              className="card shadow border-0 position-absolute"
              style={{ bottom: 75, right: 0, minWidth: 180 }}
            >
              <button
                className="btn btn-light text-start p-3"
                onClick={() => {
                  setShowAddFloorModal(true);
                  setShowActionMenu(false);
                }}
              >
                ➕ Add Section
              </button>
              <button
                className="btn btn-light text-start p-3"
                onClick={() => {
                  setShowAddTableModal(true);
                  setShowActionMenu(false);
                }}
              >
                ➕ Add Table
              </button>
              <button
                className="btn btn-light text-start p-3 border-top"
                onClick={() => {
                  setShowEditModal(true);
                  setShowActionMenu(false);
                }}
              >
                ✏️ Edit
              </button>
            </div>
          )}
        </div>
      )}

      {/* ... MODALS START HERE (Same as provided, but added shadow-lg to modal-content) ... */}
      {showAddFloorModal && (
        <div
          className="modal fade show d-block bg-dark bg-opacity-50"
          style={{ zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header">
                <h5 className="modal-title">Add Section</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowAddFloorModal(false)}
                />
              </div>
              <div className="modal-body">
                <input
                  className="form-control"
                  placeholder="Section Name (e.g. Garden, Rooftop)"
                  value={newFloorName}
                  onChange={(e) => setNewFloorName(e.target.value)}
                />
              </div>
              <div className="modal-footer border-0">
                <button
                  className="btn btn-light"
                  onClick={() => setShowAddFloorModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger px-4"
                  onClick={() => {
                    if (!newFloorName.trim()) return;
                    setFloors((prev) => {
                      const updated = [
                        ...prev,
                        {
                          id: crypto.randomUUID(), // ✅ SAFE
                          name: newFloorName.trim(),
                          tables: [],
                        },
                      ];

                      AdminAPI.saveFloors(updated);
                      return updated;
                    });

                    setNewFloorName("");
                    setShowAddFloorModal(false);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ... Other modals (AddTable, Edit) follow same structure ... */}
      {showAddTableModal && (
        <div
          className="modal fade show d-block bg-dark bg-opacity-50"
          style={{ zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header">
                <h5 className="modal-title">Add Table</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowAddTableModal(false)}
                />
              </div>
              <div className="modal-body">
                <label className="small text-muted mb-1">
                  Table Name / Number
                </label>
                <input
                  className="form-control mb-3"
                  placeholder="e.g. T-01"
                  value={form.tableNumber}
                  onChange={(e) =>
                    setForm({ ...form, tableNumber: e.target.value })
                  }
                />
                <label className="small text-muted mb-1">Seats</label>
                <input
                  className="form-control"
                  type="number"
                  placeholder="Capacity"
                  value={form.seats}
                  onChange={(e) => setForm({ ...form, seats: e.target.value })}
                />
              </div>
              <div className="modal-footer border-0">
                <button
                  className="btn btn-light"
                  onClick={() => setShowAddTableModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger px-4"
                  onClick={() => {
                    addTable();
                    setShowAddTableModal(false);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div
          className="modal fade show d-block bg-dark bg-opacity-50"
          style={{ zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header">
                <h5 className="modal-title">Edit</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                />
              </div>
              <div className="modal-body">
                {floors.map((floor) => (
                  <div
                    key={floor.id}
                    className="card p-3 mb-4 bg-light border-0"
                  >
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <input
                        className="form-control fw-bold"
                        value={floor.name}
                        onChange={(e) =>
                          setFloors((prev) =>
                            prev.map((f) =>
                              f.id === floor.id
                                ? { ...f, name: e.target.value }
                                : f
                            )
                          )
                        }
                      />
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => confirmDeleteFloor(floor.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <div className="row g-2 border-top pt-2 mt-2">
                      <div className="col-6 fw-bold small text-muted">
                        Table Name
                      </div>
                      <div className="col-4 fw-bold small text-muted">
                        Seats
                      </div>
                      <div className="col-2"></div>
                      {floor.tables.map((t) => (
                        <div className="d-flex gap-2 mb-1" key={t.id}>
                          <input
                            className="form-control form-control-sm col"
                            value={t.number}
                            onChange={(e) =>
                              setFloors((p) =>
                                p.map((f) =>
                                  f.id === floor.id
                                    ? {
                                        ...f,
                                        tables: f.tables.map((tb) =>
                                          tb.id === t.id
                                            ? { ...tb, number: e.target.value }
                                            : tb
                                        ),
                                      }
                                    : f
                                )
                              )
                            }
                          />
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            style={{ width: 80 }}
                            value={t.seats}
                            onChange={(e) =>
                              setFloors((p) =>
                                p.map((f) =>
                                  f.id === floor.id
                                    ? {
                                        ...f,
                                        tables: f.tables.map((tb) =>
                                          tb.id === t.id
                                            ? { ...tb, seats: e.target.value }
                                            : tb
                                        ),
                                      }
                                    : f
                                )
                              )
                            }
                          />
                          <button
                            className="btn btn-sm btn-link text-danger"
                            onClick={() => confirmDeleteTable(t.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="modal-footer border-top bg-white">
                <button
                  className="btn btn-danger w-100 py-2"
                  onClick={() => setShowEditModal(false)}
                >
                  Save & Sync Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageTables;
