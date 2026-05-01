const express = require("express");
const router = express.Router();
const kelasTutorController = require("../controllers/kelasTutorController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

router.get("/", kelasTutorController.getAll);
router.get("/kelas/:kelas_id", kelasTutorController.getByKelas);
router.post("/", authenticate, authorize("admin"), kelasTutorController.assign);
router.delete("/:id", authenticate, authorize("admin"), kelasTutorController.remove);

module.exports = router;
