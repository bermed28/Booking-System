import React, {Component, useState} from 'react';
import {Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import {Button, Card, Container, Form, Grid, Modal} from "semantic-ui-react";
import Navbar from "./components/Navbar";


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
    const [room, setRoom] = useState("");
    const [emailReg, setEmailReg] = useState("");
    const [passwordReg, setPasswordReg] = useState("");
    const [meetingName, setMeetingName] = useState("");
    const [permissionReg, setPermissionReg] = useState("Student");
    const [signupMessage, setSignupMessage] = useState("Not submitted yet");

    // if(meetingInformation !== undefined) {
    //     console.log(meetingInformation[0].start.getHours() + ":" + meetingInformation[0].start.getMinutes());
    //     console.log("Starting TID: " + getTID(meetingInformation[0].start.getHours(), meetingInformation[0].start.getMinutes()));
    //     console.log("Ending TID: " + (getTID(meetingInformation[0].end.getHours(), meetingInformation[0].end.getMinutes()) - 1));
    //
    //     let startTID = getTID(meetingInformation[0].start.getHours(), meetingInformation[0].start.getMinutes());
    //     let endTID = getTID(meetingInformation[0].end.getHours(), meetingInformation[0].end.getMinutes()) - 1;
    //
    //
    //     for (let i = startTID; i <= endTID; i++) {
    //         console.log(i);
    //     }
    // }


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
                                                icon='name'
                                                iconPosition='left'
                                                label='Meeting Name'
                                                type='name' />

                                    <div>
                                        <h4>Time </h4>
                                    </div>

                                    <Form.Input onChange={(e) => {
                                        setRoom(e.target.value)
                                    }}
                                                icon='user'
                                                iconPosition='left'
                                                label='Room'
                                                type='room'
                                                placeholder='Room' />
                                    {/*<Form.Input onChange={(e) => {*/}
                                    {/*    setEmailReg(e.target.value)*/}
                                    {/*}}*/}
                                    {/*            icon='user'*/}
                                    {/*            iconPosition='left'*/}
                                    {/*            label='Email'*/}
                                    {/*            placeholder='Email' />*/}
                                    {/*<Form.Input onChange={(e) => {*/}
                                    {/*    setPasswordReg(e.target.value)*/}
                                    {/*}}*/}
                                    {/*            icon='lock'*/}
                                    {/*            iconPosition='left'*/}
                                    {/*            label='Password'*/}
                                    {/*            type='password'*/}
                                    {/*            placeholder='Password'/>*/}
                                    {/*<div align='center'>*/}
                                    {/*    <div style={{paddingRight: "140px", margin: "5px"}} >*/}
                                    {/*        <h5><strong>Permission</strong></h5>*/}
                                    {/*    </div>*/}
                                    {/*    <select style={{width: "210px", textAlign: "center"}} onChange={(e) => {setPermissionReg(e.target.value)}}>*/}
                                    {/*        <option selected value="Student">Student</option>*/}
                                    {/*        <option value="Department Staff">Department Staff</option>*/}
                                    {/*    </select>*/}
                                    {/*    <br/>*/}
                                    {/*</div>*/}

                                </Form>
                            </Grid.Column>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={() => setOpen(false)}>Save</Button>
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
