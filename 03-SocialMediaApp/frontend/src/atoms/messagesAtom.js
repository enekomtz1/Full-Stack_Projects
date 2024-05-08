/*
- This code defines state management using Recoil atoms.
- It is part of a larger application that handles conversations.
- The 'conversationsAtom' holds an array of conversations, initially empty.
- The 'selectedConversationAtom' keeps track of the currently selected conversation.
- It initializes 'selectedConversationAtom' with default values for conversation details.
*/

// Importing 'atom' from Recoil, which is used for creating atom states.
import { atom } from "recoil";

// Defines an atom to store the list of conversations. Initially, this list is empty.
export const conversationsAtom = atom({
	key: "conversationsAtom", // Unique key for this atom, used in debugging and persistence.
	default: [], // Default value for the atom, an empty array in this case.
});

// Defines an atom for storing the currently selected conversation with default values.
export const selectedConversationAtom = atom({
	key: "selectedConversationAtom", // Unique key for the atom, specific to the selected conversation.
	default: {
		_id: "", // Default ID of the conversation, empty initially.
		userId: "", // Default user ID associated with the conversation, empty initially.
		username: "", // Default username, empty initially.
		userProfilePic: "", // Default path or URL to user's profile picture, empty initially.
	},
});
