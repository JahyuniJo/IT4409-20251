// backend/src/routes/message.route.js
import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getMessage, sendMessage, getConversations, getMessageRequests, acceptMessageRequest } from "../controllers/message.controller.js";

const router = express.Router();

router.route('/send/:id').post(isAuthenticated, sendMessage);
router.route('/all/:id').get(isAuthenticated, getMessage);
router.route('/conversations').get(isAuthenticated, getConversations);
router.route('/requests').get(isAuthenticated, getMessageRequests);
router.route('/requests/:id/accept').post(isAuthenticated, acceptMessageRequest);

export default router;