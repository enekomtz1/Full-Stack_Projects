/*
- This code defines a React component named UserPost used in a social media application.
- It dynamically displays user posts including images, titles, likes, and replies.
- The component uses Chakra UI for styling and layout to ensure visual consistency.
- It features interactive elements such as like buttons and links to user profiles.
- The post information such as images and likes are managed using React's useState for interactivity.
*/

// Importing necessary components and icons from Chakra UI and other libraries
import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";
import Actions from "./Actions";
import { useState } from "react";

// Defining the UserPost component with props for post details
const UserPost = ({ postImg, postTitle, likes, replies }) => {
	// State to manage like status, initialized as not liked (false)
	const [liked, setLiked] = useState(false);

	// The JSX returned defines the structure of the post, including layout and interactions
	return (
		// Linking the entire post component to a detailed view page
		<Link to={"/markzuckerberg/post/1"}>
			<Flex gap={3} mb={4} py={5}>
				{/* Left section: user profile and additional avatars */}
				<Flex flexDirection={"column"} alignItems={"center"}>
					{/* Main user avatar with hardcoded image */}
					<Avatar size="md" name="Mark Zuckerberg" src="/zuck-avatar.png" />

					{/* Decorative line between avatars */}
					<Box w="1px" h={"full"} bg="gray.light" my={2}></Box>

					{/* Container for additional small avatars */}
					<Box position={"relative"} w={"full"}>
						{/* Multiple small avatars positioned absolutely within the container */}
						<Avatar size="xs" name="John doe" src="https://bit.ly/dan-abramov" position={"absolute"} top={"0px"} left="15px" padding={"2px"} />
						<Avatar size="xs" name="John doe" src="https://bit.ly/sage-adebayo" position={"absolute"} bottom={"0px"} right="-5px" padding={"2px"} />
						<Avatar size="xs" name="John doe" src="https://bit.ly/prosper-baba" position={"absolute"} bottom={"0px"} left="4px" padding={"2px"} />
					</Box>
				</Flex>
				{/* Right section: post content and interaction details */}
				<Flex flex={1} flexDirection={"column"} gap={2}>
					{/* Top bar with user name and more options */}
					<Flex justifyContent={"space-between"} w={"full"}>
						<Flex w={"full"} alignItems={"center"}>
							<Text fontSize={"sm"} fontWeight={"bold"}>
								markzuckerberg
							</Text>

							{/* Verified icon next to the user name */}
							<Image src="/verified.png" w={4} h={4} ml={1} />
						</Flex>
						<Flex gap={4} alignItems={"center"}>
							<Text fontStyle={"sm"} color={"gray.light"}>
								1d
							</Text>
							<BsThreeDots />
						</Flex>
					</Flex>

					{/* Displaying the title of the post */}
					<Text fontSize={"sm"}>{postTitle}</Text>

					{/* Conditionally rendering the post image if it exists */}
					{postImg && (
						<Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
							<Image src={postImg} w={"full"} />
						</Box>
					)}

					{/* Actions component for like functionality */}
					<Flex gap={3} my={1}>
						<Actions liked={liked} setLiked={setLiked} />
					</Flex>

					{/* Displaying replies and likes count */}
					<Flex gap={2} alignItems={"center"}>
						<Text color={"gray.light"} fontSize="sm">
							{replies} replies
						</Text>
						<Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
						<Text color={"gray.light"} fontSize="sm">
							{likes} likes
						</Text>
					</Flex>
				</Flex>
			</Flex>
		</Link>
	);
};

// Exporting the UserPost component for use in other parts of the application
export default UserPost;
