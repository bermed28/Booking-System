import React, {useEffect, useState} from 'react';
import {Button, Form, Grid, Header, Segment} from 'semantic-ui-react';
import Navbar from "./components/Navbar";
import axios from "axios";
import {useNavigate} from "react-router-dom";
const app = require("./App");

function SignupPage() {

    const [userReg, setUserReg] = useState("");
    const [emailReg, setEmailReg] = useState("");
    const [passwordReg, setPasswordReg] = useState("");
    const [firstNameReg, setFirstNameReg] = useState("");
    const [lastNameReg, setLastNameReg] = useState("");
    const [permissionReg, setPermissionReg] = useState("");
    const [signupMessage, setSignupMessage] = useState("Not submitted yet");
    const [signupStatus, setSignupStatus] = useState(false);
    const [errorOccurred, setErrorOccurred] = useState(false);

    const signup = () => {
        if(userReg==="" || emailReg==="" || passwordReg==="" || firstNameReg==="" || lastNameReg==="" || permissionReg === ""){
            console.log("Empty Field")
            setSignupMessage("Empty Field or Invalid Field");
        } else {
            let data = {
                username: userReg, uemail: emailReg, upassword: passwordReg,
                ufirstname: firstNameReg, ulastname: lastNameReg, upermission: permissionReg
            };
            console.log(data);
            axios.post(`${app.BackendURL}/StackOverflowersStudios/users`,
                data,
                {headers: {'Content-Type': 'application/json'}}//text/plain //application/json
            ).then((response) => {
                console.log(response);
                setErrorOccurred(false);
                setSignupStatus(true);
            }, (error) => {
                console.log(error);
                setErrorOccurred(true);
            });
        }
    }

    const [loginStatus, setloginStatus] = useState(false);
    var tempData = localStorage.getItem("login-data");
    useEffect(() => {
        tempData = localStorage.getItem("login-data");
        if(tempData) {
            setloginStatus(true);
        }
    }, []);

    let navigator = useNavigate();
    if(loginStatus || signupStatus) {
        navigator("/");
    }

    return (
        <>
            <Navbar/>
            <Segment><Header dividing textAlign="center" size="huge">Sign Up for Calendearly</Header>
                <Segment placeholder>
                    <Grid.Column>
                        <Form>
                            <Form.Input onChange={(e) => {
                                setFirstNameReg(e.target.value)
                            }}
                                        icon='address card'
                                        iconPosition='left'
                                        label='First Name'
                                        type='name'
                                        placeholder='First Name'/>
                            <Form.Input onChange={(e) => {
                                setLastNameReg(e.target.value)
                            }}
                                        icon='address card outline'
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
                                        icon='envelope'
                                        iconPosition='left'
                                        label='Email'
                                        placeholder='Email' />
                            <Form.Input onChange={(e) => {
                                setPasswordReg(e.target.value)
                            }}
                                        icon='lock'
                                        iconPosition='left'
                                        label='Password'
                                        type='password'
                                        placeholder='Password'/>
                            <div align='center'>
                                <div style={{paddingRight: "140px", margin: "5px"}} >
                                    <h5><strong>Permission</strong></h5>
                                </div>
                                <select defaultValue={""} style={{width: "210px", textAlign: "center"}} onChange={(e) => {setPermissionReg(e.target.value)}}>
                                    <option value={""}>Select Permission</option>
                                    <option value="Student">Student</option>
                                    <option value="Department Staff">Department Staff</option>
                                </select>
                                <br/>
                            </div>
                            <Button content='Signup' primary onClick={signup} />
                        </Form>
                        { !signupStatus &&
                            <h3 style={{color: "red"}}>{signupMessage}</h3>
                        }
                        {errorOccurred &&
                            <h3 style={{color: "red"}}>**Username is already taken.</h3>
                        }
                    </Grid.Column>
                </Segment>
            </Segment>
        </>
    )
}

export default SignupPage;