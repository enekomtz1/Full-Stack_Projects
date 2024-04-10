// This is a Redux store configuration file using Redux Toolkit.
// Redux Toolkit simplifies store setup and provides good defaults.

import { configureStore } from "@reduxjs/toolkit"; // Importing the configureStore function from Redux Toolkit for store configuration.
import authReducer from "./slices/authSlice"; // Importing the authReducer from the authSlice file. This manages authentication state.
import { apiSlice } from "./slices/apiSlice"; // Importing the apiSlice created with createApi from Redux Toolkit for data fetching.

// Creating the Redux store with configureStore function.
const store = configureStore({
	reducer: {
		[apiSlice.reducerPath]: apiSlice.reducer, // Adding the apiSlice reducer to the store under its generated path (e.g., 'api').
		auth: authReducer, // Adding the authReducer to handle authentication-related state changes.
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware), // Integrating default middleware and adding the apiSlice middleware for managing data fetching.
	devTools: true, // Enabling Redux DevTools extension for easier debugging.
});

export default store; // Exporting the configured store to be used in the application.
