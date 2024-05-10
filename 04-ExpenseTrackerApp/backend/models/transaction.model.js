/*
- This code defines a Mongoose schema for a "Transaction" model in a MongoDB database.
- It specifies the structure and data types of each field in the transaction collection.
- Fields include user ID, description, payment type, category, amount, location, and date.
- Some fields have restrictions such as required values and enumerated options.
- This model is used to ensure data integrity and to facilitate database operations like queries.
*/

// Importing the mongoose module to interact with MongoDB
import mongoose from "mongoose";

// Defining the schema for a transaction document
const transactionSchema = new mongoose.Schema({
	// Linking to a User document, required field
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	// Description of the transaction, required field
	description: {
		type: String,
		required: true,
	},
	// Type of payment used in the transaction, restricted to 'cash' or 'card'
	paymentType: {
		type: String,
		enum: ["cash", "card"],
		required: true,
	},
	// Category of the transaction, restricted to 'saving', 'expense', or 'investment'
	category: {
		type: String,
		enum: ["saving", "expense", "investment"],
		required: true,
	},
	// Amount of money involved in the transaction, required field
	amount: {
		type: Number,
		required: true,
	},
	// Location where the transaction took place, with a default value if unspecified
	location: {
		type: String,
		default: "Unknown",
	},
	// Date of the transaction, required field
	date: {
		type: Date,
		required: true,
	},
});

// Creating the Transaction model from the defined schema
const Transaction = mongoose.model("Transaction", transactionSchema);

// Exporting the Transaction model for use in other parts of the application
export default Transaction;
