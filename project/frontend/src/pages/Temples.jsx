import { useEffect, useState } from "react";
import api from "../api/axios";
import TempleCard from "../components/TempleCard";

export default function Temples() {
  const [temples, setTemples] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/temples")
      .then((res) => setTemples(res.data))
      .catch(() => setTemples([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = temples.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container" style={{ padding: "40px 24px 64px" }}>
      <div className="eyebrow">All temples</div>
      <h2>Find a temple</h2>
      <input
        className="form-control"
        placeholder="Search by temple name or city..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ maxWidth: 420, marginBottom: 28 }}
      />

      {loading && <div className="spinner" />}
      {!loading && filtered.length === 0 && (
        <div className="empty-state">No temples match your search.</div>
      )}
      {!loading && filtered.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
          {filtered.map((t) => (
            <TempleCard key={t._id} temple={t} />
          ))}
        </div>
      )}
    </div>
  );
}
