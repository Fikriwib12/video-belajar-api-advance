const Order = require("../models/Order");
const Kelas = require("../models/Kelas");
const User = require("../models/User");

exports.getAll = async (req, res) => {
  try {
    const order = await Order.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
        {
          model: Kelas,
          as: "kelas",
          attributes: ["id", "judul", "slug", "harga"],
        },
      ],
    });

    return res.status(200).json({
      message: "Berhasil mengambil data Order",
      data: order,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};
exports.create = async (req, res) => {
  try {
    const { user_id, kelas_id } = req.body;

    if (!user_id || !kelas_id) {
      return res
        .status(400)
        .json({ message: "user_id dan kelas_id wajib diisi" });
    }

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const kelas = await Kelas.findByPk(kelas_id);
    if (!kelas) {
      return res.status(404).json({ message: "Kelas tidak ditemukan" });
    }

    const existing = await Order.findOne({
      where: { user_id, kelas_id, status: ["pending", "paid"] },
    });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Anda sudah pernah order kelas ini" });
    }

    // ini buat order-code otomatis
    const order_code = `ORD-${Date.now()}`;
    const total_harga = kelas.harga;

    const order = await Order.create({
      user_id,
      kelas_id,
      order_code,
      total_harga,
      status: "pending",
    });

    return res.status(201).json({
      message: "Order berhasil dibuat",
      data: order,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
        {
          model: Kelas,
          as: "kelas",
          attributes: ["id", "judul", "slug", "harga"],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    return res.status(200).json({
      message: "Berhasil mengambil data order",
      data: order,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status wajib diisi" });
    }

    const allowedStatus = ["pending", "paid", "cancelled", "refunded"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Status tidak valid",
      });
    }

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    await order.update({ status });

    return res.status(200).json({
      message: "Status order berhasil diupdate",
      data: order,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};
