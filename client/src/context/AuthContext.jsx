import { createContext, useState, useEffect } from "react";
import { getCurrentUser } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore user session on app load
    const restoreSession = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
          // First, restore from localStorage for immediate UI update
          const userData = JSON.parse(storedUser);
          setUser(userData);

          // Then validate token with backend (optional but recommended)
          try {
            const response = await getCurrentUser();
            if (response.success && response.data) {
              // Update with fresh data from server
              const freshUserData = response.data.user || response.data;
              setUser(freshUserData);
              localStorage.setItem("user", JSON.stringify(freshUserData));
            }
          } catch (error) {
            // Token is invalid or expired, clear session
            console.error("Session validation failed:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Failed to restore session:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = (userData, token) => {
    // Store both token and user data
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    // Clear all auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateUser = (updatedUserData) => {
    // Update user data in state and localStorage
    setUser(updatedUserData);
    localStorage.setItem("user", JSON.stringify(updatedUserData));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
