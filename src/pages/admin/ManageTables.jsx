import { useEffect, useRef, useState } from "react";
import { FaPlus, FaTrash, FaClock, FaUser } from "react-icons/fa";
import Swal from "sweetalert2";
import { AdminAPI } from "../../api/admin.api";
import { can } from "../../utils/permissions";
import { getCurrentUser } from "../../utils/auth";

const ManageTables = () => {
  const CURRENT_USER = getCurrentUser();
  const canManageTables = can(CURRENT_USER?.role, "manage_tables");

  const [floors, setFloors] = useState([]);
  const [activeFloorId, setActiveFloorId] = useState("");
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showAddFloorModal, setShowAddFloorModal] = useState(false);
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [newFloorForm, setNewFloorForm] = useState({
    floor_name: "",
    floor_number: "",
    description: "",
  });
  const [newTableForm, setNewTableForm] = useState({
    table_number: "",
    total_seats: "",
  });

  const timerRef = useRef({});

  /* ---------- FETCH DATA ---------- */
  const fetchFloors = async () => {
    try {
      setLoading(true);
      const floorsData = await AdminAPI.getFloors();

      if (!floorsData || floorsData.length === 0) {
        setFloors([]);
        setLoading(false);
        return;
      }

      // Fetch tables for each floor
      const floorsWithTables = await Promise.all(
        floorsData.map(async (floor) => {
          try {
            const tables = await AdminAPI.getTablesByFloor(floor.id);
            return {
              ...floor,
              tables: tables || [],
            };
          } catch (error) {
            console.error(
              `Error fetching tables for floor ${floor.id}:`,
              error
            );
            return {
              ...floor,
              tables: [],
            };
          }
        })
      );

      setFloors(floorsWithTables);
      if (floorsWithTables.length > 0 && !activeFloorId) {
        setActiveFloorId(String(floorsWithTables[0].id));
      }
    } catch (error) {
      console.error("Error fetching floors:", error);
      Swal.fire("Error", "Failed to load floors", "error");
    } finally {
      setLoading(false);
    }
  };

  // const fetchStaff = async () => {
  //   try {
  //     const staffData = await AdminAPI.getStaff();
  //     setStaff(staffData || []);
  //   } catch (error) {
  //     // Staff endpoint might not exist yet - handle gracefully
  //     console.warn("Staff API not available:", error.message);
  //     setStaff([]);
  //   }
  // };

  /* ---------- INITIAL LOAD ---------- */
  useEffect(() => {
    fetchFloors();
    // fetchStaff();
  }, []);

  /* ---------- CLEAN TIMERS ---------- */
  useEffect(() => {
    return () => {
      Object.values(timerRef.current).forEach(clearInterval);
      timerRef.current = {};
    };
  }, []);

  const activeFloor = floors.find(
    (f) => String(f.id) === String(activeFloorId)
  );

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const getAssignedWaiter = (floorId, tableId) => {
    if (!staff || staff.length === 0) return "Not Assigned";

    const waiter = staff.find(
      (w) =>
        w.role === "Waiter" &&
        w.onDuty &&
        (w.tables || []).some(
          (t) =>
            String(t.tableId) === String(tableId) &&
            String(t.floorId) === String(floorId)
        )
    );
    return waiter ? waiter.name : "Not Assigned";
  };

  /* ---------- ADD FLOOR ---------- */
  const addFloor = async () => {
    if (!newFloorForm.floor_name.trim()) {
      Swal.fire("Error", "Floor name is required", "error");
      return;
    }

    try {
      await AdminAPI.createFloor(newFloorForm);
      Swal.fire("Success", "Floor added successfully", "success");
      setNewFloorForm({ floor_name: "", floor_number: "", description: "" });
      setShowAddFloorModal(false);
      fetchFloors();
    } catch (error) {
      console.error("Error adding floor:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to add floor",
        "error"
      );
    }
  };

  /* ---------- ADD TABLE ---------- */
  const addTable = async () => {
    if (!newTableForm.table_number || !newTableForm.total_seats) {
      Swal.fire("Error", "All fields are required", "error");
      return;
    }

    if (!activeFloorId) {
      Swal.fire("Error", "Please select a floor first", "error");
      return;
    }

    try {
      await AdminAPI.createTable({
        floor_id: parseInt(activeFloorId),
        table_number: newTableForm.table_number,
        total_seats: parseInt(newTableForm.total_seats),
      });
      Swal.fire("Success", "Table added successfully", "success");
      setNewTableForm({ table_number: "", total_seats: "" });
      setShowAddTableModal(false);
      fetchFloors();
    } catch (error) {
      console.error("Error adding table:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to add table",
        "error"
      );
    }
  };

  /* ---------- UPDATE FLOOR ---------- */
  const updateFloor = async (floorId, updatedData) => {
    try {
      await AdminAPI.updateFloor(floorId, updatedData);
      fetchFloors();
    } catch (error) {
      console.error("Error updating floor:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to update floor",
        "error"
      );
    }
  };

  /* ---------- UPDATE TABLE ---------- */
  const updateTable = async (tableId, updatedData) => {
    try {
      await AdminAPI.updateTable(tableId, updatedData);
      fetchFloors();
    } catch (error) {
      console.error("Error updating table:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to update table",
        "error"
      );
    }
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
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        await AdminAPI.deleteTable(tableId);
        Swal.fire("Deleted", "Table has been deleted", "success");
        fetchFloors();
      } catch (error) {
        console.error("Error deleting table:", error);
        Swal.fire(
          "Error",
          error.response?.data?.message || "Failed to delete table",
          "error"
        );
      }
    });
  };

  /* ---------- TOGGLE TABLE STATUS ---------- */
  const toggleTableStatus = async (table) => {
    const newStatus = table.status === 1 ? 0 : 1;

    try {
      await AdminAPI.updateTable(table.id, {
        floor_id: table.floor_id,
        table_number: table.table_number,
        total_seats: table.total_seats,
        status: newStatus,
      });

      // ✅ UPDATE UI LOCALLY (NO REFETCH)
      setFloors((prev) =>
        prev.map((floor) =>
          floor.id === table.floor_id
            ? {
                ...floor,
                tables: floor.tables.map((t) =>
                  t.id === table.id ? { ...t, status: newStatus } : t
                ),
              }
            : floor
        )
      );
    } catch (error) {
      console.error("Error toggling table status:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to update table status",
        "error"
      );
    }
  };

  /* ---------- DELETE FLOOR ---------- */
  const confirmDeleteFloor = (floorId) => {
    const floor = floors.find((f) => f.id === floorId);
    if (floor && floor.tables && floor.tables.length > 0) {
      Swal.fire({
        title: "Cannot Delete Floor",
        text: "Please delete all tables in this floor first.",
        icon: "warning",
        confirmButtonColor: "#dc3545",
      });
      return;
    }

    Swal.fire({
      title: "Delete Floor?",
      text: "This floor will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        await AdminAPI.deleteFloor(floorId);
        Swal.fire("Deleted", "Floor has been deleted", "success");
        fetchFloors();
      } catch (error) {
        console.error("Error deleting floor:", error);
        Swal.fire(
          "Error",
          error.response?.data?.message || "Failed to delete floor",
          "error"
        );
      }
    });
  };

  /* ---------- SAVE EDIT CHANGES ---------- */
  const saveEditChanges = async () => {
    try {
      setLoading(true);

      const updatePromises = [];

      // Update all floors and tables
      for (const floor of floors) {
        updatePromises.push(
          AdminAPI.updateFloor(floor.id, {
            floor_name: floor.floor_name,
            floor_number: floor.floor_number,
            description: floor.description,
            status: floor.status,
          })
        );

        for (const table of floor.tables) {
          updatePromises.push(
            AdminAPI.updateTable(table.id, {
              floor_id: table.floor_id,
              table_number: table.table_number,
              total_seats: parseInt(table.total_seats),
              status: table.status,
            })
          );
        }
      }

      await Promise.all(updatePromises);

      Swal.fire("Success", "All changes saved successfully", "success");
      setShowEditModal(false);
      fetchFloors();
    } catch (error) {
      console.error("Error saving changes:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to save changes",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (floors.length === 0) {
    return (
      <div className="text-center py-5">
        <h5 className="text-muted mb-4">No floors found</h5>
        {canManageTables && (
          <button
            className="btn btn-danger"
            onClick={() => setShowAddFloorModal(true)}
          >
            <FaPlus className="me-2" />
            Add First Floor
          </button>
        )}

        {/* ADD FLOOR MODAL */}
        {showAddFloorModal && (
          <div
            className="modal fade show d-block bg-dark bg-opacity-50"
            style={{ zIndex: 1060 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content shadow-lg border-0">
                <div className="modal-header">
                  <h5 className="modal-title">Add Floor</h5>
                  <button
                    className="btn-close"
                    onClick={() => setShowAddFloorModal(false)}
                  />
                </div>
                <div className="modal-body">
                  <label className="small text-muted mb-1">Floor Name *</label>
                  <input
                    className="form-control mb-3"
                    placeholder="e.g. Ground Floor, First Floor"
                    value={newFloorForm.floor_name}
                    onChange={(e) =>
                      setNewFloorForm({
                        ...newFloorForm,
                        floor_name: e.target.value,
                      })
                    }
                  />
                  <label className="small text-muted mb-1">Floor Number</label>
                  <input
                    className="form-control mb-3"
                    type="number"
                    placeholder="e.g. 0, 1, 2"
                    value={newFloorForm.floor_number}
                    onChange={(e) =>
                      setNewFloorForm({
                        ...newFloorForm,
                        floor_number: e.target.value,
                      })
                    }
                  />
                  <label className="small text-muted mb-1">Description</label>
                  <textarea
                    className="form-control"
                    placeholder="Optional description"
                    value={newFloorForm.description}
                    onChange={(e) =>
                      setNewFloorForm({
                        ...newFloorForm,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
                <div className="modal-footer border-0">
                  <button
                    className="btn btn-light"
                    onClick={() => setShowAddFloorModal(false)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-danger px-4" onClick={addFloor}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="d-flex flex-column flex-sm-row gap-2 justify-content-between align-items-start align-items-sm-center mb-3">
        <h4 className="text-danger fw-bold">
          {activeFloor?.floor_name || "No Floor"}
        </h4>
        <select
          className="form-select shadow-sm"
          style={{ width: 180 }}
          value={activeFloorId}
          onChange={(e) => setActiveFloorId(e.target.value)}
        >
          {floors.map((f) => (
            <option key={f.id} value={f.id}>
              {f.floor_name}
            </option>
          ))}
        </select>
      </div>

      {activeFloor?.tables && activeFloor.tables.length === 0 ? (
        <div className="text-center py-5">
          <h5 className="text-muted mb-4">No tables in this floor</h5>
          {canManageTables && (
            <button
              className="btn btn-danger"
              onClick={() => setShowAddTableModal(true)}
            >
              <FaPlus className="me-2" />
              Add First Table
            </button>
          )}
        </div>
      ) : (
        <div className="row g-3">
          {activeFloor?.tables.map((t) => (
            <div className="col-12 col-sm-6 col-lg-4" key={t.id}>
              <div
                className={`card shadow-sm ${
                  t.status === 1 ? "border-danger" : "border-secondary"
                }`}
                style={t.status !== 1 ? { borderStyle: "dashed" } : {}}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0 fw-bold">
                      {t.table_number} –{" "}
                      {getAssignedWaiter(activeFloor.id, t.id)}
                    </h6>
                    <span className="badge bg-danger-subtle text-danger">
                      <FaUser /> {t.total_seats} Seats
                    </span>
                  </div>

                  <div className="d-flex justify-content-between mt-4 text-muted small">
                    <span>{t.query || "No active request"}</span>
                    <span>
                      <FaClock className="me-1" /> {formatTime(t.timer || 0)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                className={`btn w-100 mt-2 shadow-sm ${
                  t.status === 1 ? "btn-outline-danger" : "btn-outline-success"
                }`}
                onClick={() => toggleTableStatus(t)}
              >
                {t.status === 1 ? "Close Tab" : "Reopen Tab"}
              </button>
            </div>
          ))}
        </div>
      )}
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
                ➕ Add Floor
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

      {/* ADD FLOOR MODAL */}
      {showAddFloorModal && (
        <div
          className="modal fade show d-block bg-dark bg-opacity-50"
          style={{ zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header">
                <h5 className="modal-title">Add Floor</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowAddFloorModal(false)}
                />
              </div>
              <div className="modal-body">
                <label className="small text-muted mb-1">Floor Name *</label>
                <input
                  className="form-control mb-3"
                  placeholder="e.g. Ground Floor, First Floor"
                  value={newFloorForm.floor_name}
                  onChange={(e) =>
                    setNewFloorForm({
                      ...newFloorForm,
                      floor_name: e.target.value,
                    })
                  }
                />
                <label className="small text-muted mb-1">Floor Number</label>
                <input
                  className="form-control mb-3"
                  type="number"
                  placeholder="e.g. 0, 1, 2"
                  value={newFloorForm.floor_number}
                  onChange={(e) =>
                    setNewFloorForm({
                      ...newFloorForm,
                      floor_number: e.target.value,
                    })
                  }
                />
                <label className="small text-muted mb-1">Description</label>
                <textarea
                  className="form-control"
                  placeholder="Optional description"
                  value={newFloorForm.description}
                  onChange={(e) =>
                    setNewFloorForm({
                      ...newFloorForm,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
              <div className="modal-footer border-0">
                <button
                  className="btn btn-light"
                  onClick={() => setShowAddFloorModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger px-4" onClick={addFloor}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD TABLE MODAL */}
      {showAddTableModal && (
        <div
          className="modal fade show d-block bg-dark bg-opacity-50"
          style={{ zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header">
                <h5 className="modal-title">
                  Add Table to {activeFloor?.floor_name}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setShowAddTableModal(false)}
                />
              </div>
              <div className="modal-body">
                <label className="small text-muted mb-1">Table Number *</label>
                <input
                  className="form-control mb-3"
                  placeholder="e.g. T1, T-01"
                  value={newTableForm.table_number}
                  onChange={(e) =>
                    setNewTableForm({
                      ...newTableForm,
                      table_number: e.target.value,
                    })
                  }
                />
                <label className="small text-muted mb-1">Total Seats *</label>
                <input
                  className="form-control"
                  type="number"
                  placeholder="e.g. 4, 6"
                  value={newTableForm.total_seats}
                  onChange={(e) =>
                    setNewTableForm({
                      ...newTableForm,
                      total_seats: e.target.value,
                    })
                  }
                />
              </div>
              <div className="modal-footer border-0">
                <button
                  className="btn btn-light"
                  onClick={() => setShowAddTableModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger px-4" onClick={addTable}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div
          className="modal fade show d-block bg-dark bg-opacity-50"
          style={{ zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header">
                <h5 className="modal-title">Edit Floors & Tables</h5>
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
                        value={floor.floor_name}
                        onChange={(e) =>
                          setFloors((prev) =>
                            prev.map((f) =>
                              f.id === floor.id
                                ? { ...f, floor_name: e.target.value }
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
                    {floor.tables && floor.tables.length > 0 && (
                      <div className="row g-2 border-top pt-2 mt-2">
                        <div className="col-6 fw-bold small text-muted">
                          Table Number
                        </div>
                        <div className="col-4 fw-bold small text-muted">
                          Seats
                        </div>
                        <div className="col-2"></div>
                        {floor.tables.map((t) => (
                          <div className="d-flex gap-2 mb-1" key={t.id}>
                            <input
                              className="form-control form-control-sm col"
                              value={t.table_number}
                              onChange={(e) =>
                                setFloors((p) =>
                                  p.map((f) =>
                                    f.id === floor.id
                                      ? {
                                          ...f,
                                          tables: f.tables.map((tb) =>
                                            tb.id === t.id
                                              ? {
                                                  ...tb,
                                                  table_number: e.target.value,
                                                }
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
                              value={t.total_seats}
                              onChange={(e) =>
                                setFloors((p) =>
                                  p.map((f) =>
                                    f.id === floor.id
                                      ? {
                                          ...f,
                                          tables: f.tables.map((tb) =>
                                            tb.id === t.id
                                              ? {
                                                  ...tb,
                                                  total_seats: e.target.value,
                                                }
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
                    )}
                  </div>
                ))}
              </div>
              <div className="modal-footer border-top bg-white">
                <button
                  className="btn btn-danger w-100 py-2"
                  onClick={saveEditChanges}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save & Sync Changes"}
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
