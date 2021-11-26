import Navbar from "./components/Navbar";
import {Button, Divider, Form, Grid, Header, Modal, Segment, Tab} from 'semantic-ui-react';
import {useNavigate, useState} from "react-router-dom"
import "./App.css"

const debug = true;

if(debug){
    window.url = "localhost:8080";
} else {
    window.url = "bs-stackoverflowers-backend.herokuapp.com"
}
const App = () => {
    // const navigate = useNavigate();
    // const [open, setOpen] = useState(false);
    // let  routeChange= () => {
    //     navigate('/Home');
    // }

    // const handleChange = (event, newValue) => {
    //     setOpen(true);
    // }

    return(
        <>
            <Navbar/>
            {/* <div id={"Greeting"}>
                <h3>Welcome to Calendearly by StackOverflowers Studios!</h3>
                <button id={"SignUp"} onClick={routeChange}>Sign Up/Log In</button>
            </div> */}
            <Segment placeholder>

            <Grid columns={2} relaxed='very' stackable>
                <Grid.Column>
                    <div className="container">
                        <img src={require("./Assets/mini-calendar-2022-printable-planner-cards-04-01.jpg").default}/>
                    </div>
                </Grid.Column>
                <Grid.Column verticalAlign='middle'>
                    <div className="container" style={{textAlign: "center", verticalAlign: "baseline"}}>
                        <h1>A New Way to Meet</h1>
                        <p>Set up important meetings and reservations with your colleagues, <br/> or simply reserve a space to meet
                            with your friends and loved ones. <br/> All from one place.
                        </p>
                        <Button content='Get started' icon='calendar' size='big' color="violet" />
                    </div>
                </Grid.Column>
            </Grid>

            <Divider></Divider>
        </Segment>
        </>
    );
}

export default App;