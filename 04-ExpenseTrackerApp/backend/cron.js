/*
- This code schedules a cron job that sends an HTTP GET request to a specified URL every 14 minutes.
- It uses the `cron` package to define and manage the job schedule.
- The job sends a GET request to the server and logs a success message if the response status is 200.
- If the GET request fails, it logs the failure status code.
- In case of an error while sending the request, it logs the error message.
*/

import cron from "cron"; // Import the cron package to manage scheduled tasks
import https from "https"; // Import the https module to send HTTPS requests

const URL = "https://graphql-crash-course.onrender.com"; // Define the URL to which the GET request will be sent

// Create a new cron job that runs every 14 minutes
const job = new cron.CronJob("*/14 * * * *", function () {
	// Send a GET request to the specified URL
	https
		.get(URL, (res) => {
			// Check if the response status code is 200 (OK)
			if (res.statusCode === 200) {
				console.log("GET request sent successfully"); // Log success message
			} else {
				console.log("GET request failed", res.statusCode); // Log failure message with status code
			}
		})
		.on("error", (e) => {
			console.error("Error while sending request", e); // Log error message if there's an error
		});
});

export default job; // Export the cron job as the default export

// CRON JOB EXPLANATION:
// Cron jobs are scheduled tasks that run periodically at fixed intervals or specific times.
// This job sends 1 GET request every 14 minutes.

// Schedule:
// You define a schedule using a cron expression, which consists of five fields representing:
// MINUTE, HOUR, DAY OF THE MONTH, MONTH, DAY OF THE WEEK

// EXAMPLES & EXPLANATION:
// 14 * * * * - Every 14 minutes
// 0 0 * * 0 - At midnight on every Sunday
// 30 3 15 * * - At 3:30 AM, on the 15th of every month
// 0 0 1 1 * - At midnight, on January 1st
// 0 * * * * - Every hour
