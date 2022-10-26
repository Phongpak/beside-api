const express = require("express");
const orderController = require("../controller/orderController");

const router = express.Router();

router.get("/customer", orderController.getOrderMyCustomers);
router.get("/provider", orderController.getOrderMyProviders);
router.post("/", orderController.createOrder);
router.patch("/:id", orderController.updateOrder);

module.exports = router;
