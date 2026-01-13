import React from "react";

const WaiterCard = ({ waiter, onToggleDuty, onEditAssignment }) => {
  const { name, userId, onDuty, tables } = waiter;

  return (
    <div className="col-md-4">
      <div className="card border-danger h-100 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between">
            <div>
              <h6 className="fw-bold mb-1">{name}</h6>
              <small className="text-muted">ID – {userId}</small>
            </div>

            <div className="text-end">
              <span
                className={`badge ${onDuty ? "bg-success" : "bg-secondary"}`}
              >
                {onDuty ? "On Duty" : "Off Duty"}
              </span>
              <br />
              <button
                className={`btn btn-sm mt-2 ${
                  onDuty ? "btn-outline-secondary" : "btn-outline-success"
                }`}
                onClick={() => onToggleDuty(waiter.id)}
              >
                {onDuty ? "Set Off Duty" : "Set On Duty"}
              </button>
            </div>
          </div>

          <hr />

          <div className="d-flex justify-content-between mb-2">
            <strong className="small text-uppercase text-muted">
              Assigned Tables
            </strong>
            <button
              className="btn btn-sm btn-link text-danger p-0 text-decoration-none fw-bold"
              onClick={() => onEditAssignment(waiter)}
            >
              Edit
            </button>
          </div>

          {!tables || tables.length === 0 ? (
            <p className="text-muted small mb-0">No tables assigned</p>
          ) : (
            <ul className="list-unstyled mb-0 small">
              {tables.map((t) => (
                <li key={t.tableId} className="mb-1">
                  🪑 {t.floorName} – Table {t.number}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(WaiterCard);
