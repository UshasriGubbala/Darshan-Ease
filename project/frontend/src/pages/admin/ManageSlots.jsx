import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminLayout from "../../components/AdminLayout";

const emptyForm = { temple: "", date: "", startTime: "06:00", endTime: "07:00", capacity: 50 };

export default function ManageSlots() {
  const [slots, setSlots] = useState([]);
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [filterTemple, setFilterTemple] = useState("");

  const load = () => {
    setLoading(true);
    Promise.all([
      api.get("/admin/slots", { params: filterTemple ? { temple: filterTemple } : {} }),
      api.get("/admin/temples"),
    ])
      .then(([sRes, tRes]) => { setSlots(sRes.data); setTemples(tRes.data); })
      .finally(() => setLoading(false));
  };
  useEffect(load, [filterTemple]);

  const openCreate = () => {
    setForm({ ...emptyForm, temple: filterTemple || temples[0]?._id || "", date: new Date().toISOString().split("T")[0] });
    setError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/admin/slots", form);
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this slot?")) return;
    await api.delete(`/admin/slots/${id}`);
    load();
  };

  return (
    <AdminLayout>
      <div className="admin-header">
        <h2 style={{ margin: 0 }}>Darshan slots</h2>
        <button className="btn btn-primary" onClick={openCreate} disabled={temples.length === 0}>+ Add slot</button>
      </div>

      <div className="admin-toolbar">
        <select className="form-control" style={{ maxWidth: 260 }} value={filterTemple} onChange={(e) => setFilterTemple(e.target.value)}>
          <option value="">All temples</option>
          {temples.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
        </select>
      </div>

      {loading ? <div className="spinner" /> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Temple</th><th>Date</th><th>Time</th><th>Capacity</th><th>Booked</th><th></th></tr></thead>
            <tbody>
              {slots.map((s) => (
                <tr key={s._id}>
                  <td>{s.temple?.name}</td>
                  <td>{s.date}</td>
                  <td>{s.startTime}–{s.endTime}</td>
                  <td>{s.capacity}</td>
                  <td>{s.bookedCount}</td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(s._id)}>Delete</button></td>
                </tr>
              ))}
              {slots.length === 0 && <tr><td colSpan={6}>No slots yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0 }}>Add darshan slot</h3>
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
                <label>Date</label>
                <input type="date" className="form-control" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start time</label>
                  <input type="time" className="form-control" required value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>End time</label>
                  <input type="time" className="form-control" required value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Capacity</label>
                <input type="number" min="1" className="form-control" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
              </div>
              <button className="btn btn-primary btn-block">Create slot</button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
