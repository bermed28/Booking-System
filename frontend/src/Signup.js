import React, {Component, useEffect, useRef, useState} from 'react';
import {Button, Divider, Form, Grid, GridColumn, Header, Modal, Segment, Tab} from 'semantic-ui-react';
import Navbar from "./components/Navbar";
import axios from "axios";

function HomePage() {

    const [open, setOpen] = useState(false);
    const handleChange = (event, newValue) => {
        setOpen(true);
    }
    const [userReg, setUserReg] = useState("");
    const [emailReg, setEmailReg] = useState("");
    const [passwordReg, setPasswordReg] = useState("");
    const [firstNameReg, setFirstNameReg] = useState("");
    const [lastNameReg, setLastNameReg] = useState("");
    const [permissionReg, setPermissionReg] = useState("Student");
    const [signupMessage, setSignupMessage] = useState("Not submitted yet");

    console.log(emailReg);
    const signup = () => {
        if(userReg==="" || emailReg==="" || passwordReg==="" || firstNameReg==="" || lastNameReg===""){
            console.log("Empty Field")
            setSignupMessage("empty Field or invalid field");
        }
        let data = {username: userReg, uemail: emailReg, upassword: passwordReg,
            ufirstname: firstNameReg, ulastname: lastNameReg, upermission: permissionReg};
        console.log(data);
        axios.post("http://localhost:8080/StackOverflowersStudios/users",
            data,
            {headers: {'Content-Type': 'application/json'}}//text/plain //application/json
        ).then((response) => {
            console.log(response);
        },(error) => {
            console.log(error);
        });
    }

    return (
        <>
            <Navbar/>
            <Segment><Header dividing textAlign="center" size="huge">Sign Up for Calendearly</Header>
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
                            setUserReg(e.target.value)
                        }}
                            icon='user'
                            iconPosition='left'
                            label='Username'
                            type='username' />
                        <Form.Input onChange={(e) => {
                            setEmailReg(e.target.value)
                        }}
                            icon='user'
                            iconPosition='left'
                            label='Email'
                            placeholder='Email' />
                        <Form.Input onChange={(e) => {
                            setPasswordReg(e.target.value)
                        }}
                            icon='lock'
                            iconPosition='left'
                            label='Password'
                            type='password' />
                         <Form.Input onChange={(e) => {
                            setFirstNameReg(e.target.value)
                        }}
                            icon='name'
                            iconPosition='left'
                            label='First Name'
                            type='name' />
                         <Form.Input onChange={(e) => {
                            setLastNameReg(e.target.value)
                        }}
                            icon='name'
                            iconPosition='left'
                            label='Last Name'
                            type='name' />
                    <select style={{width: "250px",} } onChange={(e) => {
                            setPermissionReg(e.target.value)
                        }}>
                      <option selected value="Student">Student</option>
                      <option value="Department Staff">Department Staff</option>
                    </select>
                        <Button content='Signup' primary onClick={signup} />
                    </Form>
                        </Grid.Column>
                </Segment>
            </Segment>
        </>
    )
}

export default HomePage;
