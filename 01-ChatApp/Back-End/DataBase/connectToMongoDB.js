// Import the mongoose library to interact with MongoDB
import mongoose from "mongoose";

// Define an asynchronous function to connect to MongoDB
const connectToMongoDB = async () => {
	try {
		// Attempt to connect to MongoDB using the URI stored in environment variables
		await mongoose.connect(process.env.MONGO_DB_URI);
		// Log a success message to the console once the connection is established
		console.log("Connected to MongoDB");
	} catch (error) {
		// Log an error message to the console if the connection fails
		console.log("Error connecting to MongoDB", error.message);
	}
};

// Export the connectToMongoDB function for use in other parts of the application
export default connectToMongoDB;
