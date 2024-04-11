/*
- This file is the entry point of the React application,
  setting up the initial rendering and integrating the Redux store.
*/

// Import the React library to enable JSX and React component functionality.
import React from "react";

// Import ReactDOM for rendering the React application into the web page's DOM.
import ReactDOM from "react-dom/client";

// Import the Provider component from react-redux to integrate the React app with the Redux store.
import { Provider } from "react-redux";

// Import the App component, which is the root component of this React application.
import App from "./App";

// Import the store configuration from the services directory to set up Redux store.
import { store } from "./services/store";

// Entry point to the application: selects the root DOM node and renders the React component tree.
ReactDOM.createRoot(document.getElementById("root")).render(
	// React.StrictMode is a wrapper to help identify potential problems in the app during development.
	<React.StrictMode>
		{/*The Provider component wraps the App component to make the Redux store accessible throughout the application.*/}
		<Provider store={store}>
			{/*App component is the root component that starts the React application.*/}
			<App />
		</Provider>
	</React.StrictMode>
);
