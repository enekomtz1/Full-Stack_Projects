/*
- Define a custom React hook named `useGetUserProfile`.
- Use the `useState` hook to manage user data and loading state.
- Use the `useParams` hook to extract `username` from the URL parameters.
- Utilize a custom hook `useShowToast` to display notifications.
- Perform an asynchronous request to fetch user profile data from an API.
- Handle loading states, errors, and data setting within the hook.
- Utilize `useEffect` to trigger the data fetch whenever `username` changes.
*/

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "./useShowToast";

const useGetUserProfile = () => {
	// Initialize state variables for storing user data and loading status
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	// Extract the `username` from URL parameters
	const { username } = useParams();

	// Initialize toast notification functionality
	const showToast = useShowToast();

	// Effect to fetch user profile data when `username` changes
	useEffect(() => {
		// Define async function to fetch data
		const getUser = async () => {
			try {
				// Perform API request to fetch user profile
				const res = await fetch(`/api/users/profile/${username}`);
				const data = await res.json();

				// Handle potential errors from the API
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}

				// Handle specific business logic, e.g., user account is frozen
				if (data.isFrozen) {
					setUser(null);
					return;
				}

				// Set the fetched data to the state
				setUser(data);
			} catch (error) {
				// Display error notification if fetching fails
				showToast("Error", error.message, "error");
			} finally {
				// Set loading state to false once data fetching is complete or fails
				setLoading(false);
			}
		};

		// Call the fetch function
		getUser();
	}, [username, showToast]); // Dependency array to control effect re-execution

	// Return the user data and loading state
	return { loading, user };
};

// Export the custom hook for use in other components
export default useGetUserProfile;
