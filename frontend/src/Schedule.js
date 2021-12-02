import React, {useState, useEffect} from 'react';
import {Calendar, momentLocalizer} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {Card, CardHeader, CardContent, IconButton, Typography} from "@material-ui/core";
import moment from 'moment';
import {Button, Container, Form, Grid, Modal, ModalDescription, ModalHeader} from "semantic-ui-react";
import axios from "axios";
import {EditOutlined, MoreHorizOutlined} from "@material-ui/icons";
const app = require("./App");

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

function getTID(hours, minutes){
    if(minutes === 30) return hours * 2 + 2;
    else return hours * 2 + 1;
}


function Schedule() {
    const [open, setOpen] = useState(false);
    const [openAvailable, setOpenAvailable] = useState(false);

    const [openUserDelete, setOpenUserDelete] = useState(false);
    const [userToDelete, setUserToDelete] = useState("");
    const [deleteAction, setDeleteAction] = useState(false);
    const [meetings, setMeetings] = useState([]);
    const [members, setMembers] = useState([]);
    const [selected, setSelected] = useState({members: []});

    const [openUnavailabilityUser, setOpenUnavailabilityUser] = useState(false);
    const [unavailableTimeSlots, setUnavailableTimeSlots] = useState([]);
    const [selectedUnavailable, setSelectedUnavailable] = useState(false);
    const [selectedUserTimeSlot, setSelectedUserTimeSlot] = useState([]);

    const [editedMeetingName, setEditedMeetingName] = useState("");
    const [time, setTime] = useState([new Date(), new Date()])
    const localizer = momentLocalizer(moment)
    const loginData = localStorage.getItem('login-data');
    const data = JSON.parse(loginData);

    const handleSelected = (event) => {
        setSelected(event);
        if(data.uid === event.creator) {
            setOpen(true);
            console.info(selected);
            console.log(event);
        }
        else if(event.title === 'Unavailable') {
            setOpenAvailable(true);
            console.log(event);
        }
        else {
            console.log("You are not the meeting creator");
            console.log(event);
        }
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
        request.delete(`${app.BackendURL}/StackOverflowersStudios/removeMember/`, {
            data: {resid: resid, username: username} }
        ).then((r) => {
                console.log("Member Deleted", r);
                let temp = selected.members;
                const idx = temp.indexOf(data.username);
                temp.splice(idx, 1);
                window.location.reload(false);
            }, (error) =>{
                console.log("Error Occurred", error);
            }
        );
    }

    const markAvailable = () => {
        console.log(selected);
        const day = selected.start.getDate();
        const year = selected.start.getFullYear();
        const month = selected.start.getMonth() + 1;
        let usday = String(year) + "-" + String(month) + "-" + String(day);
        console.log(usday);
        let startTID = getTID(selected.start.getHours(), selected.start.getMinutes());
        let endTID = getTID(selected.end.getHours(), selected.end.getMinutes()) - 1;

        for (let i = startTID; i <= endTID; i++) {
            axios.post(`${app.BackendURL}/StackOverflowersStudios/user-schedule/markavailable`,
                {uid: data.uid, tid: i, usday: usday},
                {headers: {'Content-Type': 'application/json'}}
            ).then((response) => console.log(`TID ${i} marked available`),
                (error) => console.log(error))
        }
        delay(2000).then(() => window.location.reload(false));
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

    }

    const fetchUnavailabletimeSlots = async () => {
        axios.get(`${app.BackendURL}/StackOverflowersStudios/user/allOccupiedSchedule/${data.uid}`, {
            headers: {'Content-Type': 'application/json' }})
            .then(
                (response) => {
                    let unavailableTS = []
                    console.log(response.data)
                    const days = Object.keys(response.data)
                    for(let day of days){ // day: [ [timeBlock1], [timeBlock2], [...] ]
                        for(let block of response.data[day]){
                            let tempDate = day.split('-');
                            const blockStart = block[0].split(":");
                            const blockEnd = block[1].split(":");

                            const startDate = new Date(tempDate[0], tempDate[1] - 1, tempDate[2], parseInt(blockStart[0]), parseInt(blockStart[1]), parseInt(blockStart[2]));
                            const endDate = new Date(tempDate[0], tempDate[1] - 1, tempDate[2], parseInt(blockEnd[0]), parseInt(blockEnd[1]), parseInt(blockEnd[2]));

                            const timeSlot = {title: `Unavailable`, start: startDate, end: endDate}
                            unavailableTS.push(timeSlot)
                        }
                    }

                    setUnavailableTimeSlots(unavailableTS);
                    console.log(unavailableTimeSlots)
                }
            );

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
        fetchUnavailabletimeSlots();
    }, [])

    function formatTime(hours, minutes){
        console.log(hours + " " + minutes)
        let pastNoonIndicator = "";
        if(hours < 12){
            if(hours === 0) hours = 12;
            pastNoonIndicator = "AM";
        }
        else {
            if(hours > 12) hours -= 12;
            pastNoonIndicator = "PM";
        }
        if(minutes === 0){
            return `${hours}:00 ${pastNoonIndicator}`;
        } else {
            return`${hours}:${minutes} ${pastNoonIndicator}`;
        }
    }

    function getTID(hours, minutes){
        if(minutes === 30) return hours * 2 + 2;
        else return hours * 2 + 1;
    }
    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    function markUnavailable(){
        console.log(selectedUserTimeSlot);

        let startTID = getTID(selectedUserTimeSlot[0].start.getHours(), selectedUserTimeSlot[0].start.getMinutes());
        let endTID = getTID(selectedUserTimeSlot[0].end.getHours(), selectedUserTimeSlot[0].end.getMinutes()) - 1;

        let usday = `${selectedUserTimeSlot[0].start.getFullYear()}-${selectedUserTimeSlot[0].start.getMonth() + 1}-${selectedUserTimeSlot[0].start.getDate()}`;
        for (let i = startTID; i <= endTID; i++) {
            let datita = {tid: i, uid: data.uid, usday: usday};
            console.log(datita);
            axios.post(`${app.BackendURL}/StackOverflowersStudios/user-schedule/markunavailable`,
                datita,
                {headers: {'Content-Type': 'application/json'}}//text/plain //application/json
            ).then((response) => {
                console.log(`TID ${i} marked unavailable`);
            },(error) => {
                console.log(error);
            });
        }
        delay(2000).then(() => window.location.reload(false));
    }

    return (
        <>

            <Container style={{ height: 800, margin: "25px"}}>
                <Calendar selectable
                          localizer={localizer}
                          startAccessor="start"
                          events={[...meetings, ...selectedUserTimeSlot, ...unavailableTimeSlots]}
                          endAccessor="end"
                          views={["month", "day"]}
                          defaultDate={Date.now()}
                          onSelecting = {
                              (selected) => {
                                  setSelectedUserTimeSlot([
                                      {
                                          'title' : `${data.username} is unavailable`,
                                          'start': new Date(selected.start),
                                          'end': new Date(selected.end)
                                      }
                                  ]);
                                  setSelectedUnavailable(true);
                                  setTime([new Date(selected.start), new Date(selected.end)])
                              }
                          }
                          onSelectEvent={handleSelected}
                />
                <Container fluid>
                    <Button fluid onClick={() => {if(selectedUnavailable) setOpenUnavailabilityUser(true);}}> Mark as unavailable</Button>
                </Container>
            </Container>

            <Modal centered={false} open={openUnavailabilityUser} onClose={() => {setOpenUnavailabilityUser(false);}} onOpen={() => {setOpenUnavailabilityUser(true);}}>
                <Modal.Header>Mark Unavailable Time Slot</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        Selected Time Slot: &nbsp;
                        {formatTime(time[0].getHours(), time[0].getMinutes())}
                        - {formatTime(time[1].getHours(), time[1].getMinutes())} <br/>
                        Are you sure you wish to mark this time slot as unavailable? You will not be able to book any meetings nor be invited to any meetings at this time slot if you proceed
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button content='Yes, mark as unavailable' primary onClick={() => {markUnavailable()}}/>
                </Modal.Actions>
            </Modal>

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
                                selected.title !== 'Unavailable' &&
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

            <Modal centered={false} open={openAvailable} onClose={() => {setOpenAvailable(false);}} onOpen={() => {setOpenAvailable(true);}}>
                <Modal.Header>
                    Mark as available again?
                </Modal.Header>
                <Modal.Content>
                    <Modal.Actions>
                        <p style={{fontSize: "l"}}>Are you sure you want to mark yourself as available again?
                            Other users will be able to add you to meetings they create if you proceed.
                        </p>
                    </Modal.Actions>
                </Modal.Content>
                <Modal.Actions>
                    <Button color={"green"} content="Yes I'm sure. Mark as available." onClick={markAvailable} />
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
