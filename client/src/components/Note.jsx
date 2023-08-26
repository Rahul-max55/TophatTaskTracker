import React, { useState } from "react";
import { FETCH_WRAPPER } from "../api";
import { editNote, getNotes, updateNote } from "../redux/fetchSlice";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { MdOutlineDelete } from "react-icons/md";
import { FiEdit3 } from "react-icons/fi";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { IoIosCloseCircle } from "react-icons/io";

const Note = ({ val }) => {
  const { title, description, createdAt, image } = val;

  const [isEdit, setIsEdit] = useState(false);
  const [editVal, seteditVal] = useState({ title, description });
  const [cardAlert, setCardAlert] = useState("");
  const { notes } = useSelector((store) => store.fetch);
  const dispatch = useDispatch();

  // onChange
  const handleChange = (e) => {
    const { name, value } = e.target;
    seteditVal({ ...editVal, [name]: value });
  };

  // edit details
  const editNotes = async (id) => {
    try {
      if (
        !editVal.title ||
        !editVal.description ||
        !/[a-z0-9A-Z]/.test(editVal.title)
      ) {
        setCardAlert("Please fill all the fields");
        return "";
      }
      const token = sessionStorage.getItem("authToken");
      const response = await FETCH_WRAPPER.put(`notes/${id}`, editVal, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response) {
        dispatch(getNotes());
        setIsEdit(!isEdit);
      }
      setCardAlert("");
    } catch (err) {
      console.log(err);
    }
  };

  // Delete the Note
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "red",
      cancelButtonColor: "purple",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.value) {
        try {
          const token = sessionStorage.getItem("authToken");
          const response = await FETCH_WRAPPER.delete(`notes/${id}`, editVal, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log(response);
          if (response) {
            const filteredNotes = notes.filter((v) => v._id !== id);
            dispatch(updateNote(filteredNotes));
          }
          Swal.fire({
            icon: "success",
            title: "task deleted successfully",
          });
        } catch (err) {
          console.log(err);
        }
      } else {
        Swal("Task is not deleted");
      }
    });
  };

  return (
    // edit modal
    <div className="card min-w-[20vw] max-w-[20vw] h-auto rounded-xl bg-base-300 shadow-xl hover:shadow-2xl transition ease-in duration-200 cursor-pointer hover:scale-105">
      {cardAlert && (
        <p className="text-rose-600 font-semibold px-2 pt-2 text-center">
          {cardAlert}
        </p>
      )}{" "}
      <div className="card-body">
        {isEdit ? (
          <input
            type="text"
            name="title"
            className=" p-4 input input-sm"
            onChange={handleChange}
            value={editVal.title}
            id="title"
            placeholder="title"
          />
        ) : (
          <div>
            <h2 className="card-title text-info">{title}</h2>
            <hr className=" mt-5 border-primary border" />
          </div>
        )}

        {isEdit ? (
          <input
            type="text"
            name="description"
            className="p-4 input input-sm"
            onChange={handleChange}
            value={editVal.description}
            id="description"
            placeholder="description"
          />
        ) : (
          <p className="my-2">{description}</p>
        )}

        {/* image file */}
        <div className="justify-between flex items-center">
          {image ? (
            <div className="badge badge-outline">
              <a className="overflow-hidden" href={image} target="_blank">
                Image Added
              </a>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="w-full flex justify-start py-2">
          <div className=" w-auto transition ease-in-out duration-300 card-actions justify-between px-4 py-4 rounded-full bg-base-100 ">
            {isEdit ? (
              <>
                <div
                  className="tooltip tooltip-left tooltip-primary"
                  data-tip="save changes"
                >
                  <button
                    className="btn flex-1 btn-info btn-circle hover:shadow-lg hover:shadow-info"
                    onClick={() => editNotes(val._id)}
                  >
                    <IoCheckmarkDoneCircleSharp size={20} />
                  </button>
                </div>
                <div
                  className="tooltip tooltip-bottom tooltip-primary"
                  data-tip="close edit mode"
                >
                  <button
                    className="btn flex-1 btn-primary btn-circle hover:shadow-lg hover:shadow-primary"
                    onClick={() => (setIsEdit(!isEdit), setCardAlert(""))}
                  >
                    <IoIosCloseCircle size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="tooltip tooltip-left" data-tip="edit">
                <button
                  className="btn btn-warning btn-circle hover:shadow-lg hover:shadow-warning "
                  onClick={() => setIsEdit(!isEdit)}
                >
                  <FiEdit3 size={20} />
                </button>
              </div>
            )}

            <div className="tooltip tooltip-right" data-tip="delete">
              <button
                className="btn btn-error btn-circle hover:shadow-lg hover:shadow-error"
                onClick={() => handleDelete(val._id)}
              >
                <MdOutlineDelete size={20} />
              </button>
            </div>
          </div>
        </div>
        <div className="badge badge-secondary badge-outline ml-4">
          {new Date(createdAt).toDateString().slice(4)}
        </div>
      </div>
    </div>
  );
};

export default Note;
