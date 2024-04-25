// Import the 'cron' module to schedule tasks and the 'https' module to perform HTTPS requests
import cron from "cron";
import https from "https";

// Constant variable holding the URL for the HTTP GET request
const URL = "https://threads-clone-9if3.onrender.com";

// Create a new cron job that runs every 14 minutes
const job = new cron.CronJob("*/14 * * * *", function () {
	https
		.get(URL, (res) => {
			// Send a GET request to the specified URL
			if (res.statusCode === 200) {
				// Check if the response status code is 200 (OK)
				console.log("GET request sent successfully"); // Log success message
			} else {
				console.log("GET request failed", res.statusCode); // Log failure message with status code
			}
		})
		.on("error", (e) => {
			// Attach an error handler for the request
			console.error("Error while sending request", e); // Log any errors that occur during the request
		});
});

// Export the job so it can be used elsewhere in the application
export default job;

// CRON JOB EXPLANATION:
// Cron jobs are scheduled tasks that run periodically at fixed times or intervals

// Schedule:
// The cron expression defines the schedule. It consists of five fields:
// MINUTE, HOUR, DAY OF THE MONTH, MONTH, DAY OF THE WEEK

// Examples and explanations for cron expressions:
//* "14 * * * *" - At the 14th minute of every hour
//* "0 0 * * 0" - At midnight on every Sunday
//* "30 3 15 * *" - At 3:30 AM, on the 15th of every month
//* "0 0 1 1 *" - At midnight, on January 1st
//* "0 * * * *" - At the start of every hour
