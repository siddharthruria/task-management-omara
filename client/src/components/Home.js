import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import TaskLists from "./TaskLists";
import Tasks from "./Tasks";

const Home = () => {
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();
  // useEffect(() => {
  //   if (!authToken) {
  //     navigate("/login");
  //   }
  // }, [authToken]);
  return (
    <div className="container my-4">
      <b>
        "sorry did not have enough time to code further. my 24 hours almost ends
        here, as i now have to create a demo video for this project and fill and
        submit the google form as well for the internship.
        <br />
        <br /> i enjoyed building this but am super tired now. thank you for
        giving me the opportunity"
      </b>
      <TaskLists />
      <Tasks />
    </div>
  );
};

export default Home;
