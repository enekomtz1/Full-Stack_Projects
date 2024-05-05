/*
- This code implements several user-related operations for a web application.
- It handles user authentication, profile management, and social features.
- User data is securely managed using MongoDB and bcrypt for password hashing.
- Cloudinary is used for image storage, enhancing file management.
- The code is structured for clarity, with each function performing a distinct operation.
*/

// Import necessary modules and dependencies
import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

// Function to retrieve a user's profile based on a username or userID
const getUserProfile = async (req, res) => {
	// Extract 'query' parameter from URL which could be either a username or a userId
	const { query } = req.params;

	try {
		let user;

		// Check if the 'query' parameter is a valid MongoDB ObjectId
		if (mongoose.Types.ObjectId.isValid(query)) {
			// If 'query' is a valid ObjectId, assume it's a userId and try to find the user by _id
			user = await User.findOne({ _id: query })
				.select("-password") // Exclude password from the results for security
				.select("-updatedAt"); // Exclude updatedAt field for privacy
		} else {
			// If 'query' is not a valid ObjectId, assume it's a username and try to find the user by username
			user = await User.findOne({ username: query })
				.select("-password") // Exclude password from the results
				.select("-updatedAt"); // Exclude updatedAt field
		}

		// If no user is found, return a 404 Not Found status with an error message
		if (!user) return res.status(404).json({ error: "User not found" });

		// If a user is found, return the user data with a 200 OK status
		res.status(200).json(user);
	} catch (err) {
		// Handle any errors during the process and return a 500 Internal Server Error status
		res.status(500).json({ error: err.message });
		// Optionally log the error for debugging purposes
		console.log("Error in getUserProfile: ", err.message);
	}
};

// Function to sign up a new user
const signupUser = async (req, res) => {
	try {
		// Extract user information from the request body
		const { name, email, username, password } = req.body;

		// Check if a user with the same email or username already exists
		const user = await User.findOne({ $or: [{ email }, { username }] });

		// If a user is found, return an error response indicating the user already exists
		if (user) {
			return res.status(400).json({ error: "User already exists" });
		}

		// Generate a salt for hashing the password using bcrypt with a cost factor of 10
		const salt = await bcrypt.genSalt(10);

		// Create a hashed version of the password
		const hashedPassword = await bcrypt.hash(password, salt);

		// Create a new user instance with the provided data and hashed password
		const newUser = new User({
			name,
			email,
			username,
			password: hashedPassword,
		});

		// Save the new user to the database
		await newUser.save();

		// If the new user is successfully created
		if (newUser) {
			// Optionally generate a token and set a cookie for session management
			generateTokenAndSetCookie(newUser._id, res);

			// Return the new user's data with a 201 Created status
			res.status(201).json({
				_id: newUser._id,
				name: newUser.name,
				email: newUser.email,
				username: newUser.username,
				bio: newUser.bio,
				profilePic: newUser.profilePic,
			});
		} else {
			// If there is an issue with the user data, return a 400 Bad Request error
			res.status(400).json({ error: "Invalid user data" });
		}
	} catch (err) {
		// Handle any errors that occur during the process with a 500 Internal Server Error
		res.status(500).json({ error: err.message });
		// Optionally log the error for further investigation
		console.log("Error in signupUser: ", err.message);
	}
};

// Function to log in a user
const loginUser = async (req, res) => {
	try {
		// Extract username and password from request body
		const { username, password } = req.body;

		// Attempt to find a user in the database with the provided username
		const user = await User.findOne({ username });

		// Check if the provided password matches the stored hash using bcrypt
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

		// If no user is found or the password is incorrect, return an error
		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password" });
		}

		// If the user account is marked as frozen, unfreeze it
		if (user.isFrozen) {
			user.isFrozen = false;
			await user.save(); // Save the updated user information
		}

		// Generate a session token for the user and set it in a cookie
		generateTokenAndSetCookie(user._id, res);

		// Respond with user details excluding sensitive information
		res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			username: user.username,
			bio: user.bio,
			profilePic: user.profilePic,
		});
	} catch (error) {
		// Handle any errors during the process and respond with a 500 Internal Server Error
		res.status(500).json({ error: error.message });
		// Optionally log the error for further investigation
		console.log("Error in loginUser: ", error.message);
	}
};

// Function to log out a user
const logoutUser = (req, res) => {
	try {
		// Set the 'jwt' cookie to an empty string and expire it immediately
		res.cookie("jwt", "", { maxAge: 1 });

		// Send a successful logout response
		res.status(200).json({ message: "User logged out successfully" });
	} catch (err) {
		// Handle any errors that occur during the logout process
		res.status(500).json({ error: err.message });

		// Optionally log the error for debugging purposes
		console.log("Error in logoutUser: ", err.message);
	}
};

