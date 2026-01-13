import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AddStaffModal from "./src/pages/admin/staff/AddStaffModal";
import EditStaffModal from "./src/pages/admin/staff/EditStaffModal";
import { STAFF_KEY } from "./src/constants/storageKeys";
import { load, save } from "./src/utils/storage";
import { hasPermission } from "./src/utils/permissions";
import { getCurrentUser } from "./src/utils/auth";

const ManageStaff = () => {
  /* ================= STATE ================= */
  const CURRENT_USER = getCurrentUser();
  const [staff, setStaff] = useState(() => load(STAFF_KEY, []));
  const canAddStaff = hasPermission(CURRENT_USER?.role, "manage_staff");
  const [addOpen, setAddOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [showPassword, setShowPassword] = useState({});
  const [userToDelete, setUserToDelete] = useState(null);

  /* ================= EFFECT ================= */

  useEffect(() => {
    save(STAFF_KEY, staff);
  }, [staff]);

  /* ================= HELPERS ================= */

  const generateUserId = () => {
    if (staff.length === 0) return "U001";

    const maxId = staff.reduce((max, s) => {
      const num = Number(s.userId?.replace("U", "") || 0);
      return num > max ? num : max;
    }, 0);

    return `U${String(maxId + 1).padStart(3, "0")}`;
  };

  const canEditUser = (targetUser) => {
    // Admin can edit only self
    if (CURRENT_USER.role === "Admin") {
      return targetUser.userId === CURRENT_USER.userId;
    }

    // Manager & Waiter cannot edit Admin
    if (targetUser.role === "Admin") return false;

    return true;
  };

  const canDeleteUser = (targetRole) => {
    if (CURRENT_USER.role === "Admin") {
      return targetRole !== "Admin";
    }

    if (CURRENT_USER.role === "Manager") {
      return targetRole === "Waiter";
    }

    return false;
  };

  /* ================= ADD STAFF ================= */

  const addStaff = (user) => {
    const exists = staff.some(
      (s) => s.username.toLowerCase() === user.username.toLowerCase()
    );

    if (exists) {
      alert("Username already exists");
      return;
    }

    setStaff((prev) => [
      ...prev,
      {
        id: Date.now(),
        userId: generateUserId(),
        ...user,
        isActive: true,
        onDuty: false,
      },
    ]);
  };

  /* ================= EDIT STAFF ================= */

  const saveEdit = (updated) => {
    if (!canEditUser(updated)) {
      alert("You are not allowed to edit this user");
      return;
    }

    const exists = staff.some(
      (s) =>
        s.id !== updated.id &&
        s.username.toLowerCase() === updated.username.toLowerCase()
    );

    if (exists) {
      alert("Username already exists");
      return;
    }

    setStaff((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setEdit(null);
  };

  /* ================= DELETE STAFF ================= */

  const deleteUser = () => {
    if (!canDeleteUser(userToDelete.role)) {
      alert("You are not allowed to delete this user");
      setUserToDelete(null);
      return;
    }

    setStaff((prev) => prev.filter((s) => s.id !== userToDelete.id));

    setUserToDelete(null);
  };

  /* ================= RENDER ================= */

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <h5>Manage Staff</h5>
        {canAddStaff && (
          <button className="btn btn-danger" onClick={() => setAddOpen(true)}>
            + Add User
          </button>
        )}
      </div>

      <table className="table table-bordered align-middle">
        <thead className="table-light">
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Password</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {staff.map((s) => (
            <tr key={s.id}>
              <td>{s.userId}</td>
              <td>{s.name}</td>
              <td>{s.username}</td>

              <td>
                {s.role === "Admin" ? (
                  <span className="text-muted">Hidden</span>
                ) : (
                  <div className="d-flex align-items-center gap-2">
                    <span>{showPassword[s.id] ? s.password : "••••••"}</span>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() =>
                        setShowPassword((p) => ({
                          ...p,
                          [s.id]: !p[s.id],
                        }))
                      }
                    >
                      {showPassword[s.id] ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                )}
              </td>

              <td>{s.role}</td>

              <td>
                <div className="d-flex gap-2">
                  {canEditUser(s) && (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => setEdit(s)}
                    >
                      Edit
                    </button>
                  )}

                  {canDeleteUser(s.role) &&
                    s.userId !== CURRENT_USER.userId && (
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => setUserToDelete(s)}
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

      {/* ADD MODAL */}
      {addOpen && (
        <AddStaffModal onClose={() => setAddOpen(false)} onCreate={addStaff} />
      )}

      {/* EDIT MODAL */}
      {edit && (
        <EditStaffModal
          staff={edit}
          onClose={() => setEdit(null)}
          onSave={saveEdit}
        />
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {userToDelete && (
        <div className="modal fade show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body text-center">
                <p>
                  Are you sure you want to delete user
                  <strong> {userToDelete.name}</strong>?
                </p>
                <div className="d-flex justify-content-center gap-3 mt-3">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setUserToDelete(null)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-danger" onClick={deleteUser}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageStaff;
