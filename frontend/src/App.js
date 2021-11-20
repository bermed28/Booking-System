import Navbar from "./components/Navbar";
import {useNavigate} from "react-router-dom"


const App = () => {
    const navigate = useNavigate();
    let  routeChange= () => {
        navigate('/Home');
    }

    return(
        <>
            <Navbar></Navbar>
            <div id={"Greeting"}>
                <h3>Welcome to Calendearly by StackOverflowers Studios!</h3>
                <button id={"SignUp"} onClick={routeChange}>Sign Up/Log In</button>
            </div>
        </>
    );
}

export default App;