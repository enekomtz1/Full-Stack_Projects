/*
- This code defines a logout button component using React and Chakra UI.
- It uses Recoil for state management and a custom hook to display notifications.
- The handleLogout function is triggered on button click.
- It performs an asynchronous POST request to log the user out.
- It handles success or error responses and updates the user state accordingly.
*/

import { Button } from "@chakra-ui/button"; // Import Button from Chakra UI for styling
import { useSetRecoilState } from "recoil"; // Import Recoil hook for state management
import userAtom from "../atoms/userAtom"; // Import the user state atom
import useShowToast from "../hooks/useShowToast"; // Import custom hook for displaying toast notifications
import { FiLogOut } from "react-icons/fi"; // Import logout icon from react-icons

// Define the LogoutButton component as a functional component
const LogoutButton = () => {
	// Hook to set the user state
	const setUser = useSetRecoilState(userAtom);

	// Hook to show toast notifications
	const showToast = useShowToast();

	// Define the handleLogout function, which is asynchronous
	const handleLogout = async () => {
		try {
			// Perform a POST request to the logout API endpoint
			const res = await fetch("/api/users/logout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});
			// Parse the JSON response
			const data = await res.json();

			// Check if the response contains an error
			if (data.error) {
				// Show error toast if there's an error
				showToast("Error", data.error, "error");
				return;
			}

			// Remove user threads from localStorage
			localStorage.removeItem("user-threads");

			// Reset the user state to null
			setUser(null);
		} catch (error) {
			// Show error toast if there's a network or other error
			showToast("Error", error, "error");
		}
	};

	// Return the button component with fixed position and an onClick handler
	return (
		<Button position={"fixed"} top={"30px"} right={"30px"} size={"sm"} onClick={handleLogout}>
			<FiLogOut size={20} /> {/* Display the logout icon */}
		</Button>
	);
};

// Export the LogoutButton component
export default LogoutButton;
