// server/routes/chat.js
const express = require("express");
const { chat } = require("../controllers/chatController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();
router.use(requireAuth);

router.post("/", chat);

module.exports = router;