import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("adminToken");
    const savedAdmin = localStorage.getItem("admin");
    if (savedToken && savedAdmin) {
      setToken(savedToken);
      setAdmin(JSON.parse(savedAdmin));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (adminData, authToken) => {
    setAdmin(adminData);
    setToken(authToken);
    setIsAuthenticated(true);
    localStorage.setItem("adminToken", authToken);
    localStorage.setItem("admin", JSON.stringify(adminData));
  };

  const logout = () => {
    setAdmin(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
