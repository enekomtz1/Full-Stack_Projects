// Import the user model to interact with the user database collection
import User from "../models/user.model.js";

// Controller to get a list of users for displaying in the sidebar of the chat application
export const getUsersForSidebar = async (req, res) => {
	try {
		// Get the ID of the currently logged-in user from the request object
		const loggedInUserId = req.user._id;

		// Find all users except the logged-in user to display in the sidebar
		// Exclude the password field from the results for security
		const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

		// Send the list of filtered users as the response
		res.status(200).json(filteredUsers);
	} catch (error) {
		// Log and send an internal server error response if an exception occurs
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
