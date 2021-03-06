import React, {useState, useEffect} from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {Container} from "semantic-ui-react";
import {Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis} from "recharts";
import Navbar from "./components/Navbar";
import axios from 'axios';
const app = require("./App");

const api = axios.create({
    baseURL : app.BackendURL
})

function Dashboard(){

    const [rooms, setRooms] = useState([]);

    const getRooms = async () => {
        api.get("/StackOverflowersStudios/reservation/most-used").then(res => {
            // console.log(res);
            setRooms(res.data);
        })
    }

    const [users, setUsers] = useState([]);

    const getUsers = async () => {
        api.get("/StackOverflowersStudios/reservation/most-booked").then(res => {
            // console.log(res);
            setUsers(res.data);
        })
    }

    const [timeSlots, setTimeSlots] = useState([]);

    const getTimeSlots = async () => {
        api.get("/StackOverflowersStudios/reservation/busiest-hours").then(res => {
            // console.log(res);
            setTimeSlots(res.data);
        })
    }



    const [loggedIn, setLoggedIn]= React.useState(false);
    var tempData = localStorage.getItem("login-data");

    useEffect(() => {
        getRooms();
        getUsers();
        getTimeSlots();
        tempData = localStorage.getItem("login-data");
        if(tempData) {
            setLoggedIn(true);
            getMostLoggedWith();
            getMostUsedRoom();
        }
    }, []);

    const data = JSON.parse(tempData)

    const [mostUsedRoom, setMostUsedRoom] = useState("");

    const getMostUsedRoom = async () => {
        api.get("/StackOverflowersStudios/user/mostusedroom/" + data.uid).then(res => {
            console.log(res);
            if(res.data.rname === undefined){
                setMostUsedRoom("User has not used any rooms.");
            }else{
                setMostUsedRoom(res.data.rname + " in the " + res.data.rbuildname + " building" + ` (a total of ${res.data.uses} times).`);
            }
        })
    }

    const [mostLoggedWith, setMostLoggedWith] = useState("");

    const getMostLoggedWith = async () => {
        api.get("/StackOverflowersStudios/user/mostbookedwith/" + data.uid).then(res => {
            console.log(res);
            if(res.data.username === undefined){
                setMostLoggedWith("User has not been booked with anyone.");
            }else{
                setMostLoggedWith(res.data.username + ` (a total of ${res.data.times} times).`);
            }
        })
    }

    return(
        <>
            <Navbar/>
            <br/>
            { loggedIn === true &&
            <h1 style={{textAlign: "center"}}>Your Statistics:</h1>
            }
            { loggedIn === true &&
            <Container style={{ height: 100 }}>
                <h2>The room you've used the most is:</h2>

                <ul>
                    <li><h3>{mostUsedRoom}</h3></li>
                </ul>

            </Container>
            }
            { loggedIn === true &&
            <Container style={{ height: 100 }}>
                <h2>The user you've been booked with the most is:</h2>
                <ul>
                    <li><h3>{mostLoggedWith}</h3></li>
                </ul>

            </Container>
            }
            <br/>
            <h1 style={{textAlign: "center"}}>Global Statistics:</h1>
            <Container style={{ height: 350 }}>
                <h2>Most Used Rooms</h2>
                <BarChart width={1030} height={250} data={rooms}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rname" tick={{ fontSize: '10px', width: '250px', wordWrap: 'break-word' }} interval={0} />
                    <YAxis />
                    <Tooltip />
                    <Legend verticalAlign="top" />
                    <Bar dataKey="times_used" fill="#8884d8" />
                </BarChart>
            </Container>
            <Container style={{ height: 350 }}>
                <h2>Most Booked Users</h2>
                <BarChart width={1030} height={250} data={users}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="username" tick={{ fontSize: '10px', width: '250px', wordWrap: 'break-word' }} interval={0}/>
                    <YAxis />
                    <Tooltip />
                    <Legend verticalAlign="top"/>
                    <Bar dataKey="times_booked" fill="#8884d8" />
                </BarChart>
            </Container>
            <Container style={{ height: 350 }}>
                <h2>Busiest Time Slots</h2>
                <BarChart width={1030} height={250} data={timeSlots}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tstarttime" />
                    <YAxis />
                    <Tooltip />
                    <Legend verticalAlign="top"/>
                    <Bar dataKey="times_booked" fill="#8884d8" />
                </BarChart>
            </Container>
        </>);


}
export default Dashboard;
