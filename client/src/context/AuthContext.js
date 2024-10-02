import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => { 
  // state to manage auth token
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("token") || null
  );

  // state to manage the user role (admin/owner/user)
  const [userRole, setUserRole] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    if (authToken) {
      // fetch user details (including role) using token
      fetch("http://localhost:5555/api/auth/getUser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
      })
        .then((response) => {
          if (!response.ok) {
            // if server is restarted or token is invalid, clear token
            setAuthToken(null);
            navigate("/login");
            throw new Error("token invalid or server restarted");
          }
          return response.json();
        })
        .then((data) => {
          setUserRole(data.role);
          navigate("/")
        })
        .catch(() => {
          localStorage.removeItem("token");
          setAuthToken(null);
          navigate("/login");
        });
    }
  }, [authToken]);

  // handling login click
  const login = (token) => {
    localStorage.setItem("token", token);
    setAuthToken(token);
  };

  // handling logout click
  const logout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    setUserRole(null);
    navigate("/login");
  };

  return (
    // create a context to let the mentioned fields be available throughtout the application and wrapped it in App.js
    <AuthContext.Provider value={{ authToken, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
