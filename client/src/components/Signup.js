import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  // state to handle user credentials
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
    role: "",
  });
  let navigate = useNavigate();

  const submitFunc = async (e) => {
    e.preventDefault();
    const { name, email, password, role } = credentials;

    // api call to create a new user
    const response = await fetch("http://localhost:5555/api/auth/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        role: role,
      }),
    });
    const responseData = await response.json();

    if (responseData.success) {
      // save the auth token and redirect on successful signup
      localStorage.setItem("token", responseData.authToken);
      navigate("/");
      alert("account created successfully", "success");
    } else {
      alert("email already exitss"); // handle error

      // **************************************** FIX THIS ISSUE ******************************************

      // --------------------------------------------------------------------------------------------------

      // ------------- HOW MANY LOCALSTORAGE TOKENS ALLOWED, COS SIGNUP TAKIN BACK TO LOGIN AFTER SIGNUP BUTTTON
    }
  };

  const onChange = (e) => {
    // sets the credentials to whatever is entered by the user
    setCredentials({ ...credentials, [e.target.id]: e.target.value });
  };

  return (
    // signup form taken straight from bootstrap website
    <div className="container position-relative">
      <h2 className="position-absolute start-50 translate-middle">
        signup to view your tasks
      </h2>
      <form className="py-5 my-3" onSubmit={submitFunc}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            onChange={onChange}
            minLength={3}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            onChange={onChange}
            required
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
            minLength={5}
            onChange={onChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">
            confirm password
          </label>
          <input
            type="password"
            className="form-control"
            id="cpassword"
            minLength={5}
            onChange={onChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="role" className="form-label">
            role
          </label>
          <select
            className="form-control"
            id="role"
            onChange={onChange}
            required
          >
            <option value="" disabled selected>
              select your role

            </option>
            <option value="admin" defaultValue={credentials.role === "admin"}>
              admin
            </option>
            <option value="owner" defaultValue={credentials.role === "owner"}>
              owner
            </option>
            <option value="user" defaultValue={credentials.role === "user"}>
              user

            </option>
          </select>
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

export default Signup;
