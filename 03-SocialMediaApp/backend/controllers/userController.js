import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

const getUserProfile = async (req, res) => {
	// We will fetch user profile either with username or userId
	// query is either username or userId
	const { query } = req.params;

	try {
		let user;

		// query is userId
		if (mongoose.Types.ObjectId.isValid(query)) {
			user = await User.findOne({ _id: query }).select("-password").select("-updatedAt");
		}
		// query is username
		else {
			user = await User.findOne({ username: query }).select("-password").select("-updatedAt");
		}

		if (!user) {
			return res.status(404).json({ error: "User not found." });
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
		console.log("Error in getUserProfile ", error.message);
	}
};

const signupUser = async (req, res) => {
	try {
		const { name, email, username, password } = req.body;
		const user = await User.findOne({ $or: [{ email }, { username }] });

		if (user) {
			return res.status(400).json({ error: "User already exists" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new User({
			name,
			email,
			username,
			password: hashedPassword,
		});

		await newUser.save();

		if (newUser) {
			generateTokenAndSetCookie(newUser._id, res);

			res.status(201).json({
				_id: newUser._id,
				name: newUser.name,
				email: newUser.email,
				username: newUser.username,
				bio: newUser.bio,
				profilePic: newUser.profilePic,
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
		console.log("Error in signupUser ", error.message);
	}
};

const loginUser = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password" });
		}

		if (user.isFrozen) {
			user.isFrozen = false;
			await user.save();
		}

		generateTokenAndSetCookie(user._id, res);

		res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			username: user.username,
			bio: user.bio,
			profilePic: user.profilePic,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in signupUser ", err.message);
	}
};

const logoutUser = (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 1 });
		res.status(200).json({ message: "User logged out successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in signupUser: ", err.message);
	}
};

const followUnfollowUser = async (req, res) => {
	try {
		const { id } = req.params;
		const userToModify = await User.findById(id);
		const currentUser = await User.findById(req.user._id);

		if (id === currentUser.toString()) {
			return res.status(400).json({ error: "You can't follow/unfollow yourserlf." });
		}

		const isFollowing = currentUser.following.includes(id);

		// Unfollow if the user is already following:
		if (isFollowing) {
			await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $pull: { followers: id } });

			res.status(200).json({ message: "User unfollowed successfully" });
		}
		// Follow if the user is not following:
		else {
			await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $push: { followers: id } });

			res.status(200).json({ message: "User followed successfully" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in followUnFollowUser: ", err.message);
	}
};

const updateUser = async (req, res) => {
	const { name, email, username, password, bio } = req.body;
	let { profilePic } = req.body;

	const userId = req.user._id;

	try {
		let user = await User.findById(userId);
		if (!user) {
			return res.status(400).json({ error: "User not found" });
		}

		if (req.params.id !== userId.toString()) {
			return res.status(400).json({ error: "You can't update other user's profile" });
		}

		if (password) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			user.password = hashedPassword;
		}

		// Update the new pic on cloudinary if profilePic exists:
		if (profilePic) {
			await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
		} else {
			const uploadedResponse = await cloudinary.uploader.upload(profilePic);
			profilePic = uploadedResponse.secure_url;
		}

		user.name = name || user.name;
		user.email = email || user.email;
		user.username = username || user.username;
		user.profilePic = profilePic || user.profilePic;
		user.bio = bio || user.bio;

		// Update all changes that the user has done to the profile:
		user = await user.save();

		// Find all posts that this user replied and update username and userProfilePic fields:
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

		// password should be null in response
		user.password = null;

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in updateUser: ", err.message);
	}
};

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
