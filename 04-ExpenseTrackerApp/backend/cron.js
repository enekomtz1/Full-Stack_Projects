/*
- This code schedules a cron job that sends an HTTP GET request to a specified URL every 14 minutes.
- It uses the `cron` package to define and manage the job schedule.
- The job sends a GET request to the server and logs a success message if the response status is 200.
- If the GET request fails, it logs the failure status code.

*/