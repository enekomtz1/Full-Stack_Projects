/*
- This file defines the main structure of the Article Summarizer application.
- It uses React functional components and imports custom components (Hero and Demo),
- along with styling from App.css. The App component assembles the application's layout.
*/

import Hero from "./components/Hero"; // Import the Hero component from the components directory.
import Demo from "./components/Demo"; // Import the Demo component from the components directory.

import "./App.css"; // Import the CSS file for styling the App component.

const App = () => {
	return (
		<main>
			{/* The main HTML element that wraps the content of the application.*/}
			<div className="main">
				{/*A div element for the main background or section, styled with 'main' class.*/}
				<div className="gradient" /> {/*A child div element for background gradient effects, styled with 'gradient' class.*/}
			</div>
			<div className="app">
				{/*A div element that wraps the main components of the app, styled with 'app' class.*/}
				<Hero />
				<Demo />
			</div>
		</main>
	);
};

export default App; // Export the App component as the default export of this module.
