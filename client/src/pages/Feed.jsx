import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";
import API from "../api/axios";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // GET POSTS
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await API.get("/posts");
        setPosts(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // ADD NEW POST (from CreatePost)
  const handleNewPost = (post) => {
    setPosts((prev) => [post, ...prev]);
  };

  // UPDATE POST (LIKE, COMMENT etc.)
  const handleUpdate = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
  };

  // DELETE POST
  const handleDeletePost = (id) => {
    setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <>
      <Navbar />

      <div style={s.page}>
        <CreatePost onPostCreated={handleNewPost} />

        {loading ? (
          <p style={s.msg}>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p style={s.msg}>No posts yet. Be the first!</p>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onUpdate={handleUpdate}
              onDelete={handleDeletePost}
            />
          ))
        )}
      </div>
    </>
  );
}

const s = {
  page: {
    maxWidth: 680,
    margin: "0 auto",
    padding: "24px 16px",
  },
  msg: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 40,
    fontSize: 15,
  },
};