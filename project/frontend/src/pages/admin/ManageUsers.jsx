import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminLayout from "../../components/AdminLayout";
import { useAuth } from "../../context/AuthContext";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  const load = () => {
    setLoading(true);
    api.get("/admin/users").then((res) => setUsers(res.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const toggleRole = async (u) => {
    const newRole = u.role === "admin" ? "user" : "admin";
    await api.put(`/admin/users/${u._id}/role`, { role: newRole });
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this user?")) return;
    await api.delete(`/admin/users/${id}`);
    load();
  };

  return (
    <AdminLayout>
      <div className="admin-header">
        <h2 style={{ margin: 0 }}>Users</h2>
      </div>
      {loading ? <div className="spinner" /> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th><th></th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone || "—"}</td>
                  <td><span className={`badge ${u.role === "admin" ? "badge-completed" : "badge-confirmed"}`}>{u.role}</span></td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => toggleRole(u)} disabled={u._id === currentUser?.id}>
                      Make {u.role === "admin" ? "user" : "admin"}
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id)} disabled={u._id === currentUser?.id}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan={6}>No users yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
