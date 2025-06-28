import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const checkToken = () => {
      setIsLoggedIn(!!token);
    };

    checkToken(); 
    
    window.addEventListener('storage', checkToken);
    return () => window.removeEventListener('storage', checkToken);
  }, []);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
