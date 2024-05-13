/*
- This code defines a GraphQL resolver named transactionResolver for handling transaction data.
- It includes queries to fetch transactions, individual transactions, and category statistics.
- Additionally, it contains mutations to create, update, and delete transactions.
- Error handling is implemented to manage unauthorized access and other transaction-related errors.
- The resolver utilizes Mongoose models to interact with a MongoDB database for transaction data.
*/

import Transaction from "../models/transaction.model.js"; // Import the Transaction model
import User from "../models/user.model.js";  // Import the User model
