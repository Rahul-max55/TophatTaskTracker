import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FETCH_WRAPPER } from "../api";
import Swal from "sweetalert2";
import NotesListPage from "./NotesListPage";
import { getNotes } from "../redux/fetchSlice";
import { useDispatch } from "react-redux";

const NotesPage = () => {
  const dispatch = useDispatch();
  const [img, setImg] = useState({ status: true, file: "" });
  const formData = new FormData();
  const notesSchema = yup.object({
    title: yup
      .string()
      .max(25, "Title cannot be more than 25 characters!")
      .required("Title cannot be left empty"),
    description: yup.string().required("Description cannot be an empty field!"),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(notesSchema),
  });

  // submit
  const onSubmit = async (data) => {
    console.log(img.file);

    if (!img.status) {
      alert(
        'please select a img ex-("jpg", "jpeg", "jfif", "pjpeg", "pjp", "png")'
      );
      return "";
    }

    const createdUser = sessionStorage.getItem("email");

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("createdUser", createdUser);
    formData.append("fileUrl", img.file);

    try {
      data["createdUser"] = sessionStorage.getItem("email");
      const response = FETCH_WRAPPER.post("/notes", formData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
      });
      Swal.fire({
        icon: "success",
        title: "Note created successfully",
      }).then(() => {return dispatch(getNotes())});
      reset();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.message,
      });
      console.log(error);
    }
  };

  // validate File
  const validateFile = (e) => {
    const val = e.target.value;
    const value = e.target.files[0];
    const index = val.lastIndexOf(".");
    const extention = val.slice(index + 1, val.length).toLowerCase();
    const bool = ["jpg", "jpeg", "jfif", "pjpeg", "pjp", "png", " "].includes(
      extention
    );
    if (bool) {
      setImg({ status: true, file: value });
    } else {
      setImg({ status: false, file: "" });
    }
  };

  return (
    <>
      <div className="max-w-screen h-[88vh]">
        <form
          className="w-full h-full flex flex-col gap-4 justify-center items-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="text-xl md:text-3xl lg:text-4xl font-semibold text-info mb-8 text-center">
            Create Note
          </h1>
          <input
            {...register("title")}
            name="title"
            placeholder="Enter Title"
            className="input input-info w-1/4"
            type="text"
          />
          <p className="text-rose-500">{errors.title?.message}</p>
          <input
            {...register("description")}
            name="description"
            placeholder="Enter Description"
            className="input input-info w-1/4"
            type="text"
          />

          <label
            htmlFor="file"
            className="btn btn-outline rounded-full w-1/4 mt-3"
          >
            <input
              type="file"
              id="file"
              name="image"
              placeholder="Choose File"
              className="file:cursor-pointer file:bg-primary file:px-4 file:py-3 file:border-none rounded-full"
              accept="image/*"
              onChange={validateFile}
            />
          </label>
          <p className="text-rose-500">{errors.description?.message}</p>
          <button className="btn btn-secondary w-1/4">Submit</button>
        </form>
      </div>

      <NotesListPage />
    </>
  );
};

export default NotesPage;
