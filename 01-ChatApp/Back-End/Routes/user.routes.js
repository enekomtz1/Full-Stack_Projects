import express from "express";
import protectRoute from "../Middleware/protectRoute.js";
import { getUsersForSidebar } from "../Controllers/user.controller.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);

export default router;
