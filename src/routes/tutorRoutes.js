const express = require("express");
const router = express.Router();
const tutorController = require("../controllers/tutorController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

router.get("/", tutorController.getAll);
router.get("/:id", tutorController.getById);
router.post("/", authenticate, authorize("admin"), tutorController.create);
router.put("/:id", authenticate, authorize("admin", "tutor"), tutorController.update);
router.delete("/:id", authenticate, authorize("admin"), tutorController.destroy);

module.exports = router;
