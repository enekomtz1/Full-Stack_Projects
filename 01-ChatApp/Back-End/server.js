// Package imports:
import path from "path";
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

const __dirname = path.resolve();

const PORT = process.env.PORT || 8000;

app.use(express.json()); // To parse incoming requests with JSON payloads (from req.body)
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.use(express.static(path.join(__dirname, "/Front-End/dist")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "Front-End", "dist", "index.html"));
});

server.listen(PORT, () => {
	connectToMongoDB();
	console.log(`Server running on port ${PORT}`);
});
