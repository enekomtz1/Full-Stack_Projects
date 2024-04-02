import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./Routes/auth.routes.js";
import messageRoutes from "./Routes/message.routes.js";

import connectToMongoDB from "./DataBase/connectToMongoDB.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json()); // To parse incoming requests with JSON payloads (from req.body)
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
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
