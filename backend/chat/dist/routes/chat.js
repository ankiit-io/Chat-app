import express from 'express';
import { isAuth } from "../middlewares/isAuth.js";
import { createChat, getAllChats } from "../controllers/chat.js";
const router = express.Router();
router.post("/chat/new", isAuth, createChat);
router.get("/chat/all", isAuth, getAllChats);
export default router;
//# sourceMappingURL=chat.js.map