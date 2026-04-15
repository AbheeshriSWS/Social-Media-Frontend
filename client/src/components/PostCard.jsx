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

  const isLiked = post.likes?.some(
    (id) => id.toString() === user?._id
  );

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
      ? post.likes.filter(id => id !== user._id)
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

  // DELETE POST
  const handleDeletePost = async () => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this post?"
  );

  if (!confirmDelete) return;

  try {
    await API.delete(`/posts/${post._id}`);
    onDelete(post._id);
  } catch (err) {
    console.log(err);
  }
};

  return (
    <div style={styles.card}>
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

      {/* CONTENT */}
      <p style={styles.content}>{post.content}</p>

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
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              style={styles.input}
            />
            <button onClick={handleComment}>Send</button>
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
};