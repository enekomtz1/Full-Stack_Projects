/*
- Importing necessary hooks and state management tools from React, Recoil.
- useFollowUnfollow is a custom hook for toggling follow/unfollow state of a user.
- It uses the Recoil library to manage and access the current user state globally.
- useState is used to manage local state for 'following' and 'updating' statuses.
- The handleFollowUnfollow function provides the logic to either follow or unfollow the user based on the current state.
- API requests are handled within this function to update the server about the follow/unfollow action.
- Error handling is included to manage unsuccessful operations and inform the user.
- User feedback is provided through a custom toast notification system.
*/

import { useState } from "react"; // Import useState for managing component state
import useShowToast from "./useShowToast"; // Import a custom hook for showing toast notifications
import userAtom from "../atoms/userAtom"; // Import the Recoil atom to manage the current user state
import { useRecoilValue } from "recoil"; // Import useRecoilValue to access Recoil state in this component

const useFollowUnfollow = (user) => {
	// Get the current user's data from Recoil global state
	const currentUser = useRecoilValue(userAtom);

	// Determine if the current user is following the 'user' using the followers array
	const [following, setFollowing] = useState(user.followers.includes(currentUser?._id));

	// State to handle whether the follow/unfollow operation is in progress
	const [updating, setUpdating] = useState(false);

	// Use the custom showToast hook for showing notifications
	const showToast = useShowToast();

	// Function to handle following or unfollowing a user
	const handleFollowUnfollow = async () => {
		// Check if there's no current user, show error toast if not logged in
		if (!currentUser) {
			showToast("Error", "Please login to follow", "error");
			return;
		}
		// Prevent multiple submissions by checking if it's already updating
		if (updating) return;

		// Set updating state to true to indicate operation is in progress
		setUpdating(true);
		try {
			// Send a POST request to the follow/unfollow API endpoint
			const res = await fetch(`/api/users/follow/${user._id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json(); // Parse JSON response
			// Handle any errors from the server
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

			// Toggle following state based on current state
			if (following) {
				showToast("Success", `Unfollowed ${user.name}`, "success");
				user.followers.pop(); // Simulate removing from followers
			} else {
				showToast("Success", `Followed ${user.name}`, "success");
				user.followers.push(currentUser?._id); // Simulate adding to followers
			}
			setFollowing(!following); // Update following state

			console.log(data); // Log server response for debugging
		} catch (error) {
			// Handle any errors during fetch operation
			showToast("Error", error, "error");
		} finally {
			// Reset updating state to false after operation completes
			setUpdating(false);
		}
	};

	// Return the handle function and state values for use in components
	return { handleFollowUnfollow, updating, following };
};

export default useFollowUnfollow; // Export the custom hook for use elsewhere
