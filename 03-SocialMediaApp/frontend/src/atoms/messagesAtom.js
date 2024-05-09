/*
- This code defines state management using Recoil for a React application.
- It provides two atoms: conversationsAtom and selectedConversationAtom.
- conversationsAtom holds a list of conversation objects.
- selectedConversationAtom stores the currently selected conversation's details.
- These atoms are used throughout the app to manage and access conversation states dynamically.
*/

import { atom } from "recoil";

// Define an atom to store the array of conversations.
export const conversationsAtom = atom({
	key: "conversationsAtom", // Unique key for referencing the atom.
	default: [], // Default value is an empty array.
});

// Define an atom to store details of the selected conversation.
export const selectedConversationAtom = atom({
	key: "selectedConversationAtom", // Unique key for referencing the atom.
	default: {
		_id: "", // Default ID is an empty string.
		userId: "", // Default userId is an empty string.
		username: "", // Default username is an empty string.
		userProfilePic: "", // Default user profile picture is an empty string.
	},
});
