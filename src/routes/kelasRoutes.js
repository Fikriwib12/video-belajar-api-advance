const express = require("express");
const router = express.Router();
const KelasController = require("../controllers/kelasController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

router.get("/", KelasController.getAll);
router.get("/:id", KelasController.getById);
router.post("/", authenticate, authorize("admin", "tutor"), KelasController.create);
router.put("/:id", authenticate, authorize("admin", "tutor"), KelasController.update);
router.delete("/:id", authenticate, authorize("admin"), KelasController.destroy);
module.exports = router;
