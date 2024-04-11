/*
- Demo.jsx is a React component that summarizes articles.

- It interacts with a backend service to fetch summaries of articles.

- It manages user input and display of summarized articles.

- Allows users to enter an article URL, retrieves and displays the summary using a lazy-loaded query,
  manages article data in local storage, and provides a history of processed articles for quick access.
*/

// Import React library and its hooks for state and lifecycle management.
import React, { useState, useEffect } from "react";

// Importing assets and icons used in the UI.
import { copy, linkIcon, loader, tick, enter } from "../assets";

// Import a Redux Toolkit query hook for lazily fetching article summaries.
import { useLazyGetSummaryQuery } from "../services/article";

// Define the Demo functional component.
const Demo = () => {
	// State hook for managing article URL and summary data.
	const [article, setArticle] = useState({
		url: "",
		summary: "",
	});

	// State hook for maintaining a list of all processed articles.
	const [allArticles, setAllArticles] = useState([]);

	// State hook for tracking the copied status of an article's URL.
	const [copied, setCopied] = useState("");

	// useLazyGetSummaryQuery is a Redux Toolkit hook for making an API call to fetch the article summary.
	const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

	// useEffect hook to load article data from local storage when the component mounts.
	useEffect(() => {
		const articlesFromLocalStorage = JSON.parse(localStorage.getItem("articles"));
		if (articlesFromLocalStorage) {
			setAllArticles(articlesFromLocalStorage);
		}
	}, []); // The empty array as the second argument means this effect runs only once on mount.

	// Function to handle the form submission and fetch or retrieve the article summary.
	const handleSubmit = async (e) => {
		e.preventDefault(); // Prevent the form from submitting in the traditional way.

		// Check if the article is already in the state, and if so, use it instead of fetching again.
		const existingArticle = allArticles.find((item) => item.url === article.url);
		if (existingArticle) return setArticle(existingArticle);

		// Call the lazy query to get the summary from the backend.
		const { data } = await getSummary({ articleUrl: article.url });

		// Update the article and allArticles state if a new summary is fetched.
		if (data?.summary) {
			const newArticle = { ...article, summary: data.summary };
			const updatedAllArticles = [newArticle, ...allArticles];

			setArticle(newArticle);
			setAllArticles(updatedAllArticles);
			localStorage.setItem("articles", JSON.stringify(updatedAllArticles)); // Save updated articles list to local storage.
		}
	};

	// Function to copy the article URL to the clipboard and provide visual feedback.
	const handleCopy = (copyUrl) => {
		setCopied(copyUrl);
		navigator.clipboard.writeText(copyUrl);
		setTimeout(() => setCopied(false), 3000); // Reset copied status after 3 seconds.
	};

	// Function to trigger form submission when the Enter key is pressed.
	const handleKeyDown = (e) => {
		if (e.keyCode === 13) {
			// Check if the key pressed is Enter.
			handleSubmit(e);
		}
	};

	// Render the component UI.
	return (
		<section className="mt-16 w-full max-w-xl">
			{/* Form for submitting the article URL */}
			<div className="flex flex-col w-full gap-2">
				<form className="relative flex justify-center items-center" onSubmit={handleSubmit}>
					<img src={linkIcon} alt="link-icon" className="absolute left-0 my-2 ml-3 w-5" />

					<input
						type="url"
						placeholder="Paste the article link"
						value={article.url}
						onChange={(e) => setArticle({ ...article, url: e.target.value })}
						onKeyDown={handleKeyDown}
						required
						className="url_input"
					/>
					<button type="submit" className="submit_btn">
						<img src={enter} alt="enter-icon" className="absolute left-0 my-2 ml-2 w-5" />
					</button>
				</form>

				{/* Section to display and manage previously processed articles */}
				<div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
					{allArticles.reverse().map((item, index) => (
						<div key={`link-${index}`} onClick={() => setArticle(item)} className="link_card">
							<div className="copy_btn" onClick={() => handleCopy(item.url)}>
								<img src={copied === item.url ? tick : copy} alt="copy-icon" className="w-[40%] h-[40%]" />
							</div>
							<p className="text-sm truncate">{item.url}</p>
						</div>
					))}
				</div>
			</div>

			{/* Section to display the fetched article summary or loading/error state */}
			<div className="my-10 max-w-full flex justify-center items-center">
				{isFetching ? (
					<img src={loader} alt="loader" className="w-20 h-20" />
				) : error ? (
					<p className="font-inter font-bold text-black text-center">
						Please, paste a valid link.
						<br />
						<span className="font-satoshi font-normal text-gray-700">{error?.data?.error}</span>
					</p>
				) : (
					article.summary && (
						<div className="flex flex-col gap-3">
							<h2 className="font-satoshi font-bold text-gray-600 text-xl">
								Article <span className="summary_blue_gradient">Summary</span>
							</h2>

							<div className="summary_box">
								<p className="font-inter font-medium text-sm text-gray-700">{article.summary}</p>
							</div>
						</div>
					)
				)}
			</div>
		</section>
	);
};

export default Demo;
