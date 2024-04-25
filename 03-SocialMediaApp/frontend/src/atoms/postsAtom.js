/*
- Creating a Recoil atom to manage the state of posts.
- `postsAtom` is initialized as an empty array and is identified by the unique key 'postsAtom'.
- Atoms in Recoil represent pieces of state that can be read from and written to from different components.
*/

// Importing the atom function from the recoil package.
import { atom } from "recoil";

const postsAtom = atom({
	key: "postsAtom", // Unique key for the atom, used in debugging and persistence.
	default: [], // Default value for the atom, defining the initial state.
});

// Exporting `postsAtom` for use across the application.
export default postsAtom;
