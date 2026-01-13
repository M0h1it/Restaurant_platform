  import { useState } from "react";

  const AddStaffModal = ({ onClose, onCreate }) => {
    const [form, setForm] = useState({
      name: "",
      username: "",
      password: "",
      role: "",
    });

    const submit = () => {
      if (!form.name || !form.username || !form.password || !form.role) {
        alert("All fields required");
        return;
      }
      onCreate(form);
      onClose();
    };

    return (
      <div className="modal d-block bg-dark bg-opacity-50">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-3">
            <div className="d-flex justify-content-between mb-3">
              <h6>Add Users</h6>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>
            <input
              className="form-control mb-2"
              placeholder="Name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              className="form-control mb-2"
              placeholder="Username"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />

            <input
              type="password"
              className="form-control mb-2"
              placeholder="Password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <select
              className="form-select mb-3"
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="">Select Role</option>
              <option>Admin</option>
              <option>Manager</option>
              <option>Waiter</option>
            </select>

            <button
              className="btn btn-danger w-100"
              onClick={() => {
                submit();
                onClose();
              }}
            >
              Add User
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default AddStaffModal;
