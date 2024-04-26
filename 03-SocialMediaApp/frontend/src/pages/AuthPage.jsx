/*
- This module imports the required components and hooks.
- The useRecoilValue hook is used to access the global state managed by Recoil.
- LoginCard and SignupCard are React components for rendering the login and signup forms respectively.
- authScreenAtom defines a state piece that controls which auth form to display.
- The AuthPage component conditionally renders LoginCard or SignupCard based on the authScreenState.
- Export the AuthPage component for use in other parts of the application.
*/

import { useRecoilValue } from "recoil"; // Import useRecoilValue from Recoil for state management
import LoginCard from "../components/LoginCard"; // Import the LoginCard component
import SignupCard from "../components/SignupCard"; // Import the SignupCard component
import authScreenAtom from "../atoms/authAtom"; // Import the atom that holds the authentication screen state

// Define the AuthPage functional component
const AuthPage = () => {
	// Retrieve the current state of authScreen from Recoil
	const authScreenState = useRecoilValue(authScreenAtom);

	// Conditionally render the LoginCard or SignupCard based on the authScreenState
	return <>{authScreenState === "login" ? <LoginCard /> : <SignupCard />}</>;
};

export default AuthPage; // Export the AuthPage component for use elsewhere
