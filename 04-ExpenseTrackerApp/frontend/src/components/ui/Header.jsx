/*
- This code defines a React component called `Header`.
- It renders a styled header section for a web page.
- The header includes a title with responsive text sizes.
- It uses React Router's `Link` for navigation within the app.
- The component also adds decorative gradients below the title.
*/

import { Link } from "react-router-dom";

const Header = () => {
	// Return the JSX to render the header component
	return (
		// Main container with margin-bottom of 10 units
		<div className="mb-10">
			{/* Header title with responsive text sizes, bold font, centered alignment, and white text */}
			<h1 className="md:text-6xl text-4xl lg:text-8xl font-bold text-center  relative z-50 text-white pt-10">
				{/* The title contains a link that navigates to the home page Expense <Link to="/">GQL</Link> */}
			</h1>
			{/* Container for the gradient decorations, visible only on medium and larger screens */}
			<div className="relative mb-10 w-1/2 mx-auto hidden md:block">
				{/* Gradients */}
				{/* First gradient line with a blur effect */}
				<div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />

				{/* Second gradient line without blur */}
				<div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />

				{/* Third gradient line with a different color and blur effect */}
				<div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />

				{/* Fourth gradient line without blur */}
				<div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
			</div>
		</div>
	);
};

export default Header;
