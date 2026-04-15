import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";

// Private Route
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: 100 }}>
      Loading...
    </div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* PROTECTED ROUTES */}
          <Route
            path="/feed"
            element={
              <PrivateRoute>
                <Feed />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile/:id"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* DEFAULT ROUTE */}
          <Route path="/" element={<Navigate to="/feed" replace />} />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}