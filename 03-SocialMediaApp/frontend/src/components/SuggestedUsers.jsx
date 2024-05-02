/*
- This code implements a React component to display suggested users.
- It fetches suggested user data from an API and handles loading states.
- Error handling is managed through a custom toast notification hook.
- The UI dynamically displays user data or loading skeletons based on the fetch status.
- It utilizes Chakra UI for styling and layout purposes.
*/

import { Box, Flex, Skeleton, SkeletonCircle, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SuggestedUser from "./SuggestedUser";
import useShowToast from "../hooks/useShowToast";

// Component for displaying a list of suggested users
const SuggestedUsers = () => {
	// State for managing loading status
	const [loading, setLoading] = useState(true);

	// State for storing suggested users
	const [suggestedUsers, setSuggestedUsers] = useState([]);

	// Custom hook to show toast notifications
	const showToast = useShowToast();

	// Use effect hook to handle the component lifecycle; specifically, it fetches suggested users once on component mount.
	useEffect(() => {
		// Defines an asynchronous function to fetch suggested users from the server
		const getSuggestedUsers = async () => {
			// Initiates loading state before starting the fetch operation
			setLoading(true);
			try {
				// Makes a fetch request to the server to get suggested users
				const res = await fetch("/api/users/suggested");

				// Parses the JSON response from the server
				const data = await res.json();

				// Checks if the server response contains an error
				if (data.error) {
					// Triggers a toast notification if an error occurred
					showToast("Error", data.error, "error");
					return; // Exits the function to prevent further state updates
				}
				// Updates the suggestedUsers state with the data received from the server
				setSuggestedUsers(data);
			} catch (error) {
				// Catches any errors during the fetch operation and shows a toast notification for the error
				showToast("Error", error.message, "error");
			} finally {
				// Resets the loading state to false after the fetch operation is completed or fails
				setLoading(false);
			}
		};

		// Calls the getSuggestedUsers function to execute the fetch operation
		getSuggestedUsers();
	}, [showToast]); // Includes showToast in the dependency array to ensure useEffect re-runs if showToast changes

	// Render component UI
	return (
		<>
			{/* Title for the suggested users section */}
			<Text mb={4} fontWeight={"bold"}>
				Suggested Users
			</Text>
			{/* Container for suggested user profiles */}
			<Flex direction={"column"} gap={4}>
				{/* Conditionally render suggested users or loading skeletons */}
				{/* Display each user using the SuggestedUser component */}
				{!loading && suggestedUsers.map((user) => <SuggestedUser key={user._id} user={user} />)}

				{/* Render loading skeletons while data is being fetched */}
				{loading &&
					[(0, 1, 2, 3, 4)].map((_, idx) => (
						<Flex key={idx} gap={2} alignItems={"center"} p={"1"} borderRadius={"md"}>
							{/* Skeleton for the user avatar */}
							<Box>
								<SkeletonCircle size={"10"} />
							</Box>

							{/* Skeletons for username and fullname */}
							<Flex w={"full"} flexDirection={"column"} gap={2}>
								<Skeleton h={"8px"} w={"80px"} />
								<Skeleton h={"8px"} w={"90px"} />
							</Flex>

							{/* Skeleton for the follow button */}
							<Flex>
								<Skeleton h={"20px"} w={"60px"} />
							</Flex>
						</Flex>
					))}
			</Flex>
		</>
	);
};

export default SuggestedUsers;
