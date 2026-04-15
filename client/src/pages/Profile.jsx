import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

export default function Profile() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const isOwn = currentUser?._id === id;

  useEffect(() => {
    Promise.all([API.get(`/users/${id}`), API.get(`/posts/user/${id}`)])
      .then(([userRes, postsRes]) => {
        setProfile(userRes.data);
        setPosts(postsRes.data);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  }, [id]);

  const handleFollow = async () => {
    const isFollowing = profile.followers?.includes(currentUser?._id);
    const endpoint = isFollowing ? `/users/unfollow/${id}` : `/users/follow/${id}`;
    const res = await API.put(endpoint);
    setProfile(res.data);
  };

  const handleUpdate = (updatedPost) =>
    setPosts(posts.map((p) => (p._id === updatedPost._id ? updatedPost : p)));

  if (loading) return <><Navbar /><p style={{ textAlign: "center", marginTop: 80, color: "#aaa" }}>Loading...</p></>;
  if (!profile) return <><Navbar /><p style={{ textAlign: "center", marginTop: 80 }}>User not found</p></>;

  const isFollowing = profile.followers?.includes(currentUser?._id);

  return (
    <>
      <Navbar />
      <div style={s.page}>
        {/* Profile Header */}
        <div style={s.header}>
          <div style={s.avatar}>{profile.name?.charAt(0).toUpperCase()}</div>
          <div style={s.info}>
            <h2 style={s.name}>{profile.name}</h2>
            <p style={s.username}>@{profile.username}</p>
            <div style={s.stats}>
              <span><b>{posts.length}</b> posts</span>
              <span><b>{profile.followers?.length || 0}</b> followers</span>
              <span><b>{profile.following?.length || 0}</b> following</span>
            </div>
          </div>
          {!isOwn && (
            <button
              style={{ ...s.followBtn, background: isFollowing ? "#fff" : "#1a1a1a", color: isFollowing ? "#1a1a1a" : "#fff", border: isFollowing ? "1px solid #ddd" : "none" }}
              onClick={handleFollow}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <p style={s.msg}>No posts yet</p>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} onUpdate={handleUpdate} />)
        )}
      </div>
    </>
  );
}

const s = {
  page: { maxWidth: 680, margin: "0 auto", padding: "24px 16px" },
  header: { background: "#fff", borderRadius: 12, padding: "1.5rem", marginBottom: 20, display: "flex", alignItems: "center", gap: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
  avatar: { width: 64, height: 64, borderRadius: "50%", background: "#1a1a1a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, flexShrink: 0 },
  info: { flex: 1 },
  name: { fontSize: 18, fontWeight: 700 },
  username: { fontSize: 13, color: "#888", marginTop: 2 },
  stats: { display: "flex", gap: 16, marginTop: 10, fontSize: 13, color: "#555" },
  followBtn: { padding: "8px 20px", borderRadius: 20, fontSize: 14, fontWeight: 500, cursor: "pointer", flexShrink: 0 },
  msg: { textAlign: "center", color: "#aaa", marginTop: 40, fontSize: 15 },
};