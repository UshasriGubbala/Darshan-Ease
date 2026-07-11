import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });
  const [pwMsg, setPwMsg] = useState({ type: "", text: "" });

  const token = localStorage.getItem("tb_token");

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: "", text: "" });
    setSavingProfile(true);
    try {
      const res = await api.put("/auth/profile", form);
      login(token, res.data.user);
      setProfileMsg({ type: "success", text: "Profile updated." });
    } catch (err) {
      setProfileMsg({ type: "error", text: err.response?.data?.message || "Update failed" });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPwMsg({ type: "", text: "" });
    setSavingPw(true);
    try {
      await api.put("/auth/change-password", pwForm);
      setPwMsg({ type: "success", text: "Password changed successfully." });
      setPwForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setPwMsg({ type: "error", text: err.response?.data?.message || "Password change failed" });
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <div className="container" style={{ padding: "40px 24px 64px", maxWidth: 560 }}>
      <div className="eyebrow">Account</div>
      <h2>My profile</h2>

      <div className="card card-pad" style={{ marginBottom: 24 }}>
        <h3>Profile details</h3>
        {profileMsg.text && (
          <div className={profileMsg.type === "error" ? "form-error" : "form-success"}>{profileMsg.text}</div>
        )}
        <form onSubmit={handleProfileSave}>
          <div className="form-group">
            <label>Email</label>
            <input className="form-control" value={user?.email || ""} disabled />
          </div>
          <div className="form-group">
            <label>Full name</label>
            <input className="form-control" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <button className="btn btn-primary" disabled={savingProfile}>
            {savingProfile ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>

      <div className="card card-pad">
        <h3>Change password</h3>
        {pwMsg.text && (
          <div className={pwMsg.type === "error" ? "form-error" : "form-success"}>{pwMsg.text}</div>
        )}
        <form onSubmit={handlePasswordSave}>
          <div className="form-group">
            <label>Current password</label>
            <input type="password" className="form-control" required value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} />
          </div>
          <div className="form-group">
            <label>New password</label>
            <input type="password" className="form-control" required minLength={6} value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} />
          </div>
          <button className="btn btn-outline" disabled={savingPw}>
            {savingPw ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
