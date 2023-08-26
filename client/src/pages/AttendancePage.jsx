import { useEffect, useState } from 'react';
import { decodeToken } from 'react-jwt';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import DateSelector from '../components/DateSelector';
import { FETCH_WRAPPER } from '../api';
import { PATHS } from '../router/paths';
import Attendance from '../components/Attendance';
import { useDispatch, useSelector } from 'react-redux';
import { getAttendance } from '../redux/fetchSlice';

const AttendancePage = () => {
  const [date, setDate] = useState('');
  const [desc, setDesc] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const attendance = useSelector(state => state.fetch.attendance);

  useEffect(() => {
    dispatch(getAttendance());
  }, []);

  const selectedDate = d => {
    setDate(d);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = sessionStorage.getItem('authToken');
    const data = {
      date,
      description: desc,
      markedBy: sessionStorage.getItem('email'),
      userId: decodeToken(token).id,
    };

    try {
      const response = await FETCH_WRAPPER.post('attendence/mark', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response);

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Attendance Marked',
        });
        dispatch(getAttendance());
        return navigate(PATHS.createTasks);
      }
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: 'error',
        title: 'Attendance Not Marked',
        text: err.response.data.message,
      });
    }
  };

  return (
    <div className='max-w-full h-[88vh] flex gap-20 justify-center items-center'>
      <div className='w-64 h-[400px]'>
        <h1 className='text-xl md:text-3xl lg:text-4xl font-semibold text-info mb-8 text-center'>
          Attendance
        </h1>
        <form
          id='attendance-form'
          className='flex flex-col gap-4'
        >
          <label htmlFor='dateselector'>Date</label>
          <DateSelector
            id='dateselector'
            selectedDate={selectedDate}
          />
          <label htmlFor=''>Description</label>
          <input
            className='input input-info w-full'
            value={desc}
            onChange={e => setDesc(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className='btn btn-info w-full'
          >
            Mark Attendance
          </button>
        </form>
      </div>
      <div>
        {attendance.length > 0 ? <Attendance attendance={attendance} /> : ''}
      </div>
    </div>
  );
};

export default AttendancePage;
