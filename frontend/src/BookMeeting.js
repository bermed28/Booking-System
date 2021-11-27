import React, {Component, useState, useEffect} from 'react';
import {Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import {Button, Card, Container, Form, Grid, Modal} from "semantic-ui-react";
import Navbar from "./components/Navbar";
import axios from "axios";
import * as app from "./App";
import {Link} from "react-router-dom";


// Event {
//     title: string,
//         start: Date,
//         end: Date,
//         allDay?: boolean
//     resource?: any,
// }

function BookMeeting(){
    const [meetingInformation, setMeetingInformation] = useState([]);
    const [open, setOpen] = useState(false);
    const localizer = momentLocalizer(moment)

    /**
     * if minutes == 30:
     *      tid = hours * 2 + 2
     * if minutes == 0:
     *      tid = hours * 2 + 1
     */
    function getTID(hours, minutes){
        if(minutes === 30) return hours * 2 + 2;
        else return hours * 2 + 1;
    }

    /**
     * Use to remove duplicate elements from the array
     * const numbers = [2,3,4,4,2,3,3,4,4,5,5,6,6,7,5,32,3,4,5]
     * console.log([...new Set(numbers)]) // [2, 3, 4, 5, 6, 7, 32]
     */
    const [room, setRoom] = useState(""); // hardcoded *fix*
    const [rooms, setRooms] = useState([]);
    const [meetingName, setMeetingName] = useState("");

    const getRooms = () => {
        axios.get(`${app.BackendURL}/StackOverflowersStudios/rooms`).then(res => {
            // console.log(res.data);
            setRooms(res.data);
        })
    }
    useEffect(() => {
        getRooms();
    }, []);

    const bookMeeting = () => {
        if(room != 0) {
            var tempData = localStorage.getItem("login-data");
            const userData = JSON.parse(tempData)

            let date = meetingInformation[0].start.getFullYear()+'-'+(meetingInformation[0].start.getMonth()+1)+'-'+ meetingInformation[0].start.getDate();

            let startTID = getTID(meetingInformation[0].start.getHours(), meetingInformation[0].start.getMinutes());
            let endTID = getTID(meetingInformation[0].end.getHours(), meetingInformation[0].end.getMinutes()) - 1;

            let timeSlot =[];
            for (let i = startTID; i <= endTID; i++) {
                timeSlot.push(i);
            }

            let data = {resday: date, resname: meetingName, rid: parseInt(room), uid: userData.uid, members: [], time_slots: timeSlot};
            console.log(data);

            axios.post(`${app.BackendURL}/StackOverflowersStudios/reservations`,
                data,
                {headers: {'Content-Type': 'application/json'}}//text/plain //application/json
            ).then((response) => {
                console.log(response);
            },(error) => {
                console.log(error);
            });
        }
    }


    return (
        <>
            <Container style={{ height: 800 }}><Calendar
                selectable
                localizer={localizer}
                startAccessor="start"
                events={meetingInformation}
                endAccessor="end"
                views={["month", "day"]}
                defaultDate={Date.now()}
                onSelecting = {(selected) =>{ setMeetingInformation([{
                    'title': 'New Meeting',
                    'start': new Date(selected.start),
                    'end': new Date(selected.end)
                }] ) } }
            >
            </Calendar>
                <Modal centered={false} open={open} onClose={() => setOpen(false)} onOpen={() => setOpen(true)}>
                    <Modal.Header>Book New Meeting</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            <Grid.Column>
                                <Form>
                                    <Form.Input onChange={(e) => {
                                        setMeetingName(e.target.value)
                                    }}
                                                icon='user'
                                                iconPosition='left'
                                                label='Meeting Name'
                                                type='name' />
                                    <Form.Input label='Room'>
                                        <select defaultValue={"0"} style={{textAlign: "center"}} onChange={(e) => {setRoom(e.target.value); {console.log(e.target.value)}}}>
                                            <option key={0} value={"0"}>Select room</option>
                                            {rooms.map(item => {
                                                return (
                                                    <option key={item.rid} value={item.rid}>{item.rname}</option>
                                                )})})}
                                        </select>
                                    </Form.Input>
                                </Form>
                                { room == 0 &&
                                <h3 style={{color: "red"}}>**Please select a valid room.</h3>
                                }
                            </Grid.Column>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={bookMeeting}>Submit</Button>
                    </Modal.Actions>
                </Modal>
                <Container fluid>
                    <Button fluid onClick={() => {setOpen(true)}}> Book Meeting </Button>
                </Container>
            </Container>
        </>
    );


}
export default BookMeeting;
