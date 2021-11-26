import React, {Component, useState, useEffect, useCallback} from 'react';
import {Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import {Button, Card, Container, Modal} from "semantic-ui-react";
import Navbar from "./components/Navbar";
import axios from "axios";
const app = require("./App");

const dummyEvents = [

    {
        title: "CIIC4060",
        start: new Date(2021, 10, 24),
        end: new Date(2021, 10, 24),
        allDay: false,
    },

    {
        title: "CIIC4050",
        start: new Date(2021, 10, 24),
        end: new Date(2021, 10, 24),
        allDay: false,
    },

    {
        title: "CIIC5045",
        start: new Date(2021, 11, 24, 12, 30, 0),
        end: new Date(2021, 11, 24, 13, 45, 0),
        allDay: false,
    }

];

const months = {
    'Jan' : '01',
    'Feb' : '02',
    'Mar' : '03',
    'Apr' : '04',
    'May' : '05',
    'Jun' : '06',
    'Jul' : '07',
    'Aug' : '08',
    'Sep' : '09',
    'Oct' : '10',
    'Nov' : '11',
    'Dec' : '12'
}

/**
 * Meeting Object received from request:
 *
 * meeting = {
 *     resname: str,
 *     resday: str representing a date (Fri, 01 Jan 2021 00:00:00 GMT)
 *     timeSlots: [startTimeSlot, endTimeSlot] in format [HH:MM:SS, HH:MM:SS]
 * }
 *
 * Event Object:
 *
 *  Event {
 *    title: string,
 *    start: Date,
 *    end: Date,
 *    allDay?: boolean
 *    resource?: any
 *  }
 */
function Schedule(){
    const [open, setOpen] = useState(false);
    const[meetings, setMeetings] = useState([]);
    const localizer = momentLocalizer(moment)
    const loginData = localStorage.getItem('login-data');
    const data = JSON.parse(loginData);

    const fetchData = async () =>{
        axios.get(`${app.BackendURL}/StackOverflowersStudios/userReservations/${data.uid}`, {
            headers: {'Content-Type': 'application/json' }})
            .then(
                (response) => {
                    let fetchedMeetings = []
                    for(let meeting of response.data){
                        let tempDate = meeting.resday.split(', ')[1].split(" ");
                        const timeSlots = meeting.timeSlots;
                        const tempStart = timeSlots[0].split(":");
                        const tempEnd = timeSlots[1].split(":");
                        const startDate = new Date(tempDate[2],
                                        months[tempDate[1]] - 1,
                                        tempDate[0],
                                        parseInt(tempStart[0]),
                                        parseInt(tempStart[1]),
                                        parseInt(tempStart[2]));

                        const endDate = new Date(tempDate[2],
                                        months[tempDate[1]] - 1,
                                        tempDate[0],
                                        parseInt(tempEnd[0]),
                                        parseInt(tempEnd[1]),
                                        parseInt(tempEnd[2]));

                        const temp = {title: meeting.resname, start: startDate, end: endDate};
                        fetchedMeetings.push(temp)
                    }
                    setMeetings(fetchedMeetings);
                    console.log(meetings)
                }, (error) => {
                    console.log(error);
                }
            );
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <>
            <Container style={{ height: 800, margin: "50px"}}>
                <Calendar localizer={localizer}
                          startAccessor="start"
                          events={meetings}
                          endAccessor="end"
                          views={["month", "day"]}
                          defaultDate={Date.now()}
                />
            </Container>
        </>
    );


}
export default Schedule;
