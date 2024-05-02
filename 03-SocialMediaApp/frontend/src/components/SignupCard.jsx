/*
- This code defines a React component named `SignupCard` for user registration.
- Utilizes Chakra UI for styling and layout to create a visually appealing form.
- Manages user input state with React's `useState` and handles form submission.
- Integrates with a backend via POST request to `/api/users/signup` to register users.
- Uses Recoil for global state management and displays error or success messages with custom hooks.
*/

// Import necessary components from Chakra UI for styling and layout of the signup card

import { Flex, Box, FormControl, FormLabel, Input, InputGroup, HStack, InputRightElement, Stack, Button, Heading, Text, useColorModeValue, Link } from "@chakra-ui/react";
// Import the useState hook from React for state management within the SignupCard component

import { useState } from "react";
// Import icons from Chakra UI used for toggling the visibility of the password input

import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
// Import Recoil hook for setting a Recoil state, used here for managing authentication and user state globally

import { useSetRecoilState } from "recoil";
// Import the global state atom for managing which authentication screen is displayed
import authScreenAtom from "../atoms/authAtom";

// Import a custom hook for displaying toast notifications to provide feedback or error messages to the user
import useShowToast from "../hooks/useShowToast";

// Import the global state atom used to store and manage user data across the application
import userAtom from "../atoms/userAtom";

export default function SignupCard() {
	// State for managing visibility of the password field
	const [showPassword, setShowPassword] = useState(false);

	// Recoil state hook to change the current authentication screen (e.g., from signup to login)
	const setAuthScreen = useSetRecoilState(authScreenAtom);

	// State for managing form inputs: name, username, email, and password
	const [inputs, setInputs] = useState({
		name: "",
		username: "",
		email: "",
		password: "",
	});

	// Custom hook for displaying toast notifications, useful for showing success or error messages
	const showToast = useShowToast();

	// Recoil state hook for setting the user data globally after successful signup
	const setUser = useSetRecoilState(userAtom);

	// Function to handle user registration
	const handleSignup = async () => {
		try {
			// Sending the user input data to the server for registration using a POST request.
			// The 'Content-Type' header indicates that the body of the request is JSON.
			const res = await fetch("/api/users/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(inputs), // Convert the inputs state to a JSON string
			});
			const data = await res.json(); // Parsing the JSON response from the server

			// Check if the server response contains an error field and display it using a toast notification.
			if (data.error) {
				showToast("Error", data.error, "error"); // Using a custom hook to show error messages
				return; // Exit the function if there is an error
			}

			// If registration is successful, store the user data in localStorage and update the global user state.
			localStorage.setItem("user-threads", JSON.stringify(data)); // Storing user data for session re-use
			setUser(data); // Updating the global state with the new user data
		} catch (error) {
			// Handle any errors that occur during the fetch operation
			showToast("Error", error, "error"); // Show an error toast if something goes wrong with the network request
		}
	};

	return (
		/* Main container using Flex layout to align and justify the signup card centrally */
		<Flex align={"center"} justify={"center"}>
			{/* Outer Stack to manage the overall spacing and padding around the signup card */}
			<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
				{/* Stack for aligning the 'Sign up' heading in the center */}
				<Stack align={"center"}>
					{/* Heading displaying the 'Sign up' text */}
					<Heading fontSize={"4xl"} textAlign={"center"}>
						Sign up
					</Heading>
				</Stack>

				{/* Box container for the form elements with rounded borders, background color, and shadow */}
				<Box rounded={"lg"} bg={useColorModeValue("white", "gray.dark")} boxShadow={"lg"} p={8}>
					{/* Stack for vertical spacing of form elements */}
					<Stack spacing={4}>
						{/* Horizontal Stack for full name and username input fields */}
						<HStack>
							<Box>
								{/* Form control for full name with label and input */}
								<FormControl isRequired>
									<FormLabel>Full name</FormLabel>
									<Input type="text" onChange={(e) => setInputs({ ...inputs, name: e.target.value })} value={inputs.name} />
								</FormControl>
							</Box>
							<Box>
								{/* Form control for username with label and input */}
								<FormControl isRequired>
									<FormLabel>Username</FormLabel>
									<Input type="text" onChange={(e) => setInputs({ ...inputs, username: e.target.value })} value={inputs.username} />
								</FormControl>
							</Box>
						</HStack>

						{/* Form control for email address with label and input */}
						<FormControl isRequired>
							<FormLabel>Email address</FormLabel>
							<Input type="email" onChange={(e) => setInputs({ ...inputs, email: e.target.value })} value={inputs.email} />
						</FormControl>

						{/* Form control for password with label, input and toggle visibility button */}
						<FormControl isRequired>
							<FormLabel>Password</FormLabel>
							<InputGroup>
								<Input type={showPassword ? "text" : "password"} onChange={(e) => setInputs({ ...inputs, password: e.target.value })} value={inputs.password} />

								{/* Button to toggle password visibility */}
								<InputRightElement h={"full"}>
									<Button variant={"ghost"} onClick={() => setShowPassword((showPassword) => !showPassword)}>
										{showPassword ? <ViewIcon /> : <ViewOffIcon />}
									</Button>
								</InputRightElement>
							</InputGroup>
						</FormControl>

						{/* Stack for spacing between sign up button and password field */}
						<Stack spacing={10} pt={2}>
							{/* Button for submitting the signup form */}
							<Button
								loadingText="Submitting"
								size="lg"
								bg={useColorModeValue("gray.600", "gray.700")}
								color={"white"}
								_hover={{
									bg: useColorModeValue("gray.700", "gray.800"),
								}}
								onClick={handleSignup}
							>
								Sign up
							</Button>
						</Stack>

						{/* Stack for the link to switch to login if already a user */}
						<Stack pt={6}>
							<Text align={"center"}>
								Already a user? {/* Link to switch to the login screen */}
								<Link color={"blue.400"} onClick={() => setAuthScreen("login")}>
									Login
								</Link>
							</Text>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
}
