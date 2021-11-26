import React, {Component, useEffect, useRef, useState} from 'react';
import {Button, Divider, Form, Grid, GridColumn, Header, Modal, Segment, Tab} from 'semantic-ui-react';
import Navbar from "./components/Navbar";
import axios from "axios";

function HomePage() {
    const [open, setOpen] = useState(false);
    const handleChange = (event, newValue) => {
        setOpen(true);
    }
    const [emailReg, setEmailReg] = useState("");
    const [passwordReg, setPasswordReg] = useState("");
    const [loginStatus, setloginStatus] = useState(false);
    const [loginMessage, setloginMessage] = useState("");
    console.log(emailReg);
    const login = () => {
        let data = {email: emailReg, password: passwordReg}
        axios.post(`http://${window.url}/StackOverflowersStudios/login`,
            data,
            {headers: {'Content-Type': 'application/json'}}//text/plain //application/json
        ).then((response) => {
            console.log(response);
            setloginStatus(true);
            setloginMessage('Logged in');
            localStorage.setItem("login-data", JSON.stringify(response.data))
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
                        <Button content='Login' primary onClick={login} />
                    </Form>
                        </Grid.Column>
                    {loginMessage}
                </Segment>
            </Segment>
        </>
    )
}

export default HomePage;
