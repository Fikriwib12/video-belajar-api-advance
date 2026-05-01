const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");
const { where } = require("sequelize");
const { sendVerificationEmail } = require("../utils/sendEmail");
require("dotenv").config();

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name) {
      return res.status(400).json({ message: "nama belom diisi" });
    }
    if (!email) {
      return res.status(400).json({ message: "email belom diisi" });
    }
    if (!password) {
      return res.status(400).json({ message: "password belom diisi" });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "Email sudah terdaftar" });
    }

    const hassedPassword = await bcrypt.hash(password, 10);
    const verification_token = uuidv4();

    await User.create({
      name,
      email,
      password: hassedPassword,
      phone,
      verification_token,
    });

    await sendVerificationEmail(email, verification_token);

    return res.status(201).json({
      message: "Registrasi Berhasil. Cek email kamu untuk verifikasi akun.",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.resendVerifikasi = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email wajib diisi" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email tidak terdaftar" });
    }

    if (user.email_verified_at) {
      return res.status(400).json({ message: "Email sudah terverifikasi" });
    }

    const verification_token = uuidv4();
    await user.update({ verification_token });
    await sendVerificationEmail(email, verification_token);

    return res.status(200).json({ message: "Email verifikasi berhasil dikirim ulang" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.verifikasiEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ where: { verification_token: token } });
    if (!user) {
      return res.status(400).json({ message: "Invalid Verification Token" });
    }

    await user.update({
      email_verified_at: new Date(),
      verification_token: null,
    });

    return res.status(200).json({ message: "Email Verified Successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Email atau password salah" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email atau Password Salah" });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    return res.status(200).json({
      message: "Login Berhasil",
      token,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};
