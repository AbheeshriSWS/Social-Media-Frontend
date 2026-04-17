import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

export default function PostCard({ post, onUpdate, onDelete }) {
  const { user } = useAuth();

  const isOwner =
  (post.user?._id?.toString?.() || post.user?.toString?.()) === user?._id;

  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [lastTap, setLastTap] = useState(0);

  const isLiked = post.likes?.some(
    (id) => id.toString() === user?._id
  );

  useEffect(() => {
  const handleKeyDown = (e) => {
    if (activeImageIndex === null) return;

    if (e.key === "ArrowRight") {
      setActiveImageIndex((prev) =>
        prev < (post.images?.length || 0) - 1 ? prev + 1 : prev
      );
    }

    if (e.key === "ArrowLeft") {
      setActiveImageIndex((prev) =>
        prev > 0 ? prev - 1 : prev
      );
    }

    if (e.key === "Escape") {
      setActiveImageIndex(null);
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  return () => window.removeEventListener("keydown", handleKeyDown);
}, [activeImageIndex, post.images]);


  // Load comments once
  useEffect(() => {
    API.get(`/comments/${post._id}`)
      .then((res) => setComments(res.data))
      .catch(console.log);
  }, [post._id]);

  // LIKE / UNLIKE
 const handleLike = async () => {
  setLoading(true);

  try {
    const res = await API.put(`/posts/like/${post._id}`);

    const updatedLikes = isLiked
      ? (post.likes || []).filter(id => id !== user._id)
      : [...(post.likes || []), user._id];

    onUpdate({
      ...post,
      likes: updatedLikes,
      likesCount: res.data.likesCount,
    });

  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

const handleDelete = async () => {
  try {
    await API.delete(`/posts/${post._id}`);
    onDelete(post._id);
  } catch (err) {
    console.log(err);
  }
};


  // ADD COMMENT
  const handleComment = async () => {
    if (!comment.trim()) return;

    try {
      const res = await API.post(`/comments/${post._id}`, {
        text: comment,
      });

      setComments(res.data); // backend returns full list
      setComment("");
    } catch (err) {
      console.log(err);
    }
  };

  // DELETE COMMENT
  const handleDeleteComment = async (commentId) => {
    try {
      await API.delete(`/comments/${commentId}`);

      setComments((prev) =>
        prev.filter((c) => c._id !== commentId)
      );
    } catch (err) {
      console.log(err);
    }
  };



  return (
    <div style={{ ...styles.card, position: "relative" }}>
      {/* HEADER */}
      <div style={styles.header}>
        <Link to={`/profile/${post.user?._id}`} style={styles.avatar}>
          {post.user?.name?.charAt(0).toUpperCase()}
        </Link>

        <div>
          <Link to={`/profile/${post.user?._id}`} style={styles.name}>
            {post.user?.name}
          </Link>
          <p style={styles.time}>
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

          {post.images?.length > 0 && (
            <div style={{ marginTop: 10 }}>
            
            <div style={styles.carousel}>
              {post.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="post"
                  style={styles.image}
                  onClick={() => setActiveImageIndex(index)}
                />
              ))}
            </div>

          </div>
        )}

          {/* CONTENT */}
          <p style={{ ...styles.content, whiteSpace: "pre-wrap" }}>
            {post.content}
          </p>

          {/* ACTIONS */}
          <div style={styles.actions}>
            <button
              onClick={handleLike}
              disabled={loading}
              style={{
                ...styles.likeBtn,
                color: isLiked ? "red" : "#555",
              }}
            >
              {isLiked ? "♥" : "♡"} {post.likes?.length || 0}
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              style={styles.commentBtn}
            >
              💬 {comments.length}
            </button>

            {isOwner && (
              <button
                onClick={handleDelete}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  background: "red",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: 6
                }}
              >
                Delete
              </button>
            )}
          </div>

          {/* COMMENTS SECTION */}
          {showComments && (
            <div style={{ marginTop: 10 }}>
              {/* input */}
              <div style={{ display: "flex", gap: 8 }}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleComment();
                  }}
                  style={{ display: "flex", gap: 8 }}
                >
                  <input
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    style={styles.input}
                  />
                  <button type="submit">Send</button>
                </form>
              </div>

              {/* comment list */}
              <div style={{ marginTop: 10 }}>
                {comments.map((c) => (
                  <div key={c._id} style={styles.commentRow}>
                    <span>💬 {c.text}</span>

                    {c.user &&
                      (c.user._id || c.user) === user._id && (
                        <button
                          onClick={() =>
                            handleDeleteComment(c._id)
                          }
                        >
                          X
                        </button>
                      )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeImageIndex !== null && (
            <div style={styles.modal} onClick={() => setActiveImageIndex(null)}>
              
              <button
                style={styles.closeBtn}
                onClick={() => setActiveImageIndex(null)}
              >
                ✕
              </button>

              <button
                style={styles.navLeft}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex((prev) =>
                    prev > 0 ? prev - 1 : prev
                  );
                }}
              >
                ◀
              </button>

              <img
                src={post.images?.[activeImageIndex]}
                style={styles.modalImage}
                onClick={(e) => {
                  e.stopPropagation();

                  const now = Date.now();
                  const DOUBLE_TAP_DELAY = 300;

                  if (now - lastTap < DOUBLE_TAP_DELAY) {
                    handleLike(); // ❤️ trigger like
                  }

                  setLastTap(now);
                }}
              />

              <button
                style={styles.navRight}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex((prev) =>
                    prev < post.images?.length - 1 ? prev + 1 : prev
                  );
                }}
              >
                ▶
              </button>

              <div style={styles.counter}>
                {activeImageIndex + 1} / {post.images?.length}
              </div>

            </div>
          )}

    </div>
  );
}

