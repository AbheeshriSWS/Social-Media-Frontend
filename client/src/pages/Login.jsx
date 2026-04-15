import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

const handleLogin = async () => {
  if (!email || !password) return setError("Please fill in all fields");

  setError("");
  setLoading(true);

  try {
    const res = await API.post("/auth/login", { email, password });

    login(res.data.user, res.data.token); // ONLY THIS

    navigate("/feed");

  } catch (err) {
    setError(err.response?.data?.message || "Invalid email or password");
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo} />
        <h2 style={s.h2}>Welcome back</h2>
        <p style={s.sub}>Sign in to your account</p>
        {error && <div style={s.error}>{error}</div>}
        <label style={s.label}>Email</label>
        <input style={s.input} type="email" value={email} placeholder="you@example.com"
          onChange={(e) => setEmail(e.target.value)} />
        <label style={s.label}>Password</label>
        <input style={s.input} type="password" value={password} placeholder="Your password"
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
        <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} onClick={handleLogin} disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <p style={s.switch}>No account? <Link to="/register" style={s.link}>Sign up</Link></p>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f2f5" },
  card: { background: "#fff", borderRadius: 16, padding: "2rem 2.25rem", width: "100%", maxWidth: 380, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" },
  logo: { width: 40, height: 40, borderRadius: "50%", background: "#1a1a1a", margin: "0 auto 1.25rem" },
  h2: { textAlign: "center", fontSize: 20, fontWeight: 600, marginBottom: 4 },
  sub: { textAlign: "center", fontSize: 13, color: "#888", marginBottom: 24 },
  error: { background: "#fff0f0", border: "1px solid #fcc", color: "#c00", fontSize: 13, padding: "8px 12px", borderRadius: 8, marginBottom: 12 },
  label: { display: "block", fontSize: 13, color: "#555", marginBottom: 5, marginTop: 12 },
  input: { width: "100%", padding: "10px 12px", border: "1px solid #e0e0e0", borderRadius: 8, fontSize: 14, outline: "none" },
  btn: { width: "100%", padding: 11, border: "none", borderRadius: 8, background: "#1a1a1a", color: "#fff", fontSize: 14, fontWeight: 500, marginTop: 20 },
  switch: { textAlign: "center", fontSize: 13, color: "#888", marginTop: 18 },
  link: { color: "#1a1a1a", fontWeight: 600 },
};