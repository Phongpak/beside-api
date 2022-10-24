const express = require("express");
const authController = require("../controller/authController");
const authenticate = require("../middlewares/authenticate");
const upload = require("../middlewares/upload");

const router = express.Router();

router.post(
  "/register",
  upload.fields([{ name: "idCardImage", maxCount: 1 }]),
  authController.register
);
router.post("/login", authController.login);
router.get("/user", authenticate, authController.getUser);
module.exports = router;
