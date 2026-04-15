import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log("AUTH:", { user, loading });
  

useEffect(() => {
  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  if (token && savedUser) {
    setUser(JSON.parse(savedUser));
  }

  setLoading(false);
}, []);

  // ✅ LOGIN
 const login = (userData, token) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(userData)); // IMPORTANT
  setUser(userData);
};

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// custom hook
export function useAuth() {
  return useContext(AuthContext);
}