/* STYLES */
const styles = {
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: "1.25rem",
    marginBottom: 12,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    background: "#1a1a1a",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
  },
  name: { fontWeight: 600, fontSize: 14 },
  time: { fontSize: 12, color: "#aaa" },
  content: { fontSize: 15, marginBottom: 12 },
  actions: { display: "flex", gap: 15 },
  likeBtn: { background: "none", border: "none", cursor: "pointer" },
  commentBtn: { background: "none", border: "none", cursor: "pointer" },
  deleteBtn: {
    background: "red",
    color: "#fff",
    border: "none",
    padding: "4px 10px",
    borderRadius: 6,
  },
  input: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    border: "1px solid #ddd",
  },
  commentRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
    marginBottom: 6,
  },
  carousel: {
  display: "flex",
  overflowX: "auto",
  gap: 10,
  scrollSnapType: "x mandatory",
  scrollBehavior: "smooth",
  WebkitOverflowScrolling: "touch"
},

image: {
  minWidth: "100%",
  maxHeight: 400,
  objectFit: "cover",
  borderRadius: 10,
  scrollSnapAlign: "center"
},
modal: {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.9)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999
},
closeBtn: {
  position: "absolute",
  top: 20,
  right: 20,
  background: "white",
  border: "none",
  padding: "5px 10px",
  borderRadius: 5,
  cursor: "pointer"
},

navLeft: {
  position: "absolute",
  left: 20,
  background: "white",
  border: "none",
  padding: "10px",
  borderRadius: "50%",
  cursor: "pointer"
},

navRight: {
  position: "absolute",
  right: 20,
  background: "white",
  border: "none",
  padding: "10px",
  borderRadius: "50%",
  cursor: "pointer"
},

counter: {
  position: "absolute",
  bottom: 20,
  color: "white",
  fontSize: 14
},
modalImage: {
  maxWidth: "90%",
  maxHeight: "90%",
  borderRadius: 10,
  transition: "transform 0.2s ease-in-out"
}
};