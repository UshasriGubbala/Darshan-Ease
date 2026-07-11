import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const requestReset = async (e) => {
    e.preventDefault();
    setError(""); setMessage(""); setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage("A reset token was generated. In production this would be emailed to you.");
      if (res.data.resetToken) setToken(res.data.resetToken); // demo convenience
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setError(""); setMessage(""); setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, newPassword });
      setMessage("Password reset successfully. You can now log in.");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="eyebrow">Account recovery</div>
      <h2>Forgot password</h2>
      {error && <div className="form-error">{error}</div>}
      {message && <div className="form-success">{message}</div>}

      {step === 1 && (
        <form onSubmit={requestReset} className="card card-pad">
          <div className="form-group">
            <label>Registered email</label>
            <input type="email" className="form-control" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Sending..." : "Send reset token"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={resetPassword} className="card card-pad">
          <div className="form-group">
            <label>Reset token</label>
            <input className="form-control" required value={token} onChange={(e) => setToken(e.target.value)} />
          </div>
          <div className="form-group">
            <label>New password</label>
            <input type="password" className="form-control" required minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Resetting..." : "Reset password"}
          </button>
        </form>
      )}

      {step === 3 && (
        <Link to="/login" className="btn btn-outline btn-block">Go to login</Link>
      )}
    </div>
  );
}
