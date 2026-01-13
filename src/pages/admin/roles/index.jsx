import React, { useEffect, useState } from "react";
import { AdminAPI } from "../../../api/admin.api";
import { ROLES, PERMISSIONS, DEFAULT_ROLE_PERMISSIONS } from "./permissions.config";



const RolePermissions = () => {
  
const [rolePermissions, setRolePermissions] = useState(
  structuredClone(DEFAULT_ROLE_PERMISSIONS)
);
  useEffect(() => {
    AdminAPI.getRolePermissions().then((data) => {
      if (data) setRolePermissions(data);
    });
  }, []);

  const togglePermission = (role, permissionKey) => {
    setRolePermissions((prev) => {
      const hasPerm = prev[role].includes(permissionKey);

      return {
        ...prev,
        [role]: hasPerm
          ? prev[role].filter((p) => p !== permissionKey)
          : [...prev[role], permissionKey],
      };
    });
  };

  const savePermissions = async () => {
    await AdminAPI.saveRolePermissions(rolePermissions);
    alert("Permissions saved");
  };

  return (
    <>
      <h5 className="text-danger mb-3">Roles & Permissions</h5>

      <div className="table-responsive">
        <table className="table table-bordered text-center align-middle">
          <thead className="table-light">
            <tr>
              <th className="text-start">Access</th>
              {ROLES.map((r) => (
                <th key={r.id}>{r.name}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {PERMISSIONS.map((perm) => (
              <tr key={perm.key}>
                <td className="text-start">{perm.label}</td>
                {ROLES.map((role) => (
                  <td key={role.name}>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={rolePermissions[role.name]?.includes(perm.key)}
                      onChange={() => togglePermission(role.name, perm.key)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-end mt-3">
        <button className="btn btn-danger" onClick={savePermissions}>
          Save Permissions
        </button>
      </div>
    </>
  );
};

export default RolePermissions;
