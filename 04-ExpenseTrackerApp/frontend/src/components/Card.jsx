/*
- This code defines a React component named Card.
- It displays a transaction's details such as category, amount, location, date, payment type, and description.
- The component also provides functionality to delete a transaction.
- It uses several icons to visually represent different fields.
- The code also handles formatting and capitalizing certain strings for better presentation.
*/

import { FaLocationDot } from "react-icons/fa6";
import { BsCardText } from "react-icons/bs";
import { MdOutlinePayments } from "react-icons/md";
import { FaSackDollar } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { HiPencilAlt } from "react-icons/hi";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import toast from "react-hot-toast";
import { useMutation } from "@apollo/client";
import { DELETE_TRANSACTION } from "../graphql/mutations/transcation.mutation";

// Map of category types to corresponding color classes
const categoryColorMap = {
	saving: "from-green-700 to-green-400",
	expense: "from-pink-800 to-pink-600",
	investment: "from-blue-700 to-blue-400",
	// Add more categories and corresponding color classes as needed
};

// Card component definition
const Card = ({ transaction, authUser }) => {
	// Destructure transaction properties
	let { category, amount, location, date, paymentType, description } = transaction;

	// Determine the class for the card's background based on the category
	const cardClass = categoryColorMap[category];

	// Define the mutation for deleting a transaction
	const [deleteTransaction, { loading }] = useMutation(DELETE_TRANSACTION, {
		refetchQueries: ["GetTransactions", "GetTransactionStatistics"],
	});

	// Capitalize the first letter of the description, category, and payment type
	description = description[0]?.toUpperCase() + description.slice(1);
	category = category[0]?.toUpperCase() + category.slice(1);
	paymentType = paymentType[0]?.toUpperCase() + paymentType.slice(1);

	// Format the date using the formatDate utility
	const formattedDate = formatDate(date);

	// Handler function to delete a transaction
	const handleDelete = async () => {
		try {
			await deleteTransaction({ variables: { transactionId: transaction._id } });
			toast.success("Transaction deleted successfully");
		} catch (error) {
			console.error("Error deleting transaction:", error);
			toast.error(error.message);
		}
	};

	// Return the JSX for rendering the card component
	return (
		// Main container div with gradient background based on category
		<div className={`rounded-md p-4 bg-gradient-to-br ${cardClass}`}>
			<div className="flex flex-col gap-3">
				{/* Header section with category title and action icons */}
				<div className="flex flex-row items-center justify-between">
					<h2 className="text-lg font-bold text-white">{category}</h2>
					<div className="flex items-center gap-2">
						{!loading && <FaTrash className={"cursor-pointer"} onClick={handleDelete} />}
						{loading && <div className="w-6 h-6 border-t-2 border-b-2  rounded-full animate-spin"></div>}
						<Link to={`/transaction/${transaction._id}`}>
							<HiPencilAlt className="cursor-pointer" size={20} />
						</Link>
					</div>
				</div>
				{/* Transaction description */}
				<p className="text-white flex items-center gap-1">
					<BsCardText />
					Description: {description}
				</p>
				{/* Payment type */}
				<p className="text-white flex items-center gap-1">
					<MdOutlinePayments />
					Payment Type: {paymentType}
				</p>
				{/* Transaction amount */}
				<p className="text-white flex items-center gap-1">
					<FaSackDollar />
					Amount: ${amount}
				</p>
				{/* Transaction location */}
				<p className="text-white flex items-center gap-1">
					<FaLocationDot />
					Location: {location || "N/A"}
				</p>
				{/* Footer section with date and user profile picture */}
				<div className="flex justify-between items-center">
					<p className="text-xs text-black font-bold">{formattedDate}</p>
					<img src={authUser?.profilePicture} className="h-8 w-8 border rounded-full" alt="" />
				</div>
			</div>
		</div>
	);
};

export default Card;
