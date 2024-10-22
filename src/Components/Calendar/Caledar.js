// CalendarComponent.js
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import ApiConnetion from '../Api/ApiConfig.js'
const URLConnetion = ApiConnetion()
const CalendarComponent = () => {
    const [date, setDate] = useState(new Date());
    const [appointmentDates, setAppointmentDates] = useState([]);
    const today = new Date();
    useEffect(() => {
      // Fetch appointment dates
      axios.get(`${URLConnetion}/dates/mas/date`)
        .then(response => {
          // Assuming the API returns an array of date strings
          const dates = response.data.map(dateStr => new Date(dateStr));
          setAppointmentDates(dates);
        })
        .catch(error => {
          console.error('Error fetching appointment dates:', error);
        });
    }, []);
  
    // Function to check if a date has an appointment
    const isAppointmentDate = (date) => {
      return appointmentDates.some(appointmentDate => 
        appointmentDate.toDateString() === date.toDateString()
      );
    };
  
    return (
      <Calendar
        onChange={setDate}
        value={date}
        tileClassName={({ date, view }) => view === 'month' && isAppointmentDate(date) ? 'highlight' : null}
        minDate={today}
      />
    );
  };
  
  export default CalendarComponent;
