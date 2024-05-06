/*
- This code defines a Mongoose schema for a social media post in a Node.js application.
- It includes various fields such as the user who posted, the text of the post, image URL, likes, and replies.
- Each post can reference users for fields like 'postedBy' and in the arrays of 'likes' and 'replies'.
- The schema supports auto-creation of timestamps for each post, capturing both the creation and update times.
- The Post model created from this schema can be used to interact with the 'posts' collection in the MongoDB database.
*/

// Import the mongoose module to enable MongoDB interactions.
import mongoose from "mongoose";

// Define the schema for a post using the mongoose.Schema method.
const postSchema = mongoose.Schema(
	{
		// Reference to the User model for the post creator, required field.
		postedBy: {
			type: mongoose.Schema.Types.ObjectId, // MongoDB unique identifier for a user.
			ref: "User", // Establishes a reference to the User model.
			required: true, // Ensures this field is not empty.
		},

		// Text content of the post with a maximum length of 500 characters.
		text: {
			type: String,
			maxLength: 500,
		},

		// URL of the image associated with the post, if any.
		img: {
			type: String,
		},

		// List of users who liked the post, references the User model.
		likes: {
			type: [mongoose.Schema.Types.ObjectId], // Array of MongoDB unique identifiers for users.
			ref: "User", // Establishes a reference to the User model.
			default: [], // Initializes 'likes' as an empty array if no value is provided.
		},

		// Replies to the post, each containing details of the user and their comment.
		replies: [
			{
				// User who replied, required field.
				userId: {
					type: mongoose.Schema.Types.ObjectId, // MongoDB unique identifier for a user.
					ref: "User", // Reference to the User model.
					required: true, // Ensures this field is not empty.
				},

				// Text content of the reply, required field.
				text: {
					type: String,
					required: true,
				},

				// URL of the user's profile picture, optional.
				userProfilePic: {
					type: String,
				},

				// Username of the user who replied, optional.
				username: {
					type: String,
				},
			},
		],
	},
	{
		timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' fields to the schema.
	}
);

// Compile the schema into a model which will interact with the database under the 'Post' collection.
const Post = mongoose.model("Post", postSchema);

// Export the Post model to be used in other parts of the application.
export default Post;
