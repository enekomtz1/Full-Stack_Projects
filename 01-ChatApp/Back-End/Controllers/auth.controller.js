export const signup = async (req, res) => {
	try {
		if (password !== confirmPassword) {
			return res.status(400).json({ message: "Passwords do not match." });
		}

		const user = await User.findOne({ userName });
		if (user) {
			return res.status(400).json({ message: "Username already exists." });
		}

		// Hash password here
	} catch (error) {}
};

export const login = (req, res) => {
	console.log("login up user");
};

export const logout = (req, res) => {
	console.log("logout up user");
};
