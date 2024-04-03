import express from "express";
import { sendMessage, getMessage } from "../Controllers/message.controller.js";
import protectRoute from "../Middleware/protectRoute.js";

const router = express.Router();

router.get("/:id", protectRoute, getMessage);
router.post("/send/:id", protectRoute, sendMessage);

export default router;
