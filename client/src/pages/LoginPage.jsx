import { useSelector, useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../router/paths';
import { FETCH_WRAPPER } from '../api';
import { useEffect, useState } from 'react';

function Login() {
  const [loginerror, setLoginError] = useState('');

  const navigate = useNavigate();
  const schema = yup.object({
    email: yup.string().email().required('email is required'),
    password: yup
      .string()
      .min(4, 'minimum characters should be 4')
      .required('password is required'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async data => {
    try {
      const response = await FETCH_WRAPPER.post('auth/login', data);
      const userData = {
        email: response.data.user.email,
        token: response.data.token,
        accessType: response.data.user.accessType,
      };
      console.log('LOGIN FORM DATA: ', userData);
      sessionStorage.setItem('authToken', userData.token);
      sessionStorage.setItem('email', userData.email);
      sessionStorage.setItem('accessType', userData.accessType);
      dispatch(login(userData));
      if (userData.accessType === 'admin') navigate(PATHS.adminPage);
      else navigate(PATHS.createTasks);
    } catch (err) {
      setLoginError(err.response?.data.msg)
    }
  };

  console.log(loginerror);

  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector(state => state.auth);

  return (
    <>
      <div className='max-w-screen h-[88vh] flex justify-center items-center bg-base-50'>
        <div className='w-1/3 h-auto bg-base-200 rounded-lg p-4 shadow-md hover:shadow-2xl hover:shadow-info shadow-info transition-all ease-out duration-800'>
          <h1 className='text-4xl text-center py-4 text-info font-semibold'>
            TASK LOGS LOGIN
          </h1>
          <div className='w-full flex flex-col gap-4 p-4'>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-col gap-4'
            >
              <label htmlFor='email'>Email</label>
              <input
                id='email'
                name='email'
                defaultValue={'test1@abc.com'}
                {...register('email')}
                type='email'
                className='input-info input w-full'
              />
              <p className='text-rose-600 font-semibold'>
                {errors.email?.message}
              </p>
              <label htmlFor='password'>Password</label>
              <input
                {...register('password')}
                type='password'
                id='password'
                className='input-info input w-full'
              />
              <p className='text-rose-600 font-semibold'>
                {errors.password?.message}
              </p>
              <p className='text-rose-600 font-semibold'>{loginerror}</p>
              <button className='btn btn-info hover:text-3xl transition-all ease-in-out duration-800'>
                LOGIN
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
