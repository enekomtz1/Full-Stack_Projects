/*
- This code defines a React component called UserHeader that displays a user's profile header.
- It uses Chakra UI for styling and layout components to create a responsive and attractive UI.
- The component includes functionality to follow/unfollow a user, update the profile, and copy the profile URL.
- Conditionally renders elements based on whether the profile belongs to the current logged-in user or another user.
- Utilizes Recoil for state management to access the current user's data, enhancing the React application's reactivity.
*/

import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Link, Text, VStack } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/portal";
import { Button, useToast } from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom"; // Atom for managing user state
import { Link as RouterLink } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow"; // Custom hook to manage follow and unfollow actions

const UserHeader = ({ user }) => {
	// Hook to show toast messages
	const toast = useToast();

	// Fetch current user from Recoil state
	const currentUser = useRecoilValue(userAtom);

	// Destructure methods and state from custom hook
	const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

	// Function to copy the current page URL to the user's clipboard
	const copyURL = () => {
		// Retrieve the current URL from the window object
		const currentURL = window.location.href;

		// Use the Clipboard API to write the URL to the clipboard
		navigator.clipboard.writeText(currentURL).then(() => {
			// Once the URL is successfully copied, display a toast notification
			toast({
				title: "Success.", // Title of the toast
				status: "success", // Toast status which determines the icon and color
				description: "Profile link copied.", // More detailed description
				duration: 3000, // Duration in milliseconds for how long the toast should show (3 seconds)
				isClosable: true, // Allows the user to close the toast manually
			});
		});
	};

	return (
		/* VStack container sets the overall alignment and spacing of profile elements */
		<VStack gap={4} alignItems={"start"}>
			{/* Flex container for user name, username, and platform tag */}
			<Flex justifyContent={"space-between"} w={"full"}>
				<Box>
					{/* Display user's full name with bold style */}
					<Text fontSize={"2xl"} fontWeight={"bold"}>
						{user.name}
					</Text>

					{/* Inline flex container for username and platform tag */}
					<Flex gap={2} alignItems={"center"}>
						<Text fontSize={"sm"}>{user.username}</Text>
						<Text fontSize={"xs"} bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"full"}>
							threads.net
						</Text>
					</Flex>
				</Box>
				<Box>
					{/* Conditional rendering of user's profile picture */}
					{user.profilePic ? (
						<Avatar
							name={user.name}
							src={user.profilePic}
							size={{
								base: "md",
								md: "xl",
							}}
						/>
					) : (
						<Avatar
							name={user.name}
							src="https://bit.ly/broken-link"
							size={{
								base: "md",
								md: "xl",
							}}
						/>
					)}
				</Box>
			</Flex>

			{/* Display user's bio */}
			<Text>{user.bio}</Text>

			{/* Conditional rendering of Update Profile or Follow/Unfollow button based on user relationship */}
			{currentUser?._id === user._id ? (
				<Link as={RouterLink} to="/update">
					<Button size={"sm"}>Update Profile</Button>
				</Link>
			) : (
				<Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
					{following ? "Unfollow" : "Follow"}
				</Button>
			)}

			{/* Flex container for social links and additional actions */}
			<Flex w={"full"} justifyContent={"space-between"}>
				<Flex gap={2} alignItems={"center"}>
					<Text color={"gray.light"}>{user.followers.length} followers</Text>
					<Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
					<Link color={"gray.light"}>instagram.com</Link>
				</Flex>
				<Flex>
					<Box className="icon-container">
						<BsInstagram size={24} cursor={"pointer"} />
					</Box>
					<Box className="icon-container">
						<Menu>
							<MenuButton>
								<CgMoreO size={24} cursor={"pointer"} />
							</MenuButton>
							<Portal>
								{/* Menu list for additional actions like Copy link */}
								<MenuList bg={"gray.dark"}>
									<MenuItem bg={"gray.dark"} onClick={copyURL}>
										Copy link
									</MenuItem>
								</MenuList>
							</Portal>
						</Menu>
					</Box>
				</Flex>
			</Flex>

			{/* Flex container for navigation between Threads and Replies */}
			<Flex w={"full"}>
				<Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb="3" cursor={"pointer"}>
					<Text fontWeight={"bold"}> Threads</Text>
				</Flex>
				<Flex flex={1} borderBottom={"1px solid gray"} justifyContent={"center"} color={"gray.light"} pb="3" cursor={"pointer"}>
					<Text fontWeight={"bold"}> Replies</Text>
				</Flex>
			</Flex>
		</VStack>
	);
};

export default UserHeader;
