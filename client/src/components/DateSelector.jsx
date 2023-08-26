import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateSelector = ({ selectedDate }) => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    selectedDate(date.toISOString().slice(0, 10));
  }, []);

  return (
    <DatePicker
      selected={date}
      onChange={d => {
        setDate(d);
        selectedDate(d.toISOString().slice(0, 10));
      }}
      // showIcon
      required
      title='Select Date'
      dateFormat='dd/MM/yyyy'
      placeholderText='dd/MM/yyyy'
      dropdownMode='scroll'
      maxDate={new Date()}
      openToDate={new Date()}
      isClearable={false}
      className='input-info input w-full'
      form='attendance-form'
    />
  );
};

export default DateSelector;
