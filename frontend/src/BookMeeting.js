import React, {useState, useEffect} from 'react';
import {Calendar, momentLocalizer} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import {Button, Container, Form, Grid, Modal} from "semantic-ui-react";
import axios from "axios";
import * as app from "./App";


// Event {
//     title: string,
//         start: Date,
//         end: Date,
//         allDay?: boolean
//     resource?: any,
// }

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

const api = axios.create({
    baseURL : app.BackendURL //'http://localhost:8080'
})

function BookMeeting() {
    const [meetingInformation, setMeetingInformation] = useState([]);
    const [open, setOpen] = useState(false);
    const localizer = momentLocalizer(moment);

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
    const [meetings, setMeetings] = useState([]);
    const [unavailableTimeSlots, setUnavailableTimeSlots] = useState([]);
    const [meetingName, setMeetingName] = useState("");
    const [meetingMemberNames, setMeetingMemberNames] = useState("");
    const [errorOccurred, setErrorOccurred] = useState(false);
    const [inProgress, setInProgress] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [selected, setSelected] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const loginData = localStorage.getItem('login-data');
    const data = JSON.parse(loginData);
    const [availRooms, setAvailRooms] = useState([]);


    const getRooms = () => {
        api.get("/StackOverflowersStudios/rooms").then(res => {
            // console.log(res.data);
            setRooms(res.data);
        })
    }

    const getAvailableRooms = () => {
        let date = meetingInformation[0].start.getFullYear()+'-'+(meetingInformation[0].start.getMonth()+1)+'-'+ meetingInformation[0].start.getDate();

        let startTID = getTID(meetingInformation[0].start.getHours(), meetingInformation[0].start.getMinutes());
        let endTID = getTID(meetingInformation[0].end.getHours(), meetingInformation[0].end.getMinutes()) - 1;

        let timeSlot =[];
        for (let i = startTID; i <= endTID; i++) {
            timeSlot.push(i);
        }
        let inject = {date: date, tids: timeSlot}
        api.post("/StackOverflowersStudios/room/findRoomsAtTimes",
            inject,
            {headers: {'Content-Type': 'application/json'}}//text/plain //application/json
        ).then((response) => {
            console.log(response);
            setAvailRooms(response.data);
        },(error) => {
            console.log(error);
        });
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

    const fetchUnavailabletimeSlots = async () => {
        axios.get(`${app.BackendURL}/StackOverflowersStudios/user/allOccupiedSchedule/${data.uid}`, {
            headers: {'Content-Type': 'application/json' }})
            .then(
                (response) => {
                    let unavailableTS = []
                    // console.log(response.data)
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

    useEffect(() => {
        getRooms();
        fetchData();
        fetchUnavailabletimeSlots();
    }, []);

    const reset = () => {
        setErrorOccurred(false);
        setInProgress(false);
        setCompleted(false);
    }

    const bookMeeting = () => {
        if(room !== 0 && meetingName !== "") {
            setInProgress(true);
            setErrorMessage("");
            var tempData = localStorage.getItem("login-data");
            const userData = JSON.parse(tempData)

            let date = meetingInformation[0].start.getFullYear()+'-'+(meetingInformation[0].start.getMonth()+1)+'-'+ meetingInformation[0].start.getDate();

            let startTID = getTID(meetingInformation[0].start.getHours(), meetingInformation[0].start.getMinutes());
            let endTID = getTID(meetingInformation[0].end.getHours(), meetingInformation[0].end.getMinutes()) - 1;

            let timeSlot =[];
            for (let i = startTID; i <= endTID; i++) {
                timeSlot.push(i);
            }

            let memberData = {memberNames: meetingMemberNames.split(", ")};
            let membersIds =[];

            api.post("/StackOverflowersStudios/users/usernames",
                memberData,
                {headers: {'Content-Type': 'application/json'}}//text/plain //application/json
            ).then((response) => {
                let res = response.data.memberIds;

                for(let i = 0; i < res.length; i++) {
                    membersIds.push(res[i]);
                }

                //Create json to send to API (Ids would become empty if not done inside previous axios post variable would be blank)
                let data = {resday: date, resname: meetingName, rid: parseInt(room), uid: userData.uid, members: membersIds, time_slots: timeSlot};
                // console.log(data);

                //Create reservation
                api.post("/StackOverflowersStudios/reservations",
                    data,
                    {headers: {'Content-Type': 'application/json'}}//text/plain //application/json
                ).then((response) => {
                    console.log(response);
                    setInProgress(false);
                    setCompleted(true);
                    window.location.reload(false);
                },(error) => {
                    console.log(error);
                    setInProgress(false);
                    setErrorOccurred(true);
                });
            },(error) => {
                console.log(error);
            });

        } else {
            setErrorMessage("Empty Fields");
        }
    }
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

    return (
        <>
            <Container style={{ height: 800, margin: "25px" }}><Calendar
                selectable
                localizer={localizer}
                startAccessor="start"
                events={[...meetings, ...meetingInformation, ...unavailableTimeSlots]}
                endAccessor="end"
                views={["month", "day"]}
                defaultDate={Date.now()}
                onSelecting = {(selected) =>{ setMeetingInformation([{
                    'title': 'New Meeting',
                    'start': new Date(selected.start),
                    'end': new Date(selected.end),
                    'startTimeDisplay' : formatTime(selected.start.getHours(), selected.start.getMinutes()),
                    'endTimeDisplay' : formatTime(selected.end.getHours(), selected.end.getMinutes()),
                }]); setSelected(true); } }
            >
            </Calendar>
                <Modal centered={false} open={open} onClose={() => {setOpen(false); {reset()}}} onOpen={() => {setOpen(true);}}>
                    <Modal.Header>Book New Meeting</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            <Grid.Column>
                                <Form>
                                    <Form.Input onChange={(e) => {
                                        setMeetingName(e.target.value)
                                    }}
                                                icon='address book'
                                                iconPosition='left'
                                                label='Meeting Name'
                                                type='name' />

                                    <Form.Input onChange={(e) => {
                                        setMeetingMemberNames(e.target.value);
                                    }}
                                                icon='address card outline'
                                                iconPosition='left'
                                                label='Meeting Members'
                                                type='name' />
                                    <p>**Please enter member usernames separated by a comma and a space.</p>
                                    <h5 style={{paddingTop: "5px"}}>Meeting Time</h5>
                                    {
                                        meetingInformation[0] !== undefined &&
                                        <p style={{paddingBottom: "5px"}}>{`${meetingInformation[0].startTimeDisplay} - ${meetingInformation[0].endTimeDisplay}`}</p>
                                    }

                                    <Form.Input label='Room'>
                                        <select defaultValue={"0"} style={{textAlign: "center"}} onChange={(e) => {setRoom(e.target.value); {console.log(e.target.value)}}}>
                                            <option key={0} value={"0"}>Select Room</option>
                                            {availRooms.map(item => {
                                                var tempData = localStorage.getItem("login-data");
                                                const userData = JSON.parse(tempData)
                                                if(userData.upermission === "Student") {
                                                    if(item.rpermission === "Student") return (<option key={item.rid} value={item.rid}>{item.rname}</option>)
                                                }else return (<option key={item.rid} value={item.rid}>{item.rname}</option>)
                                            })})}
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
                        <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                            <Button onClick={bookMeeting} style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>Book</Button>
                        </div>
                        <br/>
                        <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                            {errorMessage !== "" && <h3 style={{color: "red"}}>**Please fill out the empty fields</h3>}
                        </div>
                        <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                            {errorOccurred &&
                            <h3 style={{color: "red"}}>**An error occurred while creating the reservation.</h3>
                            }
                            {inProgress &&
                            <h3 style={{color: "orange"}}>**Creating your meeting...</h3>
                            }
                            {completed &&
                            <h3 style={{color: "green"}}>**Successfully created your meeting.</h3>
                            }
                        </div>
                    </Modal.Actions>
                </Modal>
                <Container fluid>
                    <Button fluid onClick={() => {if(selected) setOpen(true); getAvailableRooms(); }}> Book Meeting </Button>
                </Container>
            </Container>
        </>
    );


}
export default BookMeeting;
