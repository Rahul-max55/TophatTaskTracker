import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../router/paths';
import { MdOutlineDarkMode } from 'react-icons/md';
import { CiSun } from 'react-icons/ci';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDarkMode } from '../redux/appSlice';
import { logout } from '../redux/authSlice';
import {
  clearAttendance,
  clearList,
  getTasks,
  updateNote,
} from '../redux/fetchSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const [toggleLogout, setToggleLogout] = useState(false);
  const dispatch = useDispatch();
  const userEmail = sessionStorage?.getItem('email');
  const accessType = sessionStorage.getItem('accessType');

  const darkMode = useSelector(x => x.app.darkMode);
  const handleToggle = () => {
    setToggleLogout(previousToggle => !previousToggle);
  };

  const handleLogout = () => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      dispatch(clearList());
      dispatch(clearAttendance());
      dispatch(updateNote([]));
      sessionStorage.clear();
      dispatch(logout());
      navigate(PATHS.root);
    }
    setToggleLogout(prevoiusToggleState => !prevoiusToggleState);
  };

  const handlePageChange = path => {
    setToggleLogout(false);
    // other routes will be added incrementally
    switch (path) {
      case PATHS.taskList:
        return navigate(PATHS.taskList);
      case PATHS.createTasks:
        return navigate(PATHS.createTasks);
      case PATHS.notes:
        return navigate(PATHS.notes);
      case PATHS.adminPage:
        dispatch(getTasks());
        return navigate(PATHS.adminPage);
      case PATHS.attendance:
        return navigate(PATHS.attendance);

      default:
        setToggleLogout(false);
    }
  };

  const handleDarkMode = () => {
    dispatch(toggleDarkMode(!darkMode));
    console.log('DARK MODE TRIGGERED: ');
  };

  return (
    <nav className='relative max-w-screen py-6 bg-base-300 px-4 md:px-6 lg:px-8 border-b-[1px] border-b-info  transition duration-150'>
      <div className='max-w-full mx-auto flex justify-between'>
        <h1>Tasks Logger</h1>
        <span>Welcome {userEmail}</span>
        <div className='flex justify-between items-center gap-4 cursor-pointer'>
          {!darkMode ? (
            <div
              className='tooltip tooltip-left tooltip-primary'
              data-tip='dark mode'
            >
              <MdOutlineDarkMode
                className='animate-spin'
                onClick={() => handleDarkMode()}
                size={24}
              />
            </div>
          ) : (
            <div
              className='tooltip tooltip-left tooltip-primary'
              data-tip='light mode'
            >
              <CiSun
                className='animate-spin'
                onClick={() => handleDarkMode()}
                size={24}
              />
            </div>
          )}
          {sessionStorage.getItem('authToken') && (
            <div
              onClick={() => handleToggle()}
              className='cursor-pointer flex justify-center items-center'
            >
              <BsThreeDotsVertical size={24} />
            </div>
          )}
        </div>
      </div>
      {/* toggle menu */}

      <div>
        {toggleLogout && (
          <aside className='absolute z-50 top-20 rounded-lg right-10 w-[10rem] h-auto p-2 bg-base-300'>
            <div className='w-full flex flex-col gap-2'>
              {accessType === 'admin' ? (
                ''
              ) : (
                <button
                  className='btn btn-info hover:scale-95 transition duration-200 ease-in-out w-full'
                  onClick={() => handlePageChange(PATHS.attendance)}
                >
                  Attendance
                </button>
              )}
              {accessType === 'admin' ? (
                ''
              ) : (
                <button
                  className='btn btn-info hover:scale-95 transition duration-200 ease-in-out w-full'
                  onClick={() => handlePageChange(PATHS.createTasks)}
                >
                  Tasks
                </button>
              )}

              {accessType === 'admin' ? (
                <button
                  onClick={() =>
                    handlePageChange(
                      accessType === 'employee'
                        ? PATHS.taskList
                        : PATHS.adminPage
                    )
                  }
                  className='btn btn-info hover:scale-95 transition duration-200 ease-in-out w-full'
                >
                  {accessType === 'admin' ? 'Admin Panel' : 'Task List'}
                </button>
              ) : (
                ''
              )}
              {accessType === 'admin' ? (
                ''
              ) : (
                <button
                  onClick={() => handlePageChange(PATHS.notes)}
                  className='btn btn-info hover:scale-95 transition duration-200 ease-in-out w-full'
                >
                  Notes
                </button>
              )}
              <button
                onClick={() => handleLogout()}
                className='btn btn-error hover:scale-95 transition duration-200 ease-in-out w-full'
              >
                Logout
              </button>
            </div>
          </aside>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
