/*
- This code defines a React functional component for the home page of a financial tracking application.
- It uses the Apollo Client to query transaction statistics and authenticated user data from a GraphQL API.
- The component displays a doughnut chart with the transaction data and includes user authentication handling.
- It incorporates several UI components like a logout button, a transaction form, and cards for displaying additional data.
- The chart is dynamically updated based on the fetched transaction statistics.
*/

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import Cards from "../components/Cards";
import TransactionForm from "../components/TransactionForm";

import { MdLogout } from "react-icons/md";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@apollo/client";
import { LOGOUT } from "../graphql/mutations/user.mutation";
import { GET_TRANSACTION_STATISTICS } from "../graphql/queries/transaction.query";
import { GET_AUTHENTICATED_USER } from "../graphql/queries/user.query";
import { useEffect, useState } from "react";

// Register necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const HomePage = () => {
	// Query to get transaction statistics
	const { data } = useQuery(GET_TRANSACTION_STATISTICS);
	// Query to get authenticated user data
	const { data: authUserData } = useQuery(GET_AUTHENTICATED_USER);

	// Mutation for logging out the user
	const [logout, { loading, client }] = useMutation(LOGOUT, {
		refetchQueries: ["GetAuthenticatedUser"],
	});

	// State to store chart data
	const [chartData, setChartData] = useState({
		labels: [],
		datasets: [
			{
				label: "$",
				data: [],
				backgroundColor: [],
				borderColor: [],
				borderWidth: 1,
				borderRadius: 30,
				spacing: 10,
				cutout: 130,
			},
		],
	});

	// Effect to update chart data when transaction statistics are fetched
	useEffect(() => {
		if (data?.categoryStatistics) {
			const categories = data.categoryStatistics.map((stat) => stat.category);
			const totalAmounts = data.categoryStatistics.map((stat) => stat.totalAmount);

			const backgroundColors = [];
			const borderColors = [];

			// Assign colors based on category
			categories.forEach((category) => {
				if (category === "saving") {
					backgroundColors.push("rgba(75, 192, 192)");
					borderColors.push("rgba(75, 192, 192)");
				} else if (category === "expense") {
					backgroundColors.push("rgba(255, 99, 132)");
					borderColors.push("rgba(255, 99, 132)");
				} else if (category === "investment") {
					backgroundColors.push("rgba(54, 162, 235)");
					borderColors.push("rgba(54, 162, 235)");
				}
			});

			// Update chart data state
			setChartData((prev) => ({
				labels: categories,
				datasets: [
					{
						...prev.datasets[0],
						data: totalAmounts,
						backgroundColor: backgroundColors,
						borderColor: borderColors,
					},
				],
			}));
		}
	}, [data]);

	// Function to handle user logout
	const handleLogout = async () => {
		try {
			await logout();
			// Clear the Apollo Client cache
			client.resetStore();
		} catch (error) {
			console.error("Error logging out:", error);
			toast.error(error.message);
		}
	};

	return (
		<>
			{/* Main container */}
			<div className="flex flex-col gap-6 items-center max-w-7xl mx-auto z-20 relative justify-center">
				{/* Header section with user info and logout button */}
				<div className="flex items-center">
					<p className="md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 mb-4 mr-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text">
						Spend wisely, track wisely
					</p>
					<img src={authUserData?.authUser.profilePicture} className="w-11 h-11 rounded-full border cursor-pointer" alt="Avatar" />
					{!loading && <MdLogout className="mx-2 w-5 h-5 cursor-pointer" onClick={handleLogout} />}
					{/* Loading spinner */}
					{loading && <div className="w-6 h-6 border-t-2 border-b-2 mx-2 rounded-full animate-spin"></div>}
				</div>
				{/* Main content section */}
				<div className="flex flex-wrap w-full justify-center items-center gap-6">
					{/* Doughnut chart */}
					{data?.categoryStatistics.length > 0 && (
						<div className="h-[330px] w-[330px] md:h-[360px] md:w-[360px]  ">
							<Doughnut data={chartData} />
						</div>
					)}
					{/* Transaction form */}
					<TransactionForm />
				</div>
				{/* Additional cards component */}
				<Cards />
			</div>
		</>
	);
};

export default HomePage;