// Function to follow/unfollow a user
const followUnFollowUser = async (req, res) => {
	try {
		// Extract the ID of the user to be followed or unfollowed from URL parameters
		const { id } = req.params;

		// Fetch the user to modify and the current logged-in user from the database
		const userToModify = await User.findById(id);
		const currentUser = await User.findById(req.user._id);

		// Prevent users from following or unfollowing themselves
		if (id === req.user._id.toString()) {
			return res.status(400).json({ error: "You cannot follow/unfollow yourself" });
		}

		// Ensure both the target user and the current user exist in the database
		if (!userToModify || !currentUser) {
			return res.status(400).json({ error: "User not found" });
		}

		// Check if the current user is already following the target user
		const isFollowing = currentUser.following.includes(id);

		if (isFollowing) {
			// If currently following, unfollow the user
			await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
			res.status(200).json({ message: "User unfollowed successfully" });
		} else {
			// If not following, follow the user
			await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
			res.status(200).json({ message: "User followed successfully" });
		}
	} catch (err) {
		// Handle any errors that occur during the process
		res.status(500).json({ error: err.message });
		// Log the error for debugging purposes
		console.log("Error in followUnFollowUser: ", err.message);
	}
};

// Function to update user information
const updateUser = async (req, res) => {
	// Extract user-provided details from the request body
	const { name, email, username, password, bio } = req.body;
	let { profilePic } = req.body;

	// Retrieve the user ID of the currently logged-in user
	const userId = req.user._id;

	try {
		// Find the current user in the database using their user ID
		let user = await User.findById(userId);

		// If the user does not exist, return a 400 Bad Request error
		if (!user) return res.status(400).json({ error: "User not found" });

		// Check if the user is trying to update another user's profile
		if (req.params.id !== userId.toString()) return res.status(400).json({ error: "You cannot update other user's profile" });

		// If a new password is provided, hash it before storing
		if (password) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			user.password = hashedPassword;
		}

		// If a new profile picture is provided, handle the image upload and deletion of the old image
		if (profilePic) {
			if (user.profilePic) {
				// Delete the old profile picture from Cloudinary
				await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
			}
			// Upload the new profile picture to Cloudinary and get the secure URL
			const uploadedResponse = await cloudinary.uploader.upload(profilePic);
			profilePic = uploadedResponse.secure_url;
		}

		// Update user details, using provided values or defaulting to existing values if not provided
		user.name = name || user.name;
		user.email = email || user.email;
		user.username = username || user.username;
		user.profilePic = profilePic || user.profilePic;
		user.bio = bio || user.bio;

		// Save the updated user data to the database
		user = await user.save();

		// Additionally, update the user's information in related posts where they have replied
		await Post.updateMany(
			{ "replies.userId": userId },
			{
				$set: {
					"replies.$[reply].username": user.username,
					"replies.$[reply].userProfilePic": user.profilePic,
				},
			},
			{ arrayFilters: [{ "reply.userId": userId }] }
		);

		// Ensure the password is not included in the response for security reasons
		user.password = null;

		// Send back the updated user data with a 200 OK status
		res.status(200).json(user);
	} catch (err) {
		// Handle any errors that occur during the process with a 500 Internal Server Error
		res.status(500).json({ error: err.message });

		// Optionally log the error for debugging purposes
		console.log("Error in updateUser: ", err.message);
	}
};

// Function to suggest new users to follow
const getSuggestedUsers = async (req, res) => {
	try {
		// Retrieve the ID of the current user from the request object
		const userId = req.user._id;

		// Fetch the list of user IDs that the current user is already following
		const usersFollowedByYou = await User.findById(userId).select("following");

		// Perform an aggregation to find users excluding the current user and randomly sample 10 of them
		const users = await User.aggregate([
			{
				$match: {
					_id: { $ne: userId }, // Exclude the current user's ID from the results
				},
			},
			{
				$sample: { size: 10 }, // Randomly select 10 users from those that are not the current user
			},
		]);

		// Filter out the users that the current user is already following from the sampled list
		const filteredUsers = users.filter((user) => !usersFollowedByYou.following.includes(user._id));

		// Limit the suggested users to the top 4 for simplicity and focus
		const suggestedUsers = filteredUsers.slice(0, 4);

		// Set the password property to null to prevent it from being sent back in the response for security reasons
		suggestedUsers.forEach((user) => (user.password = null));

		// Send the list of suggested users back to the client with a 200 OK status
		res.status(200).json(suggestedUsers);
	} catch (error) {
		// Handle any errors that might occur during the process by sending a 500 Internal Server Error status
		res.status(500).json({ error: error.message });
	}
};

// Function to freeze a user account
const freezeAccount = async (req, res) => {
	try {
		// Fetch the user document from the database based on the ID of the current logged-in user
		const user = await User.findById(req.user._id);

		// Check if the user was not found in the database
		if (!user) {
			// Return a 400 Bad Request response with an error message
			return res.status(400).json({ error: "User not found" });
		}

		// Set the isFrozen property of the user document to true, indicating the account is frozen
		user.isFrozen = true;

		// Save the updated user document to the database
		await user.save();

		// Return a 200 OK response indicating the account was successfully frozen
		res.status(200).json({ success: true });
	} catch (error) {
		// Catch any errors that occur during the process and return a 500 Internal Server Error response
		res.status(500).json({ error: error.message });
	}
};

export { signupUser, loginUser, logoutUser, followUnFollowUser, updateUser, getUserProfile, getSuggestedUsers, freezeAccount };
