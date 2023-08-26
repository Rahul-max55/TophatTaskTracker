import React, { useEffect, useState } from "react";

function Timer({ start, end, pause, resume, timer, setTimer }) {
  useEffect(() => {
    const timeout = setTimeout(() => setTimer(timer + 1), 1000);
    if (end || pause) {
      clearTimeout(timeout);
    }
  }, [timer, resume]);

  const renderTimeTaken = (end, start) => {
    const timeTaken = (new Date(end) - new Date(start)) / 1000;
    return `${parseInt(timeTaken / 60 / 60)} hrs-${
      parseInt(timeTaken / 60) % 60
    } mins-${parseInt(timeTaken) % 60} secs`;
  };

  const renderDate = () => {
    return new Date(end).toLocaleDateString();
  };

  return (
    <>
      {start && !end
        ? `${parseInt(timer / 60 / 60)} : ${parseInt(timer / 60) % 60} : ${
            timer % 60
          }`
        : ""}
      {!start && end ? renderDate() : ""}
      {start && end ? <>{renderTimeTaken(end, start)}</> : ""}
    </>
  );
}

export default Timer;
