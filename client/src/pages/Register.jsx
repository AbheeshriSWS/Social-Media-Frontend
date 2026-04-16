import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

export default function Register() {
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {

    e.preventDefault();
    
  console.log("Clicked"); // 👈 add this

  if (!form.name || !form.email || !form.password) {
    console.log("Validation failed");
    return setError("Please fill in all fields");
  }

  setError("");
  setLoading(true);

  try {
    console.log("Sending request...", form);

    const res = await API.post("/auth/register", form);

    console.log("Response:", res.data); // 👈 IMPORTANT

    login(res.data.user, res.data.token);
    navigate("/posts");

  } catch (err) {
    console.error("ERROR:", err.response?.data || err.message); // 👈 IMPORTANT
    setError(err.response?.data?.message || "Registration failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={s.page}>
  <div style={s.card}>
    <div style={s.logo} />

    <form onSubmit={handleRegister}>
      <h2 style={s.h2}>Create account</h2>
      <p style={s.sub}>Join the community today</p>

      {error && <div style={s.error}>{error}</div>}

      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label style={s.label}>Name</label>
          <input 
            style={s.input} 
            name="name" 
            placeholder="John Doe" 
            value={form.name} 
            onChange={handleChange} 
          />
        </div>

        <div style={{ flex: 1 }}>
          <label style={s.label}>Username</label>
          <input 
            style={s.input} 
            name="username" 
            placeholder="johndoe" 
            value={form.username} 
            onChange={handleChange} 
          />
        </div>
      </div>

      <label style={s.label}>Email</label>
      <input 
        style={s.input} 
        name="email" 
        type="email" 
        placeholder="you@example.com" 
        value={form.email} 
        onChange={handleChange} 
      />

      <label style={s.label}>Password</label>
      <input 
        style={s.input} 
        name="password" 
        type="password" 
        placeholder="Min. 8 characters" 
        value={form.password} 
        onChange={handleChange} 
      />

      <button 
        type="submit"
        style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} 
        disabled={loading}
      >
        {loading ? "Creating account..." : "Create account"}
      </button>
    </form>

    <p style={s.switch}>
      Already have an account? <Link to="/login" style={s.link}>Sign in</Link>
    </p>
  </div>
</div>
  );
}

const s = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f2f5" },
  card: { background: "#fff", borderRadius: 16, padding: "2rem 2.25rem", width: "100%", maxWidth: 400, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" },
  logo: { width: 40, height: 40, borderRadius: "50%", background: "#1a1a1a", margin: "0 auto 1.25rem" },
  h2: { textAlign: "center", fontSize: 20, fontWeight: 600, marginBottom: 4 },
  sub: { textAlign: "center", fontSize: 13, color: "#888", marginBottom: 20 },
  error: { background: "#fff0f0", border: "1px solid #fcc", color: "#c00", fontSize: 13, padding: "8px 12px", borderRadius: 8, marginBottom: 12 },
  label: { display: "block", fontSize: 13, color: "#555", marginBottom: 5, marginTop: 12 },
  input: { width: "100%", padding: "10px 12px", border: "1px solid #e0e0e0", borderRadius: 8, fontSize: 14, outline: "none" },
  btn: { width: "100%", padding: 11, border: "none", borderRadius: 8, background: "#1a1a1a", color: "#fff", fontSize: 14, fontWeight: 500, marginTop: 20 },
  switch: { textAlign: "center", fontSize: 13, color: "#888", marginTop: 18 },
  link: { color: "#1a1a1a", fontWeight: 600 },
};