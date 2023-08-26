import React, { useState } from 'react';
import { useEffect } from 'react';
import { ImListNumbered } from 'react-icons/im';
import { MdAssignmentAdd } from 'react-icons/md';
import { BsCalendarDate } from 'react-icons/bs';
import { useSelector, useDispatch } from 'react-redux';
import { getTasks, updateList } from '../redux/fetchSlice';
import { PATHS } from '../router/paths';
import { useNavigate } from 'react-router-dom';
import Table from '../components/Table';

const AdminPage = () => {
  const { tasks } = useSelector((state) => state.fetch);
  console.log(tasks);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [emailSearch, setEmailSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    dispatch(getTasks());
  }, []);

  useEffect(() => {
    if (emailSearch === '') {
      const filteredKeys = Object.keys(tasks).filter((item) =>
        item.includes(emailSearch)
      );

      const array = [];

      for (let i = 0; i < filteredKeys.length; i++) {
        const taskDetails = tasks[filteredKeys[i]];
        console.log(`Task details of ${filteredKeys[i]} >>> `, taskDetails);
        const name = filteredKeys[i];
        const obj = {
          email: name,
          tasks: taskDetails,
        };
        array.push(obj);
      }

      setFilteredData(array);
    } else {
      const filteredKeys = Object.keys(tasks).filter((item) =>
        item.includes(emailSearch)
      );
      console.log(filteredKeys);

      const array = [];

      for (let i = 0; i < filteredKeys.length; i++) {
        const taskDetails = tasks[filteredKeys[i]];
        console.log(`Task details of ${filteredKeys[i]} >>> `, taskDetails);
        const name = filteredKeys[i];
        const obj = {
          email: name,
          tasks: taskDetails,
        };
        array.push(obj);
      }

      setFilteredData(array);
    }
  }, [emailSearch, tasks]);

  console.log('FILTER DATA', filteredData);

  const renderTime = (time) => {
    if (isNaN(time)) {
      return;
    }
    return `${parseInt(time / 60 / 60)} : ${parseInt(time / 60) % 60} : ${
      parseInt(time) % 60
    }`;
  };

  const getTotalTime = (userEmail) => {
    try {
      const userTasks = tasks[userEmail];
      const totalTime = userTasks.reduce((total, task) => {
        if (task.start && task.end) {
          const timeTaken = (new Date(task.end) - new Date(task.start)) / 1000;
          return total + timeTaken;
        }
        return total;
      }, 0);
      return renderTime(totalTime);
    } catch (err) {
      return '';
    }
  };

  const renderTable = () => {
    return (
      <div className='overflow-x-auto'>
        <div className='float-right ml-2'>
          <input
            type='text'
            className='p-2 m-2 rounded-md outline-none'
            value={emailSearch}
            onChange={(e) => setEmailSearch(e.target.value)}
            placeholder='Search by Email'
          />
        </div>
        <table className='table table-zebra w-full'>
          {/* head */}
          <thead>
            <tr>
              <th>S no.</th>
              <th>employee email</th>
              <th>tasks</th>
              <th>Attendance</th>
              <th>Task Assignment</th>
              <th>time taken</th>
            </tr>
          </thead>
          <tbody>
            {filteredData?.map((userEmail, index) => {
              console.log(userEmail);
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{userEmail.email}</td>
                  <td>
                    <button
                      onClick={() => {
                        dispatch(updateList(tasks[userEmail.email]));
                        return navigate(PATHS.adminPage + PATHS.taskList);
                      }}
                      className='btn btn-accent btn-circle'
                    >
                      <ImListNumbered />
                    </button>
                  </td>
                  <td>
                    <button
                      className='btn btn-primary btn-square'
                      onClick={() => navigate(PATHS.attendance)}
                    >
                      <BsCalendarDate />
                    </button>
                  </td>
                  <td>
                    <button
                      className='btn btn-secondary btn-circle'
                      onClick={() => (
                        sessionStorage.setItem('assignTask', userEmail.email),
                        navigate(PATHS.createTasks)
                      )}
                    >
                      <MdAssignmentAdd />
                    </button>
                  </td>
                  <td>{getTotalTime(userEmail.email)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      {/* {renderTable()} */}
      <input
        type='text'
        className='p-2 m-2 rounded-md outline-none'
        value={emailSearch}
        onChange={(e) => setEmailSearch(e.target.value)}
        placeholder='Search by Email'
      />
      <Table
        type={'admin'}
        tasks={filteredData}
      />
    </>
  );
};

export default AdminPage;
