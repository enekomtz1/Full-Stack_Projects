/*
- This code manages conversation-related states using the Recoil library.
- It defines two atoms: one for all conversations and another for the selected conversation.
- Atoms in Recoil are units of state that can be updated and subscribed to.
*/

import { atom } from "recoil";

// Defines an atom to hold all conversations, initializes with an empty array.
export const conversationsAtom = atom({
	key: "conversationsAtom", // Unique identifier for this atom.
	default: [], // Initial state is an empty list of conversations.
});

// Defines an atom to store the currently active conversation's details.
export const selectedConversationAtom = atom({
	key: "selectedConversationAtom", // Unique identifier for this atom.
	default: {
		_id: "", // The default ID is an empty string, indicating no conversation is selected.
		userId: "", // Default user ID is empty, which will be updated when a conversation is selected.
		username: "", // Starts with no username, to be filled when a conversation is chosen.
		userProfilePic: "", // The URL for the user's profile picture, defaults to empty.
	},
});
