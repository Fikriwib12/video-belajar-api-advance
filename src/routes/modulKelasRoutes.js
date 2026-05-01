const express = require("express");
const router = express.Router();
const modulKelasController = require("../controllers/modulKelasController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

router.get("/", modulKelasController.getAll);
router.get("/:id", modulKelasController.getById);
router.post("/", authenticate, authorize("admin", "tutor"), modulKelasController.create);
router.put("/:id", authenticate, authorize("admin", "tutor"), modulKelasController.update);
router.delete("/:id", authenticate, authorize("admin"), modulKelasController.destroy);

module.exports = router;
