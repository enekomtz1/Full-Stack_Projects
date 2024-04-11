/*
- This code defines an API service using Redux Toolkit Query (RTK Query) to fetch article summaries from a third-party API.

- In this code, createApi is used to define the articleApi service,
  with endpoints to interact with the external article summarization API.

- The getSummary endpoint constructs a query to fetch a summary for a given article URL,
  and useLazyGetSummaryQuery is a generated hook to invoke this endpoint from a React component.
  
- The API key and host are set in the headers for authentication with the RapidAPI service.
*/

// Import necessary functions from Redux Toolkit Query for API creation and data fetching.
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Retrieve the RapidAPI key from the environment variables.
const rapidApiKey = import.meta.env.VITE_RAPID_API_ARTICLE_KEY;

// Create an API service using Redux Toolkit Query.
export const articleApi = createApi({
	reducerPath: "articleApi", // Unique identifier for the API in the Redux store.

	// Configure the base query with the API's base URL and headers.
	baseQuery: fetchBaseQuery({
		baseUrl: "https://article-extractor-and-summarizer.p.rapidapi.com/",
		// Function to prepare the headers for the API request.
		prepareHeaders: (headers) => {
			// Set the RapidAPI key and host in the request headers.
			headers.set("X-RapidAPI-Key", rapidApiKey);
			headers.set("X-RapidAPI-Host", "article-extractor-and-summarizer.p.rapidapi.com");
			return headers;
		},
	}),

	// Define the API endpoints and how to access them.
	endpoints: (builder) => ({
		getSummary: builder.query({
			// Define the query for fetching article summary.
			// Encodes the URL parameter to ensure it's correctly formatted for the API call.
			query: (params) => `summarize?url=${encodeURIComponent(params.articleUrl)}&length=1`,
		}),
	}),
});

// Export hooks for performing the getSummary query lazily, i.e., the query is triggered manually.
export const { useLazyGetSummaryQuery } = articleApi;
