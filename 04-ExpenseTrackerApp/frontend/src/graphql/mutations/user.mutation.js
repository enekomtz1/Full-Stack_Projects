/*
- This code defines GraphQL mutations for user authentication.
- The SIGN_UP mutation allows new users to sign up by providing necessary details.
- The LOGIN mutation allows existing users to log in with their credentials.
- The LOGOUT mutation logs out the currently authenticated user.
- Each mutation returns specific fields upon successful execution.
*/

import { gql } from "@apollo/client";

// Define the SIGN_UP mutation for user registration
export const SIGN_UP = gql`
    mutation SignUp($input: SignUpInput!) {
        signUp(input: $input) {
            _id       // Return the user's unique ID
            name      // Return the user's name
            username  // Return the user's username
        }
    }
`;

// Define the LOGIN mutation for user authentication
export const LOGIN = gql`
    mutation Login($input: LoginInput!) {
        login(input: $input) {
            _id       // Return the user's unique ID
            name      // Return the user's name
            username  // Return the user's username
        }
    }
`;

// Define the LOGOUT mutation for logging out the current user
export const LOGOUT = gql`
    mutation Logout {
        logout {
            message   // Return a logout confirmation message
        }
    }
`;
