import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/bookings/my").then((res) => setBookings(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container" style={{ padding: "40px 24px 64px" }}>
      <div className="eyebrow">Your history</div>
      <h2>My bookings</h2>

      {loading && <div className="spinner" />}
      {!loading && bookings.length === 0 && (
        <div className="empty-state">
          You haven't booked a darshan yet.
          <div style={{ marginTop: 16 }}>
            <Link to="/temples" className="btn btn-primary">Browse temples</Link>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gap: 16 }}>
        {bookings.map((b) => (
          <Link key={b._id} to={`/bookings/${b._id}`} className="card card-pad" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", textDecoration: "none" }}>
            <div>
              <h3 style={{ marginBottom: 4 }}>{b.temple?.name}</h3>
              <p style={{ margin: 0, fontSize: "0.9rem" }}>
                {b.date} · {b.slot?.startTime}–{b.slot?.endTime} {b.pooja ? `· ${b.pooja.name}` : ""}
              </p>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--gold)" }}>{b.bookingCode}</p>
            </div>
            <span className={`badge badge-${b.status}`}>{b.status}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
