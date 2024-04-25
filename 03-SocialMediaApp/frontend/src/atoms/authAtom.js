/*
- This script sets up a Recoil atom.
- Atoms are units of state in Recoil.
- `authScreenAtom` manages which authentication screen to display.
- The default state for `authScreenAtom` is "login".
- It's used across the application to maintain the state of the authentication screen.
- The `key` property uniquely identifies the atom within the Recoil state management system.
*/

import { atom } from "recoil"; // Importing the `atom` function from Recoil to create atom.

// Define `authScreenAtom` to manage the current authentication screen's state.
const authScreenAtom = atom({
	key: "authScreenAtom", // Unique key for the atom, crucial for Recoil's state management.
	default: "login", // Sets the default state to 'login', indicating the initial authentication screen.
});

export default authScreenAtom; // Export the atom for use throughout the application.
