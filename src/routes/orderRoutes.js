const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/orderController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

router.get("/", authenticate, authorize("admin"), OrderController.getAll);
router.get("/:id", authenticate, OrderController.getById);
router.post("/", authenticate, OrderController.create);
router.put("/:id", authenticate, authorize("admin"), OrderController.update);
module.exports = router;
