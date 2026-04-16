import { useState } from "react";
import API from "../api/axios";

export default function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {

      console.log("POST BUTTON CLICKED"); // 👈 add this

      
    if (!content.trim()) return;
    setLoading(true);
    try {
      const res = await API.post("/posts", { content });
      onPostCreated(res.data);
      setContent("");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.card}>
  <textarea
    style={s.textarea}
    placeholder="What's on your mind?"
    value={content}
    onChange={(e) => setContent(e.target.value)}
    rows={3}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        handlePost();
      }
    }}
  />

  <div style={s.footer}>
    <span style={s.count}>{content.length}/500</span>

    <button
      style={{ ...s.btn, opacity: (!content.trim() || loading) ? 0.5 : 1 }}
      onClick={handlePost}
      disabled={!content.trim() || loading}
    >
      {loading ? "Posting..." : "Post"}
    </button>
  </div>
</div>
  );
}

const s = {
  card: { background: "#fff", borderRadius: 12, padding: "1.25rem", marginBottom: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
  textarea: { width: "100%", border: "none", outline: "none", fontSize: 15, resize: "none", color: "#333", lineHeight: 1.6 },
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 12, borderTop: "1px solid #f0f0f0" },
  count: { fontSize: 12, color: "#bbb" },
  btn: { padding: "8px 20px", border: "none", borderRadius: 20, background: "#1a1a1a", color: "#fff", fontSize: 14, fontWeight: 500 },
};