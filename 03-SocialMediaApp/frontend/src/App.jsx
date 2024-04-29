/*
- This code defines a React component named App which serves as the main entry point for a web application.
- It utilizes the Chakra UI library for styling and layout management.
- It uses React Router for handling routing within the application, showing different pages based on the URL.
- It implements conditional rendering based on the user's authentication status using Recoil for state management.
- The application supports multiple pages like Home, Authentication, User, Post, Chat, Settings, and Update Profile.
*/

import { Box, Container } from "@chakra-ui/react"; // Importing components from Chakra UI for styling.
import { Navigate, Route, Routes, useLocation } from "react-router-dom"; // Importing components from React Router for navigation and routing.
import UserPage from "./pages/UserPage"; // Importing the UserPage component.
import PostPage from "./pages/PostPage"; // Importing the PostPage component.
import Header from "./components/Header"; // Importing the Header component, which is likely displayed across all pages.
import HomePage from "./pages/HomePage"; // Importing the HomePage component.
import AuthPage from "./pages/AuthPage"; // Importing the AuthPage component for authentication processes.
import { useRecoilValue } from "recoil"; // Importing the useRecoilValue hook from Recoil for state management.
import userAtom from "./atoms/userAtom"; // Importing the userAtom from Recoil to manage user authentication state.
import UpdateProfilePage from "./pages/UpdateProfilePage"; // Importing the UpdateProfilePage component.
import CreatePost from "./components/CreatePost"; // Importing the CreatePost component, likely used for creating new posts.
import ChatPage from "./pages/ChatPage"; // Importing the ChatPage component.
import { SettingsPage } from "./pages/SettingsPage"; // Importing the SettingsPage component.

function App() {
	// Retrieving the user's authentication status from Recoil state.
	const user = useRecoilValue(userAtom);

	// Using useLocation to get the current path from React Router.
	const { pathname } = useLocation();

	// Rendering the application UI using Chakra UI's Box and Container components.
	return (
		<Box position={"relative"} w="full">
			<Container maxW={pathname === "/" ? { base: "620px", md: "900px" } : "620px"}>
				<Header />
				<Routes>
					{/* Routing setup, redirecting based on user's authentication status */}
					<Route path="/" element={user ? <HomePage /> : <Navigate to="/auth" />} />
					<Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />
					<Route path="/update" element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />} />

					{/* Conditional rendering within a Route, allowing authenticated users to create posts */}
					<Route
						path="/:username"
						element={
							user ? (
								<>
									<UserPage />
									<CreatePost />
								</>
							) : (
								<UserPage />
							)
						}
					/>
					<Route path="/:username/post/:pid" element={<PostPage />} />
					<Route path="/chat" element={user ? <ChatPage /> : <Navigate to={"/auth"} />} />
					<Route path="/settings" element={user ? <SettingsPage /> : <Navigate to={"/auth"} />} />
				</Routes>
			</Container>
		</Box>
	);
}

export default App; // Exporting the App component for use in other parts of the application.
