import React, { useEffect, useState } from "react";
import { Calendar, DateObject } from "react-multi-date-picker";
import "react-multi-date-picker/styles/layouts/mobile.css";
import DatePanel from "react-multi-date-picker/plugins/date_panel";

const Attendance = ({ attendance }) => {
  const [dates, setDates] = useState(new DateObject());
  const [showDesc, setShowDesc] = useState(false);
  const [desc, setDesc] = useState("");

  useEffect(() => {
    const temp = [];
    attendance.map((item) => {
      temp.push(new DateObject(item.date, "DD-MM-YYYY"));
    });
    setDates(temp);
  }, []);

  return (
    <>
      <div className="h-[400px]">
        <Calendar
          value={dates}
          showOtherDays={true}
          months={new DateObject().months.map((month) => month.shortName)}
          onChange={() => {
            const temp = [];
            attendance.map((item) => {
              temp.push(new DateObject(item.date));
            });
            setDates(temp);
          }}
          monthYearSeparator={"|"}
          highlightToday={false}
          maxDate={new DateObject()}
          className="rmdp-mobile"
          plugins={[
            <DatePanel
              sort={"date"}
              removeButton={false}
              header="Attendances"
              markFocused={true}
              focusedClassName="bg-green"
              onClickDate={(day) => {
                const selected = attendance.filter((item) => {
                  return day.format("YYYY-MM-DD") === item.date;
                })[0];
                selected.description
                  ? (setShowDesc(true), setDesc(selected.description))
                  : setShowDesc(false);
                return { style: { backgroundColor: "green" } };
              }}
            />,
          ]}
        />
        {showDesc ? (
          <div className="bg-blue-200 rounded mt-1">
            <span className="font-bold m-2" >Description:</span>
            <span>{desc}</span>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Attendance;
