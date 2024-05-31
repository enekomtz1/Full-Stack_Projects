/*
- This code defines a login page component for a React application.
- It handles the user login process using GraphQL mutations.
- The component uses state management to handle form inputs.
- It displays a login form with fields for username and password.
- Upon form submission, it attempts to log in the user and displays appropriate messages.
*/

import { Link } from "react-router-dom";
import { useState } from "react";
import InputField from "../components/InputField";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../graphql/mutations/user.mutation";
import toast from "react-hot-toast";

const LoginPage = () => {
	// Define the initial state for loginData with empty username and password
	const [loginData, setLoginData] = useState({
		username: "",
		password: "",
	});

	// Define the login mutation using Apollo Client's useMutation hook
	const [login, { loading }] = useMutation(LOGIN, {
		refetchQueries: ["GetAuthenticatedUser"],
	});

	// Handle input changes for the form fields
	const handleChange = (e) => {
		// Extract name and value from the input event
		const { name, value } = e.target;
		// Update the loginData state with the new input values
		setLoginData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		// Prevent the default form submission behavior
		e.preventDefault();
		// Check if both username and password fields are filled
		if (!loginData.username || !loginData.password) return toast.error("Please fill in all fields");
		try {
			// Attempt to log in using the login mutation with the provided input data
			await login({ variables: { input: loginData } });
		} catch (error) {
			// Log any errors to the console and display an error toast message
			console.error("Error logging in:", error);
			toast.error(error.message);
		}
	};

	// Render the login page component
	return (
		<div className="flex justify-center items-center h-screen">
			<div className="flex rounded-lg overflow-hidden z-50 bg-gray-300">
				<div className="w-full bg-gray-100 min-w-80 sm:min-w-96 flex items-center justify-center">
					<div className="max-w-md w-full p-6">
						{/* Page title */}
						<h1 className="text-3xl font-semibold mb-6 text-black text-center">Login</h1>
						{/* Welcome message */}
						<h1 className="text-sm font-semibold mb-6 text-gray-500 text-center">Welcome back! Log in to your account</h1>
						{/* Login form */}
						<form className="space-y-4" onSubmit={handleSubmit}>
							{/* Username input field */}
							<InputField label="Username" id="username" name="username" value={loginData.username} onChange={handleChange} />
							{/* Password input field */}
							<InputField label="Password" id="password" name="password" type="password" value={loginData.password} onChange={handleChange} />
							<div>
								{/* Submit button */}
								<button
									type="submit"
									className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black  focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
									disabled={loading}
								>
									{loading ? "Loading..." : "Login"}
								</button>
							</div>
						</form>
						{/* Sign-up link */}
						<div className="mt-4 text-sm text-gray-600 text-center">
							<p>
								{"Don't"} have an account?{" "}
								<Link to="/signup" className="text-black hover:underline">
									Sign Up
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
