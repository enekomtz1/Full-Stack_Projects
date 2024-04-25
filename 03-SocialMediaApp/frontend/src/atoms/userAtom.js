/*
- This file defines a Recoil atom for managing user state.
- The `userAtom` is initialized with data from localStorage.
- Data is retrieved from localStorage under the key "user-threads".
- If "user-threads" does not exist in localStorage, the atom's default value will be `null`.
*/

import { atom } from "recoil"; // Import the atom utility from Recoil to create atom states.

const userAtom = atom({
	key: "userAtom", // Unique identifier for this particular atom within the Recoil state management.
	default: JSON.parse(localStorage.getItem("user-threads") || "null"), // Initialize the atom's default value.
	// Retrieves the "user-threads" data from localStorage and parses it as JSON.
	// If there is no data, it falls back to 'null'.
});

export default userAtom; // Export the atom for use throughout the application.
