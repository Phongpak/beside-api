const express = require("express");
const transactionController = require("../controller/transactionController");
const router = express.Router();

router.post(
  "/",
  upload.fields([{ name: "slipImage", maxCount: 1 }]),
  transactionController.createTransaction
);

module.exports = router;
