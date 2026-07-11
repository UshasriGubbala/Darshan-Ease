import { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import AdminLayout from "../../components/AdminLayout";

const emptyForm = {
  name: "", location: "", description: "", deity: "", image: "",
  openingTime: "06:00", closingTime: "20:00", featured: false,
};

export default function ManageTemples() {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const load = () => {
    setLoading(true);
    api.get("/admin/temples").then((res) => setTemples(res.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setError(""); setModalOpen(true); };
  const openEdit = (t) => { setForm(t); setEditingId(t._id); setError(""); setModalOpen(true); };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const data = new FormData();
      data.append("photo", file);
      const res = await api.post("/admin/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((f) => ({ ...f, image: res.data.url }));
    } catch (err) {
      setError(err.response?.data?.message || "Photo upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) await api.put(`/admin/temples/${editingId}`, form);
      else await api.post("/admin/temples", form);
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this temple? This cannot be undone.")) return;
    await api.delete(`/admin/temples/${id}`);
    load();
  };

  return (
    <AdminLayout>
      <div className="admin-header">
        <h2 style={{ margin: 0 }}>Temples</h2>
        <button className="btn btn-primary" onClick={openCreate}>+ Add temple</button>
      </div>

      {loading ? <div className="spinner" /> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Photo</th><th>Name</th><th>Location</th><th>Deity</th><th>Featured</th><th>Active</th><th></th></tr></thead>
            <tbody>
              {temples.map((t) => (
                <tr key={t._id}>
                  <td>
                    {t.image ? (
                      <img src={t.image} alt={t.name} style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 6 }} />
                    ) : (
                      <span style={{ color: "var(--ink-soft)", fontSize: "0.8rem" }}>No photo</span>
                    )}
                  </td>
                  <td>{t.name}</td>
                  <td>{t.location || "—"}</td>
                  <td>{t.deity || "—"}</td>
                  <td>{t.featured ? "Yes" : "—"}</td>
                  <td>{t.isActive ? "Yes" : "No"}</td>
                  <td style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(t)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t._id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {temples.length === 0 && <tr><td colSpan={7}>No temples yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0 }}>{editingId ? "Edit temple" : "Add temple"}</h3>
              <button className="icon-btn" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            {error && <div className="form-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input className="form-control" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>

              <div className="form-group">
                <label>Temple photo (optional)</label>
                {form.image && (
                  <div style={{ marginBottom: 8 }}>
                    <img src={form.image} alt="Preview" style={{ width: "100%", maxHeight: 140, objectFit: "cover", borderRadius: 8 }} />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  ref={fileInputRef}
                  className="form-control"
                  onChange={handlePhotoChange}
                />
                {uploading && <p style={{ fontSize: "0.8rem", margin: "6px 0 0" }}>Uploading photo...</p>}
                <p style={{ fontSize: "0.8rem", color: "var(--ink-soft)", margin: "6px 0 0" }}>
                  Or paste an image URL instead:
                </p>
                <input
                  className="form-control"
                  placeholder="https://..."
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  style={{ marginTop: 6 }}
                />
              </div>

              <div className="form-group">
                <label>Location (optional)</label>
                <input className="form-control" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Deity (optional)</label>
                <input className="form-control" value={form.deity} onChange={(e) => setForm({ ...form, deity: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Description (optional)</label>
                <textarea className="form-control" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Opening time</label>
                  <input type="time" className="form-control" value={form.openingTime} onChange={(e) => setForm({ ...form, openingTime: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Closing time</label>
                  <input type="time" className="form-control" value={form.closingTime} onChange={(e) => setForm({ ...form, closingTime: e.target.value })} />
                </div>
              </div>
              <div className="form-group" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="checkbox" id="featured" checked={!!form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                <label htmlFor="featured" style={{ margin: 0 }}>Show as featured on homepage</label>
              </div>
              <button className="btn btn-primary btn-block" disabled={uploading}>
                {editingId ? "Save changes" : "Create temple"}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
