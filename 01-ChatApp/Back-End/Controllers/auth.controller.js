import bcrypt from "bcryptjs";
import User from "../Models/user.model.js";

export const signup = async (req, res) => {
	try {
		const { fullName, userName, password, confirmPassword, gender } = req.body;

		if (password !== confirmPassword) {
			return res.status(400).json({ message: "Passwords do not match." });
		}

		const user = await User.findOne({ userName });
		if (user) {
			return res.status(400).json({ error: "Username already exists." });
		}

		// Hash password here
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		// https://avatar-placeholder.iran.liara.run/

		const boyProfilePicture = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
		const girlProfilePicture = `https://avatar.iran.liara.run/public/girl?username=${userName}`;

		const newUser = new User({
			fullName,
			userName,
			password: hashedPassword,
			gender,
			profilePicture: gender === "male" ? boyProfilePicture : girlProfilePicture,
		});

		if (newUser) {
			// Generate jwt token
			await newUser.save();

			res.status(201).json({
				_id: newUser._id,
				fullName: newUser.fullName,
				userName: newUser.userName,
				profilePicture: newUser.profilePicture,
			});
		} else {
			res.status(400).json({ error: "Invalid user data." });
		}
	} catch (error) {
		console.log("Error in signup controler", error.message);
		res.status(500).json({ error: "Internal server error." });
	}
};

export const login = (req, res) => {
	console.log("login up user");
};

export const logout = (req, res) => {
	console.log("logout up user");
};
