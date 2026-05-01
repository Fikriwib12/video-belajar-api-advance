const express = require("express");
const router = express.Router();
const pembayaranController = require("../controllers/pembayaranController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

router.get("/", authenticate, authorize("admin"), pembayaranController.getAll);
router.get("/:id", authenticate, pembayaranController.getById);
router.post("/", authenticate, pembayaranController.create);
router.patch("/:id/konfirmasi", authenticate, authorize("admin"), pembayaranController.konfirmasi);

module.exports = router;
