/*
- This code defines the GraphQL type schema for a transaction management system.
- It includes types for Transaction, Query, Mutation, and CategoryStatistics.
- The schema allows for creating, updating, and querying transactions and their statistics.
- Each type is detailed with required fields, ensuring data integrity.
- The system is designed to be used in financial or commercial applications where transaction data is critical.
*/

// Define GraphQL schema for transaction data types
const transactionTypeDef = `#graphql
  // Define a Transaction type with necessary fields
  type Transaction {
    _id: ID!
    userId: ID!
    description: String!
    paymentType: String!
    category: String!
    amount: Float!
    location: String
    date: String!
    user: User!
  }
  
  // Query type for fetching transactions and related statistics
  type Query {
    transactions: [Transaction!]
    transaction(transactionId: ID!): Transaction
    categoryStatistics: [CategoryStatistics!]
  }`;
