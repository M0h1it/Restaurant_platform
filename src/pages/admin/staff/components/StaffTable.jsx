import { FaEye, FaEyeSlash } from "react-icons/fa";

const StaffTable = ({
  staff,
  currentUser,
  showPassword,
  onTogglePassword,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}) => {
  return (
    <div className="table-responsive bg-white rounded-3 shadow-sm">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Password</th>
            <th>Role</th>
            <th className="text-end">Action</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((s) => (
            <tr key={s.id}>
              <td className="fw-bold text-muted">{s.userId}</td>
              <td>{s.name}</td>
              <td>{s.username}</td>
              <td>
                {s.role === "Admin" ? (
                  <span className="badge bg-light text-dark">Hidden</span>
                ) : (
                  <div className="d-flex align-items-center gap-2">
                    <span className="font-monospace">
                      {showPassword[s.id] ? s.password : "••••••"}
                    </span>
                    <button
                      className="btn btn-sm text-muted"
                      onClick={() => onTogglePassword(s.id)}
                    >
                      {showPassword[s.id] ? (
                        <FaEyeSlash size={14} />
                      ) : (
                        <FaEye size={14} />
                      )}
                    </button>
                  </div>
                )}
              </td>
              <td>
                <span
                  className={`badge ${
                    s.role === "Admin" ? "bg-danger" : "bg-secondary"
                  }`}
                >
                  {s.role}
                </span>
              </td>
              <td className="text-end">
                <div className="d-flex justify-content-end gap-2">
                  {canEdit(s) && (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onEdit(s)}
                    >
                      Edit
                    </button>
                  )}
                  {canDelete(s.role) && s.userId !== currentUser.userId && (
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => onDelete(s)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffTable;
