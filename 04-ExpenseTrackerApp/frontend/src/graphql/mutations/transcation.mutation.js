/*
- This code defines GraphQL mutations for creating, updating, and deleting transactions.
- It uses the gql tag from the @apollo/client library to construct the GraphQL queries.
- Each mutation takes specific input parameters and returns detailed information about the transaction.
- The CREATE_TRANSACTION mutation creates a new transaction with the provided input.
- The UPDATE_TRANSACTION and DELETE_TRANSACTION mutations update and delete transactions respectively, based on the provided input.
*/

import { gql } from "@apollo/client";

// Mutation for creating a new transaction
export const CREATE_TRANSACTION = gql`
	mutation CreateTransaction($input: CreateTransactionInput!) {
		// Define the createTransaction mutation
		createTransaction(input: $input) {
			// Fields returned by the mutation
			_id
			description
			paymentType
			category
			amount
			location
			date
		}
	}
`;

// Mutation for updating an existing transaction
export const UPDATE_TRANSACTION = gql`
	mutation UpdateTransaction($input: UpdateTransactionInput!) {
		// Define the updateTransaction mutation
		updateTransaction(input: $input) {
			// Fields returned by the mutation
			_id
			description
			paymentType
			category
			amount
			location
			date
		}
	}
`;

// Mutation for deleting a transaction
export const DELETE_TRANSACTION = gql`
	mutation DeleteTransaction($transactionId: ID!) {
		// Define the deleteTransaction mutation
		deleteTransaction(transactionId: $transactionId) {
			// Fields returned by the mutation
			_id
			description
			paymentType
			category
			amount
			location
			date
		}
	}
`;
