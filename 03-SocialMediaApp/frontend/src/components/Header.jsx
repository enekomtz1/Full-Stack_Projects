/*
- This code defines a React functional component named 'Header' using Chakra UI and React Router for UI and navigation respectively.
- It manages theme switching between light and dark modes based on user interactions.
- The component uses Recoil for state management to handle user authentication states and data.
- Conditional rendering is used to display different UI elements based on whether the user is logged in or not.
- It also includes interactive elements like login, signup, and logout buttons, and navigational links to user profile and settings.
*/

// Import necessary UI components from Chakra UI and icons from React Icons
import { Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";

// Import hooks and state management tools from Recoil and local hooks
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import authScreenAtom from "../atoms/authAtom";
import useLogout from "../hooks/useLogout";

// Define the Header functional component
const Header = () => {
	// Hook to manage light/dark theme based on user preference
	const { colorMode, toggleColorMode } = useColorMode();

	// State management for user data
	const user = useRecoilValue(userAtom);

	// Hook for handling logout functionality
	const logout = useLogout();

	// Recoil state setter for authentication screen management
	const setAuthScreen = useSetRecoilState(authScreenAtom);

	// Render component UI
	return (
		// Flex container to align and space children components
		<Flex justifyContent={"space-between"} mt={6} mb="12">
			{/* Conditionally render the home icon if the user is logged in */}
			{user && (
				<Link as={RouterLink} to="/">
					<AiFillHome size={24} />
				</Link>
			)}

			{/* Conditionally render the login link if the user is not logged in */}
			{!user && (
				<Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("login")}>
					Login
				</Link>
			)}

			{/* Image component to toggle color mode on click */}
			<Image cursor={"pointer"} alt="logo" w={6} src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"} onClick={toggleColorMode} />

			{/* Render user related icons and logout button if user is logged in */}
			{user && (
				<Flex alignItems={"center"} gap={4}>
					<Link as={RouterLink} to={`/${user.username}`}>
						<RxAvatar size={24} />
					</Link>
					<Link as={RouterLink} to={`/chat`}>
						<BsFillChatQuoteFill size={20} />
					</Link>
					<Link as={RouterLink} to={`/settings`}>
						<MdOutlineSettings size={20} />
					</Link>
					<Button size={"xs"} onClick={logout}>
						<FiLogOut size={20} />
					</Button>
				</Flex>
			)}

			{/* Conditionally render the signup link if the user is not logged in */}
			{!user && (
				<Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("signup")}>
					Sign up
				</Link>
			)}
		</Flex>
	);
};

// Export the Header component as default export
export default Header;
