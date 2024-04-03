import express from "express";

const router = express.Router();

router.get("/", getUsersForSidebar);

export default router;
