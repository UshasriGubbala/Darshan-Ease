import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import TempleCard from "../components/TempleCard";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/temples", { params: { featured: true } })
      .then((res) => setFeatured(res.data))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
        <div className="container" style={{ padding: "72px 24px", textAlign: "center" }}>
          <div className="eyebrow">Skip the queue, not the darshan</div>
          <h1>Book your temple darshan
            <br />in a few taps</h1>
          <p style={{ maxWidth: 560, margin: "0 auto 28px", fontSize: "1.05rem" }}>
            Reserve darshan slots and pooja bookings at temples across India. Choose your time,
            enter devotee details, and carry your confirmation with a scannable QR code.
          </p>
          <div className="arch-divider">
            <span></span><span></span><span></span><span></span><span></span>
          </div>
          <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
            <Link to="/temples" className="btn btn-primary">Browse temples</Link>
            <Link to="/register" className="btn btn-outline">Create an account</Link>
          </div>
        </div>
      </section>

      <section className="container" style={{ padding: "56px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
          <h2 style={{ margin: 0 }}>Featured temples</h2>
          <Link to="/temples">View all →</Link>
        </div>

        {loading && <div className="spinner" />}
        {!loading && featured.length === 0 && (
          <div className="empty-state">No featured temples yet. Check back soon.</div>
        )}
        {!loading && featured.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {featured.map((t) => (
              <TempleCard key={t._id} temple={t} />
            ))}
          </div>
        )}
      </section>

      <section className="container" style={{ padding: "20px 24px 64px" }}>
        <div className="card card-pad" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24, textAlign: "center" }}>
          <div>
            <div className="eyebrow">Step 01</div>
            <h3>Choose a temple</h3>
            <p style={{ fontSize: "0.9rem" }}>Browse timings, deities and pooja options.</p>
          </div>
          <div>
            <div className="eyebrow">Step 02</div>
            <h3>Pick a slot</h3>
            <p style={{ fontSize: "0.9rem" }}>Select a date, time and pooja type that suits you.</p>
          </div>
          <div>
            <div className="eyebrow">Step 03</div>
            <h3>Confirm devotees</h3>
            <p style={{ fontSize: "0.9rem" }}>Add names for everyone joining the darshan.</p>
          </div>
          <div>
            <div className="eyebrow">Step 04</div>
            <h3>Carry your QR</h3>
            <p style={{ fontSize: "0.9rem" }}>Show your booking QR code at the temple gate.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
