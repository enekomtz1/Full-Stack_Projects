/*
- Import necessary components and hooks from external libraries and local files.
- Declare the SettingsPage functional component.
- Initialize hooks for showing toast notifications and handling user logout.
- Define an asynchronous function to freeze the user account.
- Handle the user confirmation prompt for account freezing.
- Use fetch API to send a PUT request to the server to freeze the account.
- Handle server responses and display appropriate toast messages.
- Implement a React component return that includes text and a button for freezing the account.
*/

// Import required components from Chakra UI and custom hooks for logout and toast notifications.
import { Button, Text } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import useLogout from "../hooks/useLogout";

// Define the functional component for the Settings Page.
export const SettingsPage = () => {
	// Initialize toast notification hook.
	const showToast = useShowToast();
    
	// Initialize logout function hook.
	const logout = useLogout();

	// Define an asynchronous function to freeze the user's account.
	const freezeAccount = async () => {
		// Confirm with the user before proceeding to freeze the account.
		if (!window.confirm("Are you sure you want to freeze your account?")) return;

		try {
			// Send a PUT request to freeze the user account.
			const res = await fetch("/api/users/freeze", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
			});
			// Parse the JSON response from the server.
			const data = await res.json();

			// Check for errors in the response and show an error toast if any.
			if (data.error) {
				return showToast("Error", data.error, "error");
			}
			// If the request is successful, logout the user and show a success toast.
			if (data.success) {
				await logout();
				showToast("Success", "Your account has been frozen", "success");
			}
		} catch (error) {
			// Catch any errors during the fetch operation and show an error toast.
			showToast("Error", error.message, "error");
		}
	};

	// Render the settings page content including text and a button to freeze the account.
	return (
		<>
			<Text my={1} fontWeight={"bold"}>
				Freeze Your Account
			</Text>
			<Text my={1}>You can unfreeze your account anytime by logging in.</Text>
			<Button size={"sm"} colorScheme="red" onClick={freezeAccount}>
				Freeze
			</Button>
		</>
	);
};
