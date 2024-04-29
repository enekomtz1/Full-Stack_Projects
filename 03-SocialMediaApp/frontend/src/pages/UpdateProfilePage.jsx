/*
- This code imports necessary UI components and hooks from Chakra UI and React for building a user profile update page.
- It uses the Recoil library to manage global state, specifically the user state, allowing updates to be reflected across the app.
- Custom hooks are utilized to handle image previews and display toast notifications for user feedback during the update process.
- The component handles form submissions to update user data through an API, including profile picture changes.
- Conditional rendering and state management within the form ensure a smooth user interaction and prevent multiple submissions.
*/

// Importing necessary modules and components from Chakra UI and React
import { Button, Flex, FormControl, FormLabel, Heading, Input, Stack, useColorModeValue, Avatar, Center } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast";

// Defining the main component for updating user profile
export default function UpdateProfilePage() {
	// Using Recoil for state management to handle user state
	const [user, setUser] = useRecoilState(userAtom);
	// Local state to manage input fields, initialized with user data
	const [inputs, setInputs] = useState({
		name: user.name,
		username: user.username,
		email: user.email,
		bio: user.bio,
		password: "",
	});
	// Reference to the file input element for handling file uploads
	const fileRef = useRef(null);
	// State to manage whether an update operation is in progress
	const [updating, setUpdating] = useState(false);

	// Custom hook to display toast notifications
	const showToast = useShowToast();
	// Custom hook to handle image preview and changes
	const { handleImageChange, imgUrl } = usePreviewImg();

	// Function to handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (updating) return; // Prevent multiple submissions
		setUpdating(true); // Indicate that updating has started
		try {
			// Sending updated user data to server
			const res = await fetch(`/api/users/update/${user._id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
			});
			const data = await res.json(); // Parsing response data
			if (data.error) {
				// Handling server-side errors
				showToast("Error", data.error, "error");
				return;
			}
			// Update successful, updating local user state and localStorage
			showToast("Success", "Profile updated successfully", "success");
			setUser(data);
			localStorage.setItem("user-threads", JSON.stringify(data));
		} catch (error) {
			// Handling client-side errors
			showToast("Error", error, "error");
		} finally {
			// Resetting the updating state
			setUpdating(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<Flex align={"center"} justify={"center"} my={6}>
				<Stack spacing={4} w={"full"} maxW={"md"} bg={useColorModeValue("white", "gray.dark")} rounded={"xl"} boxShadow={"lg"} p={6}>
					<Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
						User Profile Edit
					</Heading>
					<FormControl id="userName">
						<Stack direction={["column", "row"]} spacing={6}>
							<Center>
								<Avatar size="xl" boxShadow={"md"} src={imgUrl || user.profilePic} />
							</Center>
							<Center w="full">
								<Button w="full" onClick={() => fileRef.current.click()}>
									Change Avatar
								</Button>
								<Input type="file" hidden ref={fileRef} onChange={handleImageChange} />
							</Center>
						</Stack>
					</FormControl>
					<FormControl>
						<FormLabel>Full name</FormLabel>
						<Input placeholder="John Doe" value={inputs.name} onChange={(e) => setInputs({ ...inputs, name: e.target.value })} _placeholder={{ color: "gray.500" }} type="text" />
					</FormControl>
					<FormControl>
						<FormLabel>User name</FormLabel>
						<Input placeholder="johndoe" value={inputs.username} onChange={(e) => setInputs({ ...inputs, username: e.target.value })} _placeholder={{ color: "gray.500" }} type="text" />
					</FormControl>
					<FormControl>
						<FormLabel>Email address</FormLabel>
						<Input
							placeholder="your-email@example.com"
							value={inputs.email}
							onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
							_placeholder={{ color: "gray.500" }}
							type="email"
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Bio</FormLabel>
						<Input placeholder="Your bio." value={inputs.bio} onChange={(e) => setInputs({ ...inputs, bio: e.target.value })} _placeholder={{ color: "gray.500" }} type="text" />
					</FormControl>
					<FormControl>
						<FormLabel>Password</FormLabel>
						<Input
							placeholder="password"
							value={inputs.password}
							onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
							_placeholder={{ color: "gray.500" }}
							type="password"
						/>
					</FormControl>
					<Stack spacing={6} direction={["column", "row"]}>
						<Button
							bg={"red.400"}
							color={"white"}
							w="full"
							_hover={{
								bg: "red.500",
							}}
						>
							Cancel
						</Button>
						<Button
							bg={"green.400"}
							color={"white"}
							w="full"
							_hover={{
								bg: "green.500",
							}}
							type="submit"
							isLoading={updating}
						>
							Submit
						</Button>
					</Stack>
				</Stack>
			</Flex>
		</form>
	);
}
