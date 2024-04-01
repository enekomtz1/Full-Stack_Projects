import mongoose from "mongoose";

const connectToMongoDB = async () => {
	try {
		const uri = process.env.MONGO_DB_URI;

		if (!uri) {
			console.error("The MONGO_DB_URI environment variable is not defined.");
			return;
		}
		await mongoose.connect(uri);
		console.log("Connected to MongoDB");
	} catch (error) {
		console.error("Error connecting to MongoDB", error.message);
	}
};

export default connectToMongoDB;
