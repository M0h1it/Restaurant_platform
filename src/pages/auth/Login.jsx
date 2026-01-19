import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../utils/auth";
import { can } from "../../utils/permissions";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const authUser = await login(email, password); // 👈 capture return

    const permissions = authUser.permissions || [];

    if (permissions.includes("view_dashboard_admin")) {
      navigate("/dashboard", { replace: true });
      return;
    }

    if (permissions.includes("view_dashboard_waiter")) {
      navigate("/dashboard", { replace: true });
      return;
    }

    alert("You are not authorized to access any dashboard");
  } catch (err) {
    alert("Invalid credentials or unauthorized");
  }
};


  return (
    <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card p-4 shadow" style={{ width: 350 }}>
        <h4 className="text-center mb-3">Staff Login</h4>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label>Email</label>
            <input
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
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
      </div>
    </div>
  );
};

export default Login;
