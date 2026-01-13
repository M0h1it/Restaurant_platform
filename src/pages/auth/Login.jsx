import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AUTH_USER_KEY } from "../../constants/authKeys";
import { AdminAPI } from "../../api/admin.api";
import { ROLE_CONFIG } from "../../config/roles.config";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    let staff = await AdminAPI.getStaff();

    // DEV MODE: ensure admin exists
    if (staff.length === 0) {
      staff = [
        {
          id: Date.now(),
          userId: "U001",
          name: "Admin",
          username: "admin",
          password: "admin123",
          role: "Admin",
          isActive: true,
        },
        {
          id: Date.now() + 1,
          userId: "U002",
          name: "Waiter",
          username: "waiter@123",
          password: "1234",
          role: "Waiter",
          isActive: true,
        },
      ];
      await AdminAPI.saveStaff(staff);
    }

    const user = staff.find(
      (u) =>
        u.username === username.trim() &&
        u.password === password.trim() &&
        u.isActive !== false
    );

    if (!user) {
      alert("Invalid username or password");
      return;
    }

    // 🔐 SAVE AUTH (SINGLE SOURCE)
    localStorage.setItem(
      AUTH_USER_KEY,
      JSON.stringify({
        userId: user.userId,
        name: user.name,
        role: user.role,
      })
    );

    // 🔀 ROLE-BASED REDIRECT
    
    
  const roleConfig = ROLE_CONFIG[user.role];
    if (!roleConfig) {
  alert("Role not configured");
  return;
}
navigate(roleConfig.defaultRoute);

  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h4 className="text-center mb-3">Staff Login</h4>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-danger w-100">Login</button>
        </form>

        <div className="mt-3 text-muted small">
          <strong>Test Logins:</strong>
          <div>Admin → admin / admin123</div>
          <div>Waiter → waiter@123 / 1234</div>
        </div>
      </div>
    </div>
  );
};

export default Login;
