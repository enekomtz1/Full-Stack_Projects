/*
- This code implements state management for authentication screens using Recoil.
- It defines an atom, which is a unit of state in Recoil, to manage the current authentication screen.
- The 'authScreenAtom' atom is used to store and track which authentication screen is currently active.
- It initially sets the default state to "login", indicating that the login screen is the default screen.
- This atom can be imported and used in various components to reactively update and access the state of the authentication screen.
*/

// Importing the 'atom' function from the 'recoil' package, which is used for creating atoms.
import { atom } from "recoil";

// Creating an atom named 'authScreenAtom' to hold the state of the current authentication screen.
const authScreenAtom = atom({
	key: "authScreenAtom", // Unique key for the atom, used internally by Recoil for identification.
	default: "login", // Setting the default value of the atom to "login".
});

// Exporting 'authScreenAtom' so it can be used in other parts of the application.
export default authScreenAtom;
