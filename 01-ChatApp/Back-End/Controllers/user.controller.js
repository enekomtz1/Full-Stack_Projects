import User from "../Models/user.model.js";

// Function to get all users except the logged in user
export const getUsersForSidebar = async (req, res) => {
	try {
		// Get the logged in user id:
		const loggedInUserId = req.user._id;

		// Find all users except the logged in user:
		const finteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

		res.status(200).json({ users: finteredUsers });
	} catch (error) {
		console.error("Error in getUsersForSidebar controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
