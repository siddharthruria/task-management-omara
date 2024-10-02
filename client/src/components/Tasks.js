import React, { useContext, useEffect } from "react";
import { TaskContext } from "../context/TaskContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Tasks = () => {
  let navigate = useNavigate();
  const { tasks, getAllTasks } = useContext(TaskContext);
  const { authToken } = useContext(AuthContext);
  useEffect(() => {
    if (authToken) {
      getAllTasks();
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);
  return (
    <div>
      <h1>your tasks</h1>
      {tasks.length === 0 ? (
        <p>no tasks available</p>
      ) : (
        <>
          <p>tasks available:</p>
          {tasks.map((task) => (
            <p key={task._id}>{task.title}</p>
          ))}
        </>
      )}
    </div>
  );
};

export default Tasks;
