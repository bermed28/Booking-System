import React, {Component, useEffect, useRef, useState} from 'react';
import {Button, Divider, Form, Grid, GridColumn, Header, Modal, Segment, Tab} from 'semantic-ui-react';
import Navbar from "./components/Navbar";
import axios from "axios";
import {useNavigate} from "react-router-dom";
const app = require("./App");


const api = axios.create({
    baseURL : app.BackendURL //'http://localhost:8080'
})


function SettingsPage() {
    const [open, setOpen] = useState(false);
    const [userReg, setUserReg] = useState("");
    const [emailReg, setEmailReg] = useState("");
    const [passwordReg, setPasswordReg] = useState("");
    const [firstNameReg, setFirstNameReg] = useState("");
    const [lastNameReg, setLastNameReg] = useState("");

    const [statusMessage, setStatusMessage] = useState("");
    const [loginStatus, setloginStatus] = useState(false);

    var tempData = localStorage.getItem("login-data");
    let navigator = useNavigate();

    useEffect(() => {
        tempData = localStorage.getItem("login-data");
        if(tempData) {
            setloginStatus(true);
        }else{
            navigator("/");
        }
    }, []);

    const updateSettings = () => {
        const userData = JSON.parse(tempData);
        if(userReg==="" && emailReg==="" && passwordReg==="" && firstNameReg==="" && lastNameReg===""){
            console.log("No changes")
            setStatusMessage("No changes where made");
        }else {
            let data = {
                username: userReg, uemail: emailReg, upassword: passwordReg,
                ufirstname: firstNameReg, ulastname: lastNameReg, upermission: userData.upermission
            };
            console.log(data);
            if (userReg === "") {
                data.username = userData.username;
            }
            if (emailReg === "") {
                data.uemail = userData.uemail;
            }
            if (passwordReg === "") {
                data.upassword = userData.upassword;
            }
            if (firstNameReg === "") {
                data.ufirstname = userData.ufirstname;
            }
            if (lastNameReg === "") {
                data.ulastname = userData.ulastname;
            }
            console.log(data);
            console.log(userData.uid);
            api.put("/StackOverflowersStudios/users/" + userData.uid,
                data,
                {headers: {'Content-Type': 'application/json'}}//text/plain //application/json
            ).then((response) => {
                console.log(response);
                localStorage.setItem("login-data", JSON.stringify(response.data));
                setStatusMessage("Changes were made successfully")
            }, (error) => {
                console.log(error);
            });
        }
    }
    const deleteAccount = () => {
        const userData = JSON.parse(tempData);
        console.log(userData)
        let uid = 0;
        if(userData !==null){
            uid = userData.uid;
        }
        console.log("About to end your whole career");
        api.delete("/StackOverflowersStudios/users/" + uid).then((response) => {
            setloginStatus(false);
            localStorage.removeItem("login-data");
            navigator("/");
        },(error) => {
            setStatusMessage("You can't erase your account because you have pending reservations.");
            console.log(error);
        });

    }
    return (
        <>
            <Navbar/>
            <Modal open={open} onClose={() => setOpen(false)} onOpen={() => setOpen(true)}>
                <Modal.Header> Confirm (*This cannot be reversed*) <Button color={"blue"} content='Cancel' onClick={() => {setOpen(false)}}/> </Modal.Header>
                <Modal.Content>
                    <Modal.Description></Modal.Description>
                    <Modal.Actions> Are you sure you want to delete your account? <Button color={"red"} content='Delete' onClick={deleteAccount} /> </Modal.Actions>
                </Modal.Content>
            </Modal>
            <Segment><Header dividing textAlign="center" size="huge">Account Settings</Header>
                <Segment placeholder>
                    <Grid.Column>
                        <Form>
                            <Form.Input onChange={(e) => {
                                setFirstNameReg(e.target.value)
                            }}
                                        icon='name'
                                        iconPosition='left'
                                        label='First Name'
                                        type='name'
                                        placeholder='First Name'/>
                            <Form.Input onChange={(e) => {
                                setLastNameReg(e.target.value)
                            }}
                                        icon='name'
                                        iconPosition='left'
                                        label='Last Name'
                                        type='name'
                                        placeholder='Last Name' />

                            <Form.Input onChange={(e) => {
                                setUserReg(e.target.value)
                            }}
                                        icon='user'
                                        iconPosition='left'
                                        label='Username'
                                        type='username'
                                        placeholder='Username' />
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
                                        type='password'
                                        placeholder='Password'/>
                            <Button content='Update' primary onClick={updateSettings} />
                        </Form>
                        <br/>
                        <Button content='Delete' color={"red"} onClick={() => {setOpen(true)}} />
                    </Grid.Column>
                    <h3>{statusMessage}</h3>
                </Segment>
            </Segment>
        </>
    )
}

export default SettingsPage;
