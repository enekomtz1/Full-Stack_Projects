// Importing necessary modules
import bcrypt from "bcryptjs"; // Used for hashing passwords before storing them in the database
import User from "../Models/user.model.js"; // The user model to interact with the user database collection
import generateTokenAndSetCookie from "../Utils/generateToken.js"; // Utility function to generate JWT token and set it as a cookie

// Signup function to register a new user
export const signup = async (req, res) => {
	try {
		// Extracting user details from the request body
		const { fullName, username, password, confirmPassword, gender } = req.body;

		// Ensure the passwords match to avoid user error
		if (password !== confirmPassword) {
			return res.status(400).json({ error: "Passwords don't match" });
		}

		// Check if the username already exists to maintain unique usernames
		const user = await User.findOne({ username });
		if (user) {
			return res.status(400).json({ error: "Username already exists" });
		}

		// Generate a salt and hash the password for secure storage
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Setting default profile picture based on gender
		const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
		const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

		// Create a new user with the hashed password and generated profile picture URL
		const newUser = new User({
			fullName,
			username,
			password: hashedPassword,
			gender,
			profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
		});

		if (newUser) {
			// If user creation is successful, generate a JWT token and set it as a cookie
			generateTokenAndSetCookie(newUser._id, res);
			await newUser.save();

			// Respond with the new user's public data (excluding sensitive information like password)
			res.status(201).json({
				_id: newUser._id,
				fullName: newUser.fullName,
				username: newUser.username,
				profilePic: newUser.profilePic,
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
	} catch (error) {
		// Log and respond with server error in case of any exception
		console.log("Error in signup controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Login function to authenticate a user and create a session
export const login = async (req, res) => {
	try {
		// Extract username and password from the request body
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

		// Validate the user's credentials
		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password" });
		}

		// Generate a JWT token and set it as a cookie for session management
		generateTokenAndSetCookie(user._id, res);

		// Respond with the user's public data (excluding sensitive information like password)
		res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			username: user.username,
			profilePic: user.profilePic,
		});
	} catch (error) {
		// Log and respond with server error in case of any exception
		console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Logout function to clear the user's session
export const logout = (req, res) => {
	try {
		// Clear the JWT cookie to log the user out
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		// Log and respond with server error in case of any exception
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
