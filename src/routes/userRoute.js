const express = require("express");
const userController = require("../controller/userController");
const upload = require("../middlewares/upload");

const router = express.Router();

router.patch(
  "/",
  upload.fields([{ name: "profileImages", maxCount: 3 }]),
  userController.updateUser
);

module.exports = router;
