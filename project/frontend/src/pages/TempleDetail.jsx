import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function TempleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [temple, setTemple] = useState(null);
  const [poojas, setPoojas] = useState([]);
  const [slots, setSlots] = useState([]);
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedPooja, setSelectedPooja] = useState("");

  useEffect(() => {
    Promise.all([
      api.get(`/temples/${id}`),
      api.get(`/temples/${id}/poojas`),
    ])
      .then(([tRes, pRes]) => {
        setTemple(tRes.data);
        setPoojas(pRes.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    api.get(`/temples/${id}/slots`, { params: { date } }).then((res) => setSlots(res.data));
    setSelectedSlot(null);
  }, [id, date]);

  const handleBook = () => {
    if (!user) {
      navigate("/login", { state: { from: `/temples/${id}` } });
      return;
    }
    if (!selectedSlot) return;
    navigate(`/book/${selectedSlot}`, { state: { templeId: id, poojaId: selectedPooja || null } });
  };

  if (loading) return <div className="spinner" />;
  if (!temple) return <div className="empty-state">Temple not found.</div>;

  return (
    <div className="container" style={{ padding: "40px 24px 64px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 36 }} className="temple-detail-grid">
        <div>
          <div
            style={{
              height: 280,
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
              clipPath: "polygon(0 0, 100% 0, 100% 88%, 55% 100%, 45% 100%, 0 88%)",
              marginBottom: 20,
            }}
          >
            <img src={temple.image} alt={temple.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div className="eyebrow">{temple.deity}</div>
          <h1 style={{ marginBottom: 6 }}>{temple.name}</h1>
          <p style={{ color: "var(--gold)", fontWeight: 600 }}>{temple.location}</p>
          <p>{temple.description}</p>
          <p style={{ fontSize: "0.9rem" }}>
            <strong>Timings:</strong> {temple.openingTime} – {temple.closingTime}
          </p>

          {poojas.length > 0 && (
            <>
              <h3 style={{ marginTop: 28 }}>Pooja options</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label className="card" style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <input type="radio" name="pooja" checked={selectedPooja === ""} onChange={() => setSelectedPooja("")} />
                  <span>Darshan only (no pooja) — Free</span>
                </label>
                {poojas.map((p) => (
                  <label key={p._id} className="card" style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="pooja"
                      checked={selectedPooja === p._id}
                      onChange={() => setSelectedPooja(p._id)}
                    />
                    <span style={{ flex: 1 }}>
                      <strong>{p.name}</strong> — ₹{p.price} · {p.durationMinutes} min
                      <br />
                      <span style={{ fontSize: "0.85rem", color: "var(--ink-soft)" }}>{p.description}</span>
                    </span>
                  </label>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="card card-pad" style={{ alignSelf: "start", position: "sticky", top: 90 }}>
          <h3>Choose date &amp; slot</h3>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              className="form-control"
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {slots.length === 0 && <p style={{ fontSize: "0.9rem" }}>No slots available for this date.</p>}

          <div className="slot-grid">
            {slots.map((s) => {
              const available = s.capacity - s.bookedCount;
              return (
                <button
                  key={s._id}
                  className={`slot-btn ${selectedSlot === s._id ? "selected" : ""}`}
                  disabled={available <= 0}
                  onClick={() => setSelectedSlot(s._id)}
                >
                  {s.startTime}–{s.endTime}
                  <br />
                  <span style={{ fontWeight: 400, fontSize: "0.75rem" }}>
                    {available > 0 ? `${available} left` : "Full"}
                  </span>
                </button>
              );
            })}
          </div>

          <button className="btn btn-primary btn-block" style={{ marginTop: 20 }} disabled={!selectedSlot} onClick={handleBook}>
            Continue to booking
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .temple-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
