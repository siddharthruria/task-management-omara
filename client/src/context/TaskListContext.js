import React, { createContext, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const TaskListContext = createContext();

const TaskListProvider = ({ children }) => {
  const { authToken } = useContext(AuthContext);
  const [taskLists, setTaskLists] = useState([]);

  const getAllTaskLists = async () => {
    const response = await fetch("http://localhost:5555/api/taskLists/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": authToken,
      },
    });

    const data = await response.json();
    setTaskLists(data);
  };

  return (
    <TaskListContext.Provider value={{getAllTaskLists, taskLists}}>
      {children}
    </TaskListContext.Provider>
  );
};

export default TaskListProvider;
