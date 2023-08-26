import React, { useEffect } from "react";
import { Note } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { getNotes } from "../redux/fetchSlice";


const NotesListPage = () => {
  const addNote = useSelector((store) => store.fetch);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getNotes());
  }, []);


  return (
    <div className="w-screen h-auto">
      <h1 className="py-8 text-4xl text-center">Notes List</h1>
      <div className="p-8 w-full h-full flex flex-wrap gap-6 justify-center">
        {addNote.notes?.map((val) => {
          return <Note key={val._id} val={val} />;
        })}
      </div>
    </div>
  );
};

export default NotesListPage;
