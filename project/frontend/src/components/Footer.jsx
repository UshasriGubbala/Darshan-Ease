export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div>
          <strong style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem" }}>Divya Darshan</strong>
          <p style={{ color: "#C9C3B6", maxWidth: 320, marginTop: 8 }}>
            Book darshan and pooja slots at temples across India, without the queue.
          </p>
        </div>
        <div>
          <div className="eyebrow" style={{ color: "var(--gold-light)" }}>Explore</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
            <a href="/temples">Browse temples</a>
            <a href="/my-bookings">My bookings</a>
            <a href="/admin-login">Admin login</a>
          </div>
        </div>
      </div>
      <div className="container">
        <small>© {new Date().getFullYear()} Divya Darshan. Built for devotees, everywhere.</small>
      </div>
    </footer>
  );
}
