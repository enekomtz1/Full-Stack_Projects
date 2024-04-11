/*
- This code snippet is responsible for configuring the Redux store in a React application,
  integrating the articleApi service created with Redux Toolkit Query (RTK Query).

- This setup is crucial for enabling the Redux store to manage the state of the articleApi queries and mutations,
  ensuring the API's lifecycle is handled efficiently within the Redux ecosystem.
  
- The middleware extends Redux's capabilities to handle asynchronous interactions with the API,
  such as data fetching, caching, and more.
*/

// Import the configureStore function from Redux Toolkit, used to set up the Redux store.
import { configureStore } from "@reduxjs/toolkit";

// Import the articleApi instance which contains the endpoints and configurations for the API.
import { articleApi } from "./article";

// Configure and create the Redux store.
export const store = configureStore({
	// Reducer configuration for the store.
	reducer: {
		// Add the articleApi reducer to the store using its reducer path as the key.
		// This integrates the API service with the Redux store, allowing the store to handle API states and caching.
		[articleApi.reducerPath]: articleApi.reducer,
	},
	// Middleware configuration for the store.
	middleware: (getDefaultMiddleware) =>
		// Use the default middleware provided by RTK, and add the articleApi middleware.
		// This middleware automatically dispatches actions based on the API service's needs and handles caching.
		getDefaultMiddleware().concat(articleApi.middleware),
});
