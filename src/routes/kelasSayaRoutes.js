const express = require("express");
const router = express.Router();
const kelasSayaController = require("../controllers/kelasSayaController");
const authenticate = require("../middleware/authenticate");

router.get("/", authenticate, kelasSayaController.getAll);
router.get("/:id", authenticate, kelasSayaController.getById);
router.patch("/:id/progress", authenticate, kelasSayaController.updateProgress);

module.exports = router;
