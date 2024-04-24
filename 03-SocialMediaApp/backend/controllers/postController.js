import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";

const createPost = async (req, res) => {
	try {
		// Destructure postedBy and text from request body
		const { postedBy, text } = req.body;

		// Destructure img from request body; it may be undefined
		let { img } = req.body;

		// Check if required fields are missing
		if (!postedBy || !text) {
			// Return error if postedBy or text is not provided
			return res.status(400).json({ error: "Postedby and text fields are required" });
		}

		// Fetch user from database using postedBy id
		const user = await User.findById(postedBy);

		if (!user) {
			// Return error if user is not found
			return res.status(404).json({ error: "User not found" });
		}

		// Check if the requesting user is the same as the post creator
		if (user._id.toString() !== req.user._id.toString()) {
			// Return error if the user is unauthorized to create the post
			return res.status(401).json({ error: "Unauthorized to create post" });
		}

		// Define maximum allowed length for text
		const maxLength = 500;
		if (text.length > maxLength) {
			// Return error if text exceeds maximum length
			return res.status(400).json({ error: `Text must be less than ${maxLength} characters` });
		}

		// If image data is provided, upload it to a cloud service
		if (img) {
			// Upload the image and retrieve the secure URL
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

		// Create a new post with provided data
		const newPost = new Post({ postedBy, text, img });

		// Save the new post to the database
		await newPost.save();

		// Return the newly created post
		res.status(201).json(newPost);
	} catch (err) {
		// Handle errors and return a generic server error message
		res.status(500).json({ error: err.message });

		// Log the error for debugging purposes
		console.log(err);
	}
};

const getPost = async (req, res) => {
	try {
		// Tries to find a post by ID provided in the request parameters
		const post = await Post.findById(req.params.id);

		// Checks if the post does not exist
		if (!post) {
			// Returns a 404 status with an error message if the post is not found
			return res.status(404).json({ error: "Post not found" });
		}

		// Sends a 200 status and the found post as JSON if the post exists
		res.status(200).json(post);
	} catch (err) {
		// Catches and returns any errors during the process with a 500 status
		res.status(500).json({ error: err.message });
	}
};

const deletePost = async (req, res) => {
	try {
		// Attempt to find a Post document by its ID, using the ID parameter from the request.
		const post = await Post.findById(req.params.id);

		// If the post is not found, return a 404 response with an error message.
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		// Check if the user attempting to delete the post is the one who posted it.
		if (post.postedBy.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Unauthorized to delete post" });
		}

		// If the post has an associated image, delete the image from cloud storage.
		if (post.img) {
			const imgId = post.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
		}

		// Delete the Post document from the database using its ID.
		await Post.findByIdAndDelete(req.params.id);

		// Send a 200 response indicating successful deletion of the post.
		res.status(200).json({ message: "Post deleted successfully" });
	} catch (err) {
		// If any exceptions are caught during the operation, send a 500 response with an error message.
		res.status(500).json({ error: err.message });
	}
};

const likeUnlikePost = async (req, res) => {
	try {
		// Extracting post ID from request parameters
		const { id: postId } = req.params;

		// Extracting user ID from request's user object
		const userId = req.user._id;

		// Retrieving the post by ID from the database
		const post = await Post.findById(postId);

		// Check if the post exists in the database
		if (!post) {
			// If the post does not exist, return a 404 error with a message
			return res.status(404).json({ error: "Post not found" });
		}

		// Determine if the user has already liked the post
		const userLikedPost = post.likes.includes(userId);

		if (userLikedPost) {
			// If the post is already liked, remove the user's ID from likes array
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });

			// Return a success response indicating the post was unliked
			res.status(200).json({ message: "Post unliked successfully" });
		} else {
			// If the post is not liked, add the user's ID to the likes array
			post.likes.push(userId);

			// Save the updated post object
			await post.save();

			// Return a success response indicating the post was liked
			res.status(200).json({ message: "Post liked successfully" });
		}
	} catch (err) {
		// Handle errors by returning a 500 status code with the error message
		res.status(500).json({ error: err.message });
	}
};

const replyToPost = async (req, res) => {
	try {
		// Destructuring to extract 'text' from the request body
		const { text } = req.body;

		// Extracting the post ID from the request parameters
		const postId = req.params.id;

		// Extracting the user ID and profile picture from the user information in the request
		const userId = req.user._id;
		const userProfilePic = req.user.profilePic;

		// Extracting the username from the user information in the request
		const username = req.user.username;

		// Check if the 'text' field is provided, return error if not
		if (!text) {
			return res.status(400).json({ error: "Text field is required" });
		}

		// Retrieve the post by ID, return error if not found
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		// Constructing the reply object with user details and text
		const reply = { userId, text, userProfilePic, username };

		// Adding the reply to the post's replies array
		post.replies.push(reply);

		// Save the updated post
		await post.save();

		// Respond with the reply object and a 200 OK status
		res.status(200).json(reply);
	} catch (err) {
		// Handle any errors by sending a 500 Internal Server Error status
		res.status(500).json({ error: err.message });
	}
};

const getFeedPosts = async (req, res) => {
	try {
		// Extract the user ID from the request object.
		const userId = req.user._id;

		// Retrieve the user document from the database using the user ID.
		const user = await User.findById(userId);

		// If the user does not exist, send a 404 status code with an error message.
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Extract the list of user IDs that the current user follows.
		const following = user.following;

		// Fetch posts made by the users being followed and sort them in descending order by creation date.
		const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });

		// Send the fetched posts as a JSON response with a 200 status code.
		res.status(200).json(feedPosts);
	} catch (err) {
		// If an error occurs, send a 500 status code with the error message.
		res.status(500).json({ error: err.message });
	}
};

const getUserPosts = async (req, res) => {
	// Extract username from the request parameters
	const { username } = req.params;

	try {
		// Find the user in the database by username
		const user = await User.findOne({ username });

		// If user not found, return 404 with an error message
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Find all posts by the user and sort them by creation date in descending order
		const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });

		// Respond with the posts if user is found
		res.status(200).json(posts);
	} catch (error) {
		// If an error occurs, respond with 500 and the error message
		res.status(500).json({ error: error.message });
	}
};

export { createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts, getUserPosts };
