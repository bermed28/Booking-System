import React, {useState, useEffect} from 'react';
import {Calendar, momentLocalizer} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {Card, CardHeader, CardContent, IconButton, Typography} from "@material-ui/core";
import moment from 'moment';
import {Button, Container, Form, Grid, Modal, ModalDescription, ModalHeader} from "semantic-ui-react";
import axios from "axios";
import {EditOutlined, MoreHorizOutlined} from "@material-ui/icons";
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


function Schedule() {
    const [open, setOpen] = useState(false);
    const [openUserDelete, setOpenUserDelete] = useState(false);
    const [userToDelete, setUserToDelete] = useState("");
    const [deleteAction, setDeleteAction] = useState(false);
    const [meetings, setMeetings] = useState([]);
    const [members, setMembers] = useState([]);
    const [selected, setSelected] = useState({members: []});
    const [editedMeetingName, setEditedMeetingName] = useState("");
    const localizer = momentLocalizer(moment)
    const loginData = localStorage.getItem('login-data');
    const data = JSON.parse(loginData);

    const handleSelected = (event) => {
        setSelected(event);
        if(data.uid === event.creator) {
            setOpen(true);
            console.info(selected);
        } else console.log("You are not the meeting creator")
    };

    const updateMeeting = () => {
        if(editedMeetingName === ""){
            console.log("No changes")
        }else {
            let data = {resname: editedMeetingName, resid: selected.meetingID};
            axios.put(`${app.BackendURL}/StackOverflowersStudios/reservations/updateName`, data, {headers: {'Content-Type': 'application/json'}})//text/plain //application/json)
                .then((response) => {
                    console.log(response);
                    window.location.reload(false);
                }, (error) => {
                    console.log(error);
                });
        }
    }

    const getMemberNames = async (resid) => {
        axios.get(`${app.BackendURL}/StackOverflowersStudios/memberNames/${resid}`, {
            headers: {'Content-Type': 'application/json' }})
            .then(
                (response) => {
                    // console.log(response.data.members)
                    const members = response.data.members;
                    setMembers(response.data.members);
                }, (error) => {
                    console.log(error);
                }
            );
    }

    const deleteUserFromMeeting = (username, resid) => {
        console.log(data.uid);
        const token = localStorage.getItem('token');
        const request = axios.create({
            headers: {
                Authorization: token
            }
        });
        request.delete(`${app.BackendURL}/StackOverflowersStudios/removeMember/`, { data: {resid: resid, username: username} }).then(
            (r) => {
                console.log("Member Deleted", r);
                let temp = selected.members;
                const idx = temp.indexOf(data.username);
                temp.splice(idx, 1);
                setOpenUserDelete(false);
                window.location.reload(false);
            }, (error) =>{
                console.log("Error Occurred", error);
            }
        );
    }

    const deleteMeeting = () => {

        console.log(data.uid);
        const token = localStorage.getItem('token');
        const request = axios.create({
            headers: {
                Authorization: token
            }
        });
        request.delete(`${app.BackendURL}/StackOverflowersStudios/reservations/${selected.meetingID}`, { data: {uid: data.uid} }).then(
            (r) => {
                console.log("Meeting Deleted", r);
                window.location.reload(false);
            }, (error) =>{

                console.log("Error Occurred", error);
            }
        );

        // axios.delete(`${app.BackendURL}/StackOverflowersStudios/reservation/${selected.meetingID}`, {data: data.uid, headers: {'Content-Type': 'application/json'}})
        //     .then(r =>{
        //         console.log("Meeting Deleted", r);
        //         window.location.reload(false);
        //     }, (error) =>{
        //         console.log(error);
        //     });
    }

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

                        let tempArray = []

                        axios.get(`${app.BackendURL}/StackOverflowersStudios/memberNames/${meeting.resid}`, {
                            headers: {'Content-Type': 'application/json' }})
                            .then(
                                (response) => {
                                    for(let i = 0; i < response.data.members.length; i++) {
                                        tempArray.push(response.data.members[i]);
                                    }
                                }, (error) => {
                                    console.log(error);
                                }
                            );

                        const temp = {title: meeting.resname, start: startDate, end: endDate, creator: meeting.uid, meetingID: meeting.resid, members: tempArray};
                        console.log(temp);
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
        fetchData();
    }, [])

    return (
        <>
            <Container style={{ height: 800, margin: "50px"}}>
                <Calendar //selectable //change for user mark unavailable
                    localizer={localizer}
                    startAccessor="start"
                    events={meetings}
                    endAccessor="end"
                    views={["month", "day"]}
                    defaultDate={Date.now()}
                    onSelectEvent={handleSelected}
                />
                <Button fluid onClick={() => {setOpen(true)}}> Mark as unavailable</Button>
            </Container>

            <Modal centered={false} open={open} onClose={() => {setOpen(false);}} onOpen={() => {setOpen(true); setDeleteAction(false)}}>

                { !deleteAction &&
                <Modal.Header>
                    Edit Meeting: {selected.title}
                </Modal.Header>
                }
                { deleteAction &&
                <Modal.Header> Delete Meeting: {selected.title}</Modal.Header>
                }
                <Modal.Content>
                    { !deleteAction &&
                    <Modal.Description>
                        <Grid.Column>
                            <Form>
                                <Form.Input>
                                    <Form.Input onChange={(e) => {
                                        setEditedMeetingName(e.target.value)
                                    }}
                                                label='Meeting Name'
                                                type='name'
                                    />
                                </Form.Input>
                            </Form>
                            <h4>Members</h4>
                            {
                                selected.members.map(item => {
                                    return(<Card style={{width: "50%"}} variant="outlined"><CardHeader title={item} action={
                                        <IconButton onClick={() => {setOpenUserDelete(true); setUserToDelete(item)}}><MoreHorizOutlined/></IconButton>
                                    }/></Card>)
                                })
                            }
                        </Grid.Column>
                        <br/>
                        <Button content='Delete' color={"red"} onClick={() => {setDeleteAction(true);}} />
                    </Modal.Description>
                    }
                    { deleteAction &&
                    <Modal.Description> </Modal.Description> &&
                    <Modal.Actions>
                        Are you sure you want to delete your account?
                        <Button color={"red"} content="Yes I'm sure, delete this meeting" onClick={deleteMeeting} />
                    </Modal.Actions>
                    }

                </Modal.Content>
                <Modal.Actions>
                    { !deleteAction &&
                    <Button content='Update' primary onClick={updateMeeting}/>
                    }

                    { deleteAction &&
                    <Button content='Cancel' primary onClick={() => setDeleteAction(false)} />

                    }
                </Modal.Actions>

            </Modal>

            <Modal centered={false} open={openUserDelete} onClose={() => setOpenUserDelete(false)} onOpen={() => setOpenUserDelete(true)}>
                <ModalHeader>Delete User: Are you sure you want to remove this user from the meeting?</ModalHeader>
                <ul>
                    <li><h3>{userToDelete}</h3></li>
                </ul>
                <Modal.Actions>
                    <Button color={"red"} content={`Yes I'm sure, remove ${userToDelete}.`} onClick={() => {deleteUserFromMeeting(userToDelete, selected.meetingID)}} />
                </Modal.Actions>
            </Modal>
        </>
    );
}
export default Schedule;
