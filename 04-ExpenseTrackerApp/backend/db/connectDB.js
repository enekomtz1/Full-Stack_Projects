/*
- This code establishes a connection to a MongoDB database using Mongoose.
- It utilizes the MONGO_URI environment variable to find the database connection string.
- Upon successful connection, it logs the host of the MongoDB server.
- If the connection fails, it logs an error message and terminates the process with an error status.
- This function is designed to be exported for use elsewhere in the application.
*/

import mongoose from "mongoose";

// Function to connect to the MongoDB database
export const connectDB = async () => {
	try {
		// Attempt to connect to the database using the URI provided in the environment variable
		const conn = await mongoose.connect(process.env.MONGO_URI);
		// Log the success message including the server host to the console
		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (err) {
		// Log any connection errors
		console.error(`Error: ${err.message}`);
		// Exit the process with a failure status (1) if an error occurs
		process.exit(1);
	}
};
