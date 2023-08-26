import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getTasks } from "../redux/fetchSlice";
import { useDispatch, useSelector } from "react-redux";
import Table from "../components/Table";

const TaskList = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { tasks  , allTasks } = useSelector((state) => state.fetch);

  useEffect(() => {
    if (location.pathname !== "/admin-page/create-task") {
      dispatch(getTasks());
    }
  }, []);

  

  return (
    <div className="z-10">
      <Table type={"employee"} tasks={tasks} allTasks={allTasks} />
    </div>
  );
};

export default TaskList;
