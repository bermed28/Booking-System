import Navbar from "./components/Navbar";

const App = () => {
    let name = "Chris";

    function onClick() {
        const element  = document.getElementById("greet");
        if(element.innerText === "Press the button") {
            element.innerText = "Hello Chris";
        }
        else {
            element.innerText = "Press the button"
        }
    }

    // return (
    //     <div>
    //         <h1 id="greet" style={{color : "white", backgroundColor : "black"}}>Press the button</h1>
    //         <button className="btn" onClick={onClick}>Press me!</button>
    //     </div>
    // )
    return(
        <Navbar/>
    )
}

export default App;