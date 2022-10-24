const express = require("express");
const dateController = require("../controller/dateController");

const router = express.Router();

router.post("/", dateController.dateCreate);
router.delete("/:id", dateController.dateDelete);
module.exports = router;
