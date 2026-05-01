const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

router.get("/", reviewController.getAll);
router.get("/kelas/:kelas_id", reviewController.getByKelas);
router.post("/", authenticate, reviewController.create);
router.put("/:id", authenticate, reviewController.update);
router.delete("/:id", authenticate, authorize("admin"), reviewController.destroy);

module.exports = router;
