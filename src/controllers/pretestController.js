const Pretest = require("../models/Pretest");
const Kelas = require("../models/Kelas");

exports.getAll = async (req, res) => {
  try {
    const pretests = await Pretest.findAll({
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
      message: "Berhasil mengambil data pretest",
      data: pretests,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

// Untuk user — jawaban_benar disembunyikan
exports.getByKelas = async (req, res) => {
  try {
    const { kelas_id } = req.params;

    const kelas = await Kelas.findByPk(kelas_id);
    if (!kelas) {
      return res.status(404).json({ message: "Kelas tidak ditemukan" });
    }

    const pretests = await Pretest.findAll({
      where: { kelas_id },
      attributes: [
        "id",
        "pertanyaan",
        "pilihan_a",
        "pilihan_b",
        "pilihan_c",
        "pilihan_d",
        "urutan",
      ],
      order: [["urutan", "ASC"]],
    });

    return res.status(200).json({
      message: "Berhasil mengambil soal pretest",
      data: pretests,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

// Untuk admin — jawaban_benar ikut tampil
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const pretest = await Pretest.findByPk(id, {
      include: [
        {
          model: Kelas,
          as: "kelas",
          attributes: ["id", "judul"],
        },
      ],
    });

    if (!pretest) {
      return res.status(404).json({ message: "Soal tidak ditemukan" });
    }

    return res.status(200).json({
      message: "Berhasil mengambil data soal",
      data: pretest,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const {
      kelas_id,
      pertanyaan,
      pilihan_a,
      pilihan_b,
      pilihan_c,
      pilihan_d,
      jawaban_benar,
      urutan,
    } = req.body;

    if (!kelas_id || !pertanyaan || !jawaban_benar) {
      return res
        .status(400)
        .json({ message: "kelas_id, pertanyaan, dan jawaban_benar wajib diisi" });
    }

    const kelas = await Kelas.findByPk(kelas_id);
    if (!kelas) {
      return res.status(404).json({ message: "Kelas tidak ditemukan" });
    }

    const allowedJawaban = ["a", "b", "c", "d"];
    if (!allowedJawaban.includes(jawaban_benar.toLowerCase())) {
      return res
        .status(400)
        .json({ message: "jawaban_benar harus salah satu dari: a, b, c, d" });
    }

    const pretest = await Pretest.create({
      kelas_id,
      pertanyaan,
      pilihan_a,
      pilihan_b,
      pilihan_c,
      pilihan_d,
      jawaban_benar: jawaban_benar.toLowerCase(),
      urutan,
    });

    return res.status(201).json({
      message: "Soal pretest berhasil dibuat",
      data: pretest,
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
    const {
      pertanyaan,
      pilihan_a,
      pilihan_b,
      pilihan_c,
      pilihan_d,
      jawaban_benar,
      urutan,
    } = req.body;

    const pretest = await Pretest.findByPk(id);
    if (!pretest) {
      return res.status(404).json({ message: "Soal tidak ditemukan" });
    }

    if (jawaban_benar) {
      const allowedJawaban = ["a", "b", "c", "d"];
      if (!allowedJawaban.includes(jawaban_benar.toLowerCase())) {
        return res
          .status(400)
          .json({ message: "jawaban_benar harus salah satu dari: a, b, c, d" });
      }
    }

    await pretest.update({
      pertanyaan: pertanyaan ?? pretest.pertanyaan,
      pilihan_a: pilihan_a ?? pretest.pilihan_a,
      pilihan_b: pilihan_b ?? pretest.pilihan_b,
      pilihan_c: pilihan_c ?? pretest.pilihan_c,
      pilihan_d: pilihan_d ?? pretest.pilihan_d,
      jawaban_benar: jawaban_benar
        ? jawaban_benar.toLowerCase()
        : pretest.jawaban_benar,
      urutan: urutan ?? pretest.urutan,
    });

    return res.status(200).json({
      message: "Soal pretest berhasil diupdate",
      data: pretest,
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

    const pretest = await Pretest.findByPk(id);
    if (!pretest) {
      return res.status(404).json({ message: "Soal tidak ditemukan" });
    }

    await pretest.destroy();

    return res.status(200).json({
      message: "Soal pretest berhasil dihapus",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};
