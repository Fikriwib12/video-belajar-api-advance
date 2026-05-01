const express = require("express");
const router = express.Router();
const materialController = require("../controllers/materialController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

router.get("/", authenticate, materialController.getAll);
router.get("/:id", authenticate, materialController.getById);
router.post("/", authenticate, authorize("admin", "tutor"), materialController.create);
router.put("/:id", authenticate, authorize("admin", "tutor"), materialController.update);
router.delete("/:id", authenticate, authorize("admin"), materialController.destroy);

module.exports = router;
