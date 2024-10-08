import express from 'express';
import { getRetailerNewChats, getRetailerOngoingChats, getChats, sendMessage, getSpadeMessages, modifyChat, acceptBidRequest, rejectBidRequest, setChatMessageMarkAsRead } from '../controllers/chatController.js';

const router = express.Router();

router.route('/modify-spade-retailer').patch(modifyChat);
router.route('/retailer-new-spades').get(getRetailerNewChats);
router.route('/retailer-ongoing-spades').get(getRetailerOngoingChats);
router.route('/spade-chats').get(getChats);
router.route('/send-message').post(sendMessage);
// router.route('/update-message').patch(updateMessage);
router.route('/get-spade-messages').get(getSpadeMessages);
router.route('/accept-bid').patch(acceptBidRequest);
router.route('/reject-bid').patch(rejectBidRequest);
router.route('/mark-as-read').patch(setChatMessageMarkAsRead);

export default router;