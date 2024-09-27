import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // state to manage auth token
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("token") || null
  );

  // state tio manage the user role (admin/owner/user)
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
        .then((response) => response.json())
        .then((data) => {
          setUserRole(data.role);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setAuthToken(null);
          navigate("/login");
        });
    }
  }, [authToken, navigate]);

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
    // create a context to let the mentioned fields be consistent throughtout the application and wrapped it in App.js
    <AuthContext.Provider value={{ authToken, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
