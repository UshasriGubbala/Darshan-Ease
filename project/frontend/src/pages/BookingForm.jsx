import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function BookingForm() {
  const { slotId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [devotees, setDevotees] = useState([{ name: "", age: "", gender: "" }]);
  const [contactEmail, setContactEmail] = useState(user?.email || "");
  const [contactPhone, setContactPhone] = useState(user?.phone || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!state?.templeId) navigate("/temples");
  }, [state, navigate]);

  const updateDevotee = (i, field, value) => {
    const copy = [...devotees];
    copy[i][field] = value;
    setDevotees(copy);
  };

  const addDevotee = () => setDevotees([...devotees, { name: "", age: "", gender: "" }]);
  const removeDevotee = (i) => setDevotees(devotees.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/bookings", {
        templeId: state.templeId,
        slotId,
        poojaId: state.poojaId,
        devotees,
        contactEmail,
        contactPhone,
      });
      navigate(`/bookings/${res.data._id}`, { state: { justBooked: true } });
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: "40px 24px 64px", maxWidth: 640 }}>
      <div className="eyebrow">Almost there</div>
      <h2>Devotee details</h2>
      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card card-pad">
        {devotees.map((d, i) => (
          <div key={i} style={{ borderBottom: "1px solid var(--border)", paddingBottom: 16, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ fontWeight: 700 }}>Devotee {i + 1}</label>
              {devotees.length > 1 && (
                <button type="button" className="icon-btn" onClick={() => removeDevotee(i)}>✕</button>
              )}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input className="form-control" required value={d.name} onChange={(e) => updateDevotee(i, "name", e.target.value)} />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input type="number" min="0" className="form-control" value={d.age} onChange={(e) => updateDevotee(i, "age", e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select className="form-control" value={d.gender} onChange={(e) => updateDevotee(i, "gender", e.target.value)}>
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-ghost btn-sm" onClick={addDevotee} style={{ marginBottom: 20 }}>
          + Add another devotee
        </button>

        <div className="form-row">
          <div className="form-group">
            <label>Contact email</label>
            <input type="email" className="form-control" required value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Contact phone</label>
            <input className="form-control" required value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
          </div>
        </div>

        <button className="btn btn-primary btn-block" disabled={loading}>
          {loading ? "Confirming..." : "Confirm booking"}
        </button>
      </form>
    </div>
  );
}
