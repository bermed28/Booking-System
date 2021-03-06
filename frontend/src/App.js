import Navbar from "./components/Navbar";
import {Button, Divider, Grid, Segment} from 'semantic-ui-react';
import {Link} from "react-router-dom"
import "./App.css"

/**
 * Example of using [var,setVar]:
 *  const navigate = useNavigate();
 *  const [open, setOpen] = useState(false);
 *  let  routeChange= () => {
 *      navigate('/Home');
 *  }
 *  const handleChange = (event, newValue) => {
 *      setOpen(true);
 *  }
 */
const App = () => {

    return(
        <>
            <Navbar/>
            <Segment placeholder>
                <Grid columns={2} relaxed='very' stackable>
                    <Grid.Column>
                        <div className="container">
                            <img alt="Calendar Picture" src={require("./Assets/mini-calendar-2022-printable-planner-cards-04-01.jpg").default}/>
                        </div>
                    </Grid.Column>
                    <Grid.Column verticalAlign='middle'>
                        <div className="container" style={{border: '1px solid rgba(0, 0, 0, 0.05)', textAlign: "center", verticalAlign: "baseline", background: "white", borderWidth: 2, borderColor: "black", padding: 3}}>
                            <h1>A New Way to Meet</h1>
                            <p>Set up important meetings and reservations with your colleagues, <br/> or simply reserve a space to meet
                                with your friends and loved ones. <br/> All from one place.
                            </p>
                            <Link to="Signup">
                                <Button content='Get started' icon='calendar' size='big' color="violet" />
                            </Link>
                        </div>
                    </Grid.Column>
                </Grid>
                <Divider> </Divider>
            </Segment>
        </>
    );
}

const debug = false;
let url = "";
if(debug){
    url = "http://localhost:8080";
}
else {
    url = "https://bs-stackoverflowers-backend.herokuapp.com";
}
export const BackendURL = url;
export default App;