import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "", role: "user" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = form.role === "admin" ? "/auth/admin-login" : "/auth/login";
      const res = await api.post(endpoint, {
        email: form.email,
        password: form.password,
      });
      login(res.data.token, res.data.user);
      if (res.data.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate(location.state?.from || "/temples");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="eyebrow">Welcome back</div>
      <h2>Log in</h2>
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={handleSubmit} className="card card-pad">
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Sign in as</label>
          <select
            className="form-control"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button className="btn btn-primary btn-block" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </button>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontSize: "0.85rem" }}>
          <Link to="/forgot-password">Forgot password?</Link>
          <Link to="/register">Create account</Link>
        </div>
      </form>
    </div>
  );
}
