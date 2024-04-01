import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();

const PORT = process.env.PORT || 8000;
d
app.get("/", (req, res) => {
	// root route http://localhost:5000/
	res.send("Hello world!");
});

app.listen(5000, () => console.log(`Server running on port ${PORT}`));
