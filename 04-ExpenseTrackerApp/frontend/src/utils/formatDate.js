/*
- This code defines a function to format a timestamp into a readable date string.
- The function parses the timestamp to ensure it's in milliseconds.
- It then converts this timestamp into a Date object.
- The function formats the date according to specified options.
- Finally, it returns the formatted date string.
*/

// Function to format a given timestamp into a human-readable date string
export function formatDate(timestamp) {
	// Parse the timestamp to ensure it's an integer representing milliseconds
	const date = new Date(parseInt(timestamp));
	// Define formatting options: 2-digit day, short month, and numeric year
	const options = { day: "2-digit", month: "short", year: "numeric" };
	// Format the date to a string using the specified options and return it
	return date.toLocaleDateString("en-US", options);
}

// Example usage:
const timestamp = 1704067200000; // Sample timestamp
const formattedDate = formatDate(timestamp); // Format the timestamp
console.log(formattedDate); // Output the formatted date, e.g., "12 Dec 2023"
