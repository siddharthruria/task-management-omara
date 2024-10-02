import React, { useContext, useEffect } from "react";
import { TaskListContext } from "../context/TaskListContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const TaskLists = () => {
  let navigate = useNavigate();
  const { taskLists, getAllTaskLists } = useContext(TaskListContext);
  const { authToken } = useContext(AuthContext);
  useEffect(() => {
    if (authToken) {
      getAllTaskLists();
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);
  return (
    <div>
      <h1>your task lists</h1>
      {taskLists.length === 0 ? (
        <p>no task lists available</p>
      ) : (
        <>
          <p>task lists available:</p>
          {taskLists.map((taskList) => (
            <p key={taskList._id}>{taskList.name}</p>
          ))}
        </>
      )}
    </div>
  );
};

export default TaskLists;
