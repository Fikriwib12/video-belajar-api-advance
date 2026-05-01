const KelasTutor = require("../models/KelasTutor");
const Kelas = require("../models/Kelas");
const Tutor = require("../models/Tutor");

exports.getAll = async (req, res) => {
  try {
    const kelasTutor = await KelasTutor.findAll({
      include: [
        {
          model: Kelas,
          as: "kelas",
          attributes: ["id", "judul", "slug"],
        },
        {
          model: Tutor,
          as: "tutor",
          attributes: ["id", "nama", "jabatan", "perusahaan"],
        },
      ],
    });

    return res.status(200).json({
      message: "Berhasil mengambil data kelas tutor",
      data: kelasTutor,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

exports.getByKelas = async (req, res) => {
  try {
    const { kelas_id } = req.params;

    const kelas = await Kelas.findByPk(kelas_id);
    if (!kelas) {
      return res.status(404).json({ message: "Kelas tidak ditemukan" });
    }

    const tutors = await KelasTutor.findAll({
      where: { kelas_id },
      include: [
        {
          model: Tutor,
          as: "tutor",
          attributes: ["id", "nama", "foto", "jabatan", "perusahaan", "bio"],
        },
      ],
    });

    return res.status(200).json({
      message: "Berhasil mengambil tutor untuk kelas ini",
      data: tutors,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

exports.assign = async (req, res) => {
  try {
    const { kelas_id, tutor_id } = req.body;

    if (!kelas_id || !tutor_id) {
      return res
        .status(400)
        .json({ message: "kelas_id dan tutor_id wajib diisi" });
    }

    const kelas = await Kelas.findByPk(kelas_id);
    if (!kelas) {
      return res.status(404).json({ message: "Kelas tidak ditemukan" });
    }

    const tutor = await Tutor.findByPk(tutor_id);
    if (!tutor) {
      return res.status(404).json({ message: "Tutor tidak ditemukan" });
    }

    const existing = await KelasTutor.findOne({ where: { kelas_id, tutor_id } });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Tutor sudah terdaftar di kelas ini" });
    }

    const kelasTutor = await KelasTutor.create({ kelas_id, tutor_id });

    return res.status(201).json({
      message: "Tutor berhasil ditambahkan ke kelas",
      data: kelasTutor,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const kelasTutor = await KelasTutor.findByPk(id);
    if (!kelasTutor) {
      return res
        .status(404)
        .json({ message: "Data kelas tutor tidak ditemukan" });
    }

    await kelasTutor.destroy();

    return res.status(200).json({
      message: "Tutor berhasil dihapus dari kelas",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};
