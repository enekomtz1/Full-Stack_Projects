import "./App.css";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/SignUp";
import Home from "./Pages/Home/Home";
import { Route, Routes } from "react-router-dom";

function App() {
	return (
		<div className="p-4 h-screen flex items-center justify-center">
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
			</Routes>
		</div>
	);
}

export default App;
