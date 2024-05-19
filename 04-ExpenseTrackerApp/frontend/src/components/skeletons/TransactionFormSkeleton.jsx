/*
- This code defines a React functional component called TransactionFormSkeleton.
- It serves as a placeholder or loading skeleton for a form used in transactions.
- The component helps improve user experience by showing a loading animation while data is being fetched.
- It uses Tailwind CSS classes for styling and animations.
- The skeleton includes multiple sections with animated placeholder elements to simulate content loading.
*/

const TransactionFormSkeleton = () => {
	// Return the skeleton structure
	return (
		// Main container div with max width, centered, and vertical padding
		<div className="h-screen max-w-xl mx-auto py-10">
			{/* Placeholder for the form header with animation */}
			<h3 className="h-6 bg-gray-200 rounded animate-pulse"></h3>

			{/* First list of placeholders with gap and animation */}
			<ul className="mt-5 flex gap-3">
				{/* List item placeholders */}
				<li className="w-full h-6 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></li>
				<li className="w-full h-6 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></li>
				<li className="w-full h-6 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></li>
			</ul>

			{/* Second list of placeholders with gap and animation */}
			<ul className="mt-5 flex gap-3">
				{/* List item placeholders */}
				<li className="w-full h-6 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></li>
				<li className="w-full h-6 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></li>
			</ul>

			{/* Third list of placeholders with gap and animation */}
			<ul className="mt-5 flex gap-3">
				{/* Single list item placeholder */}
				<li className="w-full h-6 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></li>
			</ul>
		</div>
	);
};

// Export the TransactionFormSkeleton component as the default export
export default TransactionFormSkeleton;
