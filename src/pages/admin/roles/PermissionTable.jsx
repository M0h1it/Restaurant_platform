// pages/admin/roles/PermissionTable.jsx

const PermissionTable = ({ permissions, activePermissions, onToggle }) => {
  return (
    <table className="table table-bordered mt-3">
      <thead className="table-light">
        <tr>
          <th>Permission</th>
          <th className="text-center">Allowed</th>
        </tr>
      </thead>

      <tbody>
        {permissions.map((p) => (
          <tr key={p.key}>
            <td>{p.label}</td>
            <td className="text-center">
              <input
                type="checkbox"
                checked={activePermissions.includes(p.key)}
                onChange={() => onToggle(p.key)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PermissionTable;
