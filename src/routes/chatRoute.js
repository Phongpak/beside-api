const express = require("express");
const chatController = require("../controller/chatController");

const router = express.Router();

router.get("/:orderId", chatController.getChatMessage);
router.patch("/:orderId", chatController.updateIsSeenChatMessage);
router.get("/unseen/:orderId", chatController.getUnseenChatMessage);

module.exports = router;
