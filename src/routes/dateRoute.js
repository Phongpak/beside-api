const express = require("express");
const dateController = require("../controller/dateController");

const router = express.Router();

router.post("/available", dateController.dateCreate);
router.get("/available/:weekday", dateController.getDateAvailable); // wave เพิ่ม
router.delete("/available/:id", dateController.dateDelete);
router.post("/unavailable", dateController.dateUnavailableCreate);
router.delete("/unavailable/:id", dateController.dateUnavailableDelete);
router.get("/unavailable/:userId", dateController.getUserUnavailableDate); // wave เพิ่ม

module.exports = router;
