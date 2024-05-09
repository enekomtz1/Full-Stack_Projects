/*
- This code defines a Recoil state using the `atom` function.
- It sets up a user-specific state called 'userAtom'.
- The default state value is retrieved from the localStorage, ensuring persistence across sessions.
- If no data is found in localStorage, the default will be null.
- This state can be used throughout a React application to manage and access user data.
*/

// Importing the 'atom' function from the Recoil library
import { atom } from "recoil";

// Defining the 'userAtom' which will hold the user data across the application
const userAtom = atom({
	key: "userAtom", // Unique key for referencing the atom
	default: JSON.parse(localStorage.getItem("user-threads")) || null, // Default value fetched from localStorage, defaults to null if nothing is found
});

// Exporting 'userAtom' to be used across the application
export default userAtom;
