const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { where } = require("sequelize");
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
    const hassedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hassedPassword,
      phone,
    });

    return res.status(201).json({
      message: "Registrasi Berhasil",
    });
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
