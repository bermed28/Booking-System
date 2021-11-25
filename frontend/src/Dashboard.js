import React, {Component, useState, useEffect} from 'react';
import {Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import {Button, Card, Container, Modal} from "semantic-ui-react";
import {Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis, ResponsiveContainer} from "recharts";
import Navbar from "./components/Navbar";
import axios from 'axios';

const api = axios.create({
    baseURL : "http://localhost:8080/"
})

function BookMeeting(){

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

      const [mostUsedRoom, setMostUsedRoom] = useState([]);

      const getMostUsedRoom = async () => {
          api.get("/StackOverflowersStudios/user/mostusedroom/" + data.uid).then(res => {
              console.log(res);
              setMostUsedRoom(res.data);
          })
      }
  
      const [mostLoggedWith, setMostLoggedWith] = useState([]);
  
      const getMostLoggedWith = async () => {
          api.get("/StackOverflowersStudios/user/mostbookedwith/" + data.uid).then(res => {
              console.log(res);
              setMostLoggedWith(res.data);
          })
      }
    
    
    // console.log(data.uid);
    // console.log(loggedIn);
    return(
        <>
            <Navbar/>
            <br/>
            { loggedIn === true &&
                <Container style={{ height: 100 }}>
                <h2>The room you've used the most is:</h2>
                <h3>{mostUsedRoom.rname + " in the " + mostUsedRoom.rbuildname + " building."}</h3>
            </Container>
            }
            { loggedIn === true &&
                <Container style={{ height: 100 }}>
                <h2>The user you've been booked with the most is:</h2>
                <h3>{mostLoggedWith.username + "."}</h3>
            </Container>
            }
            <br/>
            <Container style={{ height: 350 }}>
                <h2>Most Used Rooms</h2>
                <BarChart width={830} height={250} data={rooms}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rname" />
                    <YAxis />
                    <Tooltip />
                    <Legend verticalAlign="top" />
                    <Bar dataKey="times_used" fill="#8884d8" />
                </BarChart>
            </Container>
            {/* <Container style={{ height: 350 }}>
                <h2>Most Booked Users</h2>
                <BarChart width={730} height={250} data={users}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="username"/>
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="times_booked" fill="#8884d8" />
                </BarChart>
            </Container> */}
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
                <BarChart width={830} height={250} data={timeSlots}>
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
export default BookMeeting;
