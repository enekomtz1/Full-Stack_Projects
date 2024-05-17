/*
- This code defines the GraphQL schema for user-related operations.
- It specifies the User type with necessary fields and their types.
- It includes queries to fetch authenticated user details and a specific user's details.
- It includes mutations for user sign-up, login, and logout operations.
- Input types for sign-up and login are defined for structured data input.
*/

// Define the GraphQL schema for user-related operations
const userTypeDef = `#graphql
  // Define the User type with necessary fields and their types
  type User {
    _id: ID!                   // Unique identifier for the user
    username: String!          // Username of the user
    name: String!              // Name of the user
    password: String!          // Password of the user
    profilePicture: String     // Optional profile picture URL
    gender: String!            // Gender of the user
    transactions: [Transaction!] // List of transactions associated with the user
  }

  // Define queries for fetching user data
  type Query {
    authUser: User             // Fetch the authenticated user's details
    user(userId:ID!): User     // Fetch a specific user's details by userId
  }

  // Define mutations for user sign-up, login, and logout
  type Mutation {
    signUp(input: SignUpInput!): User // Sign-up a new user with the provided input
    login(input: LoginInput!): User   // Log in an existing user with the provided input
    logout: LogoutResponse            // Log out the current user
  }

  // Define input type for user sign-up
  input SignUpInput {
    username: String!          // Username for the new user
    name: String!              // Name of the new user
    password: String!          // Password for the new user
    gender: String!            // Gender of the new user
  }

  // Define input type for user login
  input LoginInput {
    username: String!          // Username for logging in
    password: String!          // Password for logging in
  }

  // Define the response type for logout operation
  type LogoutResponse {
    message: String!           // Logout response message
  }
`;

// Export the userTypeDef for use in other parts of the application
export default userTypeDef;
