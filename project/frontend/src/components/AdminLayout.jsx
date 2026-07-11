import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/temples", label: "Temples" },
  { to: "/admin/poojas", label: "Poojas" },
  { to: "/admin/slots", label: "Darshan Slots" },
  { to: "/admin/bookings", label: "Bookings" },
  { to: "/admin/users", label: "Users" },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="brand">
          <span className="brand-mark" />
          Divya Admin
        </div>
        <nav className="admin-nav">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div style={{ marginTop: 30, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <p style={{ color: "#C9C3B6", fontSize: "0.8rem", margin: "0 0 10px" }}>{user?.name}</p>
          <button
            className="btn btn-ghost btn-sm"
            style={{ color: "#E9E4D8", borderColor: "rgba(255,255,255,0.2)" }}
            onClick={() => { logout(); navigate("/"); }}
          >
            Log out
          </button>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
