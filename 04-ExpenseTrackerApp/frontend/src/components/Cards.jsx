/*
- This code defines a React component named Cards.
- It uses Apollo Client's useQuery hook to fetch data from a GraphQL API.
- It retrieves transactions, authenticated user information, and user-specific transactions.
- The component renders a list of transaction cards if data is successfully fetched.
- If no transactions are found, it displays a message indicating no transaction history.
*/

import { useQuery } from "@apollo/client";
import Card from "./Card";
import { GET_TRANSACTIONS } from "../graphql/queries/transaction.query";
import { GET_AUTHENTICATED_USER, GET_USER_AND_TRANSACTIONS } from "../graphql/queries/user.query";

const Cards = () => {
	// Query to fetch transaction data
	const { data, loading } = useQuery(GET_TRANSACTIONS);

	// Query to fetch authenticated user data
	const { data: authUser } = useQuery(GET_AUTHENTICATED_USER);

	// Query to fetch user-specific transactions, using the authenticated user's ID
	const { data: userAndTransactions } = useQuery(GET_USER_AND_TRANSACTIONS, {
		variables: {
			userId: authUser?.authUser?._id,
		},
	});

	// Log user and transaction data to the console
	console.log("userAndTransactions:", userAndTransactions);
	console.log("cards:", data);

	// Render the component's UI
	return (
		<div className="w-full px-10 min-h-[40vh]">
			<p className="text-5xl font-bold text-center my-10">History</p>
			<div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start mb-20">
				{
					// If data is loaded, map over the transactions to render Card components
					!loading && data.transactions.map((transaction) => <Card key={transaction._id} transaction={transaction} authUser={authUser.authUser} />)
				}
			</div>
			{
				// If no transactions are found, display a message
				!loading && data?.transactions?.length === 0 && <p className="text-2xl font-bold text-center w-full">No transaction history found.</p>
			}
		</div>
	);
};

export default Cards;
