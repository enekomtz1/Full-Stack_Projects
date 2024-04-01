import express from "express";
import dotenv from "dotenv";
import authRoutes from "./Routes/auth.routes.js";
import connectToMongoDB from "./DataBase/connectToMongoDB.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
	// root route http://localhost:5000/
	res.send("Hello world!");
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
	connectToMongoDB();
	console.log(`Server running on port ${PORT}`);
});
