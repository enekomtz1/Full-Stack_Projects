import "./App.css";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/SignUp";
import Home from "./Pages/Home/Home";

function App() {
	return (
		<div className="p-4 h-screen flex items-center justify-center">
			{/*<Signup></Signup>*/}
			<Home />
		</div>
	);
}

export default App;
