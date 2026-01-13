  // pages/admin/roles/RoleSelector.jsx

  const RoleSelector = ({ roles, selectedRole, onChange }) => {
    return (
      <select
        className="form-select w-auto"
        value={selectedRole}
        onChange={(e) => onChange(e.target.value)}
      >
        {roles.map((role) => (
          <option key={role.id} value={role.name}>
            {role.name}
          </option>
        ))}
      </select>
    );
  };

  export default RoleSelector;
