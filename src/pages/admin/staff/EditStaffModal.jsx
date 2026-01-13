import { useState } from "react";

const EditStaffModal = ({ staff, onClose, onSave }) => {
  const [form, setForm] = useState(staff);

  return (
    <div className="modal d-block bg-dark bg-opacity-50">
      <div className="modal-dialog">
        <div className="modal-content p-3">
          <div className="d-flex justify-content-between mb-3">
            <h6>Edit Staff</h6>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          <input
            className="form-control mb-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="password"
            className="form-control mb-2"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <input className="form-control mb-2" value={form.username} readOnly />

          <select
            className="form-select mb-3"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option>Admin</option>
            <option>Manager</option>
            <option>Waiter</option>
          </select>

          <button
            className="btn btn-danger w-100"
            onClick={() => {
              onSave(form);
              onClose();
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStaffModal;
