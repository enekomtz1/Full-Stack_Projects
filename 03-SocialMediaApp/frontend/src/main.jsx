/*
- This code sets up the main entry point for a React application.
- It uses various libraries and tools to enhance functionality and design.
- Chakra UI is configured for theme customization and dynamic color modes.
- Application state management is handled by Recoil, and routing by React Router.
- The application is wrapped in necessary providers for themes, routes, and websockets.
*/

// Importing essential modules from React and ReactDOM for component rendering
import React from "react";
import ReactDOM from "react-dom/client";

// Importing the root App component and global styles
import App from "./App.jsx";
import "./index.css";

// Importing Chakra UI components for UI design
import { ChakraProvider } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { extendTheme } from "@chakra-ui/theme-utils";
import { ColorModeScript } from "@chakra-ui/color-mode";

// Importing BrowserRouter for SPA routing capabilities
import { BrowserRouter } from "react-router-dom";

// Importing Recoil for state management across the application
import { RecoilRoot } from "recoil";

// Importing context provider for managing WebSocket connections
import { SocketContextProvider } from "./context/SocketContext.jsx";

// Definition of global styles using Chakra UI's mode function for light/dark mode support
const styles = {
	global: (props) => ({
		body: {
			color: mode("gray.800", "whiteAlpha.900")(props), // Setting text color based on theme mode
			bg: mode("gray.100", "#101010")(props), // Setting background color based on theme mode
		},
	}),
};

// Configuration for Chakra UI's color mode settings
const config = {
	initialColorMode: "dark", // Default color mode set to 'dark'
	useSystemColorMode: true, // Option to automatically switch based on system settings
};

// Defining a custom color palette for the theme
const colors = {
	gray: {
		light: "#616161", // Light shade of gray
		dark: "#1e1e1e", // Dark shade of gray
	},
};

// Extending the default theme with custom configurations
const theme = extendTheme({ config, styles, colors });

// Creating the root container for the React application
ReactDOM.createRoot(document.getElementById("root")).render(
	// React.StrictMode for highlighting potential problems in an app during development
	<React.StrictMode>
		<RecoilRoot>
			{/* RecoilRoot provides a state management context for Recoil */}
			<BrowserRouter>
				{/* Enables SPA routing */}
				<ChakraProvider theme={theme}>
					{/* Provides the Chakra UI theme to the app */}
					<ColorModeScript initialColorMode={theme.config.initialColorMode} /> // Manages the initial color mode for Chakra UI
					<SocketContextProvider>
						{/* Context provider for managing WebSocket connections */}
						<App /> {/* The root component of the application */}
					</SocketContextProvider>
				</ChakraProvider>
			</BrowserRouter>
		</RecoilRoot>
	</React.StrictMode>
);
