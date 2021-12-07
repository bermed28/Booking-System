import React, {useEffect, useState} from 'react';
import {Form, Grid, Header, Segment} from 'semantic-ui-react';
import axios from "axios";
import "./components/Button.css";
import * as Icons from "react-icons/bi"
import DatePicker from 'react-date-picker';
const app = require('./App');

const api = axios.create({
    baseURL : app.BackendURL //'http://localhost:8080'
})

function FreeTime() {
    const [meetingMemberNames, setMeetingMemberNames] = useState("");
    const [timeSlots, setTimeSlots] = useState([]);
    const [day, setDay] = useState(new Date());
    const [loginStatus, setloginStatus] = useState(false);


    const getFreeTimes = () => {
        let memberData = {memberNames: meetingMemberNames.split(", ")};
        let date = day.getFullYear()+'-'+(day.getMonth()+1)+'-'+ day.getDate();
        const login_data = localStorage.getItem("login-data");

        api.post("/StackOverflowersStudios/users/usernames",
            memberData,
            {headers: {'Content-Type': 'application/json'}}//text/plain //application/json
        ).then((response) => {
            console.log(response.data);
            // let res = response.data.memberIds;
            // for(let i = 0; i < res.length; i++) {
            //     membersIds.push(res[i]);
            // }
            let membersIds = response.data.memberIds;
            membersIds.push(login_data.uid);
            let data = {uids: membersIds, usday: date};
            console.log(data);
            api.post("/StackOverflowersStudios/reservation/getFreeTime",
                data,
                {headers: {'Content-Type': 'application/json'}}//text/plain //application/json
            ).then((response) => {
                console.log(response.data);
                setTimeSlots(response.data);
            },(error) => {
                console.log(error);
            });
        },(error) => {
            console.log(error);
        });
        // console.log(membersIds);
        // console.log(date);
    }

    // useEffect(() => {
    //     const login_data = localStorage.getItem("login-data");
    // }, []);


    return (
        <>
            <Segment><Header dividing textAlign="center" size="huge">Find time slots where you and your invitees are available:</Header>
                <Segment placeholder>
                    <Grid.Column>
                        <div style={{textAlign: "center", }}>
                            <h4>Date</h4>
                            Select day to get free time slots in: &nbsp;
                            <DatePicker
                                onChange={(e) => {setDay(e); setTimeSlots([])}}
                                value={day}
                            />
                            <br/>
                            <br/>
                            <Form>
                                <Form.Input onChange={(e) => {
                                    setMeetingMemberNames(e.target.value)
                                }}
                                            icon='user'
                                            iconPosition='left'
                                            label='Users'
                                            type='text'
                                            placeholder='Fulano.Detal35, etc.' />
                                <p>**Please enter member usernames separated by a comma and a space.</p>
                                <div style={{display: "flex", justifyContent: "center"}}>
                                    <button className="btn-submit" onClick={getFreeTimes}><Icons.BiLogIn/> Submit</button>
                                </div>
                            </Form>
                            <br/>
                            {   timeSlots.length > 0 &&
                                <table style={{marginLeft: "auto", marginRight: "auto"}}>
                                    <thead>
                                    <tr>
                                        <th style={{padding: "5px", border: "1px solid black"}} scope={"col"}>Start
                                            Time
                                        </th>
                                        <th style={{padding: "5px", border: "1px solid black"}} scope={"col"}>End Time
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        timeSlots.map(item => {
                                                return (
                                                    <tr>
                                                        <td style={{
                                                            padding: "5px",
                                                            border: "1px solid black"
                                                        }}>{item.tstarttime}</td>
                                                        <td style={{
                                                            padding: "5px",
                                                            border: "1px solid black"
                                                        }}>{item.tendtime}</td>
                                                    </tr>
                                                )
                                            }
                                        )
                                    }
                                    </tbody>
                                </table>
                            }
                        </div>
                    </Grid.Column>
                </Segment>
            </Segment>
        </>
    )
}

export default FreeTime;
