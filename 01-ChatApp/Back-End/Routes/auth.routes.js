import express from "express";
import { signup, login, logout } from "../Controllers/auth.controller.js";

const router = express.Router();

// Sign up route:
router.post("/signup", signup);

// Login route:
router.post("/login", login);

// Logout route:
router.post("/logout", logout);

export default router;
