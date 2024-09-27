import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  // stated to handle email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // destructured login context
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // api call to backend to authenticate user and hadnling accrodingly
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5555/api/auth/authenticate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      // console.log(data);

      if (data.success) {
        // this saves the authtoken and redirects to homepage
        login(data.authToken);
        navigate("/");
      } else {
        alert("wrong credentials"); // handle error
      }
    } catch (error) {
      // failed to login
      console.error("shitty error.message");
    }
  };

  // login form taken straight from bootstrap website
  return (
    <div className="container position-relative">
      <h2 className="my-4 position-absolute start-50 translate-middle">
        login to open tasks
      </h2>
      <form className="py-5 my-4" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            aria-describedby="emailHelp"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary my-3">
            submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
