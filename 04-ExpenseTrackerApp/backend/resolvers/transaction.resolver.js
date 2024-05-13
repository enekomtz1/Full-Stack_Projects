/*
- This code defines a GraphQL resolver named transactionResolver for handling transaction data.
- It includes queries to fetch transactions, individual transactions, and category statistics.
- Additionally, it contains mutations to create, update, and delete transactions.
- Error handling is implemented to manage unauthorized access and other transaction-related errors.
- The resolver utilizes Mongoose models to interact with a MongoDB database for transaction data.
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
	},
};
