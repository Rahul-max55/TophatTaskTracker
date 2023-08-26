import { useState } from "react";
import { GrEdit, GrTrash } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import { getTasks, updateList } from "../redux/fetchSlice";
import { FETCH_WRAPPER } from "../api";
import Timer from "./Timer";
import Swal from "sweetalert2";

function Task({
  description,
  id,
  start,
  end,
  pause = false,
  breaks,
  index,
  resume,
}) {
  const { tasks } = useSelector((state) => state.fetch);
  const [isEdit, setIsEdit] = useState(false);
  const [breakTime, setBreakTime] = useState(0);
  const [disableStop, setDisableStop] = useState(false);
  const [desc, setDesc] = useState(description);
  const [validDes, setValidDes] = useState("");
  const accessType = sessionStorage.getItem("accessType");
  const token = sessionStorage.getItem("authToken");

  const dispatch = useDispatch();

  const currentTimer = parseInt((Date.now() - new Date(start)) / 1000);
  const [timer, setTimer] = useState(currentTimer);

  // Edit the task
  async function editTask() {
    if (!desc || !/[a-zA-Z0-9]/.test(desc)) {
      setValidDes("please enter some value");
      return;
    }

    const data = {
      description: desc,
    };
    const response = await FETCH_WRAPPER.put(`tasks/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data.status === true) {
      setValidDes("");
      setIsEdit(!isEdit);
    } else {
      alert("Task description not changed");
    }
  }

  // delete the task
  async function deleteTask() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.value) {
        const response = await FETCH_WRAPPER.delete(`tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          if (accessType === "admin") {
            dispatch(updateList(tasks.filter((task) => task._id !== id)));
          } else {
            dispatch(getTasks());
          }
          Swal.fire({
            icon: "success",
            title: "task deleted successfully",
          });
        }
      } else {
        Swal("Task is not deleted");
      }
    });
  }

  // start the task
  async function startTask() {
    setDisableStop(true);
    const start = Date.now();
    const data = {
      start,
    };
    const response = await FETCH_WRAPPER.put(`tasks/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data.status === true) {
      dispatch(getTasks());
    }
  }

  // End the task
  async function endTask() {
    const end = Date.now();

    const taskTime = new Date(end) - new Date(breakSum);
    console.log(new Date(breakSum));

    const data = {
      end: new Date(taskTime),
    };

    const response = await FETCH_WRAPPER.put(`tasks/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.status === true) {
      dispatch(getTasks());
    }
  }

  //Pause or Resume the task
  async function pauseOrResumeTask() {
    const NOW = new Date();
    const pauseTime = pause ? null : NOW;
    const resumeTime = pause ? NOW : null;

    const breakSum = breaks.reduce((total, val) => {
      return total + val;
    }, 0);

    if (!pause) {
      let withoutBreak = new Date(start) - new Date(pause) - breakSum;
      withoutBreak = parseInt(withoutBreak / 1000);
      console.log(withoutBreak);
      setTimer(withoutBreak);
    }

    try {
      const response = await FETCH_WRAPPER.put(
        `tasks/${id}`,
        { pause: pauseTime, resume: resumeTime },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response) {
        alert("pause not working");
      }

      dispatch(getTasks());
      return;
    } catch (err) {
      console.log("PAUSE ERROR", err);
    }
  }

  // handle edit button functionlity
  const handleEdit = () => {
    if (!desc || !/[a-zA-Z0-9]/.test(desc)) {
      setValidDes("please enter some value");
      return;
    }
    setIsEdit(!isEdit);
  };

  // console.log(tasks);

  return (
    <tr>
      <th className="w-2">{index + 1}</th>
      {isEdit ? (
        <>
          <td className="w-10 max-w-[200px] overflow-auto whitespace-nowrap">
            <input
              className="input max-w-[200px] relative input-bordered input-sm"
              type="text"
              value={desc}
              placeholder={validDes}
              onChange={(e) => setDesc(e.target.value)}
            />
            <button
              onClick={editTask}
              className="btn border-2 btn-info btn-sm absolute mx-2"
            >
              Change Description
            </button>
          </td>
        </>
      ) : (
        <>
          <td className="w-10 max-w-[200px] relative overflow-auto whitespace-nowrap">
            {desc}
          </td>
        </>
      )}
      <td className="w-[200px] max-w-xs ">
        {!start && !end ? "Not Yet Started" : ""}
        {start ? (
          <Timer
            start={start}
            end={end}
            pause={pause}
            resume={resume}
            timer={timer}
            setTimer={setTimer}
          />
        ) : (
          ""
        )}
      </td>
      {/* new Date column added */}
      <td className="w-20">
        {!end ? "Task not Completed" : ""}
        {start ? <Timer end={end} timer={timer} setTimer={setTimer} /> : ""}
      </td>
      {/* new Date column ended */}
      {accessType === "employee" ? (
        <td className="w-10">
          {start && end ? (
            "Task Completed"
          ) : (
            <div className="flex gap-4">
              <button
                disabled={start}
                className="btn btn-success btn-sm"
                onClick={startTask}
              >
                Start
              </button>
              <button
                disabled={!start}
                className={`btn btn-sm ${pause ? "btn-info" : "btn-warning"}`}
                onClick={pauseOrResumeTask}
              >
                {pause ? "Resume" : "Pause"}
              </button>
              <button
                disabled={!start}
                className="btn btn-error btn-sm"
                onClick={endTask}
              >
                Stop
              </button>
            </div>
          )}
        </td>
      ) : (
        ""
      )}

      <td className="w-10">
        <button className="btn btn-info btn-sm" onClick={handleEdit}>
          <GrEdit />
        </button>
        <button className="btn btn-error ml-4 btn-sm" onClick={deleteTask}>
          <GrTrash />
        </button>
      </td>
    </tr>
  );
}

export default Task;
