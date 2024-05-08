/*
- This code defines a state management atom using the Recoil library.
- It creates an atom to handle user-related data across React components.
- The atom is identified by a unique key 'userAtom'.
- It initializes the atom's default state with data retrieved from the browser's localStorage.
- The retrieved data is parsed from a JSON string to an object format.
*/

// Import the `atom` function from the Recoil library for state management.
import { atom } from "recoil";

// Define `userAtom` using the `atom` function, which will store user-related data.
const userAtom = atom({
	// Assign a unique key to the atom for identification in the Recoil ecosystem.
	key: "userAtom",
	// Set the default state of the atom by retrieving and parsing user data stored in localStorage.
	default: JSON.parse(localStorage.getItem("user-threads")),
});

// Export `userAtom` to be available for use in other parts of the application.
export default userAtom;
