import mongoose from "mongoose";

// Define a schema for posts in a social media or similar application using Mongoose
const postSchema = mongoose.Schema(
    {
        postedBy: {
            type: mongoose.Schema.Types.ObjectId, // Links to the User model as the author of the post
            ref: "User",
            required: true, // It is mandatory to know who posted the content
        },
        text: {
            type: String,
            maxLength: 500, // Limits the text length to 500 characters to ensure posts are concise
        },
        img: {
            type: String, // Optional field for including an image with the post
        },
        likes: {
            // An array to store user IDs of those who liked the post
            type: [mongoose.Schema.Types.ObjectId],
            ref: "User", // References the User model
            default: [], // Initializes to an empty array indicating no likes initially
        },
        replies: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId, // Reference to the User who replied
                    ref: "User",
                    required: true, // Each reply must be linked to a user
                },
                text: {
                    type: String,
                    required: true, // Text content of the reply
                },
                userProfilePic: {
                    type: String, // Optional profile picture of the user at the time of reply
                },
                username: {
                    type: String, // Store the username to display with the reply
                },
            },
        ],
    },
    {
        timestamps: true, // Automatically manage createdAt and updatedAt timestamps for each post
    }
);

// Create the Post model using the defined schema
const Post = mongoose.model("Post", postSchema);

// Export the Post model so it can be used elsewhere in the application
export default Post;
