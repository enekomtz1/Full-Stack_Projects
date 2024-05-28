/*
- This code defines three GraphQL queries using the gql template literal tag from the @apollo/client library.
- The first query, GET_TRANSACTIONS, retrieves a list of transactions with various fields.
- The second query, GET_TRANSACTION, retrieves a single transaction's details based on a given ID.
- The third query, GET_TRANSACTION_STATISTICS, retrieves statistics about transaction categories.
- These queries are typically used in a frontend application to fetch data from a GraphQL API.
*/

import { gql } from "@apollo/client";

// Query to fetch all transactions with specific fields
export const GET_TRANSACTIONS = gql`
	query GetTransactions {
		transactions {
			_id          // Transaction ID
			description  // Description of the transaction
			paymentType  // Type of payment (e.g., cash, credit card)
			category     // Category of the transaction
			amount       // Amount of money involved in the transaction
			location     // Location where the transaction took place
			date         // Date of the transaction
		}
	}
`;

// Query to fetch details of a specific transaction by its ID
export const GET_TRANSACTION = gql`
	query GetTransaction($id: ID!) {
		transaction(transactionId: $id) {
			_id              // Transaction ID
			description      // Description of the transaction
			paymentType      // Type of payment (e.g., cash, credit card)
			category         // Category of the transaction
			amount           // Amount of money involved in the transaction
			location         // Location where the transaction took place
			date             // Date of the transaction
			user {           // User who made the transaction
				name           // User's name
				username       // User's username
				profilePicture // URL to the user's profile picture
			}
		}
	}
`;

// Query to fetch statistics about transaction categories
export const GET_TRANSACTION_STATISTICS = gql`
	query GetTransactionStatistics {
		categoryStatistics {
			category     // Category name
			totalAmount  // Total amount spent in this category
		}
	}
`;
