/*
- This code snippet defines an atomic piece of state using the Recoil library.
- The state is specifically designed to manage the authentication screen's status.
- It creates a state atom named 'authScreenAtom'.
- The default state for this atom is set to "login", indicating the initial screen.
- This atom can be used and updated throughout a React application to change or read the auth screen status.
*/

// Import the 'atom' function from the Recoil library to create state atoms
import { atom } from "recoil";

// Define 'authScreenAtom' to manage the authentication screen's state
const authScreenAtom = atom({
	key: "authScreenAtom", // Unique key for the atom, used in debugging and persisting state
	default: "login", // Default value of the atom, setting the initial state to 'login'
});

// Export the 'authScreenAtom' so it can be used across the application
export default authScreenAtom;
