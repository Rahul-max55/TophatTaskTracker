import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { GrHomeRounded } from 'react-icons/gr';
import { PATHS } from '../router/paths';
import { getRandomColor } from '../utils';
import { useEffect } from 'react';
const ErrorPage = () => {
  const [hoverState, setHoverState] = useState(false);
  const hoverReference = useRef(null);

  const handleHover = () => {
    setHoverState((previousHoverState) => !previousHoverState);
  };

  useEffect(() => {
    hoverReference.current.style.color = getRandomColor();
  }, [hoverState]);

  return (
    <div className='max-w-screen h-[88vh] flex justify-center items-center bg-base-100'>
      <div
        onMouseLeave={() => handleHover()}
        onMouseEnter={() => handleHover()}
        className={`hover:shadow-2xl transition duration-150 w-1/2 h-1/2 bg-base-300 rounded-xl shadow-lg hover:shadow-neutral-focus`}
      >
        <div className='flex flex-col justify-center items-center w-full h-full gap-4 p-4'>
          <h1
            ref={hoverReference}
            className='text-4xl md:text-5xl lg:text-8xl'
          >
            404 ERROR
          </h1>
          <p className='text-lg md:text-2xl lg:text-4xl'>Page doesnot exist</p>
          <Link
            className='btn w-[18rem] btn-primary hover:bg-primary-focus btn-circle outline-none px-4 py-2 flex  gap-4 '
            to={
              sessionStorage.getItem('accessType') === 'employee'
                ? PATHS.createTasks
                : PATHS.adminPage
            }
          >
            <GrHomeRounded size={24} />
          </Link>
          <span>click to go back to home</span>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
