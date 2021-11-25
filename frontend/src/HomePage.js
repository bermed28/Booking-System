import React, {Component, useRef, useState} from 'react';
import {Button, Divider, Form, Grid, GridColumn, Header, Modal, Segment, Tab} from 'semantic-ui-react';
import Navbar from "./components/Navbar";
import axios from "axios";

function HomePage() {

    const [open, setOpen] = useState(false);
    console.log(open);
    const handleChange = (event, newValue) => {
        setOpen(true);
    }


    const Foo = () => {
        const emailInput = useRef(null);
        const ageInput = useRef(null);

        const handleSubmit = (event) => {
            event.preventDefault();

            const emailInput = event.target.email; // accessing directly
            const password = event.target.elements.password; // accessing via `form.elements`

            console.log(emailInput.value); // output: 'myemail@mail.com'
            console.log(password.value); // output: 'password'

            let res = getDataAxios(emailInput.value, password.value);
        }
        //Get request passing data through endpoint
        // async function getDataAxios(emailInput, passwordInput){
        //     const input = JSON.stringify({ "email": emailInput, "password": passwordInput});
        //     console.log(input);
        //     const res = await axios.get('http://192.168.1.9:8080/StackOverflowersStudios/login/' + emailInput + '/'+ passwordInput);
        //     console.log(res.data);
        //     return res;
        // }

        async function getDataAxios(emailInput, passwordInput){
            let data = {email: emailInput, password: passwordInput}
            let result = null;
            await axios.post("http://localhost:8080/StackOverflowersStudios/login",
                    data,
                  {headers: {'Content-Type': 'application/json' }}//text/plain //application/json
                  ).then((response) => {
                      console.log(response);
                      result = response.data
                    }, (error) => {
                      console.log(error);
                    });
            console.log(result)
        }

        return (
            <form onSubmit={handleSubmit}>
                <Form.Input icon='user' iconPosition='left' type="email" ref={emailInput} name="email" defaultValue="myemail@mail.com" label='Username' />
                <br/>
                <Form.Input icon='lock'  iconPosition='left' type="text" ref={ageInput} name="password" defaultValue="password" label='Password'/>
                <br/>
                <Button type="submit" content='Login' primary />
            </form>
        );
    };
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

            <Grid columns={2} relaxed='very' stackable>
                <Grid.Column>
                    {Foo()}
                </Grid.Column>
                <Grid.Column verticalAlign='middle'>
                    <Button content='Sign up' icon='signup' size='big' onClick={handleChange} />
                </Grid.Column>
            </Grid>

            <Divider vertical>Or</Divider>
        </Segment>
        </Segment>
        </>
        )
    }


export default HomePage;
