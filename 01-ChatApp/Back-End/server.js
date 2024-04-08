// Package imports:
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Routes:
import authRoutes from "./Routes/auth.routes.js";
import messageRoutes from "./Routes/message.routes.js";
import userRoutes from "./Routes/user.routes.js";

// Data Base imports:
import connectToMongoDB from "./DataBase/connectToMongoDB.js";
import { app, server } from "./Socket/socket.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

app.use(express.json()); // To parse incoming requests with JSON payloads (from req.body)
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
/*
app.get("/", (req, res) => {
	// root route http://localhost:5000/
	res.send("Hello world!");
});
*/

server.listen(PORT, () => {
	connectToMongoDB();
	console.log(`Server running on port ${PORT}`);
});
