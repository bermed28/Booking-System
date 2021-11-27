import React, {Component, useEffect, useRef, useState} from 'react';
import {Divider, Form, Grid, GridColumn, Header, Modal, Segment, Tab} from 'semantic-ui-react';
import Navbar from "./components/Navbar";
import axios from "axios";
import Button from "./components/Button";
import "./components/Button.css";
import {Link} from "react-router-dom";
import * as Icons from "react-icons/bi"
const app = require('./App');

function Login() {
    const [open, setOpen] = useState(false);
    const handleChange = (event, newValue) => {
        setOpen(true);
    }
    const [emailReg, setEmailReg] = useState("");
    const [passwordReg, setPasswordReg] = useState("");
    const [loginStatus, setloginStatus] = useState(false);
    const [loginMessage, setloginMessage] = useState("");

    const login = () => {
        let data = {email: emailReg, password: passwordReg}
        axios.post(`${app.BackendURL}/StackOverflowersStudios/login`,
            data,
            {headers: {'Content-Type': 'application/json'}}//text/plain //application/json
        ).then((response) => {
            console.log(response);
            setloginStatus(true);
            setloginMessage('Logged in');
            localStorage.setItem("login-data", JSON.stringify(response.data));
            window.location.reload(false);
        },(error) => {
            // setloginStatus(false);
            setloginMessage('Wrong email or password');
            console.log(error);
        });
    }
    useEffect(() => {
        const login_data = localStorage.getItem("login-data");
        if (login_data) {
            setloginStatus(true);
        }
    }, []);


    return (
        <>
            <Navbar/>
            <Segment><Header dividing textAlign="center" size="huge">Sign in to use Calendearly</Header>
                <Modal centered={false} open={open} onClose={() => setOpen(false)} onOpen={() => setOpen(true)}>
                    <Modal.Header>Needs changing!</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            This is a modal but it serves to show how buttons and functions can be implemented.
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={() => setOpen(false)}>OK</Button>
                    </Modal.Actions>
                </Modal>
                <Segment placeholder>
                    <Grid.Column>
                        <Form>
                        <Form.Input onChange={(e) => {
                            setEmailReg(e.target.value)
                        }}
                            icon='user'
                            iconPosition='left'
                            label='Email'
                            type='email'
                            placeholder='Email' />
                        <Form.Input onChange={(e) => {
                            setPasswordReg(e.target.value)
                        }}
                            icon='lock'
                            iconPosition='left'
                            label='Password'
                            type='password' />
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <Link to={"/"} style={{color: "white"}}>
                                <button className="btn-submit" onClick={login}><Icons.BiLogIn/> Login</button>
                            </Link>
                        </div>

                    </Form>
                </Grid.Column>
                </Segment>
            </Segment>
        </>
    )
}

export default Login;
