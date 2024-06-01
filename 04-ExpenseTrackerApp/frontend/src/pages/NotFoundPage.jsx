/*
- This code defines a React functional component called NotFound.
- It displays a 404 error page indicating that the requested resource could not be found.
- The page includes an image, a message, and a button to navigate back to the homepage.
- The component uses Tailwind CSS classes for styling.
- It is exported as the default export of the module.
*/

const NotFound = () => {
	// Returns the JSX to render the NotFound component
	return (
		<section>
			{/* Main container with white text */}
			<div className="text-white">
				{/* Flex container to center content vertically and horizontally */}
				<div className="flex h-screen">
					{/* Centered content container */}
					<div className="m-auto text-center">
						{/* Image container */}
						<div>
							<img src="/404.svg" alt="404" />
						</div>
						{/* Message indicating the resource doesn't exist */}
						<p className="text-sm md:text-base text-[#F6009B] p-2 mb-4">The stuff you were looking for {"doesn't"} exist</p>
						{/* Link to navigate back to the homepage */}
						<a
							href="/"
							className="bg-transparent hover:bg-[#F6009B] text-[#F6009B] hover:text-white rounded shadow hover:shadow-lg py-2 px-4 border border-[#F6009B] hover:border-transparent"
						>
							Take me home
						</a>
					</div>
				</div>
			</div>
		</section>
	);
};

export default NotFound;
