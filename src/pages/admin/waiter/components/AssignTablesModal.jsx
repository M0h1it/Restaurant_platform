import { useState } from "react";

const AssignTablesModal = ({ waiter, floors, staff, setStaff, onClose }) => {
  /* ---------- Map assigned tables (other waiters) ---------- */
  const assignedTableMap = {};
  staff.forEach((s) => {
    if (s.role === "Waiter" && s.id !== waiter.id) {
      (s.tables || []).forEach((t) => {
        assignedTableMap[t.tableId] = s.name;
      });
    }
  });

  /* ---------- State ---------- */
  const [selectedTables, setSelectedTables] = useState(waiter.tables || []);

  /* ---------- Detect initial floor ---------- */
  const getInitialFloor = () => {
    if (!waiter.tables || waiter.tables.length === 0) return null;
    return waiter.tables[0].floorId;
  };

  const [lockedFloorId, setLockedFloorId] = useState(getInitialFloor());

  /* ---------- Toggle Table ---------- */
  const toggleTable = (floor, table) => {
    if (lockedFloorId && lockedFloorId !== floor.id) {
      alert("A waiter can work on only one floor.");
      return;
    }

    setSelectedTables((prev) => {
      const exists = prev.some((t) => t.tableId === table.id);

      let updated;
      if (exists) {
        updated = prev.filter((t) => t.tableId !== table.id);
      } else {
        updated = [
          ...prev,
          {
            floorId: floor.id,
            floorName: floor.name,
            tableId: table.id,
            number: table.number,
          },
        ];
      }

      setLockedFloorId(updated.length ? floor.id : null);
      return updated;
    });
  };

  /* ---------- Save ---------- */
  const saveAssignments = () => {
  const updated = staff.map((s) => {
    if (s.role !== "Waiter") return s;

    if (s.id === waiter.id) {
      return { ...s, tables: selectedTables };
    }

    return {
      ...s,
      tables: (s.tables || []).filter(
        (t) => !selectedTables.some((st) => st.tableId === t.tableId)
      ),
    };
  });

  setStaff(updated);
  AdminAPI.saveStaff(updated); // ✅ REQUIRED
  onClose();
};


  /* ---------- UI ---------- */
  return (
    <div className="modal fade show d-block bg-dark bg-opacity-50">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h6>Assign Tables – {waiter.name}</h6>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            {floors.map((f) => (
              <div key={f.id} className="mb-3">
                <strong>{f.name}</strong>

                <div className="row mt-2">
                  {f.tables.map((t) => {
                    const assignedToOther = assignedTableMap[t.id];
                    const checked = selectedTables.some(
                      (st) => st.tableId === t.id
                    );

                    return (
                      <div className="col-md-3" key={t.id}>
                        <label
                          className={`form-check ${
                            assignedToOther ? "text-muted" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={checked || !!assignedToOther}
                            disabled={assignedToOther || !t.is_active}
                            onChange={() => toggleTable(f, t)}
                          />
                          <span className="ms-2">
                            Table {t.number}
                            {!t.is_active && (
                              <small className="text-danger"> (Closed)</small>
                            )}
                            {assignedToOther && (
                              <small className="text-muted">
                                {" "}
                                – Assigned to {assignedToOther}
                              </small>
                            )}
                          </span>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={saveAssignments}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignTablesModal;
