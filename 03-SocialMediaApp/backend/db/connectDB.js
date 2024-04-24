import mongoose from "mongoose";

// This function asynchronously establishes a connection to a MongoDB database.
const connectDB = async () => {
	try {
		// Attempt to connect to MongoDB using the connection string from environment variables.
		const conn = await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true, // Use the new URL parser to avoid deprecation warnings.
			useUnifiedTopology: true, // Use MongoDB driver’s new connection management engine.
		});

		// Log the host of the connected MongoDB instance on successful connection.
		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		// Log any errors that occur during the connection attempt.
		console.error(`Error: ${error.message}`);

		// Exit the process with a failure code if the connection fails.
		process.exit(1);
	}
};

export default connectDB;
