import {Button, Form, Modal} from "semantic-ui-react";
import React, {useEffect, useState} from "react";
import {Card, CardHeader, CardContent, IconButton, Typography} from "@material-ui/core";
import {Grid} from 'semantic-ui-react';
import {DeleteOutlined, Edit, EditOutlined, MoreHoriz, MoreHorizOutlined} from "@material-ui/icons";
import axios from "axios";
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
    const roomID = props.id;

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
        getRoomData();
    }, []);

    function editRoom() {
        if(roomName===""  && roomCapacity === -1 &&  roomPermission==="0"){
            console.log("No changes")
            setEditMessage("No changes where made");
        } else {
            let data = {rname: roomName, rbuildname: roomBuilding, rcapacity: roomCapacity, rpermission: roomPermission}
            console.log(data);
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

            console.log(data)
            console.log(roomData.rid);
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
                {props.type === "edit" &&<Modal.Header>Edit Room</Modal.Header>}
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
                        props.type === "edit" &&
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
                    {props.type === "edit" && <Button onClick={deleteRoom} style={{marginTop: "15px"}}>Delete</Button>}
                </Modal.Content>

                <Modal.Actions>
                    {props.type === "create" && <Button onClick={createRoom}>Save</Button>}
                    {
                        props.type === "edit" &&
                        <Button onClick={editRoom}>Save</Button>
                    }
                </Modal.Actions>
            </Modal>
        </div>
    );
}

export default RoomCard;