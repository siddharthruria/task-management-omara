import React, { createContext, useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export const TaskContext = createContext();

const TaskProvider = ({ children }) => {
  const { authToken } = useContext(AuthContext);
  const [tasks, setTasks] = useState();
  const getAllTasks = async (id) => {
    const response = await fetch(`http://localhost:5555/api/tasks/list/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": authToken,
      },
    });
    const data = response.json();
    setTasks(data);
  };
  return (
    <TaskContext.Provider value={{ tasks, getAllTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskProvider;
