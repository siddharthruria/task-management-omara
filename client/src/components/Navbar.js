import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  // hook to auto navigate
  let navigate = useNavigate();

  // removes ther stored jwt when you logout and redirecst to the login page
  const logoutFunc = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    // readymade navbar component taken from official bootstrap website
    <nav
      className="navbar bg-dark navbar-expand-lg bg-body-tertiary"
      data-bs-theme="dark"
    >
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          task-management-system
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">
                home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                about
              </Link>
            </li>
          </ul>
          {!localStorage.getItem("token") ? (
            // if token not found, displays the login/signup button
            <form className="d-flex">
              <Link to="/login" className="btn btn-primary mx-1" role="button">
                login
              </Link>
              <Link to="/signup" className="btn btn-primary mx-1" role="button">
                signup
              </Link>
            </form>
          ) : (
            // if token found, displays the logout option
            <button onClick={logoutFunc} className="btn btn-primary">
              logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
