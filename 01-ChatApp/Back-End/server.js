import express from "express";
import dotenv from "dotenv";
import authRoutes from "./Routes/auth.routes.js";
import connectToMongoDB from "./DataBase/connectToMongoDB.js";

const app = express();
const PORT = process.env.PORT || 8000;

dotenv.config();
app.use("/api/auth", authRoutes);
app.use(express.json()); // To parse incoming requests with JSON payloads (from req.body)
/*
app.get("/", (req, res) => {
	// root route http://localhost:5000/
	res.send("Hello world!");
});
*/

app.listen(PORT, () => {
	connectToMongoDB();
	console.log(`Server running on port ${PORT}`);
});
