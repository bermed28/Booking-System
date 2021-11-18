import React, {Component, useState} from 'react';
import {Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import {Button, Card, Container, Modal} from "semantic-ui-react";
import {Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis} from "recharts";


function BookMeeting(){
    const [data, setData] = useState([{"name": 1, "Counts": 5},
                                                {"name": 2, "Counts": 4},
                                                {"name": 3, "Counts": 3},
                                                {"name": 4, "Counts": 2},
                                                {"name": 5, "Counts": 1}]);

    return <Container style={{ height: 800 }}>

        <BarChart width={730} height={250} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Counts" fill="#8884d8" />
        </BarChart>
    </Container>


}
export default BookMeeting;
