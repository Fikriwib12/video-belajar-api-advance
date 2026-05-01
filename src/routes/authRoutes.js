const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/verifikasi-email", authController.verifikasiEmail);
router.post("/resend-verifikasi", authController.resendVerifikasi);

module.exports = router;
