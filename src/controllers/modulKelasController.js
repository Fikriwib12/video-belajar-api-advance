const ModulKelas = require("../models/ModulKelas");
const Kelas = require("../models/Kelas");

exports.getAll = async (req, res) => {
  try {
    const moduls = await ModulKelas.findAll({
      include: [
        {
          model: Kelas,
          as: "kelas",
          attributes: ["id", "judul", "slug"],
        },
      ],
      order: [["urutan", "ASC"]],
    });

    return res.status(200).json({
      message: "Berhasil mengambil data modul kelas",
      data: moduls,
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

    const modul = await ModulKelas.findByPk(id, {
      include: [
        {
          model: Kelas,
          as: "kelas",
          attributes: ["id", "judul", "slug"],
        },
      ],
    });

    if (!modul) {
      return res.status(404).json({ message: "Modul tidak ditemukan" });
    }

    return res.status(200).json({
      message: "Berhasil mengambil data modul",
      data: modul,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { kelas_id, judul, urutan } = req.body;

    if (!kelas_id || !judul) {
      return res
        .status(400)
        .json({ message: "kelas_id dan judul wajib diisi" });
    }

    const kelas = await Kelas.findByPk(kelas_id);
    if (!kelas) {
      return res.status(404).json({ message: "Kelas tidak ditemukan" });
    }

    const modul = await ModulKelas.create({ kelas_id, judul, urutan });

    return res.status(201).json({
      message: "Modul berhasil dibuat",
      data: modul,
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
    const { kelas_id, judul, urutan } = req.body;

    const modul = await ModulKelas.findByPk(id);
    if (!modul) {
      return res.status(404).json({ message: "Modul tidak ditemukan" });
    }

    if (kelas_id) {
      const kelas = await Kelas.findByPk(kelas_id);
      if (!kelas) {
        return res.status(404).json({ message: "Kelas tidak ditemukan" });
      }
    }

    await modul.update({
      kelas_id: kelas_id ?? modul.kelas_id,
      judul: judul ?? modul.judul,
      urutan: urutan ?? modul.urutan,
    });

    return res.status(200).json({
      message: "Modul berhasil diupdate",
      data: modul,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

exports.destroy = async (req, res) => {
  try {
    const { id } = req.params;

    const modul = await ModulKelas.findByPk(id);
    if (!modul) {
      return res.status(404).json({ message: "Modul tidak ditemukan" });
    }

    await modul.destroy();

    return res.status(200).json({
      message: "Modul berhasil dihapus",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};
