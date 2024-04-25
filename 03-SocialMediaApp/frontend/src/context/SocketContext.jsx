/*
- Utilizes React context for managing socket.io connections.
- Context provides access to socket instance and online users array.
- Uses the Recoil library to manage and access global state.
- Connects to the socket server when the user ID is available and handles cleanup.
- Listens for 'getOnlineUsers' event to update the list of online users.
*/

import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import io from "socket.io-client";
import userAtom from "../atoms/userAtom";

// Create a context for the socket connection
const SocketContext = createContext();

// Custom hook to provide easy access to the socket context
export const useSocket = () => {
	return useContext(SocketContext);
};

// Provider component that initializes socket connection and manages online users
export const SocketContextProvider = ({ children }) => {
	// State to store the socket instance
	const [socket, setSocket] = useState(null);

	// State to store the list of online users
	const [onlineUsers, setOnlineUsers] = useState([]);

	// Retrieve user data from Recoil state
	const user = useRecoilValue(userAtom);

	// Effect to manage the lifecycle of the socket connection
	useEffect(() => {
		// Only establish a connection if user ID is available
		if (user?._id) {
			const socket = io("/", {
				query: {
					// Send user ID as part of connection query
					userId: user._id,
				},
			});

			// Store the socket instance in state
			setSocket(socket);

			// Event listener for 'getOnlineUsers', updates online users state
			socket.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});

			// Cleanup function to close socket connection on component unmount or user ID change
			return () => {
				if (socket) socket.close();
			};
		}
	}, [user?._id]); // Dependency on user ID, reconnect if it changes

	// Render provider with socket and online users in context value
	return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};
