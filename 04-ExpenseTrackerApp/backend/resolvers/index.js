/*
- This code integrates GraphQL resolver modules for a server application.
- It uses the mergeResolvers function from the @graphql-tools/merge package.
- The code imports resolver modules specifically for user and transaction data.
- It merges these two resolver modules into a single resolver object.
- The merged resolvers are then exported for use in GraphQL server setup.
*/

// Import the mergeResolvers function to combine multiple resolver definitions
import { mergeResolvers } from "@graphql-tools/merge";

// Import resolver modules for users and transactions from the respective files
import userResolver from "./user.resolver.js";
import transactionResolver from "./transaction.resolver.js";

// Merge the imported resolvers into a single resolver object
const mergedResolvers = mergeResolvers([userResolver, transactionResolver]);

// Export the merged resolver object for use in the GraphQL server configuration
export default mergedResolvers;
