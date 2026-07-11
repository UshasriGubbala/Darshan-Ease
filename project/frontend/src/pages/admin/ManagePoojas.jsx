import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminLayout from "../../components/AdminLayout";

const emptyForm = { temple: "", name: "", description: "", price: 0, durationMinutes: 30 };

export default function ManagePoojas() {
  const [poojas, setPoojas] = useState([]);
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    Promise.all([api.get("/admin/poojas"), api.get("/admin/temples")])
      .then(([pRes, tRes]) => { setPoojas(pRes.data); setTemples(tRes.data); })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => { setForm({ ...emptyForm, temple: temples[0]?._id || "" }); setEditingId(null); setError(""); setModalOpen(true); };
  const openEdit = (p) => { setForm({ ...p, temple: p.temple?._id || p.temple }); setEditingId(p._id); setError(""); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) await api.put(`/admin/poojas/${editingId}`, form);
      else await api.post("/admin/poojas", form);
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this pooja?")) return;
    await api.delete(`/admin/poojas/${id}`);
    load();
  };

  return (
    <AdminLayout>
      <div className="admin-header">
        <h2 style={{ margin: 0 }}>Poojas</h2>
        <button className="btn btn-primary" onClick={openCreate} disabled={temples.length === 0}>+ Add pooja</button>
      </div>
      {temples.length === 0 && !loading && <p>Add a temple first before creating poojas.</p>}

      {loading ? <div className="spinner" /> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Temple</th><th>Price</th><th>Duration</th><th></th></tr></thead>
            <tbody>
              {poojas.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.temple?.name || "—"}</td>
                  <td>₹{p.price}</td>
                  <td>{p.durationMinutes} min</td>
                  <td style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {poojas.length === 0 && <tr><td colSpan={5}>No poojas yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0 }}>{editingId ? "Edit pooja" : "Add pooja"}</h3>
              <button className="icon-btn" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            {error && <div className="form-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Temple</label>
                <select className="form-control" required value={form.temple} onChange={(e) => setForm({ ...form, temple: e.target.value })}>
                  {temples.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Pooja name</label>
                <input className="form-control" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input type="number" min="0" className="form-control" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label>Duration (minutes)</label>
                  <input type="number" min="5" className="form-control" value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })} />
                </div>
              </div>
              <button className="btn btn-primary btn-block">{editingId ? "Save changes" : "Create pooja"}</button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
