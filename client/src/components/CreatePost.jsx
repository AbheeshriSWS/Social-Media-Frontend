import { useState, useEffect, useRef } from "react";

import API from "../api/axios";
import imageCompression from "browser-image-compression";

export default function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
  return () => {
    images.forEach((img) => {
      if (img instanceof Blob) {
        URL.revokeObjectURL(img);
      }
    });
  };
}, [images]);

  const compressImage = async (file) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    useWebWorker: true
  };

  const compressedFile = await imageCompression(file, options);
  return compressedFile;
};

  const handlePost = async () => {

      console.log("POST BUTTON CLICKED"); // 👈 add this

      if (!content.trim()) return;

      setLoading(true);

      try {
        const formData = new FormData();

        formData.append("content", content);

        if (images.length > 0) {
          images.forEach((img) => {
            formData.append("images", img);
          });
        }

        const res = await API.post("/posts", formData);

        onPostCreated(res.data);
        setContent("");
        setImages([]);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

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
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        handlePost();
      }
    }}
  />
  <div
  onDragOver={(e) => {
    e.preventDefault();
    setIsDragging(true);
  }}
  onDragLeave={() => setIsDragging(false)}
  onDrop={async (e) => {
  e.preventDefault();
  setIsDragging(false);

  const files = Array.from(e.dataTransfer.files);

  const compressedFiles = await Promise.all(
    files.map(async (file) => await compressImage(file))
  );

  setImages((prev) => [...prev, ...compressedFiles]);
}}
  style={{
    border: isDragging ? "2px dashed #000" : "2px dashed transparent",
    padding: 10,
    borderRadius: 10
  }}
>

  {/* 👇 YOUR EXISTING INPUT */}
  <input
    ref={fileInputRef}
    type="file"
    accept="image/*"
    multiple
    onChange={async (e) => {
      const files = Array.from(e.target.files);

      const compressedFiles = await Promise.all(
        files.map(async (file) => await compressImage(file))
      );

      setImages((prev) => [...prev, ...compressedFiles]);
    }}
  />

  {/* 👇 YOUR EXISTING PREVIEW CODE */}
  {images.length > 0 && (
  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
    {images.map((img, index) => (
      <div key={index} style={{ position: "relative" }}>
        <img
          src={URL.createObjectURL(img)}
          style={{
            width: 120,
            height: 120,
            objectFit: "cover",
            borderRadius: 10
          }}
        />

        <button
          onClick={() => {
            setImages((prev) => prev.filter((_, i) => i !== index));
          }}
          style={{
            position: "absolute",
            top: 5,
            right: 5,
            background: "black",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: 20,
            height: 20,
            cursor: "pointer"
          }}
        >
          ✕
        </button>
      </div>
    ))}
  </div>
)}

</div>

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