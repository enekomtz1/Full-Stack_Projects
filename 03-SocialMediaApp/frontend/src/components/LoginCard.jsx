/*
- This code implements a login component using React and Chakra UI.
- It utilizes state management with React's useState and Recoil's useSetRecoilState.
- The component handles user authentication through an asynchronous fetch API call.
- User credentials and login status are managed through local state and browser storage.
- The UI provides feedback and error handling using custom toast notifications.
*/

import { Flex, Box, FormControl, FormLabel, Input, InputGroup, InputRightElement, Stack, Button, Heading, Text, useColorModeValue, Link } from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";

export default function LoginCard() {
	// State hook for toggling visibility of the password in the UI.
	const [showPassword, setShowPassword] = useState(false);

	// Hook from Recoil state management library to update the authentication screen state.
	const setAuthScreen = useSetRecoilState(authScreenAtom);

	// Hook from Recoil for setting the user state upon successful login.
	const setUser = useSetRecoilState(userAtom);

	// State hook for managing the loading status, used to show a loading indicator during API requests.
	const [loading, setLoading] = useState(false);

	// State hook managing user inputs for username and password.
	const [inputs, setInputs] = useState({
		username: "",
		password: "",
	});

	// Custom hook to display toast notifications for errors, info, or success messages.
	const showToast = useShowToast();

	// Define the handler function for the login process.
	const handleLogin = async () => {
		setLoading(true); // Set the loading state to true to indicate the start of the login process.

		try {
			// Perform a POST request to the login API endpoint with the username and password as JSON.
			const res = await fetch("/api/users/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json", // Specify that the request body format is JSON.
				},
				body: JSON.stringify(inputs), // Convert the username and password inputs to a JSON string.
			});
			const data = await res.json(); // Parse the JSON response from the server.

			if (data.error) {
				// If the server responds with an error, display a toast notification with the error message.
				showToast("Error", data.error, "error");
				return; // Exit the function early if there is an error.
			}

			// On successful login, store the user data in local storage for session persistence.
			localStorage.setItem("user-threads", JSON.stringify(data));

			// Update the global user state with the received data using Recoil.
			setUser(data);
		} catch (error) {
			// Handle any errors that occur during the fetch operation, such as network issues.
			showToast("Error", error.message || "An unexpected error occurred", "error");
		} finally {
			setLoading(false); // Reset the loading state to false regardless of the outcome.
		}
	};

	// Render the login UI.
	return (
		<Flex align={"center"} justify={"center"}>
			{/* Stack container for vertical spacing and center alignment */}
			<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
				{/* Heading section with a centered heading for the Login */}
				<Stack align={"center"}>
					<Heading fontSize={"4xl"} textAlign={"center"}>
						Login
					</Heading>
				</Stack>

				{/* Login box with conditional background color and shadow based on the theme */}
				<Box
					rounded={"lg"}
					bg={useColorModeValue("white", "gray.dark")}
					boxShadow={"lg"}
					p={8}
					w={{
						base: "full",
						sm: "400px",
					}}
				>
					{/* Stack for form controls with spacing */}
					<Stack spacing={4}>
						{/* Form control for username input */}
						<FormControl isRequired>
							<FormLabel>Username</FormLabel>
							<Input type="text" value={inputs.username} onChange={(e) => setInputs((inputs) => ({ ...inputs, username: e.target.value }))} />
						</FormControl>

						{/* Form control for password input */}
						<FormControl isRequired>
							<FormLabel>Password</FormLabel>
							<InputGroup>
								<Input type={showPassword ? "text" : "password"} value={inputs.password} onChange={(e) => setInputs((inputs) => ({ ...inputs, password: e.target.value }))} />

								{/* Button to toggle password visibility */}
								<InputRightElement h={"full"}>
									<Button variant={"ghost"} onClick={() => setShowPassword((showPassword) => !showShowPassword)}>
										{showPassword ? <ViewIcon /> : <ViewOffIcon />}
									</Button>
								</InputRightElement>
							</InputGroup>
						</FormControl>

						{/* Button stack with top padding */}
						<Stack spacing={10} pt={2}>
							<Button
								loadingText="Logging in"
								size="lg"
								bg={useColorModeValue("gray.600", "gray.700")}
								color={"white"}
								_hover={{
									bg: useColorModeValue("gray.700", "gray.800"),
								}}
								onClick={handleLogin}
								isLoading={loading}
							>
								Login
							</Button>
						</Stack>

						{/* Link to switch to the signup screen */}
						<Stack pt={6}>
							<Text align={"center"}>
								Don't have an account?{" "}
								<Link color={"blue.400"} onClick={() => setAuthScreen("signup")}>
									Sign up
								</Link>
							</Text>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
}
