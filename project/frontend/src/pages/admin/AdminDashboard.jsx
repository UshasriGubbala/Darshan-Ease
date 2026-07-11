import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminLayout from "../../components/AdminLayout";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/reports/summary").then((res) => setStats(res.data));
  }, []);

  return (
    <AdminLayout>
      <div className="admin-header">
        <h2 style={{ margin: 0 }}>Overview</h2>
      </div>

      {!stats && <div className="spinner" />}
      {stats && (
        <>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-label">Temples</div>
              <div className="stat-value">{stats.totalTemples}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Registered users</div>
              <div className="stat-value">{stats.totalUsers}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total bookings</div>
              <div className="stat-value">{stats.totalBookings}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Cancelled</div>
              <div className="stat-value">{stats.cancelledBookings}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Revenue</div>
              <div className="stat-value">₹{stats.totalRevenue}</div>
            </div>
          </div>

          <h3>Bookings by temple</h3>
          <div className="table-wrap" style={{ marginBottom: 28 }}>
            <table>
              <thead><tr><th>Temple</th><th>Bookings</th></tr></thead>
              <tbody>
                {stats.bookingsByTemple.map((row) => (
                  <tr key={row.name}><td>{row.name}</td><td>{row.count}</td></tr>
                ))}
                {stats.bookingsByTemple.length === 0 && (
                  <tr><td colSpan={2}>No bookings yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <h3>Bookings by date</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Date</th><th>Bookings</th></tr></thead>
              <tbody>
                {stats.bookingsByDate.map((row) => (
                  <tr key={row._id}><td>{row._id}</td><td>{row.count}</td></tr>
                ))}
                {stats.bookingsByDate.length === 0 && (
                  <tr><td colSpan={2}>No bookings yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
