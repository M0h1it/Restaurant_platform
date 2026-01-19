import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} from "../../../services/roles.service";

import {
  getPermissions,
  createPermission,
  updatePermission,
  deletePermission,
  getPermissionsByRole,
  assignPermissionsToRole,
  removePermissionFromRole,
} from "../../../services/permissions.services";

const RolesAndPermissions = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      try {
        const [rolesData, permsData] = await Promise.all([
          getRoles(),
          getPermissions(),
        ]);

        setRoles(rolesData || []);
        setPermissions(permsData || []);
        if (rolesData?.length) setSelectedRole(rolesData[0]);
      } catch {
        Swal.fire("Error", "Failed to load data", "error");
      } finally {
        setLoading(false);
      }
    };

    loadInitial();
  }, []);

  /* ================= LOAD ROLE PERMISSIONS ================= */
  useEffect(() => {
    if (!selectedRole?.id) {
      setRolePermissions([]);
      return;
    }

    getPermissionsByRole(selectedRole.id)
      .then((data) => setRolePermissions(data.map((p) => p.id)))
      .catch(() => setRolePermissions([]));
  }, [selectedRole]);

  /* ================= ROLE CRUD ================= */
  const handleAddRole = async () => {
    const { value } = await Swal.fire({
      title: "Add Role",
      html: `
        <input id="name" class="swal2-input" placeholder="Role name">
        <input id="desc" class="swal2-input" placeholder="Description">
      `,
      showCancelButton: true,
      preConfirm: () => {
        const role_name = document.getElementById("name").value;
        if (!role_name)
          return Swal.showValidationMessage("Role name is required");
        return {
          role_name,
          description: document.getElementById("desc").value,
        };
      },
    });

    if (!value) return;

    await createRole(value);
    setRoles(await getRoles());
  };

  const handleEditRole = async (r) => {
    const { value } = await Swal.fire({
      title: "Edit Role",
      html: `
        <input id="name" class="swal2-input" value="${r.role_name}">
        <input id="desc" class="swal2-input" value="${r.description || ""}">
      `,
      showCancelButton: true,
      preConfirm: () => {
        const role_name = document.getElementById("name").value;
        if (!role_name) return Swal.showValidationMessage("Role name required");
        return {
          role_name,
          description: document.getElementById("desc").value,
        };
      },
    });

    if (!value) return;

    await updateRole(r.id, value);
    setRoles(await getRoles());
    if (selectedRole?.id === r.id) setSelectedRole({ ...r, ...value });
  };

  const handleDeleteRole = async (r) => {
    const confirm = await Swal.fire({
      title: `Delete "${r.role_name}"?`,
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    await deleteRole(r.id);
    const updated = await getRoles();
    setRoles(updated);
    setSelectedRole(updated[0] || null);
  };

  /* ================= PERMISSION CRUD ================= */
  const handleCreatePermission = async () => {
    const { value } = await Swal.fire({
      title: "Create Permission",
      html: `
        <input id="name" class="swal2-input" placeholder="permission_name">
        <input id="desc" class="swal2-input" placeholder="Description">
      `,
      showCancelButton: true,
      preConfirm: () => {
        const permission_name = document.getElementById("name").value;
        if (!permission_name)
          return Swal.showValidationMessage("Permission name required");
        return {
          permission_name,
          description: document.getElementById("desc").value,
        };
      },
    });

    if (!value) return;

    await createPermission(value);
    setPermissions(await getPermissions());
  };

  const handleEditPermission = async (p) => {
    const { value } = await Swal.fire({
      title: "Edit Permission",
      html: `
        <input id="name" class="swal2-input" value="${p.permission_name}">
        <input id="desc" class="swal2-input" value="${p.description || ""}">
      `,
      showCancelButton: true,
      preConfirm: () => ({
        permission_name: document.getElementById("name").value,
        description: document.getElementById("desc").value,
      }),
    });

    if (!value) return;

    await updatePermission(p.id, value);
    setPermissions(await getPermissions());
  };
  
  const filteredPermissions = permissions.filter((p) =>
  p.permission_name.toLowerCase().includes(search.toLowerCase())
);

  const handleDeletePermission = async (p) => {
    const confirm = await Swal.fire({
      title: `Delete "${p.permission_name}"?`,
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    await deletePermission(p.id);
    setPermissions((prev) => prev.filter((x) => x.id !== p.id));
    setRolePermissions((prev) => prev.filter((id) => id !== p.id));
  };
  /* ================= ASSIGN / REMOVE ================= */
const togglePermission = async (permissionId) => {
  if (!selectedRole) return;

  try {
    let updatedPermissions;

    if (rolePermissions.includes(permissionId)) {
      // REMOVE permission
      updatedPermissions = rolePermissions.filter(
        (id) => id !== permissionId
      );
    } else {
      // ADD permission
      updatedPermissions = [...rolePermissions, permissionId];
    }

    // 🔥 SEND FULL ARRAY (NOT single permission)
    await assignPermissionsToRole(selectedRole.id, updatedPermissions);

    // Update UI state
    setRolePermissions(updatedPermissions);
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Failed to update permissions", "error");
  }
};


  /* ================= UI ================= */
  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <div className="row g-4">
        {/* LEFT: ROLES */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header d-flex justify-content-between">
              <h6 className="fw-bold">Roles</h6>
              <button className="btn btn-sm btn-danger" onClick={handleAddRole}>
                + Add
              </button>
            </div>
            <div className="card-body">
              {loading
                ? "Loading..."
                : roles.map((r) => (
                    <div
                      key={r.id}
                      className={`p-3 rounded mb-2 d-flex justify-content-between align-items-center ${
                        selectedRole?.id === r.id
                          ? "bg-danger text-white"
                          : "bg-light"
                      }`}
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedRole(r)}
                    >
                      {/* ROLE INFO */}
                      <div>
                        <div className="fw-bold">{r.role_name}</div>
                        <small
                          className={
                            selectedRole?.id === r.id
                              ? "text-white-50"
                              : "text-muted"
                          }
                        >
                          {r.description || "—"}
                        </small>
                      </div>

                      {/* ACTIONS */}
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-light"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditRole(r);
                          }}
                        >
                          ✏
                        </button>

                        <button
                          className="btn btn-sm btn-light text-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRole(r);
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>

        {/* RIGHT: PERMISSIONS */}
        <div className="col-lg-8">
          <div className="card shadow-sm p-4">
            <div className="d-flex justify-content-between mb-3">
              <h5>
                Permissions for{" "}
                <span className="text-danger">{selectedRole?.role_name}</span>
              </h5>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={handleCreatePermission}
              >
                + New Permission
              </button>
            </div>

            {/* SEARCH BAR */}
<div className="mb-3">
  <input
    type="text"
    className="form-control"
    placeholder="Search permission..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>

<div className="row">
  {filteredPermissions.map((p) => (
    <div key={p.id} className="col-md-6 mb-3">
      <div className="border rounded p-3 d-flex justify-content-between align-items-start">
        {/* INFO */}
        <div>
          <code className="fw-bold">{p.permission_name}</code>
          <div className="small text-muted">
            {p.description || "—"}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="d-flex flex-column align-items-end gap-2">
          {/* ASSIGN */}
          <input
            type="checkbox"
            checked={rolePermissions.includes(p.id)}
            onChange={() => togglePermission(p.id)}
          />

          {/* EDIT / DELETE */}
          <div className="d-flex gap-1">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => handleEditPermission(p)}
            >
              ✏
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => handleDeletePermission(p)}
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  ))}

  {filteredPermissions.length === 0 && (
    <div className="col-12 text-center text-muted py-4">
      No permissions found
    </div>
  )}
</div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default RolesAndPermissions;
