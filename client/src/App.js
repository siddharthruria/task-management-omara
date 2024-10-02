import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AuthProvider from "./context/AuthContext";
import TaskListProvider from "./context/TaskListContext";
import TaskProvider from "./context/TaskContext";

const App = () => {
  return (
    <>
      <Router>
        <AuthProvider>
          <TaskListProvider>
            <TaskProvider>
              <Navbar />
              <div className="container">
                <Routes>
                  <Route exact path="/" element={<Home />} />
                  <Route exact path="/about" element={<About />} />
                  <Route exact path="/login" element={<Login />} />
                  <Route exact path="/signup" element={<Signup />} />
                </Routes>
              </div>
            </TaskProvider>
          </TaskListProvider>
        </AuthProvider>
      </Router>
    </>
  );
};

export default App;
