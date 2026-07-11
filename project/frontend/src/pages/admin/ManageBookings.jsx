import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminLayout from "../../components/AdminLayout";

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const load = () => {
    setLoading(true);
    api.get("/admin/bookings").then((res) => setBookings(res.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const updateStatus = async (id, status) => {
    await api.put(`/admin/bookings/${id}/status`, { status });
    load();
  };

  const filtered = statusFilter ? bookings.filter((b) => b.status === statusFilter) : bookings;

  return (
    <AdminLayout>
      <div className="admin-header">
        <h2 style={{ margin: 0 }}>Bookings</h2>
      </div>
      <div className="admin-toolbar">
        <select className="form-control" style={{ maxWidth: 220 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? <div className="spinner" /> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Code</th><th>User</th><th>Temple</th><th>Date</th><th>Amount</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b._id}>
                  <td>{b.bookingCode}</td>
                  <td>{b.user?.name}<br /><span style={{ color: "var(--ink-soft)", fontSize: "0.8rem" }}>{b.user?.email}</span></td>
                  <td>{b.temple?.name}</td>
                  <td>{b.date}</td>
                  <td>₹{b.amount}</td>
                  <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                  <td>
                    <select className="form-control" value={b.status} onChange={(e) => updateStatus(b._id, e.target.value)}>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7}>No bookings found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
