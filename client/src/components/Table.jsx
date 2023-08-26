import { ImListNumbered } from "react-icons/im";
import { BsCalendarDate, BsFillArrowDownCircleFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAttendance, updateList } from "../redux/fetchSlice";
import { PATHS } from "../router/paths";
import Task from "./Task";
import React, { useEffect, useState } from "react";

const Table = ({ type, tasks, allTasks }) => {
  const [height, setHeight] = useState({ h: 0, r: 0 });
  const [checkboxVal, setCheckboxVal] = useState([]);
  const [descriptionSearch, setDescriptionSearch] = useState("");

  const handleChange = (e) => {
    if (checkboxVal.includes(e.target.value)) {
      const update = checkboxVal.filter((val, index) => val !== e.target.value);
      setCheckboxVal([...update]);
      return;
    }
    setCheckboxVal([...checkboxVal, e.target.value]);
  };

  const accessType = sessionStorage.getItem("accessType");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // search by description

  useEffect(() => {
    // console.log("descriptionSearch");

    // if (checkboxVal.length === 0) {
    //   setAllTask(allTask);
    //   return;
    // }

    if (
      !/[A-Za-z0-9]/.test(descriptionSearch) ||
      descriptionSearch.length === 0
    ) {
      // setAllTask(tasks);
      dispatch(updateList(allTasks));
      return;
    }

    const updated = allTasks.filter((v) => {
      if (v.description.includes(descriptionSearch)) return v;
    });

    dispatch(updateList(updated));
  }, [descriptionSearch]);

  // =========
  useEffect(() => {
    setDescriptionSearch("");
    if (
      (checkboxVal.includes("notcompleted") &&
        checkboxVal.includes("completed")) ||
      checkboxVal.length === 0
    ) {
      console.log(tasks);
      dispatch(updateList(allTasks));
      return;
    }

    if (checkboxVal.includes("completed")) {
      const updated = allTasks.filter((v) => (v.end ? v : ""));
      updated.length === 0 ? "" : dispatch(updateList(updated));
      return;
    }

    if (checkboxVal.includes("notcompleted")) {
      const updated = allTasks.filter((v) => (v.end ? "" : v));
      updated.length === 0 ? "" : dispatch(updateList(updated));
      return;
    }
  }, [checkboxVal]);
  // ==========

  const renderTime = (time) => {
    if (isNaN(time)) {
      return;
    }
    return `${parseInt(time / 60 / 60)} : ${parseInt(time / 60) % 60} : ${
      parseInt(time) % 60
    }`;
  };

  const getTotalTime = (task) => {
    try {
      const totalTime = task.tasks.reduce((total, task) => {
        if (task.start && task.end) {
          const timeTaken = (new Date(task.end) - new Date(task.start)) / 1000;
          return total + timeTaken;
        }
        return total;
      }, 0);
      return renderTime(totalTime);
    } catch (err) {
      return "";
    }
  };

  return (
    <div className="overflow-x-auto">
      {type === "admin" ? (
        ""
      ) : (
        <div className="float-left ml-2">
          <input
            type="text"
            className="p-2 m-2 rounded-md outline-none"
            value={descriptionSearch}
            onChange={(e) => setDescriptionSearch(e.target.value)}
            placeholder="Search by Email"
          />
        </div>
      )}
      <table className="table table-zebra w-full">
        {/* Table Headers */}
        <thead>
          {type === "employee" ? (
            <tr>
              <th>Sr. No.</th>
              <th>Task Description</th>
              <th className="flex relative">
                Status
                {/* DropDown */}
                <BsFillArrowDownCircleFill
                  className={`text-lg mx-2 rotate-${height.r} transition-all `}
                  onClick={() => {
                    height.h === 0
                      ? setHeight({ h: 20, r: 180 })
                      : setHeight({ h: 0, r: 0 });
                  }}
                />
                <div
                  className={`absolute transition-all top-12 w-40 h-${height.h} overflow-hidden rounded-lg bg-[#3ABFF8]`}
                >
                  <form className="flex flex-col items-start justify-between">
                    <label htmlFor="completed" className="p-2">
                      <input
                        type="checkbox"
                        name="completed"
                        id="completed"
                        value="completed"
                        className="mx-2"
                        onChange={handleChange}
                      />
                      Completed
                    </label>
                    <label htmlFor="notcompleted" className="p-2">
                      <input
                        type="checkbox"
                        name="notcompleted"
                        value="notcompleted"
                        id="notcompleted"
                        className="mx-2"
                        onChange={handleChange}
                      />
                      Not Completed
                    </label>
                  </form>
                </div>
                {/* DropDown */}
              </th>
              <th>Date</th>
              {accessType === "employee" ? <th>controls</th> : ""}
              <th>Options</th>
            </tr>
          ) : (
            <tr>
              <th>S no.</th>
              <th>employee email</th>
              <th>Attendance</th>
              <th>Tasks</th>
              <th>time taken</th>
            </tr>
          )}
        </thead>
        {/* Table Body */}

        <tbody>
          <>
            {type === "employee"
              ? tasks?.map((task, index) => {
                  return (
                    <Task
                      key={task._id}
                      index={index}
                      description={task.description}
                      status={task.status}
                      id={task._id}
                      start={task?.start}
                      end={task?.end}
                      pause={task?.pause}
                      breaks={task?.breaks}
                      resume={task?.resume}
                    />
                  );
                })
              : ""}
          </>
          <>
            {type === "admin"
              ? tasks?.map((task, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{task.email}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-square"
                          onClick={() => {
                            sessionStorage.setItem("assignTask", task.email);
                            dispatch(getAttendance());
                            navigate(PATHS.attendance);
                          }}
                        >
                          <BsCalendarDate />
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            sessionStorage.setItem("assignTask", task.email);
                            dispatch(updateList(task.tasks));
                            navigate(PATHS.adminPage + PATHS.createTasks);
                          }}
                          className="btn btn-accent btn-circle"
                        >
                          <ImListNumbered />
                        </button>
                      </td>
                      <td>{getTotalTime(task)}</td>
                    </tr>
                  );
                })
              : ""}
          </>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
