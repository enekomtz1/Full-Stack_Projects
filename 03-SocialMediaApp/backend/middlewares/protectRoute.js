import User from "../models/userModel";
import jwt from "jasonwebtoken";

// If the user is not logged in or hasn't an account, he/she won't be able to access the app.
const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;

		if (!token) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.userId).select("-password");

		req.user = user;

		next();
	} catch (error) {
		res.status(500).json({ message: error.message });
		console.log("Error in signupUser: ", err.message);
	}
};

export default protectRoute;
