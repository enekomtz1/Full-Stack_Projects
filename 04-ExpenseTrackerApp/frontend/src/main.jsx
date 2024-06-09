/*
- This code sets up a React application with routing, GraphQL, and a custom background.
- It initializes the Apollo Client for GraphQL queries.
- It configures the React Router for handling different routes.
- It wraps the application in a GridBackground component.
- It renders the main App component into the root HTML element.
*/

// Import necessary libraries and components.
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import GridBackground from "./components/ui/GridBackgroun.jsx";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

// Initialize the Apollo Client with configuration settings.
const client = new ApolloClient({
    // TODO => Update the uri on production
    // Set the URI based on the environment.
    uri: import.meta.env.VITE_NODE_ENV === "development" ? "http://localhost:4000/graphql" : "/graphql", // the URL of our GraphQL server.
    // Set up caching for GraphQL queries.
    cache: new InMemoryCache(), // Apollo Client uses to cache query results after fetching them.
    // Include credentials (cookies) with each request.
    credentials: "include", // This tells Apollo Client to send cookies along with every request to the server.
});

// Render the application into the root HTML element.
ReactDOM.createRoot(document.getElementById("root")).render(
    // Enable strict mode for highlighting potential problems in the application.
    <React.StrictMode>
        // Set up routing for the application.
        <BrowserRouter>
            // Wrap the app with a grid background.
            <GridBackground>
                // Provide the Apollo Client to the app.
                <ApolloProvider client={client}>
                    // Render the main App component.
                    <App />
                </ApolloProvider>
            </GridBackground>
        </BrowserRouter>
    </React.StrictMode>
);
