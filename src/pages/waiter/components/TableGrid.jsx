import { useEffect, useState } from "react";
import { WaiterAPI } from "../../../api/waiter.api";

export default function TableGrid() {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    WaiterAPI.getMyTables().then(setTables);
  }, []);

  if (!tables.length) {
    return (
      <div className="text-center mt-5 text-secondary fw-bold">
        No tables assigned
      </div>
    );
  }

  return (
    <div className="row g-3">
      {tables.map((t) => (
        <div key={t.id} className="col-6">
          <div className="card shadow-sm p-3">
            <div className="fw-bold">Table {t.table_number}</div>
            <small className="text-muted">
              {t.floor_name}
            </small>
          </div>
        </div>
      ))}
    </div>
  );
}
