const express = require("express");
const orderController = require("../controller/orderController");

const router = express.Router();

router.get("/:id", orderController.getOrdersById);
router.post("/", orderController.createOrder);
router.patch("/:id", orderController.updateOrder);

module.exports = router;
