const KelasSaya = require("../models/KelasSaya");
const User = require("../models/User");
const Kelas = require("../models/Kelas");

const includeRelasi = [
  {
    model: User,
    as: "user",
    attributes: ["id", "name", "email"],
  },
  {
    model: Kelas,
    as: "kelas",
    attributes: ["id", "judul", "slug", "thumbnail", "harga"],
  },
];

exports.getAll = async (req, res) => {
  try {
    const kelasSaya = await KelasSaya.findAll({
      include: includeRelasi,
      order: [["enrolled_at", "DESC"]],
    });

    return res.status(200).json({
      message: "Berhasil mengambil data kelas saya",
      data: kelasSaya,
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

    const kelasSaya = await KelasSaya.findByPk(id, {
      include: includeRelasi,
    });

    if (!kelasSaya) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    return res.status(200).json({
      message: "Berhasil mengambil data kelas saya",
      data: kelasSaya,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { progress_persen } = req.body;

    if (progress_persen === undefined) {
      return res.status(400).json({ message: "progress_persen wajib diisi" });
    }

    if (progress_persen < 0 || progress_persen > 100) {
      return res
        .status(400)
        .json({ message: "progress_persen harus antara 0 sampai 100" });
    }

    const kelasSaya = await KelasSaya.findByPk(id);
    if (!kelasSaya) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    const sertifikat_diterima = progress_persen === 100;

    await kelasSaya.update({ progress_persen, sertifikat_diterima });

    return res.status(200).json({
      message: "Progress berhasil diupdate",
      data: kelasSaya,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};
