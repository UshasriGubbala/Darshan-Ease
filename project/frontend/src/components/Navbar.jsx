import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand" style={{ textDecoration: "none" }}>
          <span className="brand-mark" />
          Divya Darshan
        </NavLink>
        <nav className="nav-links">
          <NavLink to="/temples">Temples</NavLink>
          {user && <NavLink to="/my-bookings">My Bookings</NavLink>}
          {user && <NavLink to="/profile">Profile</NavLink>}
          {user?.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
          {!user && <NavLink to="/login">Log in</NavLink>}
          {!user && (
            <NavLink to="/register" className="btn btn-primary btn-sm">
              Register
            </NavLink>
          )}
          {user && (
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
              Log out
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
