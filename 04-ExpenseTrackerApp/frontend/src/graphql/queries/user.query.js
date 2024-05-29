/*
- This code defines GraphQL queries using the Apollo Client library.
- The first query, GET_AUTHENTICATED_USER, retrieves data about the currently authenticated user.
- The second query, GET_USER_AND_TRANSACTIONS, retrieves data about a specific user and their transactions.
- These queries are useful for fetching user-related data from a GraphQL API.
- Both queries include specific fields to be returned in the response, ensuring only the necessary data is fetched.
*/

// Import the gql function from the @apollo/client library
import { gql } from "@apollo/client";

// Define a query to get the authenticated user's details
export const GET_AUTHENTICATED_USER = gql`
	query GetAuthenticatedUser {
		// Request the authUser object
		authUser {
			// Include the user ID
			_id
			// Include the username
			username
			// Include the name
			name
			// Include the profile picture URL
			profilePicture
		}
	}
`;

// Define a query to get a user's details and their transactions
export const GET_USER_AND_TRANSACTIONS = gql`
	query GetUserAndTransactions($userId: ID!) {
		// Request the user object with the provided userId
		user(userId: $userId) {
			// Include the user ID
			_id
			// Include the name
			name
			// Include the username
			username
			// Include the profile picture URL
			profilePicture
			// Include the transactions related to the user
			transactions {
				// Include the transaction ID
				_id
				// Include the transaction description
				description
				// Include the type of payment
				paymentType
				// Include the category of the transaction
				category
				// Include the amount of the transaction
				amount
				// Include the location of the transaction
				location
				// Include the date of the transaction
				date
			}
		}
	}
`;
