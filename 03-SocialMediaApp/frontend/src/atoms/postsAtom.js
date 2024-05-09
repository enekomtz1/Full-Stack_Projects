/*
- This code initializes a Recoil atom.
- It is used to manage the state of posts in a React application.
- The atom is named 'postsAtom' and it will be identifiable by this key across the application.
- It sets an initial default state as an empty array.
- This state can be shared and updated across different components using Recoil hooks.
*/

// Importing the 'atom' function from the 'recoil' package to create atom.
import { atom } from "recoil";

// Creating 'postsAtom' to hold the state of posts.
const postsAtom = atom({
	key: "postsAtom", // Unique key for referring to the atom
	default: [], // Initial state is set to an empty array
});

// Exporting the 'postsAtom' for use in other parts of the application.
export default postsAtom;
