/*
- This code defines the GraphQL resolver for transaction-related operations.
- It includes queries for fetching multiple transactions, a single transaction, and category statistics.
- It also contains mutations for creating, updating, and deleting transactions.
- Error handling is incorporated using try-catch blocks to manage database operations.
- Authorization is enforced by checking if a user context exists before performing any operation.
*/

import Transaction from "../models/transaction.model.js"; // Import the Transaction model
import User from "../models/user.model.js"; // Import the User model

const transactionResolver = {
	Query: {
		// Query to fetch all transactions associated with a user
		transactions: async (_, __, context) => {
			try {
				if (!context.getUser()) throw new Error("Unauthorized"); // Check if the user is authenticated
				const userId = await context.getUser()._id; // Get the user ID from the context

				const transactions = await Transaction.find({ userId }); // Fetch transactions from the database by user ID
				return transactions; // Return the fetched transactions
			} catch (err) {
				console.error("Error getting transactions:", err); // Log and throw errors encountered
				throw new Error("Error getting transactions");
			}
		},

		// Query to fetch a single transaction by ID
		transaction: async (_, { transactionId }) => {
			try {
				const transaction = await Transaction.findById(transactionId); // Fetch the transaction by its ID
				return transaction; // Return the found transaction
			} catch (err) {
				console.error("Error getting transaction:", err); // Log and throw errors encountered
				throw new Error("Error getting transaction");
			}
		},

		// Query to calculate and return statistics for transactions categorized by type
		categoryStatistics: async (_, __, context) => {
			if (!context.getUser()) throw new Error("Unauthorized"); // Ensure the user is authenticated

			const userId = context.getUser()._id; // Get the user ID from the context
			const transactions = await Transaction.find({ userId }); // Fetch all transactions of the user
			const categoryMap = {}; // Initialize a map to store total amounts by category

			transactions.forEach((transaction) => {
				if (!categoryMap[transaction.category]) {
					// If no entry exists for the category, initialize it
					categoryMap[transaction.category] = 0;
				}
				categoryMap[transaction.category] += transaction.amount; // Accumulate amounts by category
			});

			return Object.entries(categoryMap).map(([category, totalAmount]) => ({ category, totalAmount }));
			// Convert the category map to an array of objects with category and total amount
		},
	},
	Mutation: {
		// Mutation to create a new transaction
		createTransaction: async (_, { input }, context) => {
			try {
				const newTransaction = new Transaction({
					...input, // Spread the input to set transaction details
					userId: context.getUser()._id, // Set the user ID from the context
				});
				await newTransaction.save(); // Save the new transaction to the database
				return newTransaction; // Return the newly created transaction
			} catch (err) {
				console.error("Error creating transaction:", err); // Log and throw errors encountered
				throw new Error("Error creating transaction");
			}
		},

		// Mutation to update an existing transaction
		updateTransaction: async (_, { input }) => {
			try {
				const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId, input, { new: true }); // Update the transaction and return the new document
				return updatedTransaction; // Return the updated transaction
			} catch (err) {
				console.error("Error updating transaction:", err); // Log and throw errors encountered
				throw new Error("Error updating transaction");
			}
		},

		// Mutation to delete a transaction
		deleteTransaction: async (_, { transactionId }) => {
			try {
				const deletedTransaction = await Transaction.findByIdAndDelete(transactionId); // Delete the transaction by ID
				return deletedTransaction; // Return the deleted transaction
			} catch (err) {
				console.error("Error deleting transaction:", err); // Log and throw errors encountered
				throw new Error("Error deleting transaction");
			}
		},
	},
	Transaction: {
		// Resolver to fetch the user associated with a transaction
		user: async (parent) => {
			const userId = parent.userId; // Get the user ID from the transaction
			try {
				const user = await User.findById(userId); // Fetch the user by ID
				return user; // Return the found user
			} catch (err) {
				console.error("Error getting user:", err); // Log and throw errors encountered
				throw new Error("Error getting user");
			}
		},
	},
};

export default transactionResolver; // Export the resolver for use in other parts of the application
