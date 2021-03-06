import {Button, Form, Modal} from "semantic-ui-react";
import React, {useEffect, useState} from "react";
import {Card, CardHeader, CardContent, IconButton, Typography} from "@material-ui/core";
import {Grid} from 'semantic-ui-react';
import {EditOutlined, MoreHorizOutlined} from "@material-ui/icons";
import axios from "axios";
import DateTimePicker from 'react-datetime-picker';
import DatePicker from 'react-date-picker';

const app = require("../App");


function RoomCard(props) {

    const [open, setOpen] = useState();
    const [roomName, setRoomName] = useState("");
    const [roomBuilding, setRoomBuilding] = useState("");
    const [roomCapacity, setRoomCapacity] = useState(-1);
    const [roomPermission, setRoomPermission] = useState("");
    const [createdMessage, setCreatedMessage] = useState("");
    const [editMessage, setEditMessage] = useState("");
    const [deleteMessage, setDeleteMessage] = useState("");
    const [roomData, setRoomData] = useState({});
    const [unavailabilityModalOpen, setUnavailabilityModalOpen] = useState(false);
    const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
    const [unavailableTimeSlot, setUnavailableTimeSlot] = useState(new Date());
    const [unavailableTimeSlots, setUnavailableTimeSlots] = useState([]);
    const [toMarkAvailable, setToMarkAvailable] = useState(new Date())
    const [invalidTimeSlot, setInvalidTimeSlot] = useState(false)
    const [roomSchedule, setRoomSchedule] = useState(new Date());
    const [allDayRS, setallDayRS] = useState([]);
    const [canShowSched, setCanShowSched] = useState(false);
    const roomID = props.id;


    console.log("All day",allDayRS)
    function createRoom(){
        if(roomName==="" || roomCapacity < 0 || roomBuilding==="" || roomPermission==="0"){
            console.log("Empty Field")
            setCreatedMessage("Failed to create room, invalid parameters");
        } else {
            console.log("Creating Room")
            let data = {rname: roomName, rbuildname: roomBuilding, rcapacity: roomCapacity, rpermission: roomPermission}
            axios.post(`${app.BackendURL}/StackOverflowersStudios/rooms`, data,
                {header: {'Content-Type': 'application/json'}}
            ).then(
                (response) => {
                    console.log(response);
                    setCreatedMessage("Room Successfully Created");
                    console.log(createdMessage);
                    window.location.reload(false);
                }, (error) => {
                    console.log(error);
                    setCreatedMessage("Failed to create room, invalid parameters");
                }
            );
        }
    }

    function getRoomData(){
        axios.get(`${app.BackendURL}/StackOverflowersStudios/rooms/${roomID}`, {
            headers: {'Content-Type': 'application/json' }}).then((response) => {
                setRoomData(response.data);
            }, (error) => {
                console.log(error);
            }
        );
    }


    useEffect(() => {
        if(typeof roomID !== "undefined") {
            getRoomData();
        }
    }, []);

    function editRoom() {
        if(roomName===""  && roomCapacity === -1 &&  roomPermission==="0"){
            console.log("No changes")
            setEditMessage("No changes where made");
        } else {
            let data = {rname: roomName, rbuildname: roomBuilding, rcapacity: roomCapacity, rpermission: roomPermission}
            // console.log(data);
            if (roomName === "") {
                data.rname = roomData.rname;
            }
            if (roomBuilding === "") {
                data.rbuildname = roomData.rbuildname;
            }
            if (roomCapacity === -1) {
                data.rcapacity = roomData.rcapacity;
            }
            if (roomPermission === "") {
                data.rpermission = roomData.rpermission;
            }

            axios.put(`${app.BackendURL}/StackOverflowersStudios/rooms/${roomID}`,
                data,
                {headers: {'Content-Type': 'application/json'}}//text/plain //application/json
            ).then((response) => {
                console.log(response);
                setEditMessage("Changes were made successfully")
                console.log(editMessage);
                window.location.reload(false);
            }, (error) => {
                console.log(error);
                setEditMessage("Changes were not made")
                console.log(editMessage);
            });
        }
    }

    function deleteRoom(){
        axios.delete(`${app.BackendURL}/StackOverflowersStudios/rooms/${roomID}`).then(
            (response) => {
                console.log(response)
                setDeleteMessage("Room deleted successfully");
                console.log(deleteMessage);
                window.location.reload(false);
            }, (error) =>{
                console.log(error);
                setDeleteMessage("Room could not be deleted");
                console.log(deleteMessage)
            }
        );
    }

    function getTID(hours, minutes){
        if(minutes === 30) return hours * 2 + 2;
        else return hours * 2 + 1;
    }

    function markRoom(){
        let day = `${unavailableTimeSlot.getFullYear()}-${unavailableTimeSlot.getMonth() + 1}-${unavailableTimeSlot.getDate()}`;
        const json = {rid: roomID, rsday: day, tid:getTID(unavailableTimeSlot.getHours(), unavailableTimeSlot.getMinutes()), uid: JSON.parse(localStorage.getItem('login-data')).uid};

        axios.post(`${app.BackendURL}/StackOverflowersStudios/room-schedule/markunavailable`,
            json,
            {headers: {'Content-Type': 'application/json'}}
        ).then((response) => {
            console.log(response);
            window.location.reload(false);
        },(error) => {
            console.log(error);
        });
    }

    function markRoomAvailable(){
        console.log(toMarkAvailable)
        let day = `${toMarkAvailable.getFullYear()}-${toMarkAvailable.getMonth() + 1}-${toMarkAvailable.getDate()}`;
        const json = {rid: roomID, rsday: day, tid:getTID(toMarkAvailable.getHours(), toMarkAvailable.getMinutes())};
        axios.delete(`${app.BackendURL}/StackOverflowersStudios/room-schedule/markavailable`, {
            data: json,
            headers: {'Content-Type': 'application/json'}}//text/plain //application/json
        ).then((response) => {
            console.log(response);
            window.location.reload(false);
        },(error) => {
            console.log(error);
        });

    }

    function handleChange(date){
        setUnavailableTimeSlot(date)
        // console.log(unavailableTimeSlot)
    }

    function handleScheduleChange(date){
        setRoomSchedule(date)
        setallDayRS([]);
    }

    function fetchUnavailableTimeSlots(){
        const url = `${app.BackendURL}/StackOverflowersStudios/room/allOccupiedSchedule/${roomID}`;
        axios.get(url, {
            headers: {'Content-Type': 'application/json' }})
            .then(
                (response) => {
                    // console.log(`Time Slot fetched for ${roomID}: `, JSON.stringify(response.data))
                    let unavailableTS = []
                    // console.log("Response: ", response.data)
                    const days = Object.keys(response.data)
                    for(let day of days){ // day: [ {timeBlock1}, {timeBlock2}, {...} ]
                        let tempDate = day.split('-');
                        const blockStart = response.data[day][0].start.split(":");
                        const startDate = new Date(tempDate[0], tempDate[1] - 1, tempDate[2], parseInt(blockStart[0]), parseInt(blockStart[1]), parseInt(blockStart[2]));
                        unavailableTS.push(startDate)
                    }
                    setUnavailableTimeSlots(unavailableTS);
                    // console.log(unavailableTimeSlots)
                }
            );
    }

    function fetchRoomSchedule(){
        const url = `${app.BackendURL}/StackOverflowersStudios/room/alldayschedule`;
        let day = `${roomSchedule.getFullYear()}-${roomSchedule.getMonth() + 1}-${roomSchedule.getDate()}`;
        const inject = {rid: roomID, rsday : day};
        console.log(inject)
        axios.post(url, inject,
            {headers: {'Content-Type': 'application/json'}}//text/plain //application/json
        ).then((response) => {
            console.log("Response", response.data);
            const timeSlots = response.data
            let result = []
            for(let ts of timeSlots){ // data : [ {timeBlock1}, {timeBlock2}, {...} ]
                const blockStart = ts.tstarttime.split(":");
                const blockEnd = ts.tendtime.split(":");
                const startDate = new Date(roomSchedule.getFullYear(), roomSchedule.getMonth() + 1, roomSchedule.getDate(), parseInt(blockStart[0]), parseInt(blockStart[1]), parseInt(blockStart[2]));
                const endDate = new Date(roomSchedule.getFullYear(), roomSchedule.getMonth() + 1, roomSchedule.getDate(), parseInt(blockEnd[0]), parseInt(blockEnd[1]), parseInt(blockEnd[2]));
                result.push({start: startDate, end: endDate, available: ts.available, user: ts.user})
            }
            setallDayRS(result)
        },(error) => {
            console.log(error);
        });
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

        <div>
            <Card elevation={3}>
                {
                    props.type === "edit" &&
                    <CardHeader
                        action={
                            <IconButton onClick={() => setOpen(true)}><MoreHorizOutlined/></IconButton>
                        }
                        title={props.roomName}
                        subheader={props.building}
                    />
                }

                {
                    props.type === "create" &&
                    <CardHeader
                        action={
                            <IconButton onClick={() => setOpen(true)}><EditOutlined/></IconButton>
                        }
                        title={props.roomName}
                        subheader={props.building}
                    />
                }
                <CardContent>

                    <Typography variant="body2" color="textSecondary">Capacity: {props.capacity}</Typography>
                    <Typography variant="body2" color="textSecondary">Permission: {props.permission}</Typography>
                </CardContent>
            </Card>
            <Modal centered={false} open={open} onClose={() => setOpen(false)} onOpen={() => setOpen(true)}>
                {props.type === "create" &&<Modal.Header>Create New Room</Modal.Header>}
                {/*{*/}
                {/*    props.type === "edit" && !unavailabilityModalOpen &&*/}
                {/*    <Modal.Header>*/}
                {/*        Edit Room <br/>*/}
                {/*        <Button onClick={() => {fetchUnavailableTimeSlots(); setUnavailabilityModalOpen(true); }} style={{marginTop: "15px"}}>*/}
                {/*            Change Availability*/}
                {/*        </Button>*/}
                {/*    </Modal.Header>*/}
                {/*}*/}

                {
                    props.type === "edit" && !unavailabilityModalOpen && !scheduleModalOpen &&
                    <Modal.Header>
                        Edit Room <br/>
                        <Button onClick={() => {fetchUnavailableTimeSlots(); setUnavailabilityModalOpen(true); }} style={{marginTop: "15px"}}>
                            Change Availability
                        </Button>
                        <Button onClick={() => {setScheduleModalOpen(true);}} style={{marginTop: "15px"}}>
                            Schedule
                        </Button>
                    </Modal.Header>
                }

                {props.type === "edit" && unavailabilityModalOpen && <Modal.Header>Change availability for {props.roomName}</Modal.Header>}
                {props.type === "edit" && scheduleModalOpen && <Modal.Header>See Schedule for {props.roomName}</Modal.Header>}

                <Modal.Content>
                    {
                        props.type === "create" &&
                        <Modal.Description>
                            <Grid.Column>
                                <Form>
                                    <Form.Input
                                        onChange={(e) => {setRoomName(e.target.value);}}
                                        label='Room Name'
                                    />
                                    <Form.Input
                                        onChange={(e) => {setRoomBuilding(e.target.value)}}
                                        label='Building Name'
                                    />
                                    <Form.Input
                                        onChange={(e) => {setRoomCapacity(e.target.value)}}
                                        label='Room Capacity'
                                    />
                                    <Form.Input label='Permission'>
                                        <select defaultValue={"0"} style={{textAlign: "center"}} onChange={(e) => {setRoomPermission(e.target.value);}}>
                                            <option key={0} value={"0"}>Select Permission</option>
                                            {
                                                ["Student", "Department Staff"].map((item) => {return <option>{item}</option>})
                                            }
                                        </select>

                                    </Form.Input>


                                </Form>
                            </Grid.Column>
                        </Modal.Description>
                    }

                    {
                        props.type === "edit" && !unavailabilityModalOpen && !scheduleModalOpen &&
                        <Modal.Description>
                            <Grid.Column>
                                <Form>
                                    <Form.Input
                                        onChange={(e) => {setRoomName(e.target.value);}}
                                        label='Room Name'
                                    />

                                    <h5 style={{paddingTop: "5px"}}>Building Name</h5>
                                    <p style={{paddingBottom: "5px"}}>{`${props.building}`}</p>

                                    <Form.Input
                                        onChange={(e) => {setRoomCapacity(e.target.value)}}
                                        label='Room Capacity'
                                    />
                                    <Form.Input label='Permission'>
                                        <select defaultValue={"0"} style={{textAlign: "center"}} onChange={(e) => {setRoomPermission(e.target.value);}}>
                                            <option key={0} value={"0"}>Select Permission</option>
                                            {
                                                ["Student", "Department Staff"].map((item) => {return <option>{item}</option>})
                                            }
                                        </select>

                                    </Form.Input>
                                </Form>
                            </Grid.Column>
                        </Modal.Description>
                    }

                    {
                        props.type === "edit" && unavailabilityModalOpen && !scheduleModalOpen &&
                        <Modal.Description>
                            Select Time Slot to mark unavailable: &nbsp;
                            <DateTimePicker
                                onChange={(e) => handleChange(e)}
                                value={unavailableTimeSlot}
                            />
                            <br/>
                            Are you sure you want to mark this room as unavailable in the chosen time slot? You will not be able to book any meetings with this room at this time if marked
                            <br/>{<Button onClick={markRoom}>Mark As Unavailable</Button>}
                            <br/><br/>
                            Or select Time Slot to mark available, keep in mind that these time slots are of <strong>30 minutes</strong> in duration <br/>
                            {unavailableTimeSlots.length > 0 &&
                            <select defaultValue={"0"} style={{textAlign: "center"}} onChange={(e) => {
                                if (e.target.value != 0) {
                                    setToMarkAvailable(new Date(e.target.value));
                                    setInvalidTimeSlot(false);
                                    {
                                        console.log(e.target.value)
                                    }
                                } else setInvalidTimeSlot(true)
                            }}>
                                <option key={0} value={"0"}>Select Time Slot</option>
                                {Array.from(Array(unavailableTimeSlots.length)).map((_, i) => (
                                    <option>{`${unavailableTimeSlots[i].toDateString()}, ${unavailableTimeSlots[i].toLocaleTimeString()}`}</option>
                                ))}
                            </select>
                            }
                            {unavailableTimeSlots.length === 0 && <p style={{fontSize:"1em"}}>This Room has no time slots marked as unavailable</p>}
                            {invalidTimeSlot && <div style={{color: "red"}}> Please select a time slot</div>}
                            <br/>
                            { unavailableTimeSlots.length > 0 &&
                            <p style={{fontSize: "1em"}}>Are you sure you want to mark this room as available in the chosen time slot? Anyone will be able to book any meetings with this room at this time if marked</p>
                            }

                        </Modal.Description>
                    }

                    {
                        props.type === "edit" && scheduleModalOpen && !unavailabilityModalOpen &&
                        <Modal.Description>
                            Select Day for Room Schedule: &nbsp;
                            <DatePicker
                                onChange={(e) => handleScheduleChange(e)}
                                value={roomSchedule}
                            />
                            <br/><br/>
                            {
                                allDayRS.length > 0 &&
                                <table style={{marginLeft: "auto", marginRight: "auto"}}>
                                    <thead>
                                        <tr>
                                            <th style={{padding:"5px", border: "1px solid black"}} scope={"col"}>Start Time</th>
                                            <th style={{padding:"5px", border: "1px solid black"}} scope={"col"}>End Time</th>
                                            <th style={{padding:"5px", border: "1px solid black"}} scope={"col"}>Available?</th>
                                            <th style={{padding:"5px", border: "1px solid black"}} scope={"col"}>Who Booked?</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                    {
                                        allDayRS.map(item => {
                                                return (
                                                    <tr>
                                                        <td style={{padding:"5px", border: "1px solid black"}}>{formatTime(item.start.getHours(), item.start.getMinutes())}</td>
                                                        <td style={{padding:"5px", border: "1px solid black"}}>{formatTime(item.end.getHours(), item.end.getMinutes())}</td>
                                                        <td style={{padding:"5px", border: "1px solid black"}}>{item.available.toString() === "true" ? "Yes" : "No"}</td>
                                                        <td style={{padding:"5px", border: "1px solid black"}}>{item.user}</td>
                                                    </tr>
                                                )
                                            }
                                        )
                                    }
                                    </tbody>
                                </table>
                            }

                        </Modal.Description>
                    }

                    {props.type === "edit" && !unavailabilityModalOpen && !scheduleModalOpen && <Button onClick={deleteRoom} style={{marginTop: "15px"}}>Delete</Button>}
                    {props.type === "edit" && unavailabilityModalOpen  && unavailableTimeSlots.length > 0 && <Button onClick={markRoomAvailable}>Mark As Available</Button>}




                </Modal.Content>

                <Modal.Actions>
                    {props.type === "create" && <Button onClick={createRoom}>Save</Button>}
                    {props.type === "edit" && !unavailabilityModalOpen && !scheduleModalOpen&&  <Button onClick={editRoom}>Save</Button>}
                    {props.type === "edit" && !unavailabilityModalOpen &&  scheduleModalOpen && <Button onClick={() => setScheduleModalOpen(false)} style={{marginTop: "15px"}}>Cancel</Button>}
                    {props.type === "edit" && !unavailabilityModalOpen && scheduleModalOpen && <Button onClick={() => {fetchRoomSchedule(); setCanShowSched(true);}}>Show Schedule</Button>}
                    {props.type === "edit" && unavailabilityModalOpen && <Button onClick={() => setUnavailabilityModalOpen(false)} style={{marginTop: "15px"}}>Cancel</Button>}

                </Modal.Actions>
            </Modal>
        </div>
    );
}

export default RoomCard;