import { useState } from "react";
import { useStaffActions } from "./hooks/useStaffActions";
import StaffTable from "./components/StaffTable";
import DeleteModal from "./components/DeleteModal";
import AddStaffModal from "./AddStaffModal";
import EditStaffModal from "./EditStaffModal";

const ManageStaff = () => {
  const { staff, canAddStaff, addStaff, saveEdit, deleteUser, CURRENT_USER } =
    useStaffActions();

  const [addOpen, setAddOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showPassword, setShowPassword] = useState({});

  /* Permission Logic */
  const canEditUser = (target) =>
    CURRENT_USER.role === "Admin"
      ? target.userId === CURRENT_USER.userId
      : target.role !== "Admin";

  const canDeleteUser = (role) =>
    CURRENT_USER.role === "Admin"
      ? role !== "Admin"
      : CURRENT_USER.role === "Manager" && role === "Waiter";

  return (
    <div className="p-1">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Staff Management</h4>
          <p className="text-muted small mb-0">
            Manage roles, access, and system credentials
          </p>
        </div>
        {canAddStaff && (
          <button
            className="btn btn-danger px-4 shadow-sm"
            onClick={() => setAddOpen(true)}
          >
            + Add New Staff
          </button>
        )}
      </div>

      <StaffTable
        staff={staff}
        currentUser={CURRENT_USER}
        showPassword={showPassword}
        onTogglePassword={(id) =>
          setShowPassword((p) => ({ ...p, [id]: !p[id] }))
        }
        onEdit={setEdit}
        onDelete={setUserToDelete}
        canEdit={canEditUser}
        canDelete={canDeleteUser}
      />

      {/* MODALS */}
      {addOpen && (
        <AddStaffModal
          onClose={() => setAddOpen(false)}
          onCreate={(u) => addStaff(u) && setAddOpen(false)}
        />
      )}
      {edit && (
        <EditStaffModal
          staff={edit}
          onClose={() => setEdit(null)}
          onSave={saveEdit}
        />
      )}
      {userToDelete && (
        <DeleteModal
          userName={userToDelete.name}
          onCancel={() => setUserToDelete(null)}
          onConfirm={() => {
            deleteUser(userToDelete.id);
            setUserToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default ManageStaff;
