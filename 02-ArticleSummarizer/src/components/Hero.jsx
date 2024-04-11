/*
- The Hero.jsx component serves as the hero section of a web application, displaying the logo,
  a link to a GitHub page, and introductory text about the service offered by the application.
- This component primarily consists of a header tag that structures the hero section,
  containing a navigation bar with the site's logo and a GitHub link button,
  followed by the main heading and subheading that introduce the service provided by the app.
*/

// Import React library for building user interface components.
import React from "react";

// Import the logo image from the assets directory.
import { logo } from "../assets";

// Define the Hero functional component.
const Hero = () => {
	// Render method returns the JSX for the hero section.
	return (
		// Header element defining the top section of the page.
		<header className="w-full flex justify-center items-center flex-col">
			{/* Navigation bar containing the logo and a button linking to GitHub */}
			<nav className="flex justify-between items-center w-full mb-10 pt-3">
				{/* Logo image */}
				<img src={logo} alt="logo" className="w-28 object-contain" />

				{/* Button linking to a GitHub profile, opens in a new tab */}
				<button type="button" onClick={() => window.open("https://github.com/enekomtz1", "_blank")} className="black_btn">
					GitHub
				</button>
			</nav>

			{/* Main title of the hero section */}
			<h1 className="head_text">
				Insight in an Instant
				<br className="max-md:hidden" /> {/* Line break for smaller screens */}
				<span className="title_blue_gradient">Summify Your Read</span>
			</h1>
			{/* Subtitle describing the service */}
			<h2 className="desc">Summify transforms lengthy articles into crisp, clear summaries, enabling you to grasp key insights in a fraction of the time.</h2>
		</header>
	);
};

export default Hero; // Export the Hero component for use in other parts of the application.
