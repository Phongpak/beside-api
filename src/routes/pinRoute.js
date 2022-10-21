const express = require("express");
const pinController = require("../controller/pinController");

const router = express.Router();

router.post("/", pinController.pinCreate);
router.delete("/:id", pinController.pinDelete);
module.exports = router;
