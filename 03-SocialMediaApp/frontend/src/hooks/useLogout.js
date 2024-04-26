/*
- This file defines a custom hook for handling user logout in a React application.
- It utilizes Recoil for state management and a custom hook for showing toast messages.
- The logout process is handled by sending a POST request to the server.
- Upon successful logout, it clears the user data from local storage and Recoil state.
- If an error occurs during the logout process, it displays an error message using toast.
*/

import userAtom from "../atoms/userAtom"; // Import the user state atom from Recoil
import { useSetRecoilState } from "recoil"; // Import Recoil hook for setting state
import useShowToast from "./useShowToast"; // Import the custom hook for showing toast notifications

const useLogout = () => {
	const setUser = useSetRecoilState(userAtom); // Initialize the Recoil state setter for user data
	const showToast = useShowToast(); // Initialize the function for showing toast messages

	const logout = async () => {
		try {
			// Attempt to log out by sending a POST request to the server
			const res = await fetch("/api/users/logout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json(); // Parse the JSON response from the server

			if (data.error) {
				// If the server responds with an error, display it using a toast message
				showToast("Error", data.error, "error");
				return;
			}

			// Remove user-related data from local storage on successful logout
			localStorage.removeItem("user-threads");

			// Clear the user data from Recoil state
			setUser(null);
		} catch (error) {
			// If an error occurs during the fetch operation, display it using a toast message
			showToast("Error", error, "error");
		}
	};

	return logout; // Return the logout function for use in components
};

export default useLogout; // Export the custom hook
