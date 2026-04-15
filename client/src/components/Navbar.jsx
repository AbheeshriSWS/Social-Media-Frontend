import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={s.nav}>
      <div style={s.inner}>
        <Link to="/posts" style={s.brand}>SocialApp</Link>
        <div style={s.right}>
          {user && (
            <>
              <Link to={`/profile/${user._id}`} style={s.avatar}>
                {user.name?.charAt(0).toUpperCase()}
              </Link>
              <button style={s.logoutBtn} onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const s = {
  nav: { background: "#fff", borderBottom: "1px solid #e8e8e8", position: "sticky", top: 0, zIndex: 100 },
  inner: { maxWidth: 680, margin: "0 auto", padding: "0 16px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" },
  brand: { fontWeight: 700, fontSize: 18, color: "#1a1a1a" },
  right: { display: "flex", alignItems: "center", gap: 12 },
  avatar: { width: 34, height: 34, borderRadius: "50%", background: "#1a1a1a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 14 },
  logoutBtn: { padding: "6px 14px", border: "1px solid #e0e0e0", borderRadius: 8, background: "none", fontSize: 13, color: "#555" },
};