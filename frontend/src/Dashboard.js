import React, {Component, useState, useEffect} from 'react';
import {Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import {Button, Card, Container, Modal} from "semantic-ui-react";
import {Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis} from "recharts";
import Navbar from "./components/Navbar";
import axios from 'axios';

const api = axios.create({
    baseURL : "http://192.168.0.11:8080/"
})

function BookMeeting(){

    const [rooms, setRooms] = useState([])

    const getRooms = async () => {
        api.get("/StackOverflowersStudios/reservation/most-used").then(res => {
            console.log(res);
            setRooms(res.data);
        })
    }

    const [users, setUsers] = useState([])

    const getUsers = async () => {
        api.get("/StackOverflowersStudios/reservation/most-booked").then(res => {
            console.log(res);
            setUsers(res.data);
        })
    }

    const [timeSlots, setTimeSlots] = useState([])

    const getTimeSlots = async () => {
        api.get("/StackOverflowersStudios/reservation/busiest-hours").then(res => {
            console.log(res);
            setTimeSlots(res.data);
        })
    }

    useEffect(() => {
        getRooms();
        getUsers();
        getTimeSlots();
      }, []);
    
    return(
        <>
            <Navbar/>
            <br/>
            <Container style={{ height: 350 }}>
                <h2>Most Used Rooms</h2>
                <BarChart width={730} height={250} data={rooms}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rname" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="times_used" fill="#8884d8" />
                </BarChart>
            </Container>
            <Container style={{ height: 350 }}>
                <h2>Most Booked Users</h2>
                <BarChart width={730} height={250} data={users}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="username" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="times_booked" fill="#8884d8" />
                </BarChart>
            </Container>
            <Container style={{ height: 350 }}>
                <h2>Busiest Time Slots</h2>
                <BarChart width={730} height={250} data={timeSlots}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tstarttime" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="times_booked" fill="#8884d8" />
                </BarChart>
            </Container>
        </>);


}
export default BookMeeting;
