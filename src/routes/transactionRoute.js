const express = require("express");
const transactionController = require("../controller/transactionController");
const router = express.Router();
const adminAuthenticate = require("../middlewares/adminAuthenticate");
const authenticate = require("../middlewares/authenticate");
const upload = require("../middlewares/upload");

router.post(
  "/",
  authenticate,
  upload.fields([{ name: "slipImage", maxCount: 1 }]),
  transactionController.createTransaction
);

router.patch(
  "/:id",
  adminAuthenticate,
  transactionController.updateTransaction
);

module.exports = router;
