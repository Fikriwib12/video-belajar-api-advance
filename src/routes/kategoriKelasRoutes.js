const express = require("express");
const router = express.Router();
const kategoriKelasController = require("../controllers/kategoriKelasController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

router.get("/", kategoriKelasController.getAll);
router.post("/", authenticate, authorize("admin"), kategoriKelasController.create);
router.put("/:id", authenticate, authorize("admin"), kategoriKelasController.update);
router.delete("/:id", authenticate, authorize("admin"), kategoriKelasController.destroy);
module.exports = router;
