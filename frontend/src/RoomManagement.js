import React, {useEffect, useState} from "react";
import Navbar from "./components/Navbar";
import {Button} from 'semantic-ui-react';
import {Container, Grid} from '@material-ui/core';
import {Link} from "react-router-dom";
import RoomCard from "./components/RoomCard";
import axios from "axios";
const app = require('./App');


function RoomManagement(){
    const [open, setOpen] = useState(false);
    const [isAuth, setIsAuth] = useState(false)
    const [rooms, setRooms] = useState([]);
    const data = localStorage.getItem('login-data');
    const user = JSON.parse(data);

    function getAuthentication() {
        if (user.upermission === "Department Staff") {
            setIsAuth(true);
        }
    }

    function fetchRooms(){
        axios.get(`${app.BackendURL}/StackOverflowersStudios/rooms`, {
            headers: {'Content-Type': 'application/json' }}).then((response) => {
                setRooms(response.data);
            }, (error) => {
                console.log(error);
            }
        );
    }
    useEffect(() => {
        getAuthentication();
        fetchRooms();
    }, []);

    if(isAuth) {
        return (

            <>
                <Navbar/>
                <h1 style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>Rooms</h1>
                <Container>
                    <Grid container spacing={3}>
                        {Array.from(Array(rooms.length)).map((_, i) => (
                            <Grid justify={"center"} container item xs={12} md={6} lg={4} key={i}>
                                <RoomCard
                                    roomName={`${rooms[i].rname}`}
                                    building={`${rooms[i].rbuildname}`}
                                    capacity={`${rooms[i].rcapacity}`}
                                    permission={`${rooms[i].rpermission}`}
                                    id={`${rooms[i].rid}`}
                                    type={"edit"}
                                />
                            </Grid>
                        ))}
                        <Grid justify={"center"} container item xs={12} md={6} lg={4}>
                            <RoomCard
                                roomName={`Create`}
                                building={`New Room`}
                                type={"create"}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </>
        );
    } else {
        return (
            <>
                <Navbar/>
                <h3 style={{color: "red", display: 'flex', justifyContent: 'center', alignItems: 'center'}}>You are not
                    allowed to manage rooms, please contact a Department Staff to make any changes</h3>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Link to={"/"}>
                        <Button content='Go Home' icon='home' size='big' color="violet"/>
                    </Link>
                </div>
            </>
        );

    }

}

export default RoomManagement;

