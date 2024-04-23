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
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in getUserProfile ", err.message);
	}
};
