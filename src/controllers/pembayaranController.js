const Pembayaran = require("../models/Pembayaran");
const Order = require("../models/Order");
const KelasSaya = require("../models/KelasSaya");

exports.getAll = async (req, res) => {
  try {
    const pembayarans = await Pembayaran.findAll({
      include: [
        {
          model: Order,
          as: "order",
          attributes: ["id", "order_code", "total_harga", "status"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      message: "Berhasil mengambil data pembayaran",
      data: pembayarans,
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

    const pembayaran = await Pembayaran.findByPk(id, {
      include: [
        {
          model: Order,
          as: "order",
          attributes: ["id", "order_code", "total_harga", "status"],
        },
      ],
    });

    if (!pembayaran) {
      return res.status(404).json({ message: "Pembayaran tidak ditemukan" });
    }

    return res.status(200).json({
      message: "Berhasil mengambil data pembayaran",
      data: pembayaran,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { order_id, metode, bukti_transfer, transaction_id } = req.body;

    if (!order_id || !metode) {
      return res
        .status(400)
        .json({ message: "order_id dan metode wajib diisi" });
    }

    const order = await Order.findByPk(order_id);
    if (!order) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    if (order.status === "paid") {
      return res.status(400).json({ message: "Order ini sudah lunas" });
    }

    const pembayaran = await Pembayaran.create({
      order_id,
      metode,
      bukti_transfer,
      transaction_id,
      jumlah: order.total_harga,
      status: "pending",
    });

    return res.status(201).json({
      message: "Pembayaran berhasil dikirim",
      data: pembayaran,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

exports.konfirmasi = async (req, res) => {
  try {
    const { id } = req.params;

    const pembayaran = await Pembayaran.findByPk(id);
    if (!pembayaran) {
      return res.status(404).json({ message: "Pembayaran tidak ditemukan" });
    }

    const order = await Order.findByPk(pembayaran.order_id);
    if (!order) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    if (pembayaran.status !== "pending" || order.status !== "pending") {
      return res.status(400).json({
        message:
          "Hanya pembayaran atau order berstatus pending yang bisa dikonfirmasi",
      });
    }

    await pembayaran.update({
      status: "confirmed",
      paid_at: new Date(),
    });

    await order.update({ status: "paid" });

    await KelasSaya.create({
      user_id: order.user_id,
      kelas_id: order.kelas_id,
      order_id: order.id,
    });

    return res.status(200).json({
      message: "Pembayaran berhasil dikonfirmasi",
      data: pembayaran,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};
