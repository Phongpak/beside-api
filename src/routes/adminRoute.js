const express = require("express");
const adminController = require("../controller/adminController");
const router = express.Router();

router.get("/user", adminController.getUser);
router.get("/transaction", adminController.getTransaction);
router.get("/order", adminController.getOrder);
router.delete("/user/:id", adminController.deleteUser);
module.exports = router;
