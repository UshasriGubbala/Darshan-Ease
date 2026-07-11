import { Link } from "react-router-dom";

export default function TempleCard({ temple }) {
  return (
    <Link to={`/temples/${temple._id}`} className="temple-card" style={{ textDecoration: "none" }}>
      <div className="temple-card-image-wrap">
        <img
          src={temple.image || "https://images.unsplash.com/photo-1600100397608-f43f5a2f5d6b?w=800"}
          alt={temple.name}
        />
      </div>
      <div className="temple-card-body">
        <h3>{temple.name}</h3>
        <div className="temple-card-location">{temple.location}</div>
        <p>{temple.description?.slice(0, 100) || "Tap to view timings, pooja options and available darshan slots."}</p>
        <span className="btn btn-outline btn-sm" style={{ alignSelf: "flex-start" }}>View details</span>
      </div>
    </Link>
  );
}
