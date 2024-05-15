/*
- This code demonstrates how to merge GraphQL type definitions using the "@graphql-tools/merge" library.
- It imports type definitions from separate files and merges them into a single definition.
- The merged type definitions facilitate modular organization of GraphQL schemas.
- By merging, it supports easier collaboration among multiple developers on the same GraphQL schema.
- It allows for reuse of type definitions across different parts of the schema, enhancing maintainability.
*/

// Import the mergeTypeDefs function from the GraphQL tools library
import { mergeTypeDefs } from "@graphql-tools/merge";

// Import type definitions for users
import userTypeDef from "./user.typeDef.js";
// Import type definitions for transactions
import transactionTypeDef from "./transaction.typeDef.js";

// Merge the user and transaction type definitions into a single object
const mergedTypeDefs = mergeTypeDefs([userTypeDef, transactionTypeDef]);

// Export the merged type definitions to be used in other parts of the application
export default mergedTypeDefs;
