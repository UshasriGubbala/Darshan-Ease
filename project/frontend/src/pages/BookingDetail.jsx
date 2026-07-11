import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import api from "../api/axios";

export default function BookingDetail() {
  const { id } = useParams();
  const { state } = useLocation();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const load = () => {
    api.get(`/bookings/${id}`).then((res) => setBooking(res.data)).finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const handleCancel = async () => {
    if (!confirm("Cancel this booking?")) return;
    setCancelling(true);
    try {
      await api.put(`/bookings/${id}/cancel`);
      load();
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <div className="spinner" />;
  if (!booking) return <div className="empty-state">Booking not found.</div>;

  return (
    <div className="container" style={{ padding: "40px 24px 64px", maxWidth: 560 }}>
      {state?.justBooked && <div className="form-success">Your booking is confirmed. See details below.</div>}
      <div className="card card-pad" style={{ textAlign: "center" }}>
        <div className="eyebrow">Booking code</div>
        <h2 style={{ marginBottom: 4 }}>{booking.bookingCode}</h2>
        <span className={`badge badge-${booking.status}`}>{booking.status}</span>

        {booking.qrCode && (
          <div style={{ margin: "24px 0" }}>
            <img src={booking.qrCode} alt="Booking QR code" style={{ width: 180, height: 180 }} />
            <p style={{ fontSize: "0.85rem" }}>Show this QR code at the temple entrance.</p>
          </div>
        )}

        <div style={{ textAlign: "left", fontSize: "0.92rem" }}>
          <p><strong>Temple:</strong> {booking.temple?.name}</p>
          <p><strong>Date:</strong> {booking.date} · {booking.slot?.startTime}–{booking.slot?.endTime}</p>
          {booking.pooja && <p><strong>Pooja:</strong> {booking.pooja.name}</p>}
          <p><strong>Devotees:</strong> {booking.devotees.map((d) => d.name).join(", ")}</p>
          <p><strong>Amount paid:</strong> ₹{booking.amount}</p>
          <p><strong>Contact:</strong> {booking.contactEmail} · {booking.contactPhone}</p>
        </div>

        {booking.status === "confirmed" && (
          <button className="btn btn-danger" onClick={handleCancel} disabled={cancelling}>
            {cancelling ? "Cancelling..." : "Cancel booking"}
          </button>
        )}

        <div style={{ marginTop: 16 }}>
          <Link to="/my-bookings">← Back to my bookings</Link>
        </div>
      </div>
    </div>
  );
}
