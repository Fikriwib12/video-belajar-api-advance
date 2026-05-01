const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const uploadController = require("../controllers/uploadController");
const authenticate = require("../middleware/authenticate");

router.post("/", authenticate, upload.single("image"), uploadController.uploadImage);

module.exports = router;
