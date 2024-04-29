/*
- This code defines a React component using Chakra UI for styling and layout.
- It renders a single comment with the user's avatar, username, and text.
- The component is designed to be used in a list of comments, where it can optionally display a divider.
- It utilizes the Flex component from Chakra UI to arrange elements horizontally and vertically.
- Conditionally renders a Divider based on whether the comment is the last one in the list.
*/

// Import necessary components from Chakra UI for styling and structure
import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";

// Define the 'Comment' component that accepts 'reply' and 'lastReply' as props
const Comment = ({ reply, lastReply }) => {
	return (
		// Fragment used to group the list of elements without adding extra nodes to the DOM
		<>
			{/* Flex container for the comment content with specific padding and margin */}
			<Flex gap={4} py={2} my={2} w={"full"}>
				{/* Avatar component displaying the user's profile picture */}
				<Avatar src={reply.userProfilePic} size={"sm"} />

				{/* Flex container for the username and text of the comment */}
				<Flex gap={1} w={"full"} flexDirection={"column"}>
					{/* Flex container for the username with space-between alignment */}
					<Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
						{/* Text component for the username, styled as small and bold */}
						<Text fontSize="sm" fontWeight="bold">
							{reply.username}
						</Text>
					</Flex>

					{/* Text component displaying the comment text */}
					<Text>{reply.text}</Text>
				</Flex>
			</Flex>

			{/* Conditional rendering of a divider if this is not the last reply */}
			{!lastReply ? <Divider /> : null}
		</>
	);
};

// Export the 'Comment' component as the default export from this module
export default Comment;
