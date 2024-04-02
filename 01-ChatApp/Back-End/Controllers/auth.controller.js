import bcrypt from "bcryptjs";
import User from "../Models/user.model.js";
import generateTokenAndSetCookie from "../Utils/generateToken.js";

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
			generateTokenAndSetCookie(newUser._id, res);

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

export const login = async (req, res) => {
	try {
		// Get input from user:
		const { userName, password } = req.body;

		// Check if the user exists:
		const user = await User.findOne({ userName });

		// Check if the password is corect:
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

		// If any of those is false, return error:
		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password" });
		}

		// Generate jwt token:
		generateTokenAndSetCookie(user._id, res);

		res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			userName: user.userName,
			profilePicture: user.profilePicture,
		});
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal server error." });
	}
};

export const logout = (req, res) => {
	console.log("logout up user");
};
