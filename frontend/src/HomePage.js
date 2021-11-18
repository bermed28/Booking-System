import React, {Component, useState} from 'react';
import {Button, Divider, Form, Grid, Header, Modal, Segment, Tab} from 'semantic-ui-react';



function HomePage() {
    const [open, setOpen] = useState(false);
    console.log(open);
    const handleChange = (event, newValue) => {
        setOpen(true);
    }

    return (<Segment><Header dividing textAlign="center" size="huge">Welcome to DB Demo</Header>
            <Modal
                centered={false}
                open={open}
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
            >
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
                        <Form>
                            <Form.Input
                                icon='user'
                                iconPosition='left'
                                label='Username'
                                placeholder='Username'
                            />
                            <Form.Input
                                icon='lock'
                                iconPosition='left'
                                label='Password'
                                type='password'
                            />
                            <Button content='Login' primary onClick={handleChange}/>
                        </Form>
                    </Grid.Column>
                    <Grid.Column verticalAlign='middle'>
                        <Button content='Sign up' icon='signup' size='big' onClick={handleChange}/>
                    </Grid.Column>
                </Grid>

                <Divider vertical>Or</Divider>
            </Segment>
        </Segment>
    )
}


export default HomePage;
