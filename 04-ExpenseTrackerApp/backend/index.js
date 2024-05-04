/*
- This code sets up a server using Express and integrates the Apollo Server for handling GraphQL queries.
- It configures sessions with MongoDB using connect-mongodb-session for session storage.
- Security features like CORS, session secrets, and HTTP-only cookies are implemented to enhance security.
- Passport.js is used for authentication, managing session login states and user-specific operations.
- The server serves a static front-end build and handles API calls via the /graphql endpoint.
*/

// Import necessary modules and libraries
import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongodb-session";

// Import Apollo Server and middleware for integrating with Express
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

// Import functions to build context for GraphQL and configure Passport
import { buildContext } from "graphql-passport";
import { configurePassport } from "./passport/passport.config.js";

// Import database connection, GraphQL schema and resolvers
import { connectDB } from "./db/connectDB.js";
import mergedResolvers from "./resolvers/index.js";
import mergedTypeDefs from "./typeDefs/index.js";

// Import cron job setup
import job from "./cron.js";

// Load environment variables from .env file
dotenv.config();

// Configure Passport strategies
configurePassport();

// Start the scheduled job
job.start();

// Define the directory of the current module
const __dirname = path.resolve();

// Create an Express application
const app = express();

// Create an HTTP server using the Express app
const httpServer = http.createServer(app);

// Connect session to MongoDB using connect-mongo
const MongoDBStore = connectMongo(session);

// Configure MongoDB session store
const store = new MongoDBStore({
	uri: process.env.MONGO_URI,
	collection: "sessions",
});

// Handle session store errors
store.on("error", (err) => console.log(err));

// Set up session management in Express
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 7,
			httpOnly: true,
		},
		store: store,
	})
);

// Initialize Passport and session handling
app.use(passport.initialize());
app.use(passport.session());

// Create a new Apollo Server instance
const server = new ApolloServer({
	typeDefs: mergedTypeDefs,
	resolvers: mergedResolvers,
	plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Start the Apollo Server
await server.start();

// Use CORS, body parsing middleware, and Apollo middleware
app.use(
	"/graphql",
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	}),
	express.json(),
	expressMiddleware(server, {
		context: async ({ req, res }) => buildContext({ req, res }),
	})
);

// Serve static files from the front-end build directory
app.use(express.static(path.join(__dirname, "frontend/dist")));

// Handle all other requests by serving the index.html file
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
});

// Start the HTTP server and establish database connection
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
await connectDB();

// Log server readiness
console.log(`🚀 Server ready at http://localhost:4000/graphql`);
