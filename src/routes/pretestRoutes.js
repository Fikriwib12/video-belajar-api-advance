const express = require("express");
const router = express.Router();
const pretestController = require("../controllers/pretestController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

router.get("/", pretestController.getAll);
router.get("/kelas/:kelas_id", pretestController.getByKelas);
router.get("/:id", pretestController.getById);
router.post("/", authenticate, authorize("admin", "tutor"), pretestController.create);
router.put("/:id", authenticate, authorize("admin", "tutor"), pretestController.update);
router.delete("/:id", authenticate, authorize("admin"), pretestController.destroy);

module.exports = router;